import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './STYLING/index.scss'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import theme from './STYLING/theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
  // </React.StrictMode>,
)
