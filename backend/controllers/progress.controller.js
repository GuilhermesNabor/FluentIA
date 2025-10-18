const db = require('../db');

exports.getProgressData = async (req, res) => {
    const userId = req.userData.userId;

    try {
        const statsQuery = `
            SELECT 
                u.english_level,
                (SELECT COUNT(*) FROM user_completed_lessons WHERE user_id = u.id) as lessons_completed,
                (SELECT AVG(score) FROM quiz_attempts WHERE user_id = u.id AND score IS NOT NULL) as average_score
            FROM users u
            WHERE u.id = $1;
        `;
        const statsResult = await db.query(statsQuery, [userId]);
        const stats = statsResult.rows[0];

        const historyQuery = `
            SELECT score, end_time 
            FROM quiz_attempts 
            WHERE user_id = $1 AND score IS NOT NULL 
            ORDER BY end_time ASC;
        `;
        const historyResult = await db.query(historyQuery, [userId]);
        const quizHistory = historyResult.rows;

        res.status(200).json({
            level: stats.english_level,
            lessonsCompleted: parseInt(stats.lessons_completed, 10) || 0,
            averageScore: parseFloat(stats.average_score) || 0,
            quizHistory: quizHistory,
        });

    } catch (error) {
        console.error("Erro ao buscar dados de progresso:", error);
        res.status(500).json({ message: 'Erro ao buscar dados de progresso.' });
    }
};