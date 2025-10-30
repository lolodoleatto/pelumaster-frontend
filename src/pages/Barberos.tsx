import React, { useState } from 'react';
import BarberosList from '../components/BarberosList';
import BarberoFormModal from '../components/BarberoFormModal';
import type { Barbero } from '../types/Barbero';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '@mui/material/styles'; // 🛑 Importamos useTheme para usar el espaciado y colores

const Barberos: React.FC = () => {
    // 🛑 ACCEDEMOS AL TEMA 🛑
    const theme = useTheme();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);
    const [listKey, setListKey] = useState(0);

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
        setListKey(prev => prev + 1); // Forzar recarga de la lista
    };

    return (
        <DashboardLayout title="Administración de Barberos"> {/* 🛑 Título Ajustado 🛑 */}

            {/* 🛑 ELIMINAMOS ESTILOS FIJOS (bgcolor, minHeight) y el Fragment vacío (<> </>) 🛑 */}
            <Box sx={{
                // Usamos el spacing del tema para el padding superior e inferior
                padding: theme.spacing(3),
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography
                        variant="h4"
                        component="h1"
                        color="primary" // Usamos el color primario del tema (Celeste)
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
                // No es necesario onRefresh si usas onEdit, pero lo mantendremos para consistencia
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
    );
};

export default Barberos;