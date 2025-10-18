const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, progressController.getProgressData);

module.exports = router;