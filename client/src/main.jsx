import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppDemo from './AppDemo.jsx'
import './index.css'

const demoModeEnabled = import.meta.env.VITE_DEMO_MODE === 'true'
const RootApp = demoModeEnabled ? AppDemo : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
)
