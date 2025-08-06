const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Scheme = require('../models/Scheme');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array()
        });
    }
    next();
};

// Simple AI chatbot for scheme recommendations
router.post('/chat', [
    body('prompt').notEmpty().withMessage('Prompt is required'),
    handleValidationErrors
], async (req, res) => {
    try {
        const { prompt } = req.body;
        const userMessage = prompt.toLowerCase();

        let response = {
            message: '',
            schemes: [],
            suggestions: []
        };

        // Simple keyword-based response system
        if (userMessage.includes('education') || userMessage.includes('study') || userMessage.includes('student')) {
            response.message = "I found some great education schemes for you! Here are some options:";
            const educationSchemes = await Scheme.find({
                category: 'Education',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = educationSchemes;
            response.suggestions = ['Tell me about healthcare schemes', 'Show me employment opportunities', 'What about housing schemes?'];
        }
        else if (userMessage.includes('health') || userMessage.includes('medical') || userMessage.includes('hospital')) {
            response.message = "Here are some healthcare schemes that might interest you:";
            const healthSchemes = await Scheme.find({
                category: 'Healthcare',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = healthSchemes;
            response.suggestions = ['Show me education schemes', 'What about employment schemes?', 'Tell me about housing schemes'];
        }
        else if (userMessage.includes('job') || userMessage.includes('employment') || userMessage.includes('work')) {
            response.message = "I found some employment and job-related schemes:";
            const employmentSchemes = await Scheme.find({
                category: 'Employment',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = employmentSchemes;
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about housing schemes'];
        }
        else if (userMessage.includes('house') || userMessage.includes('home') || userMessage.includes('housing')) {
            response.message = "Here are some housing schemes available:";
            const housingSchemes = await Scheme.find({
                category: 'Housing',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = housingSchemes;
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }
        else if (userMessage.includes('agriculture') || userMessage.includes('farm') || userMessage.includes('farmer')) {
            response.message = "I found some agriculture schemes for farmers:";
            const agricultureSchemes = await Scheme.find({
                category: 'Agriculture',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = agricultureSchemes;
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }
        else if (userMessage.includes('women') || userMessage.includes('female') || userMessage.includes('girl')) {
            response.message = "Here are some women empowerment schemes:";
            const womenSchemes = await Scheme.find({
                category: 'Women Empowerment',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = womenSchemes;
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }
        else if (userMessage.includes('youth') || userMessage.includes('young') || userMessage.includes('student')) {
            response.message = "Here are some youth development schemes:";
            const youthSchemes = await Scheme.find({
                category: 'Youth Development',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = youthSchemes;
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }
        else if (userMessage.includes('senior') || userMessage.includes('elderly') || userMessage.includes('old')) {
            response.message = "Here are some schemes for senior citizens:";
            const seniorSchemes = await Scheme.find({
                category: 'Senior Citizens',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = seniorSchemes;
            response.suggestions = ['Show me healthcare schemes', 'What about housing schemes?', 'Tell me about financial inclusion'];
        }
        else if (userMessage.includes('disability') || userMessage.includes('disabled') || userMessage.includes('handicap')) {
            response.message = "Here are some schemes for persons with disabilities:";
            const disabilitySchemes = await Scheme.find({
                category: 'Disability',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = disabilitySchemes;
            response.suggestions = ['Show me healthcare schemes', 'What about employment schemes?', 'Tell me about education schemes'];
        }
        else if (userMessage.includes('loan') || userMessage.includes('finance') || userMessage.includes('money')) {
            response.message = "Here are some financial inclusion schemes:";
            const financeSchemes = await Scheme.find({
                category: 'Financial Inclusion',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = financeSchemes;
            response.suggestions = ['Show me education schemes', 'What about employment schemes?', 'Tell me about housing schemes'];
        }
        else if (userMessage.includes('technology') || userMessage.includes('tech') || userMessage.includes('digital')) {
            response.message = "Here are some technology-related schemes:";
            const techSchemes = await Scheme.find({
                category: 'Technology',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = techSchemes;
            response.suggestions = ['Show me education schemes', 'What about employment schemes?', 'Tell me about financial inclusion'];
        }
        else if (userMessage.includes('environment') || userMessage.includes('green') || userMessage.includes('eco')) {
            response.message = "Here are some environment-friendly schemes:";
            const envSchemes = await Scheme.find({
                category: 'Environment',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = envSchemes;
            response.suggestions = ['Show me education schemes', 'What about technology schemes?', 'Tell me about agriculture schemes'];
        }
        else if (userMessage.includes('rural') || userMessage.includes('village')) {
            response.message = "Here are some rural development schemes:";
            const ruralSchemes = await Scheme.find({
                category: 'Rural Development',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = ruralSchemes;
            response.suggestions = ['Show me agriculture schemes', 'What about healthcare schemes?', 'Tell me about education schemes'];
        }
        else if (userMessage.includes('urban') || userMessage.includes('city')) {
            response.message = "Here are some urban development schemes:";
            const urbanSchemes = await Scheme.find({
                category: 'Urban Development',
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = urbanSchemes;
            response.suggestions = ['Show me housing schemes', 'What about employment schemes?', 'Tell me about technology schemes'];
        }
        else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
            response.message = "Hello! I'm your Smart Scheme Assistant. I can help you find government schemes based on your needs. What type of scheme are you looking for? You can ask about education, healthcare, employment, housing, agriculture, women empowerment, youth development, senior citizens, disability, financial inclusion, technology, environment, rural development, or urban development schemes.";
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }
        else if (userMessage.includes('help') || userMessage.includes('what can you do')) {
            response.message = "I can help you find government schemes! Here's what I can do:\n\n• Find schemes by category (education, healthcare, employment, etc.)\n• Recommend schemes based on your needs\n• Provide information about scheme benefits and eligibility\n• Help you understand application processes\n\nJust tell me what you're looking for!";
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }
        else if (userMessage.includes('thank')) {
            response.message = "You're welcome! I'm here to help you find the best government schemes. Feel free to ask me anything else about schemes or if you need help with applications.";
            response.suggestions = ['Show me more schemes', 'What about other categories?', 'How do I apply for schemes?'];
        }
        else {
            // Default response with featured schemes
            response.message = "I understand you're looking for schemes. Here are some popular ones that might interest you:";
            const featuredSchemes = await Scheme.find({
                featured: true,
                status: 'Active'
            }).limit(3).select('title description benefits eligibility');
            response.schemes = featuredSchemes;
            response.suggestions = ['Show me education schemes', 'What about healthcare schemes?', 'Tell me about employment schemes'];
        }

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Error in chatbot:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, I encountered an error. Please try again.'
        });
    }
});

// Get chatbot suggestions
router.get('/suggestions', async (req, res) => {
    try {
        const suggestions = [
            'Show me education schemes',
            'What about healthcare schemes?',
            'Tell me about employment schemes',
            'Show me housing schemes',
            'What about agriculture schemes?',
            'Tell me about women empowerment schemes',
            'Show me youth development schemes',
            'What about senior citizen schemes?',
            'Tell me about disability schemes',
            'Show me financial inclusion schemes',
            'What about technology schemes?',
            'Tell me about environment schemes'
        ];

        res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get scheme categories for chatbot
router.get('/categories', async (req, res) => {
    try {
        const categories = [
            'Education',
            'Healthcare',
            'Employment',
            'Housing',
            'Agriculture',
            'Women Empowerment',
            'Youth Development',
            'Senior Citizens',
            'Disability',
            'Financial Inclusion',
            'Technology',
            'Environment',
            'Rural Development',
            'Urban Development'
        ];

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router; 