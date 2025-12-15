const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

router.get('/system-options', metadataController.getHealthMetadata);

module.exports = router;