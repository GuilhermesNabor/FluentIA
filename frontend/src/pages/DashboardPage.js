import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Iniciar Sessão de Prática?</h3>
                <p>Você terá <strong>2 minutos</strong> para conversar com a IA e treinar seu inglês. Esta sessão será cronometrada.</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="modal-button cancel">Cancelar</button>
                    <button onClick={onConfirm} className="modal-button confirm">Iniciar</button>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [isCreatingLesson, setIsCreatingLesson] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (showChatModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showChatModal]);

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
            {showChatModal && (
                <ConfirmationModal
                    onConfirm={() => navigate('/chat')}
                    onCancel={() => setShowChatModal(false)}
                />
            )}

            <div className="dashboard-header">
                <h2>Olá, {user.name}!</h2>
                <p>Pronto para continuar sua jornada no inglês?</p>
            </div>

            <div className="level-highlight-card">
                <span className="level-title">SEU NÍVEL ATUAL</span>
                <div className="level-badge">{user.english_level.toUpperCase()}</div>
            </div>

            <div className="dashboard-card main-cta" onClick={!isCreatingLesson ? handleNewLesson : null}>
                <div className="card-icon">📖</div>
                <h3>{isCreatingLesson ? 'Gerando sua aula...' : 'Iniciar Nova Aula'}</h3>
                <p>Receba uma aula personalizada gerada pela IA para o seu nível.</p>
            </div>
            
            <div className="dashboard-grid">
                <div className="dashboard-card secondary-cta" onClick={() => setShowChatModal(true)}>
                    <div className="card-icon">💬</div>
                    <h4>Praticar Chat</h4>
                    <p>Converse com a IA para treinar sua escrita.</p>
                </div>
                
                <Link to="/progress" className="dashboard-card secondary-cta no-underline">
                    <div className="card-icon">📈</div>
                    <h4>Ver Progresso</h4>
                    <p>Veja seu histórico de aulas e quizzes.</p>
                </Link>
                
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