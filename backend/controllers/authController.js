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
*/
exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log("Mock Login Denemesi:", email, password);

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

  } else {
    return res.status(401).json({ error: 'Hatalı e-posta veya şifre! (Mock: admin@hayatagi.com / 123456 deneyin)' });
  }
};

exports.register = (req, res) => {
  res.status(200).json({ message: 'Kayıt başarılı (Simülasyon)' });
};