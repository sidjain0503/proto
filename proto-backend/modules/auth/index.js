const authModule = {
  id: "auth",
  register(router) {
    require("../../routes/Auth")(router);
  },
};

module.exports = authModule;
