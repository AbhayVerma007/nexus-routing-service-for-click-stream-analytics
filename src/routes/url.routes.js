// src/routes/url.routes.js
const express = require('express');
const router = express.Router();
const urlService = require('../services/url.service');
const auth = require('../middlewares/auth'); // Our JWT protector!

// POST /api/urls (Requires Auth) [cite: 73]
router.post('/', auth, async (req, res, next) => {
  try {
    // req.user.id comes from our auth middleware
    const url = await urlService.createUrl(req.user.id, req.body.originalUrl, req.body.title);
    res.status(201).json(url);
  } catch (err) {
    next(err);
  }
});

// GET /api/urls (Requires Auth) [cite: 73]
router.get('/', auth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await urlService.getUserUrls(req.user.id, page);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;