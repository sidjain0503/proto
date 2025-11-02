const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express(); 

require('./db');

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // If it's a rejected promise with a structured error object
  if (err && typeof err === 'object' && err.code) {
    return res.status(err.code).json({
      success: false,
      error: err.error || err.message || 'An error occurred',
      message: err.message || err.error || 'An error occurred'
    });
  }
  
  // If it's a string error (like validation errors)
  if (typeof err === 'string') {
    return res.status(400).json({
      success: false,
      error: err,
      message: err
    });
  }
  
  // If it's an Error object
  if (err instanceof Error) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Internal server error',
      message: err.message || 'Internal server error'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Export the app for testing or using in server.js
module.exports = app;