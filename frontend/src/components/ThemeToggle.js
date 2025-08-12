import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css'; 

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-switch-container">
            <label className="theme-switch" htmlFor="theme-checkbox">
                <input 
                    type="checkbox" 
                    id="theme-checkbox"
                    onChange={toggleTheme}
                    checked={theme === 'dark'}
                />
                <div className="slider round"></div>
            </label>
        </div>
    );
};

export default ThemeToggle;