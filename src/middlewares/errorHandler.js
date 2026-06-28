// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  // Log the full stack trace so we can pinpoint the 'crypto' error
  console.error('[Error Details]:', {
    message: err.message,
    stack: err.stack,
    code: err.code
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Duplicate key (MongoDB unique index or MySQL unique constraint)
  if (err.code === 11000 || err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  // Generic fallback
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};