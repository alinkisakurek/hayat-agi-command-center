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

exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log("Mock Login Denemesi:", email, password);

  // Admin Login
  if (email === 'admin@hayatagi.com' && password === '123456') {
    return res.status(200).json({
      message: 'Giriş başarılı (Mock)',
      token: 'mock-token-12345-abcdef-bu-bir-sahte-tokendir',
      user: {
        id: 'user_1',
        name: 'Alin Kısakürek',
        email: email,
        role: 'admin'
      }
    });
  }

  // Vatandaş Login
  if (email === 'vatandas@hayatagi.com' && password === '123456') {
    return res.status(200).json({
      message: 'Giriş başarılı (Mock)',
      token: 'mock-token-vatandas-67890-xyz',
      user: {
        id: 'user_2',
        name: 'Berke Kuş',
        email: email,
        role: 'user'
      }
    });
  }

  // Hatalı giriş
  return res.status(401).json({ 
    error: 'Hatalı e-posta veya şifre! (Mock: admin@hayatagi.com veya vatandas@hayatagi.com / 123456 deneyin)' 
  });
};

exports.register = (req, res) => {
  res.status(200).json({ message: 'Kayıt başarılı (Simülasyon)' });
};
