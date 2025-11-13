const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token doğrulaması
async function protect(req, res, next) {
  try {
    let token;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Yetkisiz: Token yok' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Yetkisiz: Kullanıcı bulunamadı' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Yetkisiz: Geçersiz token' });
  }
}

// Rol tabanlı erişim kontrolü (FR-4)
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Yetkisiz' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Erişim yasak' });
    }
    next();
  };
}

module.exports = { protect, authorize };
