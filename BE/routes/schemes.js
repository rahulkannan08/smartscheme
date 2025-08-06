const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const { body, validationResult, query } = require('express-validator');

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

// Get all schemes with pagination
router.get('/get-all-schemes', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    handleValidationErrors
], async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const schemes = await Scheme.find({ status: 'Active' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await Scheme.countDocuments({ status: 'Active' });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: {
                schemes,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalSchemes: total,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching schemes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get filtered schemes
router.get('/get-filtered-schemes', [
    query('category').optional().isString(),
    query('age').optional().isInt({ min: 0, max: 120 }),
    query('income').optional().isInt({ min: 0 }),
    query('education').optional().isString(),
    query('gender').optional().isIn(['Male', 'Female', 'Any']),
    query('location').optional().isIn(['Rural', 'Urban', 'Both']),
    query('district').optional().isString(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    handleValidationErrors
], async (req, res) => {
    try {
        const {
            category,
            age,
            income,
            education,
            gender,
            location,
            district,
            search,
            page = 1,
            limit = 9
        } = req.query;

        const skip = (page - 1) * limit;
        const filter = { status: 'Active' };

        // Apply filters
        if (category) filter.category = category;
        if (age) {
            filter['eligibility.age.min'] = { $lte: parseInt(age) };
            filter['eligibility.age.max'] = { $gte: parseInt(age) };
        }
        if (income) {
            filter['eligibility.income.min'] = { $lte: parseInt(income) };
            filter['eligibility.income.max'] = { $gte: parseInt(income) };
        }
        if (education) filter['eligibility.education'] = { $in: [education, 'Any'] };
        if (gender) filter['eligibility.gender'] = { $in: [gender, 'Any'] };
        if (location) filter['eligibility.location'] = { $in: [location, 'Both'] };
        if (district && district !== 'All Districts') filter.district = { $in: [district, 'All Districts'] };

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        const schemes = await Scheme.find(filter)
            .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await Scheme.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: {
                schemes,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalSchemes: total,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                filters: req.query
            }
        });
    } catch (error) {
        console.error('Error fetching filtered schemes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get scheme by ID
router.get('/get-scheme-by-id/:id', async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id).select('-__v');
        
        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            });
        }

        // Increment views
        await Scheme.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.status(200).json({
            success: true,
            data: scheme
        });
    } catch (error) {
        console.error('Error fetching scheme:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid scheme ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get schemes by category
router.get('/get-scheme-by-category/:category', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    handleValidationErrors
], async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const schemes = await Scheme.find({
            category: category,
            status: 'Active'
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await Scheme.countDocuments({
            category: category,
            status: 'Active'
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: {
                schemes,
                category,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalSchemes: total,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching schemes by category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get featured schemes
router.get('/featured', async (req, res) => {
    try {
        const schemes = await Scheme.find({
            featured: true,
            status: 'Active'
        })
            .sort({ createdAt: -1 })
            .limit(6)
            .select('-__v');

        res.status(200).json({
            success: true,
            data: schemes
        });
    } catch (error) {
        console.error('Error fetching featured schemes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get scheme categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Scheme.distinct('category');
        
        const categoryStats = await Promise.all(
            categories.map(async (category) => {
                const count = await Scheme.countDocuments({
                    category: category,
                    status: 'Active'
                });
                return { category, count };
            })
        );

        res.status(200).json({
            success: true,
            data: categoryStats
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get scheme districts
router.get('/districts', async (req, res) => {
    try {
        const districts = await Scheme.distinct('district');
        
        const districtStats = await Promise.all(
            districts.map(async (district) => {
                const count = await Scheme.countDocuments({
                    district: district,
                    status: 'Active'
                });
                return { district, count };
            })
        );

        res.status(200).json({
            success: true,
            data: districtStats
        });
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Search schemes
router.get('/search', [
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    handleValidationErrors
], async (req, res) => {
    try {
        const { q, page = 1, limit = 9 } = req.query;
        const skip = (page - 1) * limit;

        const schemes = await Scheme.find({
            $text: { $search: q },
            status: 'Active'
        })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await Scheme.countDocuments({
            $text: { $search: q },
            status: 'Active'
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: {
                schemes,
                searchQuery: q,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalSchemes: total,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error searching schemes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Admin routes (protected)
// Create new scheme
router.post('/create', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn([
        'Agriculture', 'Education', 'Healthcare', 'Employment', 'Housing',
        'Women Empowerment', 'Youth Development', 'Senior Citizens', 'Disability',
        'Financial Inclusion', 'Technology', 'Environment', 'Rural Development',
        'Urban Development', 'Other'
    ]).withMessage('Invalid category'),
    body('benefits').isArray({ min: 1 }).withMessage('At least one benefit is required'),
    body('documents').isArray({ min: 1 }).withMessage('At least one document is required'),
    body('applicationProcess').notEmpty().withMessage('Application process is required'),
    body('governmentBody').notEmpty().withMessage('Government body is required'),
    handleValidationErrors
], async (req, res) => {
    try {
        const scheme = new Scheme(req.body);
        await scheme.save();

        res.status(201).json({
            success: true,
            message: 'Scheme created successfully',
            data: scheme
        });
    } catch (error) {
        console.error('Error creating scheme:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update scheme
router.put('/update/:id', async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Scheme updated successfully',
            data: scheme
        });
    } catch (error) {
        console.error('Error updating scheme:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete scheme
router.delete('/delete/:id', async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndDelete(req.params.id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Scheme deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting scheme:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router; 