const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const { body, validationResult, query } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token provided' });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === 'admin') {
            req.user = user;
            next();
        } else {
            res.status(403).json({ message: 'Not authorized' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

/**
 * @swagger
 * /api/v2/schemes/get-all-schemes:
 *   get:
 *     summary: Get all schemes with pagination
 *     tags: [Schemes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of schemes per page
 *     responses:
 *       200:
 *         description: Successfully retrieved schemes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     schemes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Scheme'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalSchemes:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// Get all schemes with pagination
router.get('/get-all-schemes', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const query = { status: 'Active' }; // Only active schemes

        const totalSchemes = await Scheme.countDocuments(query);
        const totalPages = Math.ceil(totalSchemes / limit);

        const schemes = await Scheme.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: {
                schemes,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalSchemes,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @swagger
 * /api/v2/schemes/get-filtered-schemes:
 *   get:
 *     summary: Get schemes with filters
 *     tags: [Schemes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *         description: Filter by age
 *       - in: query
 *         name: income
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter by income
 *       - in: query
 *         name: education
 *         schema:
 *           type: string
 *         description: Filter by education level
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female, Any]
 *         description: Filter by gender
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           enum: [Rural, Urban, Both]
 *         description: Filter by location
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered schemes
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v2/schemes/get-scheme-by-id/{id}:
 *   get:
 *     summary: Get scheme by ID
 *     tags: [Schemes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ID
 *     responses:
 *       200:
 *         description: Successfully retrieved scheme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scheme'
 *       404:
 *         description: Scheme not found
 *       500:
 *         description: Internal server error
 */
// Get scheme by ID
router.get('/get-scheme-by-id/:id', async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        res.json(scheme);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/v2/schemes/get-scheme-by-category/{category}:
 *   get:
 *     summary: Get schemes by category
 *     tags: [Schemes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved schemes by category
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v2/schemes/featured:
 *   get:
 *     summary: Get featured schemes
 *     tags: [Schemes]
 *     responses:
 *       200:
 *         description: Successfully retrieved featured schemes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Scheme'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v2/schemes/categories:
 *   get:
 *     summary: Get all scheme categories
 *     tags: [Schemes]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       count:
 *                         type: integer
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v2/schemes/districts:
 *   get:
 *     summary: Get all scheme districts
 *     tags: [Schemes]
 *     responses:
 *       200:
 *         description: Successfully retrieved districts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       district:
 *                         type: string
 *                       count:
 *                         type: integer
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v2/schemes/search:
 *   get:
 *     summary: Search schemes
 *     tags: [Schemes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully searched schemes
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
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

router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

/**
 * @swagger
 * /api/v2/schemes/create:
 *   post:
 *     summary: Create a new scheme
 *     tags: [Schemes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scheme'
 *     responses:
 *       201:
 *         description: Scheme created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scheme'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// Create a new scheme
router.post('/', isAdmin, handleValidationErrors, async (req, res) => {
    try {
        const scheme = new Scheme(req.body);
        await scheme.save();
        res.status(201).json({ success: true, scheme });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;