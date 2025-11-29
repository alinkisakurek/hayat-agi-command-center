const express = require('express');
const router = express.Router();
const {
  getGateways,
  createGateway,
  getGatewayById,
  updateGateway,
  deleteGateway,
} = require('../controllers/gatewayController');
const { protect, authorize } = require('../middleware/authMiddleware');

// /api/gateways
router.get('/', protect, getGateways);
router.get('/:id', protect, getGatewayById);
router.post('/', protect, authorize('admin'), createGateway);
router.put('/:id', protect, authorize('admin'), updateGateway);
router.delete('/:id', protect, authorize('admin'), deleteGateway);

module.exports = router;
