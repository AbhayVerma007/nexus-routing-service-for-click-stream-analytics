// src/models/Click.model.js
const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, index: true },
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Url' },
  userId: { type: Number, required: true },
  ip: { type: String },
  userAgent: { type: String },
  referer: { type: String, default: 'direct' },
  country: { type: String, default: 'unknown' },
  clickedAt: { type: Date, default: Date.now },
});

// TTL (Time-To-Live) index: MongoDB will automatically delete clicks older than 90 days (7776000 seconds) to save space!
clickSchema.index({ clickedAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Click', clickSchema);