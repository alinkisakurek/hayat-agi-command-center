// Dummy auth controller for /auth/login (no JWT, no DB)

// POST /auth/login
async function dummyLogin(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // No verification or JWT – just echo back a dummy user payload
    return res.json({
      success: true,
      user: {
        name: 'Demo User',
        email,
        role: 'regional',
      },
      token: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { dummyLogin };
