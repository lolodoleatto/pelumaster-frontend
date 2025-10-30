import React, { useState } from 'react';
import ClientesList from '../components/ClientesList';
import ClienteFormModal from '../components/ClienteFormModal'; // 🛑 Importar Modal
import type { Cliente } from '../types/Cliente';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';

const Clientes: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [listKey, setListKey] = useState(0); // Para forzar la recarga de ClientesList

    const handleOpenCreate = () => {
        setSelectedCliente(null); // Modo Creación
        setModalOpen(true);
    };

    const handleOpenEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente); // Modo Edición
        setModalOpen(true);
    };

    const handleSuccess = () => {
        setModalOpen(false);
        setListKey(prev => prev + 1); // Forzar recarga de la lista
    };

    return (
        <>
            <DashboardLayout title="Gestión de Servicios">

                <Box sx={{
                    width: '100%',
                    minHeight: 'calc(100vh - 64px)',
                    p: 3,
                    bgcolor: '#f4f6f8'
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" component="h1" sx={{ color: '#4a148c' }}>
                            Administración de Clientes
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

        </>
    );
};

export default Clientes;