// src/services/url.service.js
const { nanoid } = require('nanoid');
const Url = require('../models/Url.model');
const Click = require('../models/Click.model');

exports.createUrl = async (userId, originalUrl, title = '') => {
  const shortCode = nanoid(7); // Generates a random 7-character string e.g. 'aB3kX9z'
  const url = await Url.create({ shortCode, originalUrl, userId, title });
  return url;
};

exports.getUserUrls = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  // Run both queries concurrently for better performance
  const [urls, total] = await Promise.all([
    Url.find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Url.countDocuments({ userId, isActive: true })
  ]);

  return { urls, total, page, pages: Math.ceil(total / limit) };
};

exports.redirect = async (shortCode, meta) => {
  // findOneAndUpdate is an atomic operation: it finds the doc and increments the click count in a single database step!
  const url = await Url.findOneAndUpdate(
    { shortCode, isActive: true },
    { $inc: { clickCount: 1 } },
    { new: true }
  );

  if (!url) throw new Error('URL not found');

  // Log the click asynchronously. We DO NOT await this because we don't want to make the user wait for the redirect while we save analytics data.
  Click.create({
    shortCode,
    urlId: url._id,
    userId: url.userId,
    ip: meta.ip,
    userAgent: meta.userAgent,
    referer: meta.referer || 'direct',
  }).catch(err => console.error('[Click log error]', err));

  return url.originalUrl;
};