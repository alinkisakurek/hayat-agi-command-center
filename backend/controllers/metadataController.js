const { HEALTH_OPTIONS } = require('../utils/constants');
const { GENDER_LABELS, DEMOGRAPHIC_RISK } = require('../utils/demographic');
const { BILISSEL_ILETISIM_DUYUSAL_RISK } = require('../utils/others');

const getHealthMetadata = (req, res) => {
    res.status(200).json({
        healthOptions: HEALTH_OPTIONS,
        genderLabels: GENDER_LABELS,
        demographicRisks: DEMOGRAPHIC_RISK,
        sensoryRisks: BILISSEL_ILETISIM_DUYUSAL_RISK
    });
};

module.exports = { getHealthMetadata };