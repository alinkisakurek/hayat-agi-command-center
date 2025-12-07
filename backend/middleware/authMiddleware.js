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
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Tamamdır, sıradaki fonksiyona (me controller'ına) geç
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Yetkisiz işlem, token geçersiz.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Token bulunamadı, giriş yapmalısınız.' });
  }
};

module.exports = { protect };