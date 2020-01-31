const path = require('path');
const appRoot = require('app-root-path');

/**
 * Logger configuration.
 * @module config/logger
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
module.exports = env => ({
  path: env.LOG_PATH || path.join(appRoot.path, 'logs')
});
