import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, submitResult } from '../api/placementTest';
import './PlacementTestPage.css'; 

const PlacementTestPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getQuestions()
            .then(response => {
                setQuestions(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar questões:", error);
                setIsLoading(false);
            });
    }, []);

    const handleAnswerSelect = (selectedOption) => {
        setUserAnswers({ ...userAnswers, [currentQuestionIndex]: selectedOption });
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300); 
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        let score = 0;
        questions.forEach((q, index) => {
            const correctOptionIndex = q.answer.charCodeAt(0) - 'a'.charCodeAt(0);
            if (userAnswers[index] === q.options[correctOptionIndex]) {
                score++;
            }
        });

        try {
            const token = localStorage.getItem('token');
            const response = await submitResult(score, token);
            setTestResult(response.data);
            localStorage.setItem('user', JSON.stringify(response.data.user)); 
            localStorage.setItem('test_completed', 'true'); 
        } catch (error) {
            alert("Houve um erro ao enviar seu resultado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="test-container"><h2>Carregando teste...</h2></div>;
    if (testResult) {
        return (
            <div className="test-container result-container">
                <h2>Teste Concluído!</h2>
                <p>{testResult.message}</p>
                <p>Seu novo nível é: <strong>{testResult.user.english_level.toUpperCase()}</strong></p>
                <button onClick={() => navigate('/dashboard')}>Ir para o Dashboard</button>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div className="test-container">
            <h1>Teste de Nivelamento</h1>
            <p>Questão {currentQuestionIndex + 1} de {questions.length}</p>
            <h3>{currentQuestion?.question}</h3>
            <div className="options-grid">
                {currentQuestion?.options.map((option, index) => (
                    <button 
                        key={index} 
                        className={`option-button ${userAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
                        onClick={() => handleAnswerSelect(option)}>
                        {option}
                    </button>
                ))}
            </div>
            {Object.keys(userAnswers).length === questions.length && (
                <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Finalizar Teste'}
                </button>
            )}
        </div>
    );
};

export default PlacementTestPage;