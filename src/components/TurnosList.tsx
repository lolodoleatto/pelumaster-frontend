import React, { useState, useCallback } from 'react';
import type { Turno, EstadoTurno, TurnoFilters } from '../types/Turno';
import { ESTADOS_TURNO } from '../types/Turno';
import { getTurnos, deleteTurno, cancelarTurno } from '../api/api';
import { useFetch } from '../hooks/useFetch';
import ReprogramarModal from './ReprogramarModal';
import {
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
    Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CancelIcon from '@mui/icons-material/Cancel';
import UpdateIcon from '@mui/icons-material/Update';

interface TurnosListProps {
    filters: TurnoFilters;
}

const formatTurnoData = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    const dateStr = date.toLocaleDateString('es-AR');
    const timeStr = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return { dateStr, timeStr };
};


const getStatusColor = (estado: EstadoTurno): 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' => {
    switch (estado) {

        case ESTADOS_TURNO.PENDIENTE:
            return 'warning';
        case ESTADOS_TURNO.REALIZADO:
            return 'success';
        case ESTADOS_TURNO.CANCELADO:
            return 'error';
        case ESTADOS_TURNO.EN_PROCESO:
            return 'info';
        default:
            return 'default';
    }
};

export default function TurnosList({ filters }: TurnosListProps) {

    // usamos useCallback para que el fetch dependa de filters
    const turnosFetcher = useCallback(() => {
        return getTurnos(filters);
    }, [filters]); // El fetcher se actualiza solo cuando los filtros cambian

    const { data: turnos, loading, error, refetch } = useFetch<Turno[]>(turnosFetcher);

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
                refetch();
            } catch (e) {
                alert('Error al cancelar el turno.');
                console.error(e);
            }
        }
    };

    // FUNCIÓN PARA ABRIR EL MODAL DE REPROGRAMACIÓN
    const openReprogramarModal = (turno: Turno) => {
        setTurnoSeleccionado(turno);
        setReprogramarOpen(true);
    };

    // Estilo para el contenedor de la lista
    const listContainerStyle = {
        maxWidth: '1400px', // Ancho máximo
        margin: '0 auto',  // Centrado
        mt: 4,             // Margen superior
    };


    if (loading) {
        return (
            <Box sx={{ ...listContainerStyle, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Cargando turnos...</Typography>
            </Box>
        );
    }


    if (error) {
        return (
            <Box sx={listContainerStyle}>
                <Alert severity="error">
                    Error al cargar los turnos. Detalles: {error.message}
                </Alert>
            </Box>
        );
    }


    return (

        <Box sx={listContainerStyle}>
            <Paper elevation={3} sx={{ p: 3 }}>

                <Typography variant="h5" gutterBottom>
                    Lista de Turnos ({turnos?.length || 0})
                </Typography>

                {turnos && turnos.length > 0 ? (
                    <List>
                        {turnos.map((turno) => {
                            const { dateStr, timeStr } = formatTurnoData(turno.fecha_hora);

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

                                        <Stack direction="row" spacing={1} alignItems="center">


                                            <Chip
                                                label={turno.estado.toUpperCase()}
                                                color={getStatusColor(turno.estado)}
                                                size="small"
                                            />


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
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    Servicio: {servicioNombre} ({duracion} min.)
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Día: {dateStr} a las {timeStr}
                                                </Typography>
                                            </>
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
