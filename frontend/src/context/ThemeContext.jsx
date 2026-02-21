import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const getThemeKey = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            return `theme_${user._id}`;
        }
        return 'theme_guest';
    };
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    useEffect(() => {
        const savedTheme = localStorage.getItem(getThemeKey());
        setIsDarkMode(savedTheme === 'dark');
    }, [localStorage.getItem('user')]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);