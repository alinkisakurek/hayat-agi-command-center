const express = require('express');
const router = express.Router();
const { register, login, me, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// /api/users
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);

module.exports = router;
