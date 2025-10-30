import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Turnos from './pages/Turnos';
import Barberos from './pages/Barberos';
// Importa ThemeProvider y CssBaseline de MUI para un buen inicio
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Reportes from './pages/Reportes';

// Define un tema básico de MUI (opcional, pero mejora la estética)
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c', // Un color morado fuerte para PeluMaster
    },
    secondary: {
      main: '#ffb300', // Un color amarillo/naranja
    },
  },
});

function App() {
  return (
    // Usa ThemeProvider para aplicar el tema de MUI
    <ThemeProvider theme={theme}>
      {/* CssBaseline reinicia los estilos CSS */}
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/barberos" element={<Barberos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>404 - Página no encontrada</h1>
            </div>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
