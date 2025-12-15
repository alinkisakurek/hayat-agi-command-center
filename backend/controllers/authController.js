// Mock Auth Controller - Test için basit login/register

// POST /auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // Issue tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.json({
      user: publicUser(user),
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/refresh
async function refresh(req, res, next) {
  try {
    let token = req.cookies?.refresh_token;
    const auth = req.headers.authorization;
    if (!token && auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'devrefreshsecret');
    } catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (typeof decoded.v !== 'number' || decoded.v !== user.tokenVersion) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // Rotate refresh token by bumping tokenVersion
    user.tokenVersion += 1;
    await user.save();

    const newRefresh = signRefreshToken(user);
    setRefreshCookie(res, newRefresh);
    const newAccess = signAccessToken(user);

    return res.json({
      accessToken: newAccess,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });
  } catch (err) {
    next(err);
  }
}

/*module.exports = { dummyLogin }; */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login isteği alındı:', { email });

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'E-posta ve şifre gereklidir.' 
      });
    }

    // MongoDB bağlantısını kontrol et
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB bağlantısı yok, mock login kullanılıyor');
      // MongoDB yoksa mock login'e geri dön
      if (email === 'admin@hayatagi.com' && password === '123456') {
        const mockToken = jwt.sign(
          { id: 'mock-admin-id', role: 'admin' },
          process.env.JWT_SECRET || 'devsecret',
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          message: 'Giriş başarılı (Mock)',
          token: mockToken,
          user: {
            _id: 'mock-admin-id',
            id: 'mock-admin-id',
            name: 'Alin Kısakürek',
            email: email,
            role: 'admin'
          }
        });
      }
      if (email === 'vatandas@hayatagi.com' && password === '123456') {
        const mockToken = jwt.sign(
          { id: 'mock-user-id', role: 'user' },
          process.env.JWT_SECRET || 'devsecret',
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          message: 'Giriş başarılı (Mock)',
          token: mockToken,
          user: {
            _id: 'mock-user-id',
            id: 'mock-user-id',
            name: 'Berke Kuş',
            email: email,
            role: 'user'
          }
        });
      }
      return res.status(401).json({ 
        error: 'Hatalı e-posta veya şifre!' 
      });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      return res.status(401).json({ 
        error: 'Hatalı e-posta veya şifre!' 
      });
    }

    console.log('Kullanıcı bulundu:', user.email);

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Şifre hatalı:', email);
      return res.status(401).json({ 
        error: 'Hatalı e-posta veya şifre!' 
      });
    }

    console.log('Şifre doğru, token oluşturuluyor...');

    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '7d' }
    );

    console.log('Token oluşturuldu, giriş başarılı');

    return res.status(200).json({
      message: 'Giriş başarılı',
      token: token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login hatası (detaylı):', error);
    console.error('Hata stack:', error.stack);
    return res.status(500).json({ 
      error: 'Giriş yapılırken bir hata oluştu: ' + error.message 
    });
  }
};

// Basit kayıt uç noktası (mock) - TC Kimlik doğrulaması ile
exports.register = (req, res) => {
  try {
    const { name, surname, email, password, tcNumber } = req.body || {};
    if (!name || !surname || !email || !password || !tcNumber) {
      return res.status(400).json({ message: 'Ad, soyad, e-posta, şifre ve TC Kimlik zorunludur' });
    }
    // TC Kimlik doğrulama
    const isValidTc = (tc) => {
      if (!/^\d{11}$/.test(tc)) return false;
      if (tc[0] === '0') return false;
      const d = tc.split('').map(Number);
      const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
      const evenSum = d[1] + d[3] + d[5] + d[7];
      const d10 = ((oddSum * 7) - evenSum) % 10;
      const d11 = (d.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
      return d[9] === d10 && d[10] === d11;
    };
    if (!isValidTc(tcNumber)) {
      return res.status(400).json({ message: 'Geçersiz TC Kimlik Numarası' });
    }

    // Not: Bu bir simülasyondur, DB kaydı yapmaz
    return res.status(200).json({ message: 'Kayıt başarılı (Simülasyon)', user: { name, surname, email, tcNumber } });
  } catch (e) {
    return res.status(500).json({ message: 'Kayıt sırasında hata oluştu' });
  }
};
