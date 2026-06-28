// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the token exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract just the token string
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the payload { id, email, plan } to the request object
    next(); // Move on to the next function/route
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};