import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [isCreatingLesson, setIsCreatingLesson] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleNewLesson = async () => {
        setIsCreatingLesson(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/lessons/new', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate(`/lesson/${response.data.id}`);
        } catch (error) {
            alert('Erro ao criar nova aula. Por favor, tente novamente.');
            setIsCreatingLesson(false);
        }
    };

    const featureComingSoon = () => {
        alert('Funcionalidade em desenvolvimento. Em breve!');
    };

    if (!user) {
        return <div className="loading-container">Carregando...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Olá, {user.name}!</h2>
                <p>Pronto para continuar sua jornada no inglês?</p>
            </div>

            <div className="level-highlight-card">
                <span>SEU NÍVEL ATUAL</span>
                <div className="level-badge">{user.english_level.toUpperCase()}</div>
            </div>

            <div className="dashboard-card main-cta" onClick={!isCreatingLesson ? handleNewLesson : null}>
                <div className="card-icon">📖</div>
                <h3>{isCreatingLesson ? 'Gerando sua aula...' : 'Iniciar Nova Aula'}</h3>
                <p>Receba uma aula personalizada gerada pela IA para o seu nível.</p>
            </div>
            
            <div className="dashboard-grid">
                <div className="dashboard-card secondary-cta" onClick={featureComingSoon}>
                    <div className="card-icon">💬</div>
                    <h4>Praticar Chat</h4>
                    <p>Converse com a IA para treinar sua escrita.</p>
                </div>
                <div className="dashboard-card secondary-cta" onClick={featureComingSoon}>
                    <div className="card-icon">📈</div>
                    <h4>Ver Progresso</h4>
                    <p>Veja seu histórico de aulas e quizzes.</p>
                </div>
                <div className="dashboard-card secondary-cta" onClick={featureComingSoon}>
                    <div className="card-icon">⚙️</div>
                    <h4>Configurações</h4>
                    <p>Altere seus dados e preferências.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;