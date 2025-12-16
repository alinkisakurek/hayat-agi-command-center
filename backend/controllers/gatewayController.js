const Gateway = require('../models/Gateway');
const mongoose = require('mongoose');
const { getCoordsFromAddress } = require('../utils/geocoder');

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

// Get All Gateways
exports.getGateways = async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const gateways = await Gateway.find().sort({ createdAt: -1 });
      res.status(200).json(gateways);
    }
  } catch (error) {
    console.error('Error fetching gateways:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create New Gateway
exports.createGateway = async (req, res) => {
  try {
    const { name, serialNumber, address } = req.body;

    if (!name || !serialNumber || !address) {
      return res.status(400).json({
        message: 'Cihaz adı, seri numarası ve adres zorunludur.'
      });
    }

    const coords = await getCoordsFromAddress(address);

    if (!coords) {
      return res.status(400).json({
        message: 'Adres çözümlenemedi. Lütfen geçerli bir adres giriniz.'
      });
    }

    if (!isMongoDBConnected()) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }

    const newGateway = new Gateway({
      owner: req.user._id,
      name,
      serialNumber,
      address,
      location: coords,
      status: 'inactive',
      battery: 100,
      signal_quality: 'strong',
      connected_devices: 0,
      uptime: 0,
      last_seen: new Date(),
    });

    await newGateway.save();

    res.status(201).json({
      message: 'Cihaz başarıyla kaydedildi.',
      gateway: newGateway
    });

  } catch (error) {
    console.error('Error creating gateway:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Bu seri numarasına sahip bir cihaz zaten mevcut.'
      });
    }

    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Delete Gateway
exports.deleteGateway = async (req, res) => {
  try {
    if (!isMongoDBConnected()) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }
    const gateway = await Gateway.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!gateway) {
      return res.status(404).json({
        message: 'Gateway bulunamadı veya silme yetkiniz yok.'
      });
    }

    res.json({ message: 'Gateway silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};