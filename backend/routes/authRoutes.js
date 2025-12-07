const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Senin yazdığın kod
const { protect } = require('../middleware/authMiddleware'); // Yukarıdaki middleware

router.post('/register', register);
router.post('/login', login);

module.exports = router;