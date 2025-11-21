const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// --- DEĞİŞİKLİK BURADA ---
// 1. Ortam değişkenlerini diğer HER ŞEYDEN önce yükle.
// Kendi 'loadEnv' fonksiyonun yerine standart dotenv kullanımı daha garantidir.
// Eğer loadEnv kullanacaksan da en üste almalısın.
require('dotenv').config();

// 2. Veritabanı dosyasını env yüklendikten SONRA çağır
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to the database
// (process.env.MONGO_URI artık kesinlikle dolu olduğu için burası çalışacaktır)
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route dosyalarını import et
app.use('/api/gateways', require('./routes/gatewayRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Bu kontrol testi kolaylaştırmak içindir, kalabilir.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;