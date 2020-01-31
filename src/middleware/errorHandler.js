/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { InternalServerError } = require('../errors');
const { logger } = require('../services');

/**
 * Error handler Middleware
 * @module middleware/errorHandler
 */

/**
 * Error handler middleware.
 * @function errorHandler
 * @param {Error} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports = (err, req, res, next) => {
  if (!err.isHTTPError) {
    err = new InternalServerError({ cause: err });
  }

  /* TODO: Create a middleware to log error ? */
  logger.error(err, { stack: err.fullStack() });

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status).json(_.pick(err, 'info', 'message', 'name', 'status'));
};
