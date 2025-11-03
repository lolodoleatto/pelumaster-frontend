/**
 * import React from 'react';
import { Typography, Box } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const Home: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard Principal">       

      <Box 
        sx={{ 
          mt: 2, 
          textAlign: 'center', 
          maxWidth: 900, 
          mx: 'auto' // Centra el contenido en pantallas grandes
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Bienvenido a PeluMaster
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
          Tu sistema integral para la gestión de turnos y barberos.
        </Typography>
        
        <Box>
          <img
            src="https://via.placeholder.com/600x300.png?text=Panel+de+Control"
            alt="Dashboard Placeholder"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
      </Box>

    </DashboardLayout>
  );
};

export default Home;
*/