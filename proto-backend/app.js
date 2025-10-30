const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express(); 

require('./db');

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Export the app for testing or using in server.js
module.exports = app;