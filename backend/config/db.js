const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hayat-agi';
  try {
    await mongoose.connect(uri, {
      // keep options minimal; Mongoose 8 uses sane defaults
    });
    console.log('MongoDB bağlantısı başarılı');
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
