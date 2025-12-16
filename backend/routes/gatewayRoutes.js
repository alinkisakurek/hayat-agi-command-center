const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, gatewayController.getGateways);
router.get('/user', protect, gatewayController.getUserGateways);

router.post('/', protect, gatewayController.createGateway);

router.delete('/:id', protect, gatewayController.deleteGateway);

router.post('/:id/citizens', protect, gatewayController.addPersonToGateway);
router.delete('/:gatewayId/citizens/:personId', protect, gatewayController.removePersonFromGateway);

router.post('/:id/pets', protect, gatewayController.addPetToGateway);
router.delete('/:gatewayId/pets/:petId', protect, gatewayController.removePetFromGateway);

module.exports = router;