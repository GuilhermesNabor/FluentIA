const { generatePlacementTest } = require('../services/groq.service');
const db = require('../db');

exports.getTestQuestions = async (req, res) => {
    try {
        const questions = await generatePlacementTest();

        if (!questions || questions.length === 0) {
            return res.status(500).json({ message: "Não foi possível gerar as questões do teste no momento." });
        }
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Erro ao gerar questões do teste." });
    }
};

exports.submitTestResult = async (req, res) => {
    const { score } = req.body; 
    const userId = req.userData.userId; 

    if (score === undefined || !userId) {
        return res.status(400).json({ message: "Pontuação ou ID do usuário faltando." });
    }

    let level = 'beginner';
    const percentage = (score / 20) * 100;

    if (percentage > 80) { 
        level = 'advanced';
    } else if (percentage > 40) { 
        level = 'intermediate';
    }

    try {
        const updatedUser = await db.query(
            'UPDATE users SET english_level = $1 WHERE id = $2 RETURNING id, name, email, english_level',
            [level, userId]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({
            message: "Nível atualizado com sucesso!",
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error("Erro ao salvar resultado do teste:", error);
        res.status(500).json({ message: "Erro interno ao salvar resultado." });
    }
};