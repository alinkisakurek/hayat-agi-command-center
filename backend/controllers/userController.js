const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/users/register
async function register(req, res, next) {
  try {
    const { name, surname, phoneNumber, email, password, allowsNotifications } = req.body;
    const normalizedEmail = (email || '').toLowerCase();

    if (!name || !surname || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Ad, soyad, e-posta, şifre ve telefon numarası zorunludur' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    const existsEmail = await User.findOne({ email: normalizedEmail });
    if (existsEmail) {
      return res.status(400).json({ message: 'Email kayıtlı.' });
    }

    const existsPhoneNumber = await User.findOne({ phoneNumber });
    if (existsPhoneNumber) {
      return res.status(400).json({ message: 'Telefon numarası zaten kayıtlı.' });
    }

    // Do not hash here — the model's pre-save hook will hash the password.
    const user = await User.create({
      name,
      surname,
      phoneNumber,
      email: normalizedEmail,
      password,
      allowsNotifications: allowsNotifications || false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/users/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

// GET /api/users/myProfile
async function me(req, res, next) {
  {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

// PUT /api/users/profile - Profil bilgilerini güncelle
async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    // YENİ ALANLARI BURAYA EKLEDİK:
    const allowedUpdates = [
      'name', 'surname', 'phoneNumber', 'email', // Temel bilgiler
      'tcNumber', // Kimlik
      'bloodType', 'weight', 'height', 'gender', // Fiziksel
      // Tıbbi Kategoriler (User modeline eklediğimiz yeni alanlar)
      'respiration', 'heartCirculation', 'metabolic',
      'allergies', 'cancer', 'neurological',
      'medicalAddictions', 'movementDisorders',
      // Risk Grupları
      'demographicRisk', 'cognitiveCommunicationSensoryRisk',
      'allowsNotifications'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.emergencyContact) {
      user.emergencyContact = {
        // Mevcut verileri koru, yenileri üzerine yaz (Merge mantığı)
        fullname: req.body.emergencyContact.fullname || user.emergencyContact.fullname,
        phone: req.body.emergencyContact.phone || user.emergencyContact.phone,
        relation: req.body.emergencyContact.relation || user.emergencyContact.relation
      };
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi.',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        surname: updatedUser.surname,
        email: updatedUser.email,
        role: updatedUser.role,

        ...updatedUser.toObject()
      }
    });

  } catch (err) {
    // Validasyon hatalarını (örn: geçersiz enum) yakalamak için
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

module.exports = { register, login, me, updateProfile };
