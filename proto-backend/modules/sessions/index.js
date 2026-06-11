const sessionsModule = {
  id: "sessions",
  featureKey: "chat",
  register(router) {
    require("../../routes/SessionRoutes")(router);
  },
};

module.exports = sessionsModule;
