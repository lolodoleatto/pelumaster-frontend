import React, { useState } from 'react';
import ClientesList from '../components/ClientesList';
import ClienteFormModal from '../components/ClienteFormModal'; 
import type { Cliente } from '../types/Cliente';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '@mui/material/styles';

export default function Clientes() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [listKey, setListKey] = useState(0); // para forzar la recarga de ClientesList

    const handleOpenCreate = () => {
        setSelectedCliente(null); // modo Creación
        setModalOpen(true);
    };

    const handleOpenEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente); // modo Edición
        setModalOpen(true);
    };

    const handleSuccess = () => {
        setModalOpen(false);
        setListKey(prev => prev + 1); // forzar recarga de la lista
    };

    const theme = useTheme();

    return (
        <DashboardLayout title="Administración de Clientes"> 
        
            <Box sx={{
                pt: theme.spacing(3), 
                pb: theme.spacing(3), 
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        color="primary"
                    >
                        Catálogo de Clientes
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                    >
                        Agregar Cliente
                    </Button>
                </Box>

                <ClientesList
                    key={listKey}
                    onEdit={handleOpenEdit}
                    onRefresh={handleSuccess}
                />
            </Box>

            {/* Modal de Crear/Editar */}
            <ClienteFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
                cliente={selectedCliente}
            />
        </DashboardLayout>
    );
};
