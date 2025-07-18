const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessons.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/new', lessonsController.createNewLesson);

router.get('/:id', lessonsController.getLessonById);

module.exports = router;