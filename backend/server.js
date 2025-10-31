const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { query } = require('./config/database');
const userRoutes = require('./routes/users');
const clubRoutes = require('./routes/clubs');
const farmsRoutes = require('./routes/farms');
const bookingRoutes = require('./routes/bookings');
const courtRoutes = require('./routes/courts');
const clubSettingsRoutes = require('./routes/club-settings');
const rainfallRoutes = require('./routes/rainfall');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting (more relaxed for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for dev)
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration - allow any localhost port in development
app.use(cors({
  origin: (origin, callback) => {
    const allowedEnv = process.env.FRONTEND_URL;
    if (!origin) return callback(null, true); // non-browser or same-origin
    if (allowedEnv && origin === allowedEnv) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Open Farm Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Database check - returns the current database name
app.get('/health/db', async (req, res) => {
  try {
    const result = await query('SELECT DATABASE() AS db');
    res.json({ database: result.rows?.[0]?.db || null });
  } catch (e) {
    res.status(500).json({ error: 'DB check failed', details: e.message });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
// New farms routes (newfarm schema)
app.use('/api/farms', farmsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/courts', courtRoutes);
// New alias: camps (maps to courts routes)
app.use('/api/camps', courtRoutes);
app.use('/api/club-settings', clubSettingsRoutes);
// New alias: farm-settings (maps to club-settings routes)
app.use('/api/farm-settings', clubSettingsRoutes);
app.use('/api', rainfallRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: err.message 
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Unauthorized' 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Open Farm Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;






