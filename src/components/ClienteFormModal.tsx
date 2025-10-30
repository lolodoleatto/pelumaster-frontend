import React, { useState, useEffect } from 'react';
import type { Cliente, CreateClienteDto, UpdateClienteDto } from '../types/Cliente';
import { createCliente, updateCliente } from '../api/api';
import { 
    Modal, Box, TextField, Button, Typography, Alert, CircularProgress, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface ClienteFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cliente: Cliente | null; // Null para CREAR, objeto para EDITAR
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const INITIAL_FORM_DATA = { nombre: '', apellido: '', telefono: '', email: '' };

const ClienteFormModal: React.FC<ClienteFormModalProps> = ({ open, onClose, onSuccess, cliente }) => {
    const isEdit = !!cliente;
    
    const [formData, setFormData] = useState<CreateClienteDto>({
        nombre: '', apellido: '', telefono: '', email: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);


    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setSubmitError(null);
    };

    // Lógica para precargar el formulario en modo EDICIÓN
    useEffect(() => {
        if (cliente) {
            setFormData({
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono: cliente.telefono || '',
                email: cliente.email || '',
            });
        } else {
            // Resetear para modo CREACIÓN
            setFormData(INITIAL_FORM_DATA);
        }
    }, [cliente]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.apellido || !formData.telefono) {
            setSubmitError("Nombre, Apellido y Teléfono son obligatorios.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // 🛑 CORRECCIÓN: Definimos y tipamos la data DENTRO de la lógica condicional 🛑
            if (isEdit && cliente) {
                // Modo EDICIÓN (PATCH)
                const updateData: UpdateClienteDto = {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    telefono: formData.telefono,
                    email: formData.email,
                };
                await updateCliente(cliente.id_cliente, updateData);
            } else {
                // Modo CREACIÓN (POST)
                const createData: CreateClienteDto = {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    telefono: formData.telefono,
                    email: formData.email,
                };
                await createCliente(createData);
                resetForm();    // Limpiar el formulario tras crear un nuevo cliente
            }
            
            onSuccess(); // Cierra el modal y refresca la lista
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Error al guardar el cliente.";
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper component="form" onSubmit={handleSubmit} sx={modalStyle}>
                <Typography variant="h5" mb={3}>
                    {isEdit ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
                </Typography>

                <TextField
                    fullWidth margin="normal" label="Nombre"
                    name="nombre" value={formData.nombre} onChange={handleChange}
                    required disabled={isSubmitting}
                />
                <TextField
                    fullWidth margin="normal" label="Apellido"
                    name="apellido" value={formData.apellido} onChange={handleChange}
                    required disabled={isSubmitting}
                />
                <TextField
                    fullWidth margin="normal" label="Teléfono"
                    name="telefono" value={formData.telefono} onChange={handleChange}
                    required disabled={isSubmitting}
                />
                <TextField
                    fullWidth margin="normal" label="Email (Opcional)"
                    name="email" value={formData.email} onChange={handleChange}
                    type="email" disabled={isSubmitting}
                />

                {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1.5 }}>
                    <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={isSubmitting}
                    >
                        {isEdit ? 'Guardar Cambios' : 'Crear Cliente'}
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ClienteFormModal;