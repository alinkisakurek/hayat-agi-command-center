const express = require('express');
const router = express.Router();
// Use userController to handle auth-related actions (authController was removed)
const { register, login, me } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);

router.post('/login', login);

// Session check
router.get('/me', protect, me);

// Simple logout endpoint (clears session on client if any)
router.post('/logout', protect, (req, res) => {
    // If you use cookies/sessions, clear them here. For stateless JWT, client should just discard token.
    return res.json({ message: 'Logged out' });
});

module.exports = router;