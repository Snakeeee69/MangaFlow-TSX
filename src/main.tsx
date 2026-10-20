import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // <-- ¡OBLIGATORIA PARA BOOTSTRAP!
import './index.css'                         // Es la que ya tienes, déjala aquí
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
