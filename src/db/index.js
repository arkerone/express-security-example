const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const { db: config } = require('../config');

const { database, username, password, host, port, dialect, logging } = config;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging
});

/* Load models */
const models = {};
const files = fs
  .readdirSync(path.join(__dirname, 'models'))
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

for (const file of files) {
  const model = sequelize.import(path.join(__dirname, 'models', file));
  models[model.name] = model;
}

for (const modelName of Object.keys(models)) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
}
/**
 * Database manager
 * @module db
 */

module.exports = {
  /**
   * Get models
   * @function getModels
   * @returns {Array} The list of models.
   */
  getModels() {
    return models;
  },
  /**
   * Get model by name.
   * @function getModel
   * @param {string} name - The name of model.
   * @returns {Array} The list of models.
   * @throws {Error} Will throw an error if the model doesn't exists.
   */
  getModel(name) {
    const model = models[name];
    if (!model) {
      throw Error(`The models "${name}" doesn't exists`);
    }
    return model;
  },
  /**
   * Get the SQL operators.
   * @function getOperators
   * @returns {Object} The list SQL operators.
   */
  getOperators() {
    return Sequelize.Op;
  },
  /**
   * Get the database instance.
   * @function getDatabase
   * @returns {Sequelize} Sequelize instance.
   */
  getDatabase() {
    return sequelize;
  },
  /**
   * Sync all defined models to the DB.
   * @function sync
   * @param {object} opts
   * @param {boolean} options.force - If force is true, each Model will run DROP TABLE IF EXISTS, before it tries to create its own table.
   * @returns {Promise}
   */
  sync(opts) {
    return sequelize.sync(opts);
  },
  /**
   * Start a transaction.
   * @function createTransaction
   * @returns {Promise}
   */
  createTransaction() {
    return sequelize.transaction();
  }
};
