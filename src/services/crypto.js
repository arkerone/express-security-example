const { createHmac, createHash, scryptSync, randomBytes } = require('crypto');
/**
 * Crypto module.
 * @module services/crypto
 */
module.exports = {
  /**
   * Compute the hash of string or buffer.
   * @method hash
   * @param {string} type - The type of hash.
   * @param {string|Buffer} buffer - The string or buffer.
   * @returns {string} The hash.
   */
  hash(type, buffer) {
    return createHash(type)
      .update(buffer)
      .digest('hex');
  },
  /**
   * Create a password hash
   * @method createPasswordHash
   * @param {string|Buffer} buffer - The string or buffer.
   * @returns {Object} Object that contains the hash and salt.
   */
  createPasswordHash(password, salt) {
    const generatedSalt = salt || randomBytes(128).toString('base64');

    const hmac = createHmac('sha256', generatedSalt);
    hmac.update(password);
    let hashedPassword = hmac.digest('hex');

    const scrypt = scryptSync(hashedPassword, generatedSalt, 64);
    hashedPassword = scrypt.toString('hex');

    return {
      hash: hashedPassword,
      salt: generatedSalt
    };
  }
};
