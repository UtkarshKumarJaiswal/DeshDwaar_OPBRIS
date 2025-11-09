// Dashboard JavaScript for Deshswaar Passport System

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    
    if (!currentUser || !currentUser.isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Load dashboard data
    loadUserData(currentUser);
    loadApplications();
    loadNotifications();
    loadActivities();
    
    // Update statistics
    updateStatistics();
    
    // Add animations
    addAnimations();
}

function loadUserData(user) {
    // Update user name in welcome section
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.name || extractNameFromEmail(user.email);
    }
    
    // Update account created time
    const accountCreatedElement = document.getElementById('accountCreatedTime');
    if (accountCreatedElement && user.registrationDate) {
        const registrationDate = new Date(user.registrationDate);
        accountCreatedElement.textContent = formatRelativeTime(registrationDate);
    }
}

function loadApplications() {
    const applications = DeshswaarUtils.getFromLocalStorage('applications') || [];
    const currentUser = getCurrentUser();
    
    // Filter applications for current user
    const userApplications = applications.filter(app => 
        app.email === currentUser.email
    );
    
    const tableBody = document.getElementById('applicationsTableBody');
    const noApplicationsMessage = document.getElementById('noApplicationsMessage');
    
    if (userApplications.length === 0) {
        tableBody.style.display = 'none';
        noApplicationsMessage.style.display = 'block';
        return;
    }
    
    // Show recent applications (last 5)
    const recentApplications = userApplications
        .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
        .slice(0, 5);
    
    tableBody.innerHTML = '';
    
    recentApplications.forEach(app => {
        const row = createApplicationRow(app);
        tableBody.appendChild(row);
    });
    
    tableBody.style.display = 'table-row-group';
    noApplicationsMessage.style.display = 'none';
}

function createApplicationRow(application) {
    const row = document.createElement('tr');
    
    const status = getApplicationStatus(application);
    const statusClass = getStatusClass(status);
    
    row.innerHTML = `
        <td>${application.applicationNo}</td>
        <td>${formatApplicationType(application.applicationType)}</td>
        <td>${formatDate(new Date(application.submissionDate))}</td>
        <td><span class="status-badge ${statusClass}">${status}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-small btn-view" onclick="viewApplication('${application.applicationNo}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn-small btn-download" onclick="downloadApplication('${application.applicationNo}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function getApplicationStatus(application) {
    // Simulate status progression based on submission date
    const submissionDate = new Date(application.submissionDate);
    const now = new Date();
    const daysDiff = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Submitted';
    if (daysDiff <= 2) return 'Under Review';
    if (daysDiff <= 5) return 'Documents Verified';
    if (daysDiff <= 10) return 'Police Verification';
    if (daysDiff <= 15) return 'Approved';
    return 'Completed';
}

function getStatusClass(status) {
    const statusMap = {
        'Submitted': 'status-submitted',
        'Under Review': 'status-under-review',
        'Documents Verified': 'status-under-review',
        'Police Verification': 'status-under-review',
        'Approved': 'status-approved',
        'Completed': 'status-completed',
        'Rejected': 'status-rejected'
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

function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const noNotificationsMessage = document.getElementById('noNotificationsMessage');
    
    // Generate sample notifications based on applications
    const applications = DeshswaarUtils.getFromLocalStorage('applications') || [];
    const currentUser = getCurrentUser();
    const userApplications = applications.filter(app => app.email === currentUser.email);
    
    const notifications = generateNotifications(userApplications);
    
    if (notifications.length === 0) {
        notificationsList.style.display = 'none';
        noNotificationsMessage.style.display = 'block';
        return;
    }
    
    notificationsList.innerHTML = '';
    
    notifications.slice(0, 5).forEach(notification => {
        const notificationElement = createNotificationElement(notification);
        notificationsList.appendChild(notificationElement);
    });
    
    notificationsList.style.display = 'block';
    noNotificationsMessage.style.display = 'none';
}

function generateNotifications(applications) {
    const notifications = [];
    
    applications.forEach(app => {
        const submissionDate = new Date(app.submissionDate);
        const status = getApplicationStatus(app);
        
        // Create notification based on status
        if (status !== 'Submitted') {
            notifications.push({
                id: `app_${app.applicationNo}_${status.toLowerCase().replace(/\s+/g, '_')}`,
                type: 'info',
                title: `Application ${status}`,
                message: `Your passport application ${app.applicationNo} is now ${status.toLowerCase()}.`,
                time: new Date(submissionDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
                applicationNo: app.applicationNo
            });
        }
    });
    
    // Add welcome notification
    const user = getCurrentUser();
    if (user.registrationDate) {
        const regDate = new Date(user.registrationDate);
        notifications.push({
            id: 'welcome',
            type: 'success',
            title: 'Welcome to Deshswaar!',
            message: 'Your account has been successfully created. You can now apply for passport services.',
            time: regDate
        });
    }
    
    // Sort by time (most recent first)
    return notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
}

function createNotificationElement(notification) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification-item';
    
    const iconClass = getNotificationIconClass(notification.type);
    const typeClass = `notification-${notification.type}`;
    
    notificationDiv.innerHTML = `
        <div class="notification-icon ${typeClass}">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
            <span class="notification-time">${formatRelativeTime(notification.time)}</span>
        </div>
    `;
    
    return notificationDiv;
}

function getNotificationIconClass(type) {
    const iconMap = {
        'info': 'fas fa-info-circle',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle'
    };
    
    return iconMap[type] || 'fas fa-info-circle';
}

function loadActivities() {
    const activitiesList = document.getElementById('activitiesList');
    const applications = DeshswaarUtils.getFromLocalStorage('applications') || [];
    const currentUser = getCurrentUser();
    
    // Generate activities based on applications and user actions
    const activities = generateActivities(applications, currentUser);
    
    // Keep only the welcome activity if no other activities
    const existingWelcome = activitiesList.querySelector('.activity-item');
    
    activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        if (existingWelcome) {
            activitiesList.insertBefore(activityElement, existingWelcome);
        } else {
            activitiesList.appendChild(activityElement);
        }
    });
}

function generateActivities(applications, user) {
    const activities = [];
    
    // Filter user applications
    const userApplications = applications.filter(app => app.email === user.email);
    
    userApplications.forEach(app => {
        activities.push({
            icon: 'fas fa-file-plus',
            title: 'Application Submitted',
            message: `Passport application ${app.applicationNo} has been submitted successfully.`,
            time: new Date(app.submissionDate)
        });
    });
    
    // Sort by time (most recent first)
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
}

function createActivityElement(activity) {
    const activityDiv = document.createElement('div');
    activityDiv.className = 'activity-item';
    
    activityDiv.innerHTML = `
        <div class="activity-icon">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.message}</p>
            <span class="activity-time">${formatRelativeTime(activity.time)}</span>
        </div>
    `;
    
    return activityDiv;
}

function updateStatistics() {
    const applications = DeshswaarUtils.getFromLocalStorage('applications') || [];
    const currentUser = getCurrentUser();
    
    // Filter applications for current user
    const userApplications = applications.filter(app => app.email === currentUser.email);
    
    const totalApplications = userApplications.length;
    const pendingApplications = userApplications.filter(app => {
        const status = getApplicationStatus(app);
        return !['Completed', 'Rejected'].includes(status);
    }).length;
    const approvedApplications = userApplications.filter(app => {
        const status = getApplicationStatus(app);
        return ['Approved', 'Completed'].includes(status);
    }).length;
    
    // Update stats with animation
    animateCounter('totalApplications', totalApplications);
    animateCounter('pendingApplications', pendingApplications);
    animateCounter('approvedApplications', approvedApplications);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 30; // 30 frames
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 50);
}

function addAnimations() {
    // Add fade-in animation to dashboard cards
    const cards = document.querySelectorAll('.action-card, .stat-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in-up');
        }, index * 100);
    });
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function formatRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return formatDate(date);
    }
}

// Action handlers
function viewApplication(applicationNo) {
    // Redirect to application details page
    window.location.href = `application-details.html?appNo=${applicationNo}`;
}

function downloadApplication(applicationNo) {
    const application = DeshswaarUtils.getFromLocalStorage(`application_${applicationNo}`);
    
    if (!application) {
        DeshswaarUtils.showNotification('Application not found', 'error');
        return;
    }
    
    // Create downloadable PDF content (simplified)
    const content = generateApplicationPDF(application);
    downloadFile(content, `passport_application_${applicationNo}.txt`);
    
    DeshswaarUtils.showNotification('Application downloaded successfully', 'success');
}

function generateApplicationPDF(application) {
    return `
PASSPORT APPLICATION
====================

Application Number: ${application.applicationNo}
Application Type: ${formatApplicationType(application.applicationType)}
Submission Date: ${formatDate(new Date(application.submissionDate))}

PERSONAL INFORMATION
====================
Name: ${application.firstName} ${application.middleName || ''} ${application.lastName}
Date of Birth: ${application.dateOfBirth}
Place of Birth: ${application.placeOfBirth}
Gender: ${application.gender}
Marital Status: ${application.maritalStatus}
Email: ${application.email}
Phone: ${application.phone}
Aadhar Number: ${application.aadharNumber}
PAN Number: ${application.panNumber || 'Not provided'}

PRESENT ADDRESS
===============
${application.presentHouseNo}, ${application.presentStreet}
${application.presentArea}, ${application.presentCity}
${application.presentState} - ${application.presentPincode}

Status: ${getApplicationStatus(application)}
Generated on: ${formatDate(new Date())}

---
Deshswaar - Government of India
    `;
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Auto-refresh dashboard data every 5 minutes
setInterval(() => {
    loadApplications();
    loadNotifications();
    updateStatistics();
}, 5 * 60 * 1000);

// Make functions available globally
window.viewApplication = viewApplication;
window.downloadApplication = downloadApplication;