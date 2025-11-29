const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token verification (access token)
async function protect(req, res, next) {
  try {
    let token;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
    if (!token && req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'devaccesssecret';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// Role-based access control (FR-4)
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { protect, authorize };
