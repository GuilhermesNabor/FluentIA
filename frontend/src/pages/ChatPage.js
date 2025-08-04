import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

const aiAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230d6efd'%3E%3Cpath d='M12 2a2 2 0 0 0-2 2v2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2zm0 2c.55 0 1 .45 1 1v1h-2V5c0-.55.45-1 1-1zM8 8h8v8H8V8zm2 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-2 4h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2z'/%3E%3C/svg%3E";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(120); 
    const [isChatFinished, setIsChatFinished] = useState(false);
    const [userMessageCount, setUserMessageCount] = useState(0);

    useEffect(() => {
        setMessages([{ 
            id: Date.now(), 
            text: 'Hello! Your 2-minute practice session starts now. Let\'s talk!', 
            sender: 'ai' 
        }]);
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (!isChatFinished) {
            setIsChatFinished(true);
        }
    }, [timeLeft, isChatFinished, userMessageCount]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isChatFinished) return;

        const userMessage = { id: Date.now(), text: newMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setUserMessageCount(prev => prev + 1); 
        const currentInput = newMessage;
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/chat/send',
                { message: currentInput },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const aiResponse = { id: Date.now() + 1, text: response.data.response, sender: 'ai' };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorResponse = { id: Date.now() + 1, text: 'Sorry, I could not get a response. Please try again.', sender: 'ai', error: true };
            setMessages(prev => [...prev, errorResponse]);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isChatFinished) {
        return (
            <div className="chat-page-container">
                <div className="result-container chat-result">
                    <div className="card-icon">🎉</div>
                    <h2>Tempo Esgotado!</h2>
                    <p>Ótima sessão de prática. Confira seus resultados:</p>
                    <div className="results-summary">
                        <span className="score-text">Você enviou</span>
                        <div className="final-score">{userMessageCount}</div>
                        <span className="score-text">mensagens</span>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="submit-button">
                        Voltar para o Painel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page-container">
            <div className="chat-header">
                <div className="chat-timer">{formatTime(timeLeft)}</div>
                <img src={aiAvatar} alt="AI Avatar" className="chat-avatar" />
                <div className="chat-header-info">
                    <div className="chat-title">FluentIA</div>
                    <div className="chat-status">Praticando...</div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                        <div className="message-content">
                            <span>{msg.text}</span>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="chat-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder="Escreva sua mensagem em inglês..."
                    rows="1"
                    disabled={isChatFinished} 
                />
                <button onClick={handleSendMessage} disabled={isChatFinished}>Enviar</button>
            </div>
        </div>
    );
};

export default ChatPage;