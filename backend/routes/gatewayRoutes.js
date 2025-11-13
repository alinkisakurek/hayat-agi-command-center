const express = require('express');
const router = express.Router();
const { getGateways, createGateway } = require('../controllers/gatewayController');
const { protect, authorize } = require('../middleware/authMiddleware');

// /api/gateways
router.get('/', protect, getGateways);
router.post('/', protect, authorize('admin'), createGateway);

module.exports = router;
