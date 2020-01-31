const _ = require('lodash');

/**
 * Anything controller.
 * @module controllers/anything
 */

/**
 * Example controller to get information about request.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.anything = (req, res) => {
  res.json(
    _.pick(
      req,
      'body',
      'files',
      'headers',
      'hostname',
      'ip',
      'method',
      'params',
      'query',
      'protocol',
      'url'
    )
  );
};
