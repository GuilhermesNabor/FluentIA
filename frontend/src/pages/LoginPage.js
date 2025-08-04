import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            if (response.data.user.english_level === 'untested') {
                 navigate('/placement-test');
            } else {
                 navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />
                <button type="submit">Entrar</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </div>
    );
};

export default LoginPage;