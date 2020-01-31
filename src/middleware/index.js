const auth = require('./auth');
const errorHandler = require('./errorHandler');

/**
 * Middleware
 * @module middleware
 */
module.exports = {
  auth,
  errorHandler
};
