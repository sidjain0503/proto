const express = require("express");
const { registerModules } = require("../modules/registry");
const { loadClient } = require("../lib/client");
const appConfig = require("../lib/appConfig");

const router = express.Router();

const client = loadClient();
const features = {
  ...appConfig.features,
  ...(client?.configOverrides?.features || {}),
};

registerModules(router, {
  features,
  extraModules: client?.modules || [],
});

module.exports = router;
