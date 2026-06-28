// src/middlewares/validate.js
const Joi = require('joi');

// Validation schemas define the exact shape and rules for incoming data
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required()
      .messages({ 'string.pattern.base': 'Password needs uppercase + number' })
  }),
  createUrl: Joi.object({
    originalUrl: Joi.string().uri().required(),
    title: Joi.string().max(100).optional(),
    expiresAt: Joi.date().min('now').optional()
  })
};

// Middleware factory: returns a middleware function based on the schema name
const validate = (schemaName) => (req, res, next) => {
  const { error } = schemas[schemaName].validate(req.body, { abortEarly: false });
  
  if (error) {
    // Format the Joi errors into a clean array of messages
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ errors: messages });
  }
  
  next(); // Data is valid, proceed to the route handler!
};

module.exports = validate;