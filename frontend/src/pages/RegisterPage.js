import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await register(formData);
            setMessage('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Criar Conta</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nome" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />
                <button type="submit">Cadastrar</button>
            </form>
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}
            <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
        </div>
    );
};

export default RegisterPage;