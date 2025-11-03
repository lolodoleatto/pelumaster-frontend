import React from 'react';
import type { Cliente } from '../types/Cliente';
import { getClientes, deleteCliente } from '../api/api'; 
import { useFetch } from '../hooks/useFetch'; 
import { 
    Box, CircularProgress, Alert, List, ListItem, ListItemText, Typography, 
    Paper, Stack, IconButton, Tooltip 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 

interface ClientesListProps {
    onEdit: (cliente: Cliente) => void; 
    onRefresh: () => void; 
}

export default function ClientesList({ onEdit, onRefresh }: ClientesListProps) {
    const { data: clientes, loading, error, refetch } = useFetch<Cliente[]>(getClientes);

    // Lógica para manejar la eliminación
    const handleDelete = async (id: number, nombre: string) => {
        if (window.confirm(`¿Estás seguro de ELIMINAR al cliente ${nombre}?`)) {
            try {
                await deleteCliente(id);
                onRefresh(); // Forzar la recarga de la lista
            } catch (e: any) {
                const msg = e.response?.data?.message || e.message || "Error al eliminar el cliente.";
                alert(`No se pudo eliminar: ${msg}`);
            }
        }
    };
    
    const contentStyle = { maxWidth: '1400px', margin: '0 auto', mt: 4 };

    if (loading) {
        return (
            <Box sx={{ ...contentStyle, textAlign: 'center' }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ mt: 2 }}>Cargando clientes...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={contentStyle}>
                <Alert severity="error">Error al cargar los clientes. Detalles: {error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={contentStyle}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Clientes Registrados
                </Typography>
                
                {clientes && clientes.length > 0 ? (
                    <List>
                        {clientes.map((cliente) => (
                            <ListItem 
                                key={cliente.id_cliente} 
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="Editar">
                                            <IconButton onClick={() => onEdit(cliente)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton 
                                                onClick={() => handleDelete(cliente.id_cliente, cliente.nombre)} 
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
                                    primary={<Typography variant="h6">{cliente.nombre} {cliente.apellido}</Typography>}
                                    secondary={`Teléfono: ${cliente.telefono || 'N/A'} | Email: ${cliente.email || 'N/A'}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Alert severity="info">No hay clientes registrados en el sistema.</Alert>
                )}
            </Paper>
        </Box>
    );
};
