const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, isAdmin } = require('../utils/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, password, age, district, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, password: hashedPassword, age, district, role: role || 'user' });
        await user.save();
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: 'Invalid password' });

        // Create JWT token
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Exclude password from user data
        const { password: pwd, ...userData } = user._doc;

        // Return user data and token
        res.json({
            success: true,
            user: userData,
            token: jwtToken
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Protected routes
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin-only routes
router.get('/admin', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'admin' });
        res.json(users);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
