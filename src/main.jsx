import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Force dark theme on initial load
document.documentElement.classList.add('dark');

// Add a placeholder resume file in the public folder (you'll need to create this)
// Create public/resume.pdf with your actual resume

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
