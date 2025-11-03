import React from 'react';
import type { Barbero } from '../types/Barbero';
import { getBarberos, deleteBarbero } from '../api/api'; 
import { useFetch } from '../hooks/useFetch'; 
import { 
    Box, CircularProgress, Alert, List, ListItem, ListItemText, Typography, 
    Paper, Stack, IconButton, Tooltip 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 

interface BarberosListProps {
    onEdit: (barbero: Barbero) => void; 
    onRefresh: () => void; 
}

export default function BarberosList ({ onEdit, onRefresh }: BarberosListProps) {
    // el refetch del hook se usara para Delete.
    const { data: barberos, loading, error, refetch } = useFetch<Barbero[]>(getBarberos);

    // logica para manejar la eliminación
    const handleDelete = async (id: number, nombre: string) => {
        if (window.confirm(`¿Estás seguro de ELIMINAR al barbero ${nombre}? Esta acción es irreversible.`)) {
            try {
                await deleteBarbero(id);
                // usamos el refetch del hook para actualizar la lista de forma reactiva
                refetch(); 
            } catch (e: any) {
                const msg = e.response?.data?.message || e.message || "Error al eliminar el barbero.";
                alert(`No se pudo eliminar: ${msg}`);
            }
        }
    };
    
    const contentStyle = { maxWidth: '1400px', margin: '0 auto', mt: 4 };

    if (loading) {
        return (
            <Box sx={{ ...contentStyle, textAlign: 'center' }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ mt: 2 }}>Cargando barberos...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={contentStyle}>
                <Alert severity="error">Error al cargar los barberos. Detalles: {error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={contentStyle}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Nuestros Barberos
                </Typography>
                
                {barberos && barberos.length > 0 ? (
                    <List>
                        {barberos.map((barbero) => (
                            <ListItem 
                                key={barbero.id_barbero} 
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="Editar">
                                            <IconButton onClick={() => onEdit(barbero)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton 
                                                onClick={() => handleDelete(barbero.id_barbero, barbero.nombre)} 
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                                sx={{ borderBottom: '1px solid #eee', py: 1.5 }}
                            >
                                <PersonIcon color="action" sx={{ mr: 2 }} />
                                <ListItemText
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
        </Box>
    );
};
