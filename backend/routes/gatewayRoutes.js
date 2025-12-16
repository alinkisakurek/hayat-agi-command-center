const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, gatewayController.getGateways);


router.post('/', protect, gatewayController.createGateway);

router.delete('/:id', protect, gatewayController.deleteGateway);

module.exports = router;