import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import CustomDoughnutChart from '../components/CustomDoughnutChart';
import CustomLineChart from '../components/CustomLineChart';


const ProgressPage = () => {
    const [progressData, setProgressData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login'); 
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProgressData(response.data);
            } catch (error) {
                console.error("Erro ao buscar progresso:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);
    
    const lineChartData = useMemo(() => {
        if (!progressData?.quizHistory || progressData.quizHistory.length === 0) return { labels: [], datasets: [] };
        return {
            labels: progressData.quizHistory.map((item, index) => `Quiz ${index + 1}`),
            datasets: [
                {
                    label: 'Pontuação nos Quizzes (de 10)',
                    data: progressData.quizHistory.map(item => item.score),
                    fill: true,
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    tension: 0.3,
                },
            ],
        };
    }, [progressData]);

    const doughnutChartData = useMemo(() => {
        if (!progressData) return { labels: [], datasets: [] };
        const avgPercentage = (progressData.averageScore / 10) * 100;
        return {
            labels: ['Acertos', 'Erros'],
            datasets: [
                {
                    data: [avgPercentage, 100 - avgPercentage],
                    backgroundColor: ['#198754', '#dc3545'],
                    borderColor: ['var(--card-bg-color)'], 
                    borderWidth: 2,
                },
            ],
        };
    }, [progressData]);


    if (isLoading) {
        return <div className="loading-container">Carregando seu progresso...</div>;
    }

    if (!progressData || (progressData.lessonsCompleted === 0 && progressData.quizHistory.length === 0)) {
        return (
            <div className="progress-container">
                <h2>Seu Progresso</h2>
                <p className="empty-state">Você ainda não completou nenhuma aula ou quiz. Comece a aprender para ver seu progresso aqui!</p>
                <button onClick={() => navigate('/dashboard')}>Voltar ao Painel</button>
            </div>
        );
    }

    const avgPercentage = (progressData.averageScore / 10) * 100;

    return (
        <div className="progress-container">
            <h2>Seu Progresso</h2>

            <div className="progress-grid">
                <div className="progress-card">
                    <h3>Nível Atual</h3>
                    <p className="stat-highlight">{progressData.level ? progressData.level.toUpperCase() : 'N/A'}</p>
                </div>
                <div className="progress-card">
                    <h3>Aulas Concluídas</h3>
                    <p className="stat-highlight">{progressData.lessonsCompleted}</p>
                </div>
                <div className="progress-card chart-card-doughnut">
                    <h3>Média de Acertos</h3>
                    <CustomDoughnutChart data={doughnutChartData} summaryText={`${avgPercentage.toFixed(1)}%`} />
                </div>
            </div>

            {progressData.quizHistory.length > 0 && (
                <div className="progress-card full-width">
                    <h3>Evolução nos Quizzes</h3>
                    <CustomLineChart data={lineChartData} />
                </div>
            )}

            <button onClick={() => navigate('/dashboard')} style={{marginTop: '2rem'}}>Voltar ao Painel</button>
        </div>
    );
};

export default ProgressPage;