// src/utils/asyncWrap.js

// This function wraps async route handlers so errors automatically propagate to the errorHandler middleware
const asyncWrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrap;