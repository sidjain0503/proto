const express = require('express');
const router = express.Router();

require('./auth')(router);

module.exports = router;