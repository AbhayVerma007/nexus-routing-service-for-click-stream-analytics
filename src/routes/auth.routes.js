// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');

// POST /api/auth/register [cite: 72]
router.post('/register', async (req, res, next) => {
  try {
    const result = await authService.register(req.body.email, req.body.password);
    res.status(201).json(result);
  } catch (err) {
    next(err); // Passes the error to our Global Error Handler
  }
});

// POST /api/auth/login [cite: 72]
router.post('/login', async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;