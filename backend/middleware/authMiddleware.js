const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Header'da "Authorization: Bearer <token>" var mı bak
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Token'ı al (Bearer kelimesini at)
      token = req.headers.authorization.split(' ')[1];

      // 3. Token'ı çöz (Verify)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

      // 4. Token içindeki ID'den kullanıcıyı bul ve req.user'a ata
      // (Şifreyi getirme - select('-password'))
      const mongoose = require('mongoose');
      const isMongoDBConnected = mongoose.connection.readyState === 1;

      if (isMongoDBConnected) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
        }
      } else {
        // MongoDB bağlı değilse token'dan gelen bilgileri kullan
        // Mock kullanıcı için token içindeki bilgileri kullan
        // Token'da id ve role var, name ve email yoksa varsayılan değerler kullan
        req.user = {
          _id: decoded.id,
          role: decoded.role || 'admin',
          name: decoded.name || (decoded.role === 'admin' ? 'Admin' : 'Kullanıcı'),
          email: decoded.email || (decoded.role === 'admin' ? 'admin@hayatagi.com' : 'user@hayatagi.com')
        };
        console.log('MongoDB bağlı değil, token\'dan kullanıcı bilgisi alındı:', req.user);
      }

      next(); // Tamamdır, sıradaki fonksiyona (me controller'ına) geç
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      res.status(401).json({ message: 'Yetkisiz işlem, token geçersiz.' });
    }
  } else {
    res.status(401).json({ message: 'Token bulunamadı, giriş yapmalısınız.' });
  }
};

// Admin kontrolü
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
  }
};

module.exports = { protect, adminOnly };