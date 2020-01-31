const path = require('path');
const appRoot = require('app-root-path');

/**
 * Server configuration.
 * @module config/server
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
module.exports = env => ({
  host: env.HOST || 'localhost',
  port: env.PORT || 8080,
  certificate: env.CERTIFICATE || path.join(appRoot.path, 'certificate', 'server.cert'),
  privateKey: env.PRIVATE_KEY || path.join(appRoot.path, 'certificate', 'server.key')
});
