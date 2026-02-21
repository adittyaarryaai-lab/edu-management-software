import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'; // Sahi import hai

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* FIXED: ThemeProvider ko yahan wrap karna zaroori hai */}
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)