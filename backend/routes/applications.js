const express = require('express');
const jwt = require('jsonwebtoken');
const Application = require('../models/Application');
const User = require('../models/User');
const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Submit new application
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const applicationData = req.body;
        
        // Validate required fields
        const requiredFields = [
            'applicationType', 'firstName', 'lastName', 'dateOfBirth',
            'gender', 'email', 'phone', 'address', 'city', 'state', 'pincode'
        ];
        
        for (const field of requiredFields) {
            if (!applicationData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }
        
        // Generate application number
        const applicationNo = await generateApplicationNumber();
        
        // Create application
        const application = new Application({
            ...applicationData,
            applicationNo,
            userId: req.user.userId,
            submissionDate: new Date(),
            status: 'submitted',
            statusHistory: [{
                status: 'submitted',
                date: new Date(),
                description: 'Application submitted successfully'
            }]
        });
        
        await application.save();
        
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            applicationNo,
            application: {
                id: application._id,
                applicationNo: application.applicationNo,
                applicationType: application.applicationType,
                status: application.status,
                submissionDate: application.submissionDate
            }
        });
        
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application'
        });
    }
});

// Get user's applications
router.get('/my-applications', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.userId })
            .sort({ submissionDate: -1 })
            .select('-userId -documents'); // Exclude sensitive data
        
        res.json({
            success: true,
            applications
        });
        
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
});

// Get specific application details
router.get('/:applicationNo', authenticateToken, async (req, res) => {
    try {
        const { applicationNo } = req.params;
        
        const application = await Application.findOne({ 
            applicationNo,
            userId: req.user.userId 
        });
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        res.json({
            success: true,
            application
        });
        
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application details'
        });
    }
});

// Track application (public endpoint)
router.post('/track', async (req, res) => {
    try {
        const { applicationNo, dateOfBirth } = req.body;
        
        if (!applicationNo || !dateOfBirth) {
            return res.status(400).json({
                success: false,
                message: 'Application number and date of birth are required'
            });
        }
        
        const application = await Application.findOne({ 
            applicationNo: applicationNo.toUpperCase(),
            dateOfBirth 
        }).select('-userId -documents'); // Don't expose sensitive data
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'No application found with the provided details'
            });
        }
        
        // Generate timeline based on current status
        const timeline = generateStatusTimeline(application);
        
        res.json({
            success: true,
            application: {
                ...application.toObject(),
                timeline
            }
        });
        
    } catch (error) {
        console.error('Track application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track application'
        });
    }
});

// Update application status (admin endpoint)
router.put('/:applicationNo/status', authenticateToken, async (req, res) => {
    try {
        const { applicationNo } = req.params;
        const { status, description } = req.body;
        
        // In a real app, you'd check if user is admin
        // For now, allowing any authenticated user
        
        const application = await Application.findOne({ applicationNo });
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        // Update status
        application.status = status;
        application.statusHistory.push({
            status,
            date: new Date(),
            description: description || `Status updated to ${status}`
        });
        
        await application.save();
        
        res.json({
            success: true,
            message: 'Application status updated successfully',
            application: {
                applicationNo: application.applicationNo,
                status: application.status,
                lastUpdated: new Date()
            }
        });
        
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status'
        });
    }
});

// Get application statistics (for dashboard)
router.get('/stats/summary', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const stats = await Application.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const totalApplications = await Application.countDocuments({ userId });
        
        // Convert to object format
        const statusCounts = {};
        stats.forEach(stat => {
            statusCounts[stat._id] = stat.count;
        });
        
        res.json({
            success: true,
            stats: {
                total: totalApplications,
                submitted: statusCounts.submitted || 0,
                'under-review': statusCounts['under-review'] || 0,
                approved: statusCounts.approved || 0,
                rejected: statusCounts.rejected || 0,
                completed: statusCounts.completed || 0
            }
        });
        
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Generate unique application number
async function generateApplicationNumber() {
    const prefix = 'DESH';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    let applicationNo;
    let attempts = 0;
    
    do {
        applicationNo = prefix + timestamp.slice(-8) + random + attempts.toString().padStart(2, '0');
        attempts++;
        
        // Check if this number already exists
        const existing = await Application.findOne({ applicationNo });
        if (!existing) {
            break;
        }
    } while (attempts < 100);
    
    return applicationNo;
}

// Generate status timeline
function generateStatusTimeline(application) {
    const submissionDate = new Date(application.submissionDate);
    const now = new Date();
    const daysDiff = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
    
    const timeline = [
        {
            status: 'Application Submitted',
            description: 'Your application has been successfully submitted and received.',
            date: submissionDate,
            completed: true,
            icon: 'fas fa-file-plus'
        },
        {
            status: 'Document Verification',
            description: 'Your documents are being verified by our officials.',
            date: daysDiff >= 1 ? new Date(submissionDate.getTime() + 1 * 24 * 60 * 60 * 1000) : null,
            completed: daysDiff >= 1,
            current: daysDiff >= 1 && daysDiff < 3,
            icon: 'fas fa-search'
        },
        {
            status: 'Police Verification',
            description: 'Police verification process is in progress.',
            date: daysDiff >= 3 ? new Date(submissionDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
            completed: daysDiff >= 3,
            current: daysDiff >= 3 && daysDiff < 7,
            icon: 'fas fa-shield-alt'
        },
        {
            status: 'Application Approved',
            description: 'Your passport application has been approved.',
            date: daysDiff >= 7 ? new Date(submissionDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null,
            completed: daysDiff >= 7,
            current: daysDiff >= 7 && daysDiff < 10,
            icon: 'fas fa-check-circle'
        },
        {
            status: 'Passport Printing',
            description: 'Your passport is being printed.',
            date: daysDiff >= 10 ? new Date(submissionDate.getTime() + 10 * 24 * 60 * 60 * 1000) : null,
            completed: daysDiff >= 10,
            current: daysDiff >= 10 && daysDiff < 14,
            icon: 'fas fa-print'
        },
        {
            status: 'Dispatch',
            description: 'Your passport has been dispatched and is on its way.',
            date: daysDiff >= 14 ? new Date(submissionDate.getTime() + 14 * 24 * 60 * 60 * 1000) : null,
            completed: daysDiff >= 14,
            current: daysDiff >= 14 && daysDiff < 21,
            icon: 'fas fa-shipping-fast'
        },
        {
            status: 'Delivered',
            description: 'Your passport has been successfully delivered.',
            date: daysDiff >= 21 ? new Date(submissionDate.getTime() + 21 * 24 * 60 * 60 * 1000) : null,
            completed: daysDiff >= 21,
            icon: 'fas fa-home'
        }
    ];
    
    return timeline;
}

// Token verification middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
}

module.exports = router;