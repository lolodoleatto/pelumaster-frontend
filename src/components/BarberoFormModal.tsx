import React, { useState, useEffect } from 'react';
import type { Barbero, CreateBarberoDto, UpdateBarberoDto } from '../types/Barbero';
import { createBarbero, updateBarbero } from '../api/api';
import { 
    Modal, Box, TextField, Button, Typography, Alert, CircularProgress, 
    Switch, FormControlLabel, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface BarberoFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    barbero: Barbero | null; // Null para Crear, Objeto para Editar
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

const BarberoFormModal: React.FC<BarberoFormModalProps> = ({ open, onClose, onSuccess, barbero }) => {
    const isEdit = !!barbero;
    
    // 🛑 Usamos un tipo que combina los campos necesarios para el formulario 🛑
    const [formData, setFormData] = useState<CreateBarberoDto & { activo: boolean }>({
        nombre: '', apellido: '', telefono: '', activo: true,
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // 🛑 Lógica para precargar el formulario en modo EDICIÓN 🛑
    useEffect(() => {
        if (barbero) {
            setFormData({
                nombre: barbero.nombre,
                apellido: barbero.apellido,
                telefono: barbero.telefono || '',
                activo: barbero.activo,
            });
        } else {
            // Resetear para modo CREACIÓN
            setFormData({ nombre: '', apellido: '', telefono: '', activo: true });
        }
    }, [barbero]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.apellido) {
            setSubmitError("Nombre y Apellido son obligatorios.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (isEdit && barbero) {
                // Modo EDICIÓN
                const updateDto: UpdateBarberoDto = { ...formData };
                await updateBarbero(barbero.id_barbero, updateDto);
            } else {
                // Modo CREACIÓN
                const createDto: CreateBarberoDto = {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    telefono: formData.telefono,
                };
                await createBarbero(createDto);
            }
            
            onSuccess(); // Cierra el modal y refresca la lista
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Error al guardar el barbero.";
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper component="form" onSubmit={handleSubmit} sx={modalStyle}>
                <Typography variant="h5" mb={3}>
                    {isEdit ? 'Editar Barbero' : 'Agregar Nuevo Barbero'}
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
                    disabled={isSubmitting}
                />

                {isEdit && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.activo}
                                onChange={handleChange}
                                name="activo"
                                disabled={isSubmitting}
                            />
                        }
                        label="Activo"
                        sx={{ mt: 2 }}
                    />
                )}

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
                        {isEdit ? 'Guardar Cambios' : 'Crear Barbero'}
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default BarberoFormModal;