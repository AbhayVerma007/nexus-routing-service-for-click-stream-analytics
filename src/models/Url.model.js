// src/models/Url.model.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    shortCode: { type: String, required: true, unique: true, index: true },
    originalUrl: { type: String, required: true },
    userId: { type: Number, required: true }, // Foreign key linking to MySQL users.id
    title: { type: String, default: '' },
    clickCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound index: Makes searching for a specific user's active URLs very fast
urlSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Url', urlSchema);