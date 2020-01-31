const { createLogger, format, transports } = require('winston');
const chalk = require('chalk');
const path = require('path');
const config = require('../config');

const formatter = colorize =>
  format.printf(info => {
    const content = colorize ? chalk.yellow(JSON.stringify(info)) : JSON.stringify(info);
    return `[${info.timestamp}] ${info.level}: ${info.message} ${content}`;
  });

/**
 * Logger module.
 * @module services/logger
 */
module.exports = createLogger({
  transports: [
    new transports.File({
      filename: path.join(config.logger.path, 'error.log'),
      level: 'error',
      format: format.combine(format.timestamp(), formatter(false))
    }),
    new transports.File({
      filename: path.join(config.logger.path, 'combined.log'),
      format: format.combine(format.timestamp(), formatter(false))
    }),
    new transports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.colorize(), formatter(true))
    })
  ]
});
