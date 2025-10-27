import React, { useState, useEffect } from 'react';
import type { Servicio, CreateServicioDto, UpdateServicioDto } from '../types/Servicio';
import { createServicio, updateServicio } from '../api/api';
import { 
    Modal, Box, TextField, Button, Typography, Alert, CircularProgress, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface ServicioFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    servicio: Servicio | null; // Null para CREAR, objeto para EDITAR
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 }, // Ancho ajustado
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

// Tipo para el estado del formulario (usa string para inputs de number)
type FormState = Omit<CreateServicioDto, 'precio' | 'duracion_minutos'> & { 
    precio: string; 
    duracion_minutos: string; 
    descripcion: string; // Aseguramos que es string
};

const ServicioFormModal: React.FC<ServicioFormModalProps> = ({ open, onClose, onSuccess, servicio }) => {
    const isEdit = !!servicio;
    
    const [formData, setFormData] = useState<FormState>({
        nombre: '', precio: '', duracion_minutos: '', descripcion: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Lógica para precargar el formulario en modo EDICIÓN
    useEffect(() => {
        if (servicio) {
            setFormData({
                nombre: servicio.nombre,
                precio: String(servicio.precio),
                duracion_minutos: String(servicio.duracion_minutos),
                descripcion: servicio.descripcion || '',
            });
        } else {
            setFormData({ nombre: '', precio: '', duracion_minutos: '', descripcion: '' });
        }
    }, [servicio]);


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
        
        if (!formData.nombre || !formData.precio || !formData.duracion_minutos) {
            setSubmitError("Nombre, Precio y Duración son obligatorios.");
            return;
        }
        
        const precioNumber = parseFloat(formData.precio);
        const duracionNumber = parseInt(formData.duracion_minutos, 10);
        
        if (isNaN(precioNumber) || precioNumber <= 0 || isNaN(duracionNumber) || duracionNumber <= 0) {
            setSubmitError("Precio y Duración deben ser números positivos válidos.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const dataToSubmit: CreateServicioDto = {
                nombre: formData.nombre,
                precio: precioNumber,
                duracion_minutos: duracionNumber,
                descripcion: formData.descripcion || undefined,
            };

            if (isEdit && servicio) {
                // Modo EDICIÓN
                await updateServicio(servicio.id_servicio, dataToSubmit);
            } else {
                // Modo CREACIÓN
                await createServicio(dataToSubmit);
            }
            
            onSuccess();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Error al guardar el servicio.";
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper component="form" onSubmit={handleSubmit} sx={modalStyle}>
                <Typography variant="h5" mb={3}>
                    {isEdit ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
                </Typography>

                <TextField
                    fullWidth margin="normal" label="Nombre del Servicio"
                    name="nombre" value={formData.nombre} onChange={handleChange}
                    required disabled={isSubmitting}
                />
                
                {/* 🛑 USAMOS BOX CON FLEXBOX PARA ALINEAR LOS CAMPOS (Duración y Precio) 🛑 */}
                <Box sx={{ display: 'flex', gap: 2, '& > *': { flexGrow: 1 } }}>
                    <TextField
                        // Sin fullWidth aquí para que Box lo maneje
                        margin="normal" label="Duración (minutos)"
                        name="duracion_minutos" value={formData.duracion_minutos} onChange={handleChange}
                        type="number" required disabled={isSubmitting}
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                    <TextField
                        margin="normal" label="Precio ($)"
                        name="precio" value={formData.precio} onChange={handleChange}
                        type="number" required disabled={isSubmitting}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    />
                </Box>
                
                <TextField
                    fullWidth margin="normal" label="Descripción (Opcional)"
                    name="descripcion" value={formData.descripcion} onChange={handleChange}
                    multiline rows={2} disabled={isSubmitting}
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
                        {isEdit ? 'Guardar Cambios' : 'Crear Servicio'}
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ServicioFormModal;