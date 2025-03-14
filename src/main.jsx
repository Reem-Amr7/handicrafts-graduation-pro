import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.jsx'
import TokenContextProvider from './Context/TokenContext.jsx'

createRoot(document.getElementById('root')).render(
  <TokenContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </TokenContextProvider>,
)
