import React, { useState } from 'react';
import BarberosList from '../components/BarberosList';
import BarberoFormModal from '../components/BarberoFormModal'; // 🛑 Importar Modal
import type { Barbero } from '../types/Barbero';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';

const Barberos: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);
    const [listKey, setListKey] = useState(0); // Para forzar la recarga de BarberosList

    const handleOpenCreate = () => {
        setSelectedBarbero(null); // Modo Creación
        setModalOpen(true);
    };

    const handleOpenEdit = (barbero: Barbero) => {
        setSelectedBarbero(barbero); // Modo Edición
        setModalOpen(true);
    };

    const handleSuccess = () => {
        setModalOpen(false);
        setListKey(prev => prev + 1); // Forzar recarga completa de la lista (incluye Delete/Create/Update)
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
                            Administración de Barberos
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenCreate}
                        >
                            Agregar Barbero
                        </Button>
                    </Box>

                    <BarberosList
                        key={listKey}
                        onEdit={handleOpenEdit} // Función para abrir modal en edición
                        onRefresh={handleSuccess} // Función para recargar tras una acción (opcional, pero buena práctica)
                    />
                </Box>

                {/* Modal de Crear/Editar */}
                <BarberoFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handleSuccess}
                    barbero={selectedBarbero}
                />
            </DashboardLayout>

        </>
    );
};

export default Barberos;