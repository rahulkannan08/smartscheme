const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        res.json({ success: true, user: { id: user._id, name: user.name, role: user.role, district: user.district, age: user.age } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;