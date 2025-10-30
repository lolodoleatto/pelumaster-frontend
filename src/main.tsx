// src/main.tsx (CORRECCIÓN)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// 🛑 Verificar y tipar la importación del tema 🛑
import customTheme from './themes/theme'; // 🛑 Asegúrate que NO tenga .ts al final (Vite lo maneja)
import type { Theme } from '@mui/material/styles'; // Importar el tipo Theme

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme as Theme}> {/* 🛑 Asertar el tipo 🛑 */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);