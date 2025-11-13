const express = require('express');
const router = express.Router();
const { dummyLogin } = require('../controllers/authController');

// /auth
router.post('/login', dummyLogin);

module.exports = router;
