// Authentication JavaScript for Deshswaar Passport System

document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    checkAuthStatus();
});

// Initialize authentication forms
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Add real-time validation
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateAuthField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Add real-time validation
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateAuthField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Password confirmation validation
        const passwordConfirm = document.getElementById('confirmPassword');
        if (passwordConfirm) {
            passwordConfirm.addEventListener('input', validatePasswordMatch);
        }
    }
    
    // Social login buttons
    initSocialLogin();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateLoginForm(form)) {
        return;
    }
    
    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual authentication)
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };
    
    // Mock authentication - replace with actual API call
    setTimeout(() => {
        // For demo purposes, accept any email/password
        if (loginData.email && loginData.password) {
            // Create mock user session
            const user = {
                id: generateUserId(),
                email: loginData.email,
                name: extractNameFromEmail(loginData.email),
                loginTime: new Date().toISOString(),
                isAuthenticated: true
            };
            
            // Store user session
            if (loginData.remember) {
                saveToLocalStorage('user_session', user);
            } else {
                sessionStorage.setItem('user_session', JSON.stringify(user));
            }
            
            // Show success message
            DeshswaarUtils.showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            
            DeshswaarUtils.showNotification('Invalid credentials. Please try again.', 'error');
        }
    }, 1500);
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateRegisterForm(form)) {
        return;
    }
    
    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    const registerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        dateOfBirth: formData.get('dateOfBirth'),
        agreeToTerms: formData.get('agreeToTerms') === 'on'
    };
    
    setTimeout(() => {
        // Check if email already exists (mock check)
        const existingUser = getFromLocalStorage('users') || [];
        const emailExists = existingUser.some(user => user.email === registerData.email);
        
        if (emailExists) {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            DeshswaarUtils.showNotification('Email already registered. Please use a different email.', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            ...registerData,
            registrationDate: new Date().toISOString(),
            isVerified: false,
            status: 'active'
        };
        
        // Remove password from stored data
        delete newUser.password;
        
        // Store user
        existingUser.push(newUser);
        saveToLocalStorage('users', existingUser);
        
        // Show success message
        DeshswaarUtils.showNotification('Registration successful! Please check your email for verification.', 'success');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html?registered=true';
        }, 2000);
    }, 2000);
}

// Validate login form
function validateLoginForm(form) {
    let isValid = true;
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    
    if (!validateAuthField(email)) isValid = false;
    if (!validateAuthField(password)) isValid = false;
    
    return isValid;
}

// Validate registration form
function validateRegisterForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!validateAuthField(input)) {
            isValid = false;
        }
    });
    
    // Additional validation for password confirmation
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    
    if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
            showFieldError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate authentication form fields
function validateAuthField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (!value) return true; // If not required and empty, skip other validations
    
    // Email validation
    if (fieldType === 'email' || fieldName === 'email') {
        if (!DeshswaarUtils.validateEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (fieldName === 'password') {
        if (value.length < 8) {
            showFieldError(field, 'Password must be at least 8 characters long');
            return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            showFieldError(field, 'Password must contain uppercase, lowercase, and number');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone') {
        if (!DeshswaarUtils.validatePhone(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Name validation
    if (fieldName === 'firstName' || fieldName === 'lastName') {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showFieldError(field, 'Name should only contain letters and spaces');
            return false;
        }
    }
    
    // Date of birth validation
    if (fieldName === 'dateOfBirth') {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            showFieldError(field, 'You must be at least 18 years old');
            return false;
        }
        if (age > 100) {
            showFieldError(field, 'Please enter a valid date of birth');
            return false;
        }
    }
    
    showFieldSuccess(field);
    return true;
}

// Password match validation
function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (password && confirmPassword) {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            showFieldError(confirmPassword, 'Passwords do not match');
        } else if (confirmPassword.value) {
            showFieldSuccess(confirmPassword);
        }
    }
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
}

// Show field success
function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // Remove existing messages
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleBtn = field.parentElement.querySelector('.password-toggle i');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Initialize social login
function initSocialLogin() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', handleFacebookLogin);
    }
}

// Handle Google login
function handleGoogleLogin() {
    DeshswaarUtils.showNotification('Google login integration coming soon!', 'info');
    // Implement Google OAuth integration here
}

// Handle Facebook login
function handleFacebookLogin() {
    DeshswaarUtils.showNotification('Facebook login integration coming soon!', 'info');
    // Implement Facebook OAuth integration here
}

// Check authentication status
function checkAuthStatus() {
    const user = getCurrentUser();
    
    if (user && user.isAuthenticated) {
        // User is logged in
        updateUIForLoggedInUser(user);
    } else {
        // User is not logged in
        updateUIForGuestUser();
    }
}

// Get current user
function getCurrentUser() {
    let user = null;
    
    // Check session storage first
    const sessionUser = sessionStorage.getItem('user_session');
    if (sessionUser) {
        user = JSON.parse(sessionUser);
    }
    
    // Check local storage if not in session
    if (!user) {
        user = getFromLocalStorage('user_session');
    }
    
    return user;
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    // Update navigation
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn && registerBtn) {
        // Replace login/register buttons with user menu
        const userMenu = createUserMenu(user);
        loginBtn.parentElement.replaceWith(userMenu);
        registerBtn.style.display = 'none';
    }
}

// Update UI for guest user
function updateUIForGuestUser() {
    // Ensure login/register buttons are visible
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (registerBtn) registerBtn.style.display = 'block';
}

// Create user menu
function createUserMenu(user) {
    const userMenuItem = document.createElement('li');
    userMenuItem.className = 'user-menu';
    userMenuItem.innerHTML = `
        <div class="user-dropdown">
            <button class="user-toggle">
                <i class="fas fa-user-circle"></i>
                <span>${user.name || 'User'}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown-content">
                <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                <a href="applications.html"><i class="fas fa-file-alt"></i> My Applications</a>
                <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
                <div class="dropdown-divider"></div>
                <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>
    `;
    
    // Add dropdown functionality
    const toggle = userMenuItem.querySelector('.user-toggle');
    const dropdown = userMenuItem.querySelector('.user-dropdown-content');
    
    toggle.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuItem.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    return userMenuItem;
}

// Logout function
function logout() {
    // Clear user session
    sessionStorage.removeItem('user_session');
    removeFromLocalStorage('user_session');
    
    // Show notification
    DeshswaarUtils.showNotification('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Utility functions
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function extractNameFromEmail(email) {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
}

// Add user dropdown styles
const userDropdownStyles = `
    .user-menu .user-dropdown {
        position: relative;
    }
    
    .user-toggle {
        background: none;
        border: none;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: background 0.3s ease;
    }
    
    .user-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .user-dropdown-content {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        min-width: 200px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        border-radius: 5px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .user-dropdown-content.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .user-dropdown-content a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        color: #2c3e50;
        text-decoration: none;
        transition: background 0.3s ease;
    }
    
    .user-dropdown-content a:hover {
        background: #f8f9fa;
    }
    
    .dropdown-divider {
        height: 1px;
        background: #e9ecef;
        margin: 0.5rem 0;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = userDropdownStyles;
document.head.appendChild(styleSheet);

// Make functions available globally
window.togglePassword = togglePassword;
window.logout = logout;