const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const routes = require('./routes');

const app = express(); 

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Export the app for testing or using in server.js
module.exports = app;