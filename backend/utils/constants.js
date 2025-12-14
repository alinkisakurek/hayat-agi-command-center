const HEALTH_OPTIONS = {
    bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'],
    prostheses: ['Yok', 'Görsel', 'İşitsel', 'Ortopedik', 'Diğer'],
    chronicConditions: ['Yok', 'Astım', 'Diyabet', 'Kalp', 'Tansiyon', 'Epilepsi', 'Diğer'],
    medications: ['Yok', 'İnsülin', 'Kalp İlacı', 'Tansiyon İlacı', 'Diğer']
};

const GENDER_LABELS = {
    male: 'Erkek',
    female: 'Kadın',
    prefer_not_to_say: 'Belirtmek İstemiyorum'
};

module.exports = { HEALTH_OPTIONS, GENDER_LABELS };
