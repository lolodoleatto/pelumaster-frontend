import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import customTheme from './themes/theme';
import type { Theme } from '@mui/material/styles'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme as Theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);