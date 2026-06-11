/**
 * Client overlay entry point.
 *
 * Fork-specific modules and config overrides live here.
 * The foundation never imports from client/ — client registers into the core.
 */

module.exports = {
  /** Additional backend modules: { id, featureKey?, register(router) } */
  modules: [],

  /** Optional config overrides merged at fork time */
  configOverrides: {},
};
