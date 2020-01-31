/* eslint-disable max-classes-per-file */
const { WError, VError } = require('verror');

/**
 * Errors
 * @module errors
 */

/**
 * @class HTTPError
 */
class HTTPError extends WError {
  /**
   * @constructor
   * @param {Object} options
   * @param {string} options.cause - The error's cause.
   * @param {string} options.name - The error's name.
   * @param {string} options.message - The error's message.
   * @param {Object} options.info - The error's info.
   * @param {number} options.status - The status code.
   * @param {boolean} [options.expose=true] - Can be used to signal if message should be sent to the client.
   */
  constructor({ cause, name, message, info, status, expose = true }) {
    super({ cause, message, name, info }, message);
    this.isHTTPError = true;
    this.status = status;
    this.expose = expose;
  }

  /**
   * @method fullStack
   * @returns {string} A string containing the full stack trace.
   */
  fullStack() {
    return VError.fullStack(this);
  }
}

/**
 * @class MissingRequiredParameterError
 */
module.exports.MissingRequiredParameterError = class MissingRequiredParameterError extends HTTPError {
  /**
   * @constructor
   * @param {Object} options
   * @param {string} [options.message='Missing required parameters'] - The error's message.
   * @param {Object} options.info - The error's info.
   */
  constructor({ message = 'Missing required parameters', info } = {}) {
    super({ name: 'missing_required_parameter', message, info, status: 400 });
  }
};

/**
 * @class BadCredentialsError
 */
module.exports.BadCredentialsError = class BadCredentialsError extends HTTPError {
  /**
   * @constructor
   * @param {Object} options
   * @param {string} [options.message='Bad credentials'] - The error's message.
   * @param {Object} options.info - The error's info.
   */
  constructor({ message = 'Bad credentials', info } = {}) {
    super({ name: 'bad_credentials', message, info, status: 401 });
  }
};

/**
 * @class InvalidTokenError
 */
module.exports.InvalidTokenError = class InvalidTokenError extends HTTPError {
  /**
   * @constructor
   * @param {Object} options
   * @param {string} [options.message='Bad credentials'] - The error's message.
   * @param {Object} options.info - The error's info.
   */
  constructor({ message = 'Invalid token', info } = {}) {
    super({ name: 'invalid_token', message, info, status: 401 });
  }
};

/**
 * @class ExpiredTokenError
 */
module.exports.ExpiredTokenError = class ExpiredTokenError extends HTTPError {
  /**
   * @constructor
   * @param {Object} options
   * @param {string} [options.message='Expired token'] - The error's message.
   * @param {Object} options.info - The error's info.
   */
  constructor({ message = 'Expired token', info } = {}) {
    super({ name: 'expired_token', message, info, status: 401 });
  }
};

/**
 * @class InternalServerError
 */
module.exports.InternalServerError = class InternalServerError extends HTTPError {
  /**
   * @constructor
   * @param {Object} options
   * @param {Error} options.cause - Indicates that the new error was caused by cause.
   * @param {string} [options.message='Internal error server'] - The error's message.
   * @param {Object} options.info - The error's info.
   */
  constructor({ cause, message = 'Internal error server', info } = {}) {
    super({
      cause,
      name: 'internal_server',
      message,
      info,
      status: 500,
      expose: false
    });
  }
};
