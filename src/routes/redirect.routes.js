// src/routes/redirect.routes.js
const express = require('express');
const router = express.Router();
const urlService = require('../services/url.service');

// GET /:shortCode [cite: 74]
router.get('/:shortCode', async (req, res, next) => {
  try {
    // Gather analytics data to pass to our service
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer']
    };
    
    const originalUrl = await urlService.redirect(req.params.shortCode, meta);
    res.redirect(originalUrl); // The actual browser redirect
  } catch (err) {
    next(err);
  }
});

module.exports = router;