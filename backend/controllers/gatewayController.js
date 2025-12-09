const Gateway = require('../models/Gateway');
const mongoose = require('mongoose');

// MongoDB bağlantısı olup olmadığını kontrol et
const isMongoDBConnected = () => mongoose.connection.readyState === 1;

// Mock data storage (MongoDB bağlantısı yoksa kullanılacak)
let mockGateways = [
  {
    _id: 'm1',
    name: 'Ön Kapı',
    status: 'active',
    battery: 85,
    signal_quality: 'strong',
    location: { lat: 41.0082, lng: 28.9784 },
    connected_devices: 3,
    uptime: 1200,
    last_seen: new Date(),
  },
  {
    _id: 'm2',
    name: 'Arka Bahçe',
    status: 'active',
    battery: 60,
    signal_quality: 'medium',
    location: { lat: 41.0080, lng: 28.9785 },
    connected_devices: 2,
    uptime: 950,
    last_seen: new Date(),
  },
];
let nextId = 1000; // MongoDB ID'leri ile çakışmaması için yüksek başlangıç

// Get All Gateways
exports.getGateways = async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      // MongoDB bağlıysa sadece MongoDB'den çek
      const gateways = await Gateway.find().sort({ createdAt: -1 });
      res.status(200).json(gateways);
    } else {
      // MongoDB bağlı değilse mock data kullan
      res.status(200).json(mockGateways);
    }
  } catch (error) {
    console.error('Error fetching gateways:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create New Gateway
exports.createGateway = async (req, res) => {
  try {
    const { name, serialNumber, location, address, status } = req.body;

    if (!name || !location || !location.lat || !location.lng) {
      return res.status(400).json({ message: 'Cihaz adı ve konum bilgileri zorunludur.' });
    }

    if (isMongoDBConnected()) {
      // MongoDB bağlıysa gerçek veritabanına kaydet
      const newGateway = new Gateway({
        name,
        serialNumber: serialNumber || undefined,
        location,
        address: address || {},
        status: status || 'inactive',
        battery: 0,
        signal_quality: 'none',
        connected_devices: 0,
        uptime: 0,
        last_seen: new Date(),
      });

      await newGateway.save();
      res.status(201).json({ message: 'Cihaz başarıyla kaydedildi.', gateway: newGateway });
    } else {
      // MongoDB bağlı değilse mock data kullan
      const newGateway = {
        _id: String(nextId++),
        name,
        serialNumber,
        status: status || 'inactive',
        battery: 0,
        signal_quality: 'none',
        location,
        address: address || {},
        connected_devices: 0,
        uptime: 0,
        last_seen: new Date(),
      };
      mockGateways.push(newGateway);
      res.status(201).json({ message: 'Cihaz başarıyla kaydedildi (Mock).', gateway: newGateway });
    }
  } catch (error) {
    console.error('Error creating gateway:', error);
    if (error.code === 11000) { // Duplicate key error for unique serialNumber
      return res.status(400).json({ message: 'Bu seri numarasına sahip bir cihaz zaten mevcut.' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete Gateway
exports.deleteGateway = async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const gateway = await Gateway.findByIdAndDelete(req.params.id);
      if (!gateway) {
        return res.status(404).json({ message: 'Gateway bulunamadı.' });
      }
      res.json({ message: 'Gateway silindi' });
    } else {
      mockGateways = mockGateways.filter(gw => gw._id !== req.params.id);
      res.json({ message: 'Gateway silindi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};