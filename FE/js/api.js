if (!window.SMART_API_LOADED) {
    window.SMART_API_LOADED = true;

    // API Base URL - Backend Integration
    if (typeof API_BASE_URL === "undefined") {
        var API_BASE_URL = 'http://localhost:5001/api';
    }

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
        // Send message to Gemini AI chatbot securely
        async sendMessage(message) {
            // Fetch Gemini API key from backend
            let apiKey = '';
            try {
                // Always use full backend URL
                const res = await fetch('http://localhost:5001/api/get-gemini-key');
                const data = await res.json();
                apiKey = data.key;
            } catch (err) {
                return { reply: "Error: Unable to fetch Gemini API key." };
            }
            if (!apiKey) {
                return { reply: "Error: Gemini API key not configured." };
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            };

            const systemPrompt = "You are a helpful and friendly chatbot. You provide concise and useful answers.";

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...payload,
                    systemInstruction: {
                        parts: [{
                            text: systemPrompt
                        }]
                    }
                })
            };

            let responseText = '';
            let retries = 0;
            const maxRetries = 3;
            const delay = (ms) => new Promise(res => setTimeout(res, ms));

            while (retries < maxRetries) {
                try {
                    const response = await fetch(apiUrl, requestOptions);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
                    }
                    const result = await response.json();
                    const candidate = result.candidates?.[0];

                    if (candidate && candidate.content?.parts?.[0]?.text) {
                        responseText = candidate.content.parts[0].text;
                        break;
                    } else {
                        throw new Error("Invalid API response format.");
                    }
                } catch (error) {
                    retries++;
                    if (retries < maxRetries) {
                        await delay(1000 * Math.pow(2, retries - 1));
                    } else {
                        responseText = "Failed to get a response from the chatbot. Please try again later.";
                    }
                }
            }
            return { reply: responseText };
        }
    };

    // Example registration function
    async function registerUser(userData) {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    }

    // Export API functions
    window.API = {
        schemes: schemesAPI,
        chatbot: chatbotAPI,
        request: apiRequest,
        registerUser
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
}

