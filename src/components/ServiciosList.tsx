import React from 'react';
import type { Servicio } from '../types/Servicio';
import { getServicios, deleteServicio } from '../api/api';
import { useFetch } from '../hooks/useFetch';
import {
    Box, CircularProgress, Alert, List, ListItem, ListItemText, Typography,
    Paper, Stack, IconButton, Tooltip
} from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ServiciosListProps {
    onEdit: (servicio: Servicio) => void;
    onRefresh: () => void;
}

export default function ServiciosList({ onEdit, onRefresh }: ServiciosListProps) {
    const { data: servicios, loading, error, refetch } = useFetch<Servicio[]>(getServicios);

    // Lógica para manejar la eliminación
    const handleDelete = async (id: number, nombre: string) => {
        if (window.confirm(`¿Estás seguro de ELIMINAR el servicio "${nombre}"? Esta acción es irreversible.`)) {
            try {
                await deleteServicio(id);
                onRefresh();
            } catch (e: any) {
                const msg = e.response?.data?.message || e.message || "Error al eliminar el servicio.";
                alert(`No se pudo eliminar: ${msg}`);
            }
        }
    };

    const contentStyle = { maxWidth: '1400px', margin: '0 auto', mt: 4 };

    if (loading) {
        return (
            <Box sx={{ ...contentStyle, textAlign: 'center' }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ mt: 2 }}>Cargando servicios...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={contentStyle}>
                <Alert severity="error">Error al cargar los servicios. Detalles: {error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={contentStyle}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Catálogo de Servicios
                </Typography>

                {servicios && servicios.length > 0 ? (
                    <List>
                        {servicios.map((servicio) => (
                            <ListItem
                                key={servicio.id_servicio}
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="Editar">
                                            <IconButton onClick={() => onEdit(servicio)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                onClick={() => handleDelete(servicio.id_servicio, servicio.nombre)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                                sx={{ borderBottom: '1px solid #eee', py: 1.5 }}
                            >
                                <ContentCutIcon color="action" sx={{ mr: 2 }} />
                                <ListItemText
                                    primary={<Typography variant="h6">{servicio.nombre}</Typography>}
                                    secondary={
                                        
                                        `Precio: $${parseFloat(String(servicio.precio)).toFixed(2)} | Duración: ${servicio.duracion_minutos} min | Descripción: ${servicio.descripcion || 'N/A'}`
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Alert severity="info">No hay servicios registrados en el catálogo.</Alert>
                )}
            </Paper>
        </Box>
    );
};
