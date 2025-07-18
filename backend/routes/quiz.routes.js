const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/lessons/:lessonId/start', quizController.startQuizForLesson);

router.post('/attempts/:attemptId/submit', quizController.submitQuizAttempt);

module.exports = router;