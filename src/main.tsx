import { StrictMode } from 'react' // cd "C:\Users\Tuff\Desktop\NewestProjects\test-project"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)