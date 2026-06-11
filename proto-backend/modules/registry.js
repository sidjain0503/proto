const appConfig = require("../lib/appConfig");
const { createLogger } = require("../lib/logger");

const log = createLogger("modules");

const coreModules = [
  require("./auth"),
  require("./sessions"),
  require("./chat"),
  require("./documents"),
  require("./ai"),
];

const isModuleEnabled = (module, features) => {
  if (!module.featureKey) return true;
  return features[module.featureKey] !== false;
};

const registerModules = (router, { features = appConfig.features, extraModules = [] } = {}) => {
  const modules = [...coreModules, ...extraModules];
  const registered = [];

  for (const module of modules) {
    if (!module?.id || typeof module.register !== "function") {
      log.warn({ moduleId: module?.id }, "Skipping invalid module");
      continue;
    }

    if (!isModuleEnabled(module, features)) {
      log.debug({ moduleId: module.id }, "Module disabled by feature flag");
      continue;
    }

    module.register(router);
    registered.push(module.id);
  }

  log.info({ modules: registered }, "Registered API modules");
  return registered;
};

module.exports = {
  coreModules,
  registerModules,
  isModuleEnabled,
};
