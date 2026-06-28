// src/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics.service');
const auth = require('../middlewares/auth'); 
const asyncWrap = require('../utils/asyncWrap');

// GET /api/analytics/daily
router.get('/daily', auth, asyncWrap(async (req, res) => {
  const data = await analyticsService.getClicksByDay(req.user.id);
  res.json(data);
}));

// GET /api/analytics/referrers
router.get('/referrers', auth, asyncWrap(async (req, res) => {
  const data = await analyticsService.getTopReferrers(req.user.id);
  res.json(data);
}));

module.exports = router;