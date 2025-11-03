import React, { useState } from 'react';
import BarberosList from '../components/BarberosList';
import BarberoFormModal from '../components/BarberoFormModal';
import type { Barbero } from '../types/Barbero';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '@mui/material/styles'; 

export default function Barberos() {
    // ACCEDEMOS AL TEMA 
    const theme = useTheme();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);
    const [listKey, setListKey] = useState(0);

    const handleOpenCreate = () => {
        setSelectedBarbero(null); // modo Creación
        setModalOpen(true);
    };

    const handleOpenEdit = (barbero: Barbero) => {
        setSelectedBarbero(barbero); // modo Edición
        setModalOpen(true);
    };

    const handleSuccess = () => {
        setModalOpen(false);
        setListKey(prev => prev + 1); // forzar recarga de la lista
    };

    return (
        <DashboardLayout title="Administración de Barberos">


            <Box sx={{
                padding: theme.spacing(3),
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography
                        variant="h4"
                        component="h1"
                        color="primary" 
                    >
                        Catálogo de Barberos
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
                    onEdit={handleOpenEdit}
                    onRefresh={handleSuccess}
               
                />
            </Box>

            {/* modal de Crear/Editar */}
            <BarberoFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
                barbero={selectedBarbero}
            />
        </DashboardLayout>
    );
};
