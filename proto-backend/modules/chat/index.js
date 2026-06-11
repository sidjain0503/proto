const chatModule = {
  id: "chat",
  featureKey: "chat",
  register(router) {
    require("../../routes/ChatRoutes")(router);
  },
};

module.exports = chatModule;
