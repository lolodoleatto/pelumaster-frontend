import React, { useState } from 'react';
import ClientesList from '../components/ClientesList';
import ClienteFormModal from '../components/ClienteFormModal'; 
import type { Cliente } from '../types/Cliente';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '@mui/material/styles'; // Importar useTheme si necesitas el espaciado o colores

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

    // 🛑 ACCEDER AL TEMA (Opcional, pero bueno para el padding) 🛑
    const theme = useTheme();

    return (
        <DashboardLayout title="Administración de Clientes"> 
            
            {/* 🛑 ELIMINAMOS ESTILOS FIJOS (bgcolor, minHeight, width, color) 🛑 */}
            <Box sx={{
                // Usamos el spacing del tema para el padding superior e inferior
                pt: theme.spacing(3), 
                pb: theme.spacing(3), 
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        color="primary" // Usar color primario del tema (celeste)
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
                    // Aquí asumimos que ClientesList usa onEdit y onRefresh 
                    // Si solo usa onEdit, onRefresh no es necesario en el List, solo en el Modal onSuccess
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

export default Clientes;