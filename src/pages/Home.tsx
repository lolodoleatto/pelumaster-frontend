import React from 'react';
import Navbar from '../components/NavBar';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Bienvenido a PeluMaster ✂️
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary">
          Tu sistema integral para la gestión de turnos y barberos.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <img 
            src="https://via.placeholder.com/600x300.png?text=Panel+de+Control" 
            alt="Dashboard Placeholder" 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
      </Container>
    </>
  );
};

export default Home;