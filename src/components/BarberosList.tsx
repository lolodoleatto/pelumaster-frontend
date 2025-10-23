import React from 'react';
import type { Barbero } from '../types/Barbero';
import { getBarberos } from '../api/api'; 
import { useFetch } from '../hooks/useFetch'; 
import { Container, CircularProgress, Alert, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const BarberosList: React.FC = () => {
  const { data: barberos, loading, error } = useFetch<Barbero[]>(getBarberos);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>Cargando barberos...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Error al cargar los barberos. Detalles: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nuestros Barberos
        </Typography>
        
        {barberos && barberos.length > 0 ? (
          <List>
            {barberos.map((barbero) => (
              <ListItem 
                key={barbero.id_barbero} 
                sx={{ borderBottom: '1px solid #eee' }}
              >
                <PersonIcon color="action" sx={{ mr: 2 }} />
                <ListItemText
                  // Usamos id_barbero y combinamos nombre y apellido
                  primary={<Typography variant="h6">{barbero.nombre} {barbero.apellido}</Typography>}
                  secondary={`Teléfono: ${barbero.telefono || 'N/A'} | Activo: ${barbero.activo ? 'Sí' : 'No'}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">No hay barberos registrados en el sistema.</Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BarberosList;