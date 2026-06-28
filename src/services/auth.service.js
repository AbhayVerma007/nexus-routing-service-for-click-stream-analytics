// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.mysql');

exports.register = async (email, password) => {
  // 1. Check if user already exists
  const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length > 0) throw new Error('Email already registered');

  // 2. Hash password (cost factor 12 is a good balance of security/speed)
  const hash = await bcrypt.hash(password, 12);

  // 3. Insert into MySQL
  const [result] = await db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hash]
  );

  return { id: result.insertId, email };
};

exports.login = async (email, password) => {
  // 1. Find user
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) throw new Error('Invalid credentials');
  
  const user = rows[0];

  // 2. Compare passwords
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  // 3. Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, user: { id: user.id, email: user.email, plan: user.plan } };
};