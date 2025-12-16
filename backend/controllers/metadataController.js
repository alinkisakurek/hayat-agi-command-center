const { HEALTH_OPTIONS, GENDER_LABELS } = require('../utils/constants');

const getHealthMetadata = (req, res) => {
    res.status(200).json({
        healthOptions: HEALTH_OPTIONS,
        genderLabels: GENDER_LABELS
    });
};

module.exports = { getHealthMetadata };