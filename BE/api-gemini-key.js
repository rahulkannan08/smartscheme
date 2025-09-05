const express = require('express');
const router = express.Router();

router.get('/api/get-gemini-key', (req, res) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return res.status(500).json({ key: '', error: 'Gemini API key not configured.' });
    }
    res.json({ key: geminiKey });
});

module.exports = router;