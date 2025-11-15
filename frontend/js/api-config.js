// API Configuration for DeshDwaar Passport System
// This file configures the connection between frontend and backend

const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 10000, // 10 seconds
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// API Endpoints
const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password'
    },
    
    // Applications
    APPLICATIONS: {
        SUBMIT: '/applications/submit',
        MY_APPLICATIONS: '/applications/my-applications',
        TRACK: '/applications/track',
        STATS: '/applications/stats/summary',
        GET_BY_ID: '/applications' // + /:applicationNo
    },
    
    // System
    HEALTH: '/health'
};

// Utility function to make API calls
const apiCall = async (endpoint, options = {}) => {
    const url = API_CONFIG.BASE_URL + endpoint;
    
    const defaultOptions = {
        method: 'GET',
        headers: { ...API_CONFIG.HEADERS },
        timeout: API_CONFIG.TIMEOUT
    };
    
    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(url, {
            ...finalOptions,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
        
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// Export for use in other files
window.API_CONFIG = API_CONFIG;
window.API_ENDPOINTS = API_ENDPOINTS;
window.apiCall = apiCall;

// CORS handling for development
if (window.location.hostname === 'localhost' && window.location.port === '8080') {
    console.log('🔗 Frontend running on http://localhost:8080');
    console.log('🚀 Backend API running on http://localhost:3000');
    console.log('📡 API calls will be made to:', API_CONFIG.BASE_URL);
}