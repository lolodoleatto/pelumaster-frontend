import React, { useState, useCallback } from 'react';
import type { Turno, EstadoTurno } from '../types/Turno';
import { ESTADOS_TURNO } from '../types/Turno';
// Importamos las funciones de la API y el tipo TurnoFilters
import { getTurnos, deleteTurno, cancelarTurno, type TurnoFilters } from '../api/api';
import { useFetch } from '../hooks/useFetch';
// Importamos el Modal de Reprogramación
import ReprogramarModal from './ReprogramarModal';


import {
    // 🛑 Reemplazamos Container por Box para control de ancho
    Box, 
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


interface TurnosListProps {
    filters: TurnoFilters; // 🛑 Recibir los filtros como prop
}

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
        // Asumiendo que el tipo EstadoTurno fue ampliado
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

// 🛑 AÑADIMOS 'filters' a las props del componente 🛑
const TurnosList: React.FC<TurnosListProps> = ({ filters }) => { 
    
    // 🛑 USO DEL HOOK MODIFICADO: usamos useCallback para que el fetch dependa de filters 🛑
    const turnosFetcher = useCallback(() => {
        return getTurnos(filters);
    }, [filters]); // El fetcher se actualiza solo cuando los filtros cambian

    const { data: turnos, loading, error, refetch } = useFetch<Turno[]>(turnosFetcher);

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
                // Asumiendo que cancelarTurno(id) llama a un endpoint que actualiza el estado a CANCELADO
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
    
    // Estilo para el contenedor de la lista (sustituye al Container)
    const listContainerStyle = {
        maxWidth: '1400px', // Ancho máximo
        margin: '0 auto',  // Centrado
        mt: 4,             // Margen superior
    };

    // 🔄 Manejo de estados: Cargando
    if (loading) {
        return (
            <Box sx={{ ...listContainerStyle, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Cargando turnos...</Typography>
            </Box>
        );
    }

    // ❌ Manejo de estados: Error
    if (error) {
        return (
            <Box sx={listContainerStyle}>
                <Alert severity="error">
                    Error al cargar los turnos. Detalles: {error.message}
                </Alert>
            </Box>
        );
    }
    
    // ✅ Manejo de estados: Datos cargados
    return (
        // 🛑 Reemplazamos Container por Box 🛑
        <Box sx={listContainerStyle}>
            <Paper elevation={3} sx={{ p: 3 }}>

                <Typography variant="h5" gutterBottom>
                    Lista de Turnos ({turnos?.length || 0})
                </Typography>

                {turnos && turnos.length > 0 ? (
                    <List>
                        {turnos.map((turno) => {
                            const { dateStr, timeStr } = formatTurnoData(turno.fecha_hora);

                            // 🛡️ Verificación de nulidad para la UI
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

                            const puedeSerModificado = turno.estado === ESTADOS_TURNO.PENDIENTE || turno.estado === ESTADOS_TURNO.EN_PROCESO;

                            return (
                                <ListItem
                                    key={turno.id_turno}
                                    secondaryAction={
                                        // Stack agrupa los botones
                                        <Stack direction="row" spacing={1} alignItems="center">

                                            {/* CHIP DE ESTADO */}
                                            <Chip
                                                label={turno.estado.toUpperCase()}
                                                color={getStatusColor(turno.estado)}
                                                size="small"
                                            />

                                            {/* 1. Botón de Reprogramar */}
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

                                            {/* 2. Botón de Cancelar */}
                                            {puedeSerModificado && (
                                                <Tooltip title="Cancelar Turno">
                                                    <IconButton aria-label="cancel" onClick={() => handleCancel(turno.id_turno)}>
                                                        <CancelIcon color="warning" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* 3. Botón de Eliminar */}
                                            <Tooltip title="Eliminar (Permanente)">
                                                <IconButton aria-label="delete" onClick={() => handleDelete(turno.id_turno)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    }
                                    // 🛑 Estilo para hacer espacio para las acciones secundarias 🛑
                                    sx={{ borderBottom: '1px solid #eee', py: 2, bgcolor: 'background.paper', paddingRight: '180px' }}
                                >
                                    <EventIcon color="info" sx={{ mr: 2 }} />
                                    <ListItemText
                                        // Estilo para evitar que el texto empuje las acciones secundarias
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
                        No hay turnos agendados con los filtros actuales.
                    </Alert>
                )}
            </Paper>

            {/* 🟢 MODAL DE REPROGRAMACIÓN (Se muestra si hay un turno seleccionado) */}
            {turnoSeleccionado && (
                <ReprogramarModal
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
        </Box>
    );
};

export default TurnosList;