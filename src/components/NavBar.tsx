import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Título y Link a Home */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          PeluMaster
        </Typography>

        {/* Botones de Navegación */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button color="inherit" component={Link} to="/turnos">
            Turnos
          </Button>
          <Button color="inherit" component={Link} to="/barberos">
            Barberos
          </Button>
          <Button color="inherit" component={Link} to="/clientes">
            Clientes
          </Button>
          <Button color="inherit" component={Link} to="/servicios">
            Servicios
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;