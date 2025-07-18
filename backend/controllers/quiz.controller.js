const db = require('../db');
const { generateQuizForLesson } = require('../services/groq.service');

exports.startQuizForLesson = async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.userData.userId;

    try {
        const lessonResult = await db.query('SELECT content FROM lessons WHERE id = $1', [lessonId]);
        if (lessonResult.rows.length === 0) return res.status(404).json({ message: 'Aula não encontrada.' });
        const lessonContent = lessonResult.rows[0].content;

        const quizData = await generateQuizForLesson(lessonContent);

        const quizResult = await db.query(
            'INSERT INTO quizzes (lesson_id, title) VALUES ($1, $2) RETURNING id',
            [lessonId, `Quiz para a aula ${lessonId}`]
        );
        const quizId = quizResult.rows[0].id;

        for (const q of quizData.questions) {
            await db.query(
                'INSERT INTO questions (quiz_id, question_text, options, correct_answer) VALUES ($1, $2, $3, $4)',
                [quizId, q.question_text, JSON.stringify(q.options), q.correct_answer]
            );
        }
        
        await db.query(
            'INSERT INTO user_completed_lessons (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, lessonId]
        );

        const attemptResult = await db.query(
            'INSERT INTO quiz_attempts (user_id, quiz_id, start_time) VALUES ($1, $2, NOW()) RETURNING id',
            [userId, quizId]
        );
        const attemptId = attemptResult.rows[0].id;
        
        res.status(201).json({ 
            message: 'Quiz iniciado!', 
            attemptId, 
            questions: quizData.questions 
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao iniciar quiz.' });
    }
};

exports.submitQuizAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body; 

    try {
        const quizIdResult = await db.query('SELECT quiz_id FROM quiz_attempts WHERE id = $1', [attemptId]);
        const quizId = quizIdResult.rows[0].quiz_id;
        
        const questionsResult = await db.query('SELECT correct_answer FROM questions WHERE quiz_id = $1 ORDER BY id', [quizId]);
        const correctAnswers = questionsResult.rows.map(r => r.correct_answer);

        let score = 0;
        for (const questionIndex in answers) {
            if (parseInt(answers[questionIndex]) === correctAnswers[questionIndex]) {
                score++;
            }
        }
        
        await db.query(
            "UPDATE quiz_attempts SET score = $1, end_time = NOW(), status = 'completed' WHERE id = $2",
            [score, attemptId]
        );

        res.status(200).json({
            message: "Quiz finalizado!",
            score: score,
            total: correctAnswers.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao submeter quiz.' });
    }
};