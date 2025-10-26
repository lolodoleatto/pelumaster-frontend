import React, { useState } from 'react';
import type { Turno, EstadoTurno } from '../types/Turno';
import { ESTADOS_TURNO } from '../types/Turno';
// Importamos las funciones de la API
import { getTurnos, deleteTurno, cancelarTurno } from '../api/api';
import { useFetch } from '../hooks/useFetch';
// Importamos el Modal de Reprogramación
import ReprogramarModal from './ReprogramarModal';

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
  Stack // Para agrupar los botones de acción
} from '@mui/material';

// Importamos los íconos
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CancelIcon from '@mui/icons-material/Cancel'; // Para Cancelar
import UpdateIcon from '@mui/icons-material/Update'; // Para Reprogramar


// Función para formatear la fecha_hora
const formatTurnoData = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  const dateStr = date.toLocaleDateString('es-AR');
  const timeStr = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return { dateStr, timeStr };
};

// Función para mapear estado a color MUI
const getStatusColor = (estado: EstadoTurno): 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' => {
  switch (estado) {
    case ESTADOS_TURNO.PENDIENTE:
      return 'warning'; // Naranja
    case ESTADOS_TURNO.REALIZADO:
      return 'success'; // Verde
    case ESTADOS_TURNO.CANCELADO:
      return 'error'; // Rojo
    case ESTADOS_TURNO.EN_PROCESO:
      return 'info'; // Celeste
    default:
      return 'default';
  }
};

const TurnosList: React.FC = () => {
  // 🚀 Uso del hook y obtenemos 'refetch' para recargar
  const { data: turnos, loading, error, refetch } = useFetch<Turno[]>(getTurnos);

  // 🟢 ESTADO PARA MANEJAR EL MODAL DE REPROGRAMACIÓN
  const [reprogramarOpen, setReprogramarOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);

  // --- HANDLERS DE ACCIÓN ---

  const handleDelete = async (id: number) => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres ELIMINAR PERMANENTEMENTE este turno?')) {
      try {
        await deleteTurno(id);
        refetch(); // Recargar la lista
      } catch (e) {
        alert('Error al eliminar el turno.');
        console.error(e);
      }
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres CANCELAR este turno? El horario se liberará.')) {
      try {
        await cancelarTurno(id);
        refetch(); // Recargar la lista
      } catch (e) {
        alert('Error al cancelar el turno.');
        console.error(e);
      }
    }
  };

  // 🟢 FUNCIÓN PARA ABRIR EL MODAL DE REPROGRAMACIÓN
  const openReprogramarModal = (turno: Turno) => {
    setTurnoSeleccionado(turno);
    setReprogramarOpen(true);
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

              // 🛡️ SOLUCIÓN AL ERROR NULL: Verificación de nulidad en las relaciones
              const barberoNombre = turno.barbero
                ? `${turno.barbero.nombre} ${turno.barbero.apellido}`
                : 'Barbero Eliminado/No Asignado';

              const clienteNombre = turno.cliente
                ? `${turno.cliente.nombre} ${turno.cliente.apellido}`
                : 'Cliente Eliminado/No Asignado';

              const servicioNombre = turno.servicio
                ? turno.servicio.nombre
                : 'Servicio Desconocido';

              const duracion = turno.servicio?.duracion_minutos || 'N/A';

              // Lógica para mostrar botones: solo si es PENDIENTE o EN_PROCESO
              const puedeSerModificado = turno.estado === ESTADOS_TURNO.PENDIENTE || turno.estado === ESTADOS_TURNO.EN_PROCESO;

              return (
                <ListItem
                  key={turno.id_turno}
                  secondaryAction={
                    // Stack agrupa los botones
                    <Stack direction="row" spacing={1} alignItems="center">

                      {/* 🛑 CHIP DE ESTADO (Primera posición a la derecha, cerca del texto) 🛑 */}
                      <Chip
                        label={turno.estado.toUpperCase()}
                        color={getStatusColor(turno.estado)}
                        size="small"
                      />

                      {/* 1. Botón de Reprogramar (Visible si puede ser modificado) */}
                      {puedeSerModificado && (
                        <Tooltip title="Reprogramar Turno">
                          <IconButton
                            aria-label="reprogram"
                            color="primary"
                            onClick={() => openReprogramarModal(turno)}
                          >
                            <UpdateIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* 2. Botón de Cancelar (Visible si puede ser modificado) */}
                      {puedeSerModificado && (
                        <Tooltip title="Cancelar Turno">
                          <IconButton aria-label="cancel" onClick={() => handleCancel(turno.id_turno)}>
                            <CancelIcon color="warning" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* 3. Botón de Eliminar (Siempre visible para administradores) */}
                      <Tooltip title="Eliminar (Permanente)">
                        <IconButton aria-label="delete" onClick={() => handleDelete(turno.id_turno)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                  sx={{ borderBottom: '1px solid #eee', py: 2, bgcolor: 'background.paper', paddingRight: '150px' }}
                >
                  <EventIcon color="info" sx={{ mr: 2 }} />
                  <ListItemText
                    // 🛑 AÑADIMOS MAX-WIDTH para evitar que el texto sea demasiado largo
                    sx={{ maxWidth: { xs: '60%', sm: '75%' } }}
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

      {/* 🟢 MODAL DE REPROGRAMACIÓN (Se muestra si hay un turno seleccionado) */}
      {turnoSeleccionado && (
        <ReprogramarModal
          // 🟢 CORRECCIÓN: Usar el ID como key para forzar el reinicio
          key={turnoSeleccionado.id_turno}
          open={reprogramarOpen}
          turno={turnoSeleccionado}
          onClose={() => setReprogramarOpen(false)}
          onSuccess={() => {
            setReprogramarOpen(false);
            refetch(); // Recarga la lista tras el éxito
          }}
        />
      )}
    </Container>
  );
};

export default TurnosList;