const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const db = require('./db');
const logger = require('./logger');
const token = require('./token');
const server = require('./server');

let env = dotenv.config({});
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

/**
 * Global configuration.
 * @module config
 */
module.exports = {
  db: db(env),
  logger: logger(env),
  token: token(env),
  server: server(env)
};
