// src/App.tsx (CORREGIDO)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Turnos from './pages/Turnos';
import Barberos from './pages/Barberos';
// 🛑 ELIMINAR ESTAS IMPORTACIONES REDUNDANTES 🛑
// import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'; 
// import customTheme from './themes/theme'; 
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Reportes from './pages/Reportes';


function App() {
  return (
    // 🛑 ELIMINAR ThemeProvider y CssBaseline de aquí 🛑
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
  );
}

export default App;