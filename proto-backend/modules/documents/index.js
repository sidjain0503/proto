const documentsModule = {
  id: "documents",
  featureKey: "documents",
  register(router) {
    require("../../routes/DocumentRoutes")(router);
  },
};

module.exports = documentsModule;
