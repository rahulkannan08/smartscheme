// API Configuration and Functions

// API Base URL - Backend Integration
const API_BASE_URL = 'http://localhost:5000/api';

// API Configuration
const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
};

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    const url = `${apiConfig.baseURL}${endpoint}`;
    
    const config = {
        method: 'GET',
        headers: {
            ...apiConfig.headers,
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Schemes API Functions
const schemesAPI = {
    // Get all schemes with pagination
    async getAllSchemes(page = 1, limit = 9) {
        try {
            const response = await apiRequest(`/v2/schemes/get-all-schemes?page=${page}&limit=${limit}`);
            return response;
        } catch (error) {
            throw new Error('Failed to fetch schemes');
        }
    },

    // Get filtered schemes
    async getFilteredSchemes(filters = {}, page = 1, limit = 9) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filters
            });
            
            const response = await apiRequest(`/v2/schemes/get-filtered-schemes?${params}`);
            return response;
        } catch (error) {
            throw new Error('Failed to fetch filtered schemes');
        }
    },

    // Get scheme by ID
    async getSchemeById(id) {
        try {
            const response = await apiRequest(`/v2/schemes/get-scheme-by-id/${id}`);
            return response;
        } catch (error) {
            throw new Error('Failed to fetch scheme details');
        }
    },

    // Get schemes by category
    async getSchemesByCategory(category, page = 1, limit = 9) {
        try {
            const response = await apiRequest(`/v2/schemes/get-scheme-by-category/${category}?page=${page}&limit=${limit}`);
            return response;
        } catch (error) {
            throw new Error('Failed to fetch schemes by category');
        }
    }
};

// Chatbot API Functions
const chatbotAPI = {
    // Send message to AI chatbot
    async sendMessage(message) {
        try {
            const response = await apiRequest('/v1/ai-chatbot/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: message })
            });
            return response;
        } catch (error) {
            throw new Error('Failed to get chatbot response');
        }
    }
};



// Export API functions
window.API = {
    schemes: schemesAPI,
    chatbot: chatbotAPI,
    request: apiRequest
};

// Error handling utility
function handleAPIError(error, fallbackMessage = 'Something went wrong') {
    console.error('API Error:', error);
    
    let message = fallbackMessage;
    if (error.message) {
        message = error.message;
    }
    
    // Show error toast
    if (window.SMART_THITTAM && window.SMART_THITTAM.showToast) {
        window.SMART_THITTAM.showToast(message, 'error');
    }
    
    return {
        success: false,
        message: message
    };
}

// Success response utility
function handleAPISuccess(data, message = 'Operation successful') {
    if (window.SMART_THITTAM && window.SMART_THITTAM.showToast) {
        window.SMART_THITTAM.showToast(message, 'success');
    }
    
    return {
        success: true,
        data: data,
        message: message
    };
} 