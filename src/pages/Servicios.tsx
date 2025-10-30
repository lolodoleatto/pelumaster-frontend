import React, { useState } from 'react';
import ServiciosList from '../components/ServiciosList';
import ServicioFormModal from '../components/ServicioFormModal'; 
import type { Servicio } from '../types/Servicio';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '@mui/material/styles'; // 🛑 Importar useTheme 🛑

const Servicios: React.FC = () => {
    // ... (Tu lógica de estado: modalOpen, selectedServicio, listKey)
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

    // 🛑 ACCEDER AL TEMA PARA EL COLOR DEL FONDO DE LA PÁGINA 🛑
    const theme = useTheme();

    return (
        <DashboardLayout title="Gestión de Servicios">
            {/* 🛑 ELIMINAMOS ESTILOS FIJOS 🛑 */}
            <Box sx={{ 
                width: '100%', 
                // ELIMINADO minHeight, bgcolor, color fijo.
                // Usamos el fondo del componente principal del Layout para el color de fondo de la página.
                padding: theme.spacing(3), // Usar el spacing del tema para el padding
            }}> 
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        // ELIMINAMOS COLOR FIJO, USAMOS EL COLOR PRIMARIO DEL TEMA
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

export default Servicios;