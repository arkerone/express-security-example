const express = require('express');
const { auth } = require('../middleware');
const { anything: controller } = require('../controllers');

const router = express.Router();

router.all('/anything', auth, controller.anything);

/**
 * Anything routes.
 * @module routes/anything
 */
module.exports = router;
