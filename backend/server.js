const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const userRoutes = require('./routes/userRoutes');
const issueRoutes = require('./routes/issueRoutes');
const connectDB = require('./config/db');

const app = express();

// MongoDB bağlantısı
connectDB();

// CORS ayarları - credentials ile wildcard kullanılamaz
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL'i
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/api/gateways', gatewayRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});