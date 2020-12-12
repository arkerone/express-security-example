const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const {
  BadCredentialsError,
  InvalidTokenError,
  ExpiredTokenError,
  MissingRequiredParameterError
} = require('../errors');
const db = require('../db');
const { token: config } = require('../config');

const jwtSign = promisify(jwt.sign);

async function generateToken(user) {
  const accessToken = await jwtSign(
    { firstName: user.firstName, lastName: user.lastName },
    config.accessToken.secret,
    {
      algorithm: config.accessToken.algorithm,
      audience: config.accessToken.audience,
      expiresIn: config.accessToken.expiresIn,
      issuer: config.accessToken.issuer,
      subject: user.id.toString()
    }
  );

  const refreshToken = crypto.randomBytes(128).toString('base64');

  await db.getModel('RefreshToken').create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + config.refreshToken.expiresIn)
  });

  return { accessToken, refreshToken };
}

/**
 * Auth controller.
 * @module controllers/auth
 */

/**
 * Login controller.
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw new MissingRequiredParameterError({
        info: {
          body: ['username']
        }
      });
    }

    if (!password) {
      throw new MissingRequiredParameterError({
        info: {
          body: ['password']
        }
      });
    }

    const user = await db.getModel('User').authenticate(username, password);
    if (!user) {
      throw new BadCredentialsError({
        message: 'Username or password is incorrect'
      });
    }
    const { accessToken, refreshToken } = await generateToken(user);

    res.json({
      accessToken,
      tokenType: config.accessToken.type,
      accessTokenExpiresIn: config.accessToken.expiresIn,
      refreshToken,
      refreshTokenExpiresIn: config.refreshToken.expiresIn
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Refresh token controller.
 * @function refreshToken
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new MissingRequiredParameterError({
        info: {
          body: ['token']
        }
      });
    }

    const oldRefreshToken = await db.getModel('RefreshToken').findOne({
      where: { token },
      include: ['user']
    });

    if (!oldRefreshToken) {
      throw new InvalidTokenError();
    }

    if (oldRefreshToken.expiresAt < new Date()) {
      throw new ExpiredTokenError({
        info: {
          expiresAt: oldRefreshToken.expiresAt
        }
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateToken(
      oldRefreshToken.user
    );

    await oldRefreshToken.destroy();

    res.json({
      accessToken,
      tokenType: config.accessToken.type,
      accessTokenExpiresIn: config.accessToken.expiresIn,
      refreshToken: newRefreshToken,
      refreshTokenExpiresIn: config.refreshToken.expiresIn
    });
  } catch (err) {
    next(err);
  }
};
