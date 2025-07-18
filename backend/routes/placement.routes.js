const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placement.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', placementController.getTestQuestions);

router.post('/submit', authMiddleware, placementController.submitTestResult);

module.exports = router;