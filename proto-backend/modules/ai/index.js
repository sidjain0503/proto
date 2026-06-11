const aiModule = {
  id: "ai",
  featureKey: "chat",
  register(router) {
    require("../../routes/AIRoutes")(router);
  },
};

module.exports = aiModule;
