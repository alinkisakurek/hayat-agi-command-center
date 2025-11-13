const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { loadEnv } = require('./config');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
loadEnv();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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
