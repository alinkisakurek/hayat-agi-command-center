const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const { loadEnv } = require('./config');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
loadEnv();

const app = express();

// Middlewares
// CORS
const FRONTEND_URL = process.env.FRONTEND_URL;
if (FRONTEND_URL) {
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );
} else {
  app.use(cors());
}
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Connect to the database
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/gateways', require('./routes/gatewayRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
