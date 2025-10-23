import React from 'react';
import type { Turno, EstadoTurno } from '../types/Turno';
import { ESTADOS_TURNO } from '../types/Turno'; 
import { getTurnos, deleteTurno } from '../api/api'; 
import { useFetch } from '../hooks/useFetch'; 
import { 
  Container, 
  CircularProgress, 
  Alert, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper, 
  Chip, 
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

// Función para formatear la fecha_hora
const formatTurnoData = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  // Opciones de formato, ajusta según tu preferencia local
  const dateStr = date.toLocaleDateString('es-AR'); 
  const timeStr = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return { dateStr, timeStr };
};

// Función para mapear estado a color MUI
const getStatusColor = (estado: EstadoTurno): 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' => {
  switch (estado) {
    case ESTADOS_TURNO.CONFIRMADO: return 'success';
    case ESTADOS_TURNO.CANCELADO: return 'error';
    default: return 'warning'; // 'pendiente'
  }
};

const TurnosList: React.FC = () => {
  // 🚀 Uso del hook y obtenemos 'refetch' para recargar
  const { data: turnos, loading, error, refetch } = useFetch<Turno[]>(getTurnos);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar el turno ' + id + '? Esta acción es irreversible.')) {
      try {
        // Llama a la función de la API
        await deleteTurno(id);
        // Recarga la lista para reflejar el cambio en la UI
        refetch(); 
      } catch (e) {
        console.error('Error al eliminar el turno:', e);
        alert('Ocurrió un error al intentar eliminar el turno.');
      }
    }
  };

  // 🔄 Manejo de estados: Cargando
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Cargando turnos...</Typography>
      </Container>
    );
  }

  // ❌ Manejo de estados: Error
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error al cargar los turnos. Detalles: {error.message}
        </Alert>
      </Container>
    );
  }

  // ✅ Manejo de estados: Datos cargados
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        
        <Typography variant="h5" gutterBottom>
          Lista de Turnos ({turnos?.length || 0})
        </Typography>
        
        {turnos && turnos.length > 0 ? (
          <List>
            {turnos.map((turno) => {
              // Extraer datos de tiempo
              const { dateStr, timeStr } = formatTurnoData(turno.fecha_hora);
              
              // 🚨 SOLUCIÓN AL ERROR: Verificación de nulidad en las relaciones (barbero, cliente, servicio)
              const barberoNombre = turno.barbero 
                ? `${turno.barbero.nombre} ${turno.barbero.apellido}` 
                : 'Barbero Eliminado/No Asignado';
              
              const clienteNombre = turno.cliente
                ? `${turno.cliente.nombre} ${turno.cliente.apellido}` 
                : 'Cliente Eliminado/No Asignado';
                
              const servicioNombre = turno.servicio
                ? turno.servicio.nombre
                : 'Servicio Desconocido';
              
              const duracion = turno.servicio?.duracion_minutos || 'N/A'; // Usando encadenamiento opcional para la duración

              return (
                <ListItem 
                  key={turno.id_turno} 
                  secondaryAction={
                    <Tooltip title="Eliminar Turno">
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(turno.id_turno)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                    </Tooltip>
                  }
                  sx={{ borderBottom: '1px solid #eee', py: 2, bgcolor: 'background.paper' }}
                >
                  <EventIcon color="info" sx={{ mr: 2 }} />
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {clienteNombre} con {barberoNombre}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          Servicio: {servicioNombre} ({duracion} min.)
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Día: {dateStr} a las {timeStr}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Chip 
                    label={turno.estado.toUpperCase()} 
                    color={getStatusColor(turno.estado)} 
                    size="small" 
                    sx={{ ml: 2, minWidth: 90 }} 
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Alert severity="info">
            No hay turnos agendados. ¡Es hora de crear uno!
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default TurnosList;