import React, { useState } from 'react';
import ServiciosList from '../components/ServiciosList';
import ServicioFormModal from '../components/ServicioFormModal'; 
import type { Servicio } from '../types/Servicio';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';

const Servicios: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
    const [listKey, setListKey] = useState(0); 

    const handleOpenCreate = () => {
        setSelectedServicio(null); // Modo Creación
        setModalOpen(true);
    };

    const handleOpenEdit = (servicio: Servicio) => {
        setSelectedServicio(servicio); // Modo Edición
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
                        Catálogo de Servicios
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                    >
                        Agregar Servicio
                    </Button>
                </Box>
                
                <ServiciosList 
                    key={listKey}
                    onEdit={handleOpenEdit} 
                    onRefresh={handleSuccess} 
                />
            </Box>
            
            {/* Modal de Crear/Editar */}
            <ServicioFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
                servicio={selectedServicio}
            />
            </DashboardLayout>
        </>
    );
};

export default Servicios;