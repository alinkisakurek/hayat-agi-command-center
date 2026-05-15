const express = require('express');
const router = express.Router();
const adminStatsController = require('../controllers/adminStatsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/citizens', protect, adminOnly, adminStatsController.getCitizenStats);

module.exports = router;
