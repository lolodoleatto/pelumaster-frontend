import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Turnos from './pages/Turnos';
import Barberos from './pages/Barberos';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Reportes from './pages/Reportes';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Turnos />} />
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