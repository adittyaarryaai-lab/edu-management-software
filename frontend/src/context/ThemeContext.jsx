import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Neural Identity key for multi-user isolation
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
        return savedTheme !== 'light'; // Default to dark (Void Black)
    });

    // Matrix Effect state toggle (Optional if you want to turn it off in settings later)
    const [isMatrixActive, setIsMatrixActive] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem(getThemeKey());
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            localStorage.setItem(getThemeKey(), 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            localStorage.setItem(getThemeKey(), 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isMatrixActive }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);