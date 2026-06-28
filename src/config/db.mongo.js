// src/config/db.mongo.js
const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    // We use the URI we defined in our .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[MongoDB] Connected successfully');
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1); // Exit the app - it shouldn't run if the DB is down
  }
};

module.exports = connectMongo;