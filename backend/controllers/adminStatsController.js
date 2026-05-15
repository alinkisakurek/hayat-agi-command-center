const Gateway = require('../models/Gateway');
const mongoose = require('mongoose');

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

// GET /api/admin/stats/citizens — KVKK uyumlu agrega istatistik.
// Sadece sayısal sonuçlar döner; kişi adı/TC/iletişim bilgisi vs. dönmez.
//
// Filtre: province / district / neighborhood (hepsi opsiyonel).
// Drill-down: filtreye göre bir alt seviyenin (province → district → neighborhood)
// kırılımı `breakdown` alanında döner. Filtre dolduğunda breakdown otomatik daralır.
exports.getCitizenStats = async (req, res) => {
  try {
    if (!isMongoDBConnected()) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }

    const { province, district, neighborhood } = req.query;
    const match = {};
    if (province) match['address.province'] = province;
    if (district) match['address.district'] = district;
    if (neighborhood) match['address.neighborhood'] = neighborhood;

    const gateways = await Gateway.find(match).select(
      'address registered_users registered_animals'
    );

    let totalCitizens = 0;
    let totalAnimals = 0;
    let withChronicConditions = 0;
    let withProsthetics = 0;
    let withMedications = 0;

    const byChronicCondition = new Map();
    const byMedication = new Map();
    const byProsthesis = new Map();

    const breakdownLevel = !province
      ? 'province'
      : !district
        ? 'district'
        : !neighborhood
          ? 'neighborhood'
          : null;

    const breakdown = new Map();

    for (const gw of gateways) {
      const users = gw.registered_users || [];
      const animals = gw.registered_animals || [];

      totalCitizens += users.length;
      totalAnimals += animals.length;

      for (const user of users) {
        if (user.medicalConditions?.length) withChronicConditions++;
        if (user.prosthetics?.length) withProsthetics++;
        if (user.medications?.length) withMedications++;

        for (const c of user.medicalConditions || []) {
          byChronicCondition.set(c, (byChronicCondition.get(c) || 0) + 1);
        }
        for (const m of user.medications || []) {
          byMedication.set(m, (byMedication.get(m) || 0) + 1);
        }
        for (const p of user.prosthetics || []) {
          byProsthesis.set(p, (byProsthesis.get(p) || 0) + 1);
        }
      }

      if (breakdownLevel) {
        const key = gw.address?.[breakdownLevel] || '(belirtilmemiş)';
        const entry = breakdown.get(key) || {
          name: key,
          gatewayCount: 0,
          citizenCount: 0,
        };
        entry.gatewayCount++;
        entry.citizenCount += users.length;
        breakdown.set(key, entry);
      }
    }

    const toTopList = (m, limit = 10) =>
      Array.from(m.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    res.status(200).json({
      scope: {
        province: province || null,
        district: district || null,
        neighborhood: neighborhood || null,
      },
      gatewayCount: gateways.length,
      totalCitizens,
      totalAnimals,
      withChronicConditions,
      withProsthetics,
      withMedications,
      byChronicCondition: toTopList(byChronicCondition),
      byMedication: toTopList(byMedication),
      byProsthesis: toTopList(byProsthesis),
      breakdownLevel,
      breakdown: breakdownLevel
        ? Array.from(breakdown.values()).sort(
            (a, b) => b.citizenCount - a.citizenCount
          )
        : [],
    });
  } catch (error) {
    console.error('Citizen stats error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
