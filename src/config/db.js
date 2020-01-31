/**
 * Database configuration
 * @module config/db
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
module.exports = env => ({
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: env.DB_DIALECT
});
