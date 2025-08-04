import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LessonPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false); 

    useEffect(() => {
        const fetchLesson = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/lessons/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLesson(response.data);
            } catch (error) {
                console.error("Erro ao buscar aula:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLesson();

        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [lessonId]);

    const handleReadAloud = () => {
        if (!lesson || !lesson.content) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const englishTextOnly = lesson.content.replace(/ *\([^)]*\) */g, " ");
        
        const utterance = new SpeechSynthesisUtterance(englishTextOnly);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.9; 

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleStartQuiz = async () => {
        window.speechSynthesis.cancel();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/quiz/lessons/${lessonId}/start`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/quiz/${response.data.attemptId}`, { state: { questions: response.data.questions } });
        } catch (error) {
            alert('Erro ao iniciar o quiz.');
        }
    };

    if (isLoading) return <div className="loading-container">Gerando sua aula...</div>;
    if (!lesson) return <div className="test-container">Aula não encontrada.</div>;

    return (
        <div className="lesson-container">
            <div className="lesson-header">
                <h1>{lesson.title}</h1>
                <button onClick={handleReadAloud} className="speak-button" title="Ler texto em voz alta">
                    {isSpeaking ? '⏹️ Parar' : '🔊 Ouvir'}
                </button>
            </div>
            
            <div className="lesson-content" style={{ whiteSpace: 'pre-wrap' }}>
                {lesson.content}
            </div>

            <button onClick={handleStartQuiz} className="submit-button">
                Finalizar Aula e Iniciar Teste
            </button>
        </div>
    );
};

export default LessonPage;