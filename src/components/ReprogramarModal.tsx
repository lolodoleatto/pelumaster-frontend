import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import type { Turno } from '../types/Turno';
import { reprogramarTurno } from '../api/api';
import UpdateIcon from '@mui/icons-material/Update';

// estilos del modal
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

interface ReprogramarModalProps {
    open: boolean;
    turno: Turno; 
    onClose: () => void;
    onSuccess: () => void; 
}

export default function ReprogramarModal({ open, turno, onClose, onSuccess }: ReprogramarModalProps) {

    // Función para obtener la fecha y hora inicial en formato HTML (YYYY-MM-DD y HH:MM)
    const getInitialDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        return {
            dateStr: localIso.substring(0, 10), // YYYY-MM-DD
            timeStr: localIso.substring(11, 16), // HH:MM
        };
    };

    const initialDateTime = getInitialDateTime(turno.fecha_hora);

    const [newDate, setNewDate] = useState(initialDateTime.dateStr);
    const [newTime, setNewTime] = useState(initialDateTime.timeStr);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const updatedDateTime = getInitialDateTime(turno.fecha_hora);
        setNewDate(updatedDateTime.dateStr);
        setNewTime(updatedDateTime.timeStr);
        setError(null); 
    }, [turno.id_turno, turno.fecha_hora]); 

    const handleSubmit = async () => {
        // Validación básica
        if (!newDate || !newTime) return setError("Debe seleccionar una nueva fecha y hora.");

        setLoading(true);
        setError(null);
        const nuevaFechaHoraISO = `${newDate}T${newTime}:00`; // Formato necesario para NestJS

        try {
            // Llamar a la API de reprogramación
            await reprogramarTurno(turno.id_turno, nuevaFechaHoraISO);

            onSuccess(); // Recarga la lista en el componente padre
        } catch (err: any) {
            // capturamos el mensaje de error de conflicto del backend
            const msg = err.response?.data?.mensaje
                || err.response?.data?.message
                || "Error al reprogramar el turno. Verifique que el horario esté libre.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const barberoNombre = `${turno.barbero.nombre} ${turno.barbero.apellido}`;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h5" component="h2" mb={2}>
                    Reprogramar Turno
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mb={2}>
                    Cliente: **{turno.cliente.nombre}** con **{barberoNombre}**
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Input de Fecha (Pre-cargado) */}
                <TextField
                    label="Nueva Fecha" type="date" fullWidth margin="normal"
                    value={newDate} onChange={(e) => setNewDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />

                {/* Input de Hora (Pre-cargado) */}
                <TextField
                    label="Nueva Hora" type="time" fullWidth margin="normal"
                    value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                    <Button onClick={onClose} variant="outlined" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UpdateIcon />}
                    >
                        Confirmar Reprogramación
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
