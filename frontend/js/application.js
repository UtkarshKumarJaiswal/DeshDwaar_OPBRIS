// Application JavaScript for DeshDwaar Passport System

let currentStep = 1;
const totalSteps = 6;

document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
    generateApplicationNumber();
});

function initializeApplication() {
    // Initialize form functionality
    initStepNavigation();
    initFormValidation();
    initAddressFields();
    
    // Set current date limits
    setDateLimits();
    
    // Initialize file uploads (will be added in later steps)
    // initFileUploads();
}

function generateApplicationNumber() {
    const appNoField = document.getElementById('applicationNo');
    if (appNoField) {
        const applicationNo = DeshswaarUtils.generateApplicationNumber();
        appNoField.value = applicationNo;
    }
}

function initStepNavigation() {
    updateProgressBar();
    updateStepIndicators();
    
    // Show/hide navigation buttons
    updateNavigationButtons();
}

function changeStep(direction) {
    console.log('changeStep called with direction:', direction, 'currentStep:', currentStep);
    
    const currentStepElement = document.getElementById(`step${currentStep}`);
    console.log('Current step element:', currentStepElement);
    
    // Validate current step before moving forward
    if (direction > 0) {
        if (!validateCurrentStep()) {
            console.log('Validation failed, not moving forward');
            return;
        }
    }
    
    // Hide current step
    currentStepElement.classList.remove('active');
    
    // Update current step
    currentStep += direction;
    console.log('New currentStep:', currentStep);
    
    // Show new step
    const newStepElement = document.getElementById(`step${currentStep}`);
    console.log('New step element:', newStepElement);
    if (newStepElement) {
        newStepElement.classList.add('active');
    }
    
    // Update UI
    updateProgressBar();
    updateStepIndicators();
    updateNavigationButtons();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;
}

function updateStepIndicators() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    // Show/hide next/submit button
    // Hide Next button on step 1 (it has its own dedicated button)
    if (currentStep === 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
    } else if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function validateCurrentStep() {
    console.log('validateCurrentStep called');
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
    
    console.log('Required fields found:', requiredFields.length);
    
    let isValid = true;
    let emptyFieldsCount = 0;
    
    requiredFields.forEach(field => {
        if (!field.value || !field.value.trim()) {
            emptyFieldsCount++;
            console.log('Empty field:', field.name, field.id);
            // Highlight the field but don't stop validation yet
            field.style.borderColor = '#e74c3c';
        } else {
            field.style.borderColor = '#27ae60';
        }
    });
    
    // Only show notification if there are empty fields
    if (emptyFieldsCount > 0) {
        console.log(`Found ${emptyFieldsCount} empty required fields`);
        // Try to show notification, but don't fail if it doesn't exist
        try {
            if (typeof DeshswaarUtils !== 'undefined' && DeshswaarUtils.showNotification) {
                DeshswaarUtils.showNotification(`Please fill ${emptyFieldsCount} required field(s)`, 'error');
            } else {
                alert(`Please fill ${emptyFieldsCount} required field(s)`);
            }
        } catch (e) {
            console.error('Error showing notification:', e);
            alert(`Please fill ${emptyFieldsCount} required field(s)`);
        }
        isValid = false;
    }
    
    console.log('Validation result:', isValid);
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const fieldType = field.type;
    
    // Clear previous validation
    clearFieldValidation(field);
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (!value) return true; // Skip other validations if field is empty and not required
    
    // Specific field validations
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
        case 'middleName':
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                showFieldError(field, 'Name should only contain letters and spaces');
                return false;
            }
            if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
            break;
            
        case 'email':
            if (!DeshswaarUtils.validateEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            if (!DeshswaarUtils.validatePhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'aadharNumber':
            if (!DeshswaarUtils.validateAadhar(value)) {
                showFieldError(field, 'Please enter a valid Aadhar number');
                return false;
            }
            break;
            
        case 'panNumber':
            if (value && !DeshswaarUtils.validatePAN(value)) {
                showFieldError(field, 'Please enter a valid PAN number');
                return false;
            }
            break;
            
        case 'dateOfBirth':
            if (!validateDateOfBirth(value)) {
                showFieldError(field, 'Invalid date of birth');
                return false;
            }
            break;
            
        case 'presentPincode':
        case 'permanentPincode':
            if (!/^\d{6}$/.test(value)) {
                showFieldError(field, 'PIN code must be 6 digits');
                return false;
            }
            break;
    }
    
    showFieldSuccess(field);
    return true;
}

function validateDateOfBirth(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    // Check if age is reasonable (0-120 years)
    return age >= 0 && age <= 120;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('success');
}

function clearFieldValidation(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function initFormValidation() {
    // Add real-time validation to all form fields
    const formFields = document.querySelectorAll('input, select');
    
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            if (field.value.trim()) {
                validateField(field);
            }
        });
        
        field.addEventListener('input', () => {
            clearFieldValidation(field);
        });
    });
    
    // Special handling for Aadhar number formatting
    const aadharField = document.getElementById('aadharNumber');
    if (aadharField) {
        aadharField.addEventListener('input', formatAadharNumber);
    }
    
    // Special handling for PAN number formatting
    const panField = document.getElementById('panNumber');
    if (panField) {
        panField.addEventListener('input', formatPANNumber);
    }
}

function formatAadharNumber(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'); // Add spaces
    e.target.value = value;
}

function formatPANNumber(e) {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Remove invalid characters
    e.target.value = value;
}

function initAddressFields() {
    const sameAsPermanentCheckbox = document.getElementById('sameAsPermanent');
    const permanentAddressSection = document.getElementById('permanentAddressSection');
    
    if (sameAsPermanentCheckbox && permanentAddressSection) {
        sameAsPermanentCheckbox.addEventListener('change', function() {
            if (this.checked) {
                copyPresentToPermanentAddress();
                permanentAddressSection.style.display = 'none';
                // Remove required attribute from permanent address fields
                const permanentFields = permanentAddressSection.querySelectorAll('input[required], select[required]');
                permanentFields.forEach(field => {
                    field.removeAttribute('required');
                });
            } else {
                permanentAddressSection.style.display = 'block';
                // Add required attribute back to permanent address fields
                const permanentFields = permanentAddressSection.querySelectorAll('input, select');
                permanentFields.forEach(field => {
                    if (field.name.startsWith('permanent')) {
                        field.setAttribute('required', '');
                    }
                });
            }
        });
    }
    
    // Populate permanent state options
    const permanentStateSelect = document.getElementById('permanentState');
    const presentStateSelect = document.getElementById('presentState');
    
    if (permanentStateSelect && presentStateSelect) {
        permanentStateSelect.innerHTML = presentStateSelect.innerHTML;
    }
}

function copyPresentToPermanentAddress() {
    const fieldMappings = {
        'presentHouseNo': 'permanentHouseNo',
        'presentStreet': 'permanentStreet',
        'presentArea': 'permanentArea',
        'presentCity': 'permanentCity',
        'presentState': 'permanentState',
        'presentPincode': 'permanentPincode'
    };
    
    Object.keys(fieldMappings).forEach(presentField => {
        const presentElement = document.getElementById(presentField);
        const permanentElement = document.getElementById(fieldMappings[presentField]);
        
        if (presentElement && permanentElement) {
            permanentElement.value = presentElement.value;
        }
    });
}

function setDateLimits() {
    const dateOfBirthField = document.getElementById('dateOfBirth');
    
    if (dateOfBirthField) {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        
        dateOfBirthField.max = maxDate.toISOString().split('T')[0];
        dateOfBirthField.min = minDate.toISOString().split('T')[0];
    }
}

// Handle form submission
document.addEventListener('submit', function(e) {
    if (e.target.id === 'passportApplicationForm') {
        e.preventDefault();
        handleFormSubmission();
    }
});

function handleFormSubmission() {
    // Final validation
    if (!validateAllSteps()) {
        DeshswaarUtils.showNotification('Please complete all required fields', 'error');
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Submitting Application...';
    submitBtn.disabled = true;
    
    // Simulate API submission
    setTimeout(() => {
        // Save application data
        saveApplicationData(formData);
        
        // Show success message
        DeshswaarUtils.showNotification('Application submitted successfully!', 'success');
        
        // Redirect to confirmation page
        setTimeout(() => {
            window.location.href = `confirmation.html?appNo=${formData.applicationNo}`;
        }, 2000);
    }, 3000);
}

function validateAllSteps() {
    for (let step = 1; step <= totalSteps; step++) {
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) {
            const requiredFields = stepElement.querySelectorAll('input[required], select[required]');
            
            for (let field of requiredFields) {
                if (!field.value.trim()) {
                    // Navigate to the step with error
                    currentStep = step;
                    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
                    stepElement.classList.add('active');
                    updateProgressBar();
                    updateStepIndicators();
                    updateNavigationButtons();
                    
                    return false;
                }
            }
        }
    }
    return true;
}

function collectFormData() {
    const form = document.getElementById('passportApplicationForm');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to regular object
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add metadata
    data.submissionDate = new Date().toISOString();
    data.status = 'submitted';
    data.paymentStatus = 'pending';
    
    return data;
}

function saveApplicationData(data) {
    // Save to localStorage (in real app, this would be sent to server)
    const applications = DeshswaarUtils.getFromLocalStorage('applications') || [];
    applications.push(data);
    DeshswaarUtils.saveToLocalStorage('applications', applications);
    
    // Also save individual application for easy retrieval
    DeshswaarUtils.saveToLocalStorage(`application_${data.applicationNo}`, data);
}

// Auto-save functionality (save draft every 30 seconds)
setInterval(() => {
    const formData = collectFormData();
    if (formData.firstName || formData.lastName || formData.email) {
        DeshswaarUtils.saveToLocalStorage('application_draft', formData);
    }
}, 30000);

// Load draft on page load
window.addEventListener('load', () => {
    const draft = DeshswaarUtils.getFromLocalStorage('application_draft');
    if (draft && confirm('You have a saved draft. Would you like to continue from where you left off?')) {
        loadDraftData(draft);
    }
});

function loadDraftData(draft) {
    Object.keys(draft).forEach(key => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = draft[key];
            
            // Trigger validation
            if (field.value.trim()) {
                validateField(field);
            }
        }
    });
    
    DeshswaarUtils.showNotification('Draft loaded successfully', 'success');
}