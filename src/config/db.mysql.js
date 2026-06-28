// src/config/db.mysql.js
const mysql = require('mysql2/promise');

// Create the connection pool using our .env variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DB,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  waitForConnections: true,
  connectionLimit: 10, // Max 10 concurrent connections
  queueLimit: 0
});

// Test the connection immediately on startup
pool.getConnection()
  .then(conn => {
    console.log('[MySQL] Connected successfully');
    conn.release(); // Always release the connection back to the pool
  })
  .catch(err => {
    console.error('[MySQL] Connection failed:', err.message);
    process.exit(1);
  });

module.exports = pool;