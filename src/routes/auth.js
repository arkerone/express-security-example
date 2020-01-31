const express = require('express');
const bodyParser = require('body-parser');
const { auth: controller } = require('../controllers');

const router = express.Router();

router.post(
  '/login',
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  controller.login
);

router.post(
  '/token',
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  controller.refreshToken
);

/**
 * Auth routes.
 * @module routes/auth
 */
module.exports = router;
