import React from 'react';
import Navbar from '../components/NavBar';
import BarberosList from '../components/BarberosList';
import { Container, Typography } from '@mui/material';

const Barberos: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administración de Barberos
        </Typography>
        <BarberosList />
      </Container>
    </>
  );
};

export default Barberos;