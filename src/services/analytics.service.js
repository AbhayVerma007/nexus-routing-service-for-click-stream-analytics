// src/services/analytics.service.js
const Click = require('../models/Click.model');

// Get click stats grouped by day for the last 30 days
exports.getClicksByDay = async (userId) => {
  return Click.aggregate([
    {
      // 1. $match: Filter down to clicks belonging to this user from the last 30 days
      $match: {
        userId,
        clickedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      // 2. $group: Group the remaining clicks by their date string (YYYY-MM-DD) and count them
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
        count: { $sum: 1 }
      }
    },
    {
      // 3. $sort: Order the results by date (newest to oldest)
      $sort: { _id: -1 }
    },
    {
      // 4. $project: Format the final output to make it cleaner for the frontend
      $project: {
        date: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
};

// Get the top referring websites
exports.getTopReferrers = async (userId, limit = 10) => {
  return Click.aggregate([
    { $match: { userId } },
    { $group: { _id: '$referer', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { referer: '$_id', count: 1, _id: 0 } }
  ]);
};