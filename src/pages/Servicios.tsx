import React, { useState } from 'react';
import ServiciosList from '../components/ServiciosList';
import ServicioFormModal from '../components/ServicioFormModal'; 
import type { Servicio } from '../types/Servicio';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '@mui/material/styles'; 

export default function Servicios() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
    const [listKey, setListKey] = useState(0); 

    const handleOpenCreate = () => {
        setSelectedServicio(null); 
        setModalOpen(true);
    };

    const handleOpenEdit = (servicio: Servicio) => {
        setSelectedServicio(servicio); 
        setModalOpen(true);
    };

    const handleSuccess = () => {
        setModalOpen(false);
        setListKey(prev => prev + 1); 
    };

    const theme = useTheme();

    return (
        <DashboardLayout title="Gestión de Servicios">

            <Box sx={{ 
                width: '100%', 
                padding: theme.spacing(3),
            }}> 
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        color="primary" 
                    >
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
    );
};
