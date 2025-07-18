import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizPage = () => {
    const { attemptId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { questions } = location.state || { questions: [] };
    
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(50 * 60);
    
    const [quizResult, setQuizResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return; 
        setIsSubmitting(true);
        setTimeLeft(-1); 

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/quiz/attempts/${attemptId}/submit`, 
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setQuizResult(response.data); 
        } catch (error) {
            alert('Erro ao enviar o quiz.');
            navigate('/dashboard');
        } finally {
            setIsSubmitting(false);
        }
    }, [answers, attemptId, navigate, isSubmitting]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
            return;
        }
        if (timeLeft < 0) return;

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, handleSubmit]);

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setAnswers({ ...answers, [questionIndex]: answerIndex });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (quizResult) {
        return (
            <div className="test-container result-container">
                <div className="card-icon">🎉</div>
                <h2>Parabéns, você concluiu!</h2>
                <p>Confira seu desempenho no teste:</p>
                <div className="results-summary">
                    <span className="score-text">Você acertou</span>
                    <div className="final-score">
                        {quizResult.score}
                        <span className="total-score">/ {quizResult.total}</span>
                    </div>
                    <span className="score-text">questões</span>
                </div>
                <button onClick={() => navigate('/dashboard')} className="submit-button">
                    Voltar para o Painel
                </button>
            </div>
        );
    }

    if (questions.length === 0) return <div className="loading-container">Carregando quiz...</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="test-container">
            <h1>Quiz da Aula - <span className="timer">{formatTime(timeLeft)}</span></h1>
            
            <div className="quiz-question-card">
                <h3>{currentQuestionIndex + 1}. {currentQuestion.question_text}</h3>
                <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => (
                        <button 
                            key={index}
                            className={`option-button quiz-option ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="quiz-navigation">
                {currentQuestionIndex < questions.length - 1 ? (
                    <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Próxima Questão</button>
                ) : (
                    <button onClick={handleSubmit} className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Finalizar e Ver Resultado'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizPage;