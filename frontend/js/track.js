// Track Application JavaScript for Deshswaar Passport System

document.addEventListener('DOMContentLoaded', function() {
    initializeTrackPage();
    initializeFAQ();
});

function initializeTrackPage() {
    const trackForm = document.getElementById('trackForm');
    
    if (trackForm) {
        trackForm.addEventListener('submit', handleTrackSubmission);
        
        // Add real-time validation
        const inputs = trackForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateTrackField(input));
            input.addEventListener('input', () => clearTrackFieldError(input));
        });
    }
    
    // Check URL parameters for direct tracking
    const urlParams = new URLSearchParams(window.location.search);
    const appNo = urlParams.get('appNo');
    
    if (appNo) {
        document.getElementById('applicationNo').value = appNo;
        // You might want to auto-submit if date of birth is also available
    }
}

function handleTrackSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateTrackForm(form)) {
        return;
    }
    
    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Searching...';
    submitBtn.disabled = true;
    
    const searchData = {
        applicationNo: formData.get('applicationNo').trim().toUpperCase(),
        dateOfBirth: formData.get('dateOfBirth')
    };
    
    // Simulate API call to search for application
    setTimeout(() => {
        const application = findApplication(searchData);
        
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        
        if (application) {
            displayApplicationStatus(application);
        } else {
            showNoApplicationFound();
        }
    }, 2000);
}

function validateTrackForm(form) {
    let isValid = true;
    const applicationNo = form.querySelector('#applicationNo');
    const dateOfBirth = form.querySelector('#dateOfBirth');
    
    if (!validateTrackField(applicationNo)) isValid = false;
    if (!validateTrackField(dateOfBirth)) isValid = false;
    
    return isValid;
}

function validateTrackField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearTrackFieldError(field);
    
    if (!value) {
        showTrackFieldError(field, 'This field is required');
        return false;
    }
    
    if (fieldName === 'applicationNo') {
        // Validate application number format (DESH followed by 11 digits)
        if (!/^DESH\d{11}$/.test(value.toUpperCase())) {
            showTrackFieldError(field, 'Invalid application number format (e.g., DESH12345678901)');
            return false;
        }
    }
    
    if (fieldName === 'dateOfBirth') {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 0 || age > 120) {
            showTrackFieldError(field, 'Please enter a valid date of birth');
            return false;
        }
    }
    
    showTrackFieldSuccess(field);
    return true;
}

function showTrackFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
}

function showTrackFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('success');
}

function clearTrackFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function findApplication(searchData) {
    // Search in localStorage for applications
    const applications = DeshswaarUtils.getFromLocalStorage('applications') || [];
    
    return applications.find(app => {
        const appNoMatch = app.applicationNo === searchData.applicationNo;
        const dobMatch = app.dateOfBirth === searchData.dateOfBirth;
        
        return appNoMatch && dobMatch;
    });
}

function displayApplicationStatus(application) {
    const statusContainer = document.getElementById('applicationStatus');
    const noApplicationContainer = document.getElementById('noApplicationFound');
    
    // Hide no application message
    noApplicationContainer.style.display = 'none';
    
    // Generate status data
    const statusData = generateStatusData(application);
    
    // Create status display
    statusContainer.innerHTML = createStatusHTML(application, statusData);
    statusContainer.style.display = 'block';
    
    // Scroll to status
    statusContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Show notification
    DeshswaarUtils.showNotification('Application found successfully!', 'success');
}

function generateStatusData(application) {
    const submissionDate = new Date(application.submissionDate);
    const now = new Date();
    const daysDiff = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
    
    // Generate timeline based on submission date
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
    
    // Determine current status
    let currentStatus = 'Submitted';
    if (daysDiff >= 21) currentStatus = 'Completed';
    else if (daysDiff >= 14) currentStatus = 'Dispatch';
    else if (daysDiff >= 10) currentStatus = 'Printing';
    else if (daysDiff >= 7) currentStatus = 'Approved';
    else if (daysDiff >= 3) currentStatus = 'Police Verification';
    else if (daysDiff >= 1) currentStatus = 'Under Review';
    
    return {
        currentStatus,
        timeline,
        processingDays: daysDiff,
        estimatedCompletion: new Date(submissionDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    };
}

function createStatusHTML(application, statusData) {
    const statusClass = getStatusClass(statusData.currentStatus);
    
    return `
        <div class="status-header">
            <h2>Application Status</h2>
            <div class="current-status ${statusClass}">
                <i class="fas fa-info-circle"></i>
                ${statusData.currentStatus}
            </div>
        </div>
        
        <div class="application-details">
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Application Number</span>
                    <span class="detail-value">${application.applicationNo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Applicant Name</span>
                    <span class="detail-value">${application.firstName} ${application.lastName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Application Type</span>
                    <span class="detail-value">${formatApplicationType(application.applicationType)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Submission Date</span>
                    <span class="detail-value">${formatDate(new Date(application.submissionDate))}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Processing Days</span>
                    <span class="detail-value">${statusData.processingDays} days</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Estimated Completion</span>
                    <span class="detail-value">${formatDate(statusData.estimatedCompletion)}</span>
                </div>
            </div>
            
            <div class="status-timeline">
                <div class="timeline-header">
                    <h3>Application Progress</h3>
                    <p>Track your application through each stage of processing</p>
                </div>
                
                <div class="timeline">
                    ${statusData.timeline.map((item, index) => createTimelineItemHTML(item, index)).join('')}
                </div>
            </div>
        </div>
    `;
}

function createTimelineItemHTML(item, index) {
    let iconClass = 'pending';
    if (item.completed) iconClass = 'completed';
    else if (item.current) iconClass = 'current';
    
    const dateText = item.date ? formatDate(item.date) : 'Pending';
    
    return `
        <div class="timeline-item">
            <div class="timeline-content">
                <h4>${item.status}</h4>
                <p>${item.description}</p>
                <span class="timeline-date">${dateText}</span>
            </div>
            <div class="timeline-icon ${iconClass}">
                <i class="${item.icon}"></i>
            </div>
        </div>
    `;
}

function showNoApplicationFound() {
    const statusContainer = document.getElementById('applicationStatus');
    const noApplicationContainer = document.getElementById('noApplicationFound');
    
    // Hide status display
    statusContainer.style.display = 'none';
    
    // Show no application message
    noApplicationContainer.style.display = 'block';
    
    // Scroll to message
    noApplicationContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Show notification
    DeshswaarUtils.showNotification('No application found with the provided details', 'error');
}

function getStatusClass(status) {
    const statusMap = {
        'Submitted': 'status-submitted',
        'Under Review': 'status-under-review',
        'Police Verification': 'status-under-review',
        'Approved': 'status-approved',
        'Printing': 'status-approved',
        'Dispatch': 'status-under-review',
        'Completed': 'status-completed'
    };
    
    return statusMap[status] || 'status-submitted';
}

function formatApplicationType(type) {
    const typeMap = {
        'fresh': 'Fresh Passport',
        'reissue': 'Re-issue',
        'diplomatic': 'Diplomatic',
        'official': 'Official'
    };
    
    return typeMap[type] || type;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Auto-format application number input
document.addEventListener('input', function(e) {
    if (e.target.id === 'applicationNo') {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // Ensure it starts with DESH
        if (value && !value.startsWith('DESH')) {
            if ('DESH'.startsWith(value)) {
                value = 'DESH';
            } else {
                value = 'DESH' + value.replace(/^DESH/, '');
            }
        }
        
        // Limit to correct length
        if (value.length > 15) {
            value = value.substr(0, 15);
        }
        
        e.target.value = value;
    }
});

// Sample applications for demo (in real app, this would come from backend)
function createSampleApplications() {
    const sampleApps = [
        {
            applicationNo: 'DESH12345678901',
            firstName: 'Raj',
            lastName: 'Kumar',
            applicationType: 'fresh',
            dateOfBirth: '1990-05-15',
            submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            applicationNo: 'DESH23456789012',
            firstName: 'Priya',
            lastName: 'Sharma',
            applicationType: 'reissue',
            dateOfBirth: '1985-08-22',
            submissionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    // Only add if no applications exist
    const existingApps = DeshswaarUtils.getFromLocalStorage('applications') || [];
    if (existingApps.length === 0) {
        DeshswaarUtils.saveToLocalStorage('applications', sampleApps);
    }
}

// Create sample applications on page load for demo
createSampleApplications();