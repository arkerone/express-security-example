/* eslint-disable no-console */
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { server: config } = require('./config');
const routes = require('./routes');
const { errorHandler } = require('./middleware');
const { logger } = require('./services');

const { privateKey, certificate, host, port } = config;

const app = express();
app.use(helmet());
app.use(cors());
app.use(routes);
app.use(errorHandler);

const key = fs.readFileSync(privateKey);
const cert = fs.readFileSync(certificate);
const options = { key, cert };

https.createServer(options, app).listen(port, host, () => {
  logger.info(`App is running ! Go to https://${host}:${port}`);
});
