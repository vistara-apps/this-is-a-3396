import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(220 11.9% 95.7%)',
            color: 'hsl(220 14% 14%)',
            border: '1px solid hsl(220 14% 44%)',
          },
          success: {
            iconTheme: {
              primary: 'hsl(12 93.8% 53.1%)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
