// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Database connections
const connectMongo = require('./config/db.mongo');
// const pool = require('./config/db.mysql'); // Pool connects on first query

// These will be used in Phase 2:
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const urlRoutes = require('./routes/url.routes');
const redirectRoutes = require('./routes/redirect.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (no auth required) - crucial for AWS deployment later!
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes (Commented out for now)
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/', redirectRoutes); // Short link redirects

// Global error handler (always last)
app.use(errorHandler);

const start = async () => {
  try {
    await connectMongo();
    // MySQL pool is already initiated when the module is required
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

start();