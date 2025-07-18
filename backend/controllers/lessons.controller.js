const db = require('../db');
const { generateLesson } = require('../services/groq.service');

exports.createNewLesson = async (req, res) => {
    const userLevel = req.userData.level;
    const userId = req.userData.userId;

    try {
        const lessonData = await generateLesson(userLevel);

        const lessonResult = await db.query(
            'INSERT INTO lessons (title, content, level_required) VALUES ($1, $2, $3) RETURNING *',
            [lessonData.title, lessonData.textContent, userLevel]
        );
        const newLesson = lessonResult.rows[0];

        for (const rec of lessonData.recommendations) {
            const description = rec.author ? `Por ${rec.author}` : rec.url;
            await db.query(
                'INSERT INTO recommendations (lesson_id, type, title, url_or_description) VALUES ($1, $2, $3, $4)',
                [newLesson.id, rec.type, rec.title, description]
            );
        }

        res.status(201).json(newLesson);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar nova aula.' });
    }
};

exports.getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const lessonResult = await db.query('SELECT * FROM lessons WHERE id = $1', [id]);
        if (lessonResult.rows.length === 0) {
            return res.status(404).json({ message: 'Aula não encontrada.' });
        }
        res.status(200).json(lessonResult.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar aula.' });
    }
}