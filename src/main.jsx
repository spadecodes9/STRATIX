import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PremiumProvider } from './context/PremiumContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PremiumProvider>
          <ThemeProvider>
            <App />
            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1c1c22',
                  border: '1px solid #2a2a32',
                  color: '#f2f1ee',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          </ThemeProvider>
        </PremiumProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
