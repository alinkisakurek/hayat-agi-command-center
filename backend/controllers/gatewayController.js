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

// Get User's Gateways
exports.getUserGateways = async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const gateways = await Gateway.find({ owner: req.user._id }).sort({ createdAt: -1 });
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
    // 1. Veriyi al (address bir obje olarak geliyor)
    const { name, serialNumber, address } = req.body;

    if (!name || !serialNumber || !address) {
      return res.status(400).json({
        message: 'Cihaz adı, seri numarası ve adres zorunludur.'
      });
    }

    // -------------------------------------------------------------
    // ADIM 2: Adres Objesini String'e Çevirme (Controller Dönüşümü)
    // -------------------------------------------------------------

    // Frontend'den gelen alanlar: street, buildingNo, doorNo, district, city, province
    // Nominatim için en ideal format: "Sokak BinaNo, Mahalle, İlçe, İl, Ülke"

    let addressSearchString = '';

    if (typeof address === 'object') {
      const parts = [];

      // Sokak ve Bina No'yu birleştir (Örn: Atatürk Cad. No 12)
      if (address.street) {
        let streetPart = address.street.trim();
        if (address.buildingNo) {
          streetPart += ` ${address.buildingNo.trim()}`;
        }
        parts.push(streetPart);
      }

      // Mahalle (Varsa ekle - Çok önemli)
      if (address.district) parts.push(address.district.trim());

      // İlçe
      if (address.city) parts.push(address.city.trim());

      // İl
      if (address.province) parts.push(address.province.trim());

      // Ülke (Garanti olsun diye ekliyoruz)
      parts.push('Türkiye');

      // Virgülle birleştir: "Papatya Sokak 5, Moda, Kadıköy, İstanbul, Türkiye"
      addressSearchString = parts.join(', ');

      console.log('Oluşturulan Adres Sorgusu:', addressSearchString); // Loglayıp kontrol edelim
    } else {
      // Eğer yanlışlıkla string gelirse olduğu gibi kullanalım
      addressSearchString = address;
    }

    // 3. Geocoder'a artık OBJEYİ değil, oluşturduğumuz STRING'i gönderiyoruz
    const coords = await getCoordsFromAddress(addressSearchString);

    if (!coords) {
      return res.status(400).json({
        message: 'Adres haritada bulunamadı. Lütfen mahalle ve ilçe bilgilerini kontrol ediniz.'
      });
    }

    if (!isMongoDBConnected()) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }

    // 4. Kayıt sırasında orijinal 'address' objesini saklıyoruz (gösterim için),
    // ama 'location' alanına bulduğumuz koordinatları yazıyoruz.
    const newGateway = new Gateway({
      owner: req.user._id,
      name,
      serialNumber,
      address, // Orijinal obje veritabanına kaydedilir (kapı no vs. burada saklanır)
      location: coords, // Geocoder'dan gelen { lat, lng }
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

// PUT /gateways/:id 
exports.updateGateway = async (req, res) => {
  try {
    if (!isMongoDBConnected()) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }

    const { id } = req.params;
    const { name, address } = req.body;


    const gateway = await Gateway.findOne({ _id: id, owner: req.user._id });

    if (!gateway) {
      return res.status(404).json({ message: 'Cihaz bulunamadı veya güncelleme yetkiniz yok.' });
    }


    if (name) gateway.name = name;


    if (address) {
      gateway.address = {
        city: address.city || gateway.address.city,
        district: address.district || gateway.address.district,
        street: address.street || gateway.address.street,
        buildingNo: address.buildingNo || gateway.address.buildingNo,
      };
      const coords = await getCoordsFromAddress(address);

      if (coords) {
        gateway.location = coords;
      }
    }
    await gateway.save();

    res.status(200).json({
      message: 'Cihaz başarıyla güncellendi.',
      gateway
    });

  } catch (error) {
    console.error('Update gateway error:', error);
    res.status(500).json({ message: 'Güncelleme sırasında sunucu hatası oluştu.' });
  }
};

exports.addPersonToGateway = async (req, res) => {
  try {
    const { id } = req.params; // Gateway ID'si URL'den gelir
    const personData = req.body; // Formdan gelen kişi bilgileri

    // 1. Gateway'i bul (Sadece kendi cihazına ekleyebilsin diye owner kontrolü şart)
    const gateway = await Gateway.findOne({ _id: id, owner: req.user._id });

    if (!gateway) {
      return res.status(404).json({ message: 'Cihaz bulunamadı veya yetkiniz yok.' });
    }

    // 2. Kişiyi diziye ekle
    // Not: Mongoose, şemadaki validasyonları (TC, isim zorunluluğu vb.) burada kontrol eder.
    gateway.registered_users.push(personData);

    // 3. Kaydet
    await gateway.save();

    res.status(200).json({
      message: 'Kişi başarıyla eklendi.',
      updatedGateway: gateway
    });

  } catch (error) {
    res.status(400).json({ message: 'Kişi eklenemedi.', error: error.message });
  }
};

// 2. Gateway'den Kişi Sil
exports.removePersonFromGateway = async (req, res) => {
  try {
    const { gatewayId, personId } = req.params;

    const gateway = await Gateway.findOne({ _id: gatewayId, owner: req.user._id });

    if (!gateway) {
      return res.status(404).json({ message: 'Cihaz bulunamadı.' });
    }

    // Subdocument'i silme yöntemi
    gateway.registered_users.pull({ _id: personId });

    await gateway.save();

    res.status(200).json({ message: 'Kişi silindi.', updatedGateway: gateway });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Gateway'e Evcil Hayvan Ekle
exports.addPetToGateway = async (req, res) => {
  try {
    const { id } = req.params;
    const petData = req.body;

    const gateway = await Gateway.findOne({ _id: id, owner: req.user._id });

    if (!gateway) {
      return res.status(404).json({ message: 'Cihaz bulunamadı.' });
    }

    gateway.registered_animals.push(petData);
    await gateway.save();

    res.status(200).json({
      message: 'Evcil hayvan eklendi.',
      updatedGateway: gateway
    });

  } catch (error) {
    res.status(400).json({ message: 'Evcil hayvan eklenemedi.', error: error.message });
  }
};

// 4. Gateway'den Evcil Hayvan Sil
exports.removePetFromGateway = async (req, res) => {
  try {
    const { gatewayId, petId } = req.params;

    const gateway = await Gateway.findOne({ _id: gatewayId, owner: req.user._id });

    if (!gateway) {
      return res.status(404).json({ message: 'Cihaz bulunamadı.' });
    }

    gateway.registered_animals.pull({ _id: petId });
    await gateway.save();

    res.status(200).json({ message: 'Evcil hayvan silindi.', updatedGateway: gateway });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};