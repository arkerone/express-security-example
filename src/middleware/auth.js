/* eslint-disable no-ex-assign */
const jwt = require('jsonwebtoken');
const { InvalidTokenError, ExpiredTokenError, BadCredentialsError } = require('../errors');
const { token: config } = require('../config');
const db = require('../db');

/**
 * Auth Middleware
 * @module middleware/auth
 */

/**
 * Middleware to validate JWT and sets req.user.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports = async (req, res, next) => {
  try {
    const { headers } = req;

    if (!headers.authorization) {
      throw new BadCredentialsError({
        message: 'Missing Authorization header'
      });
    }

    const {
      accessToken: { type, secret }
    } = config;

    const parts = headers.authorization.split(' ');

    if (parts.length !== 2) {
      throw new BadCredentialsError({
        message: `Header format is Authorization: ${type} token`
      });
    }

    const scheme = parts[0];
    const token = parts[1];

    if (type.toLowerCase() !== scheme.toLowerCase() || !token) {
      throw new BadCredentialsError({
        message: `Header format is Authorization: ${type} token`
      });
    }

    const { sub: userId } = await jwt.verify(token, secret);
    const user = await db.getModel('User').findOne({ where: { id: userId } });
    if (!user) {
      throw new BadCredentialsError({
        message: `User ${userId} not exists`
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      err = new ExpiredTokenError({
        info: {
          expiredAt: err.expiredAt
        }
      });
    } else if (err.name === 'JsonWebTokenError') {
      err = new InvalidTokenError({
        message: err.message
      });
    }
    return next(err);
  }
};
