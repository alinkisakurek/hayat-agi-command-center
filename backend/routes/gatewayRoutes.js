const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController');

// GET /api/gateways -> getGateways 
router.get('/', gatewayController.getGateways);

// POST /api/gateways -> createGateway
router.post('/', gatewayController.createGateway);

// DELETE /api/gateways/:id -> deleteGateway 
router.delete('/:id', gatewayController.deleteGateway);

module.exports = router;