const jwt = require('jsonwebtoken');
const User = require('../models/User');

// helpers
function signAccessToken(user) {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'devaccesssecret';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m';
  return jwt.sign(payload, secret, { expiresIn });
}

function signRefreshToken(user) {
  const payload = { id: user._id, v: user.tokenVersion };
  const secret = process.env.JWT_REFRESH_SECRET || 'devrefreshsecret';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

function setRefreshCookie(res, token) {
  const isProd = (process.env.NODE_ENV || 'development') === 'production';
  const secure = String(process.env.COOKIE_SECURE || (isProd ? 'true' : 'false')).toLowerCase() === 'true';
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/auth/refresh',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refresh_token', { path: '/auth/refresh' });
}

function publicUser(u) {
  return { id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt };
}

// POST /auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role });
    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

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

// POST /auth/logout
async function logout(req, res, next) {
  try {
    if (req.user) {
      // Invalidate all refresh tokens for this user
      await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    }
    clearRefreshCookie(res);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// GET /auth/me
async function me(req, res, next) {
  try {
    return res.json({ user: publicUser(req.user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, me };
