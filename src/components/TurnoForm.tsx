import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { createTurno, getBarberos, getClientes, getServicios, type CreateTurnoDto } from '../api/api';
import type { Barbero } from '../types/Barbero';
import type { Cliente } from '../types/Cliente';
import type { Servicio } from '../types/Servicio';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, // Usaremos Box en lugar de Grid
  CircularProgress, 
  Typography, 
  Alert, 
  type SelectChangeEvent
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface TurnoFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const TurnoForm: React.FC<TurnoFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState<Omit<CreateTurnoDto, 'fecha_hora'> & { date: string, time: string }>({
    clienteId: 0,
    barberoId: 0,
    servicioId: 0,
    date: '',
    time: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Carga de datos
  const { data: barberos, loading: loadingBarberos, error: errorBarberos } = useFetch<Barbero[]>(getBarberos);
  const { data: clientes, loading: loadingClientes, error: errorClientes } = useFetch<Cliente[]>(getClientes);
  const { data: servicios, loading: loadingServicios, error: errorServicios } = useFetch<Servicio[]>(getServicios);

  // 🛑 MANEJADOR DE CAMBIOS CORREGIDO Y UNIFICADO 🛑
  const handleChange = (e: SelectChangeEvent<number> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convertir el valor a number si es un campo de ID, o mantenerlo como string (para date/time)
    const isIdField = name === 'clienteId' || name === 'barberoId' || name === 'servicioId';
    
    // Si es un Select (que devuelve string) o un TextField (que devuelve string), procesamos:
    const processedValue = isIdField ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    
    setSubmitError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.barberoId || !formData.servicioId || !formData.date || !formData.time) {
      setSubmitError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
        const fecha_hora_iso = `${formData.date}T${formData.time}:00`; 
        const turnoData: CreateTurnoDto = {
            clienteId: formData.clienteId,
            barberoId: formData.barberoId,
            servicioId: formData.servicioId,
            fecha_hora: fecha_hora_iso,
        };

        await createTurno(turnoData);
        onSuccess();
        onClose(); 
    } catch (err: any) {
        // 🛑 LÓGICA DE CAPTURA DE ERRORES CORREGIDA 🛑
        const serverResponseData = err.response?.data;

        const message = serverResponseData?.mensaje // 1. Captura tu clave personalizada ('mensaje')
                       || serverResponseData?.message // 2. Captura la clave estándar de NestJS ('message')
                       || err.message // 3. Mensaje genérico de Axios
                       || "Error desconocido al agendar el turno.";
                       
        setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadingData = loadingBarberos || loadingClientes || loadingServicios;
  const errorData = errorBarberos || errorClientes || errorServicios;

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorData) {
    return <Alert severity="error">Error al cargar datos para el formulario: {errorData.message}</Alert>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detalles del Nuevo Turno
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Fila 1: Cliente y Barbero */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <FormControl fullWidth required sx={{ flex: 1 }}>
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              name="clienteId"
              // El valor del state es number, pero Select lo acepta
              value={formData.clienteId} 
              label="Cliente"
              onChange={handleChange} // 🛑 Usando el handler unificado
            >
              <MenuItem value={0} disabled>Selecciona un Cliente</MenuItem> 
              {clientes?.map((c) => (
                <MenuItem key={c.id_cliente} value={c.id_cliente}> 
                  {c.nombre} {c.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth required sx={{ flex: 1 }}>
            <InputLabel id="barbero-label">Barbero</InputLabel>
            <Select
              labelId="barbero-label"
              name="barberoId"
              value={formData.barberoId}
              label="Barbero"
              onChange={handleChange} // 🛑 Usando el handler unificado
            >
              <MenuItem value={0} disabled>Selecciona un Barbero</MenuItem>
              {barberos?.filter(b => b.activo).map((b) => (
                <MenuItem key={b.id_barbero} value={b.id_barbero}>
                  {b.nombre} {b.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Fila 2: Servicio */}
        <FormControl fullWidth required>
          <InputLabel id="servicio-label">Servicio</InputLabel>
          <Select
            labelId="servicio-label"
            name="servicioId"
            value={formData.servicioId}
            label="Servicio"
            onChange={handleChange} // 🛑 Usando el handler unificado
          >
            <MenuItem value={0} disabled>Selecciona un Servicio</MenuItem>
            {servicios?.map((s) => (
              <MenuItem key={s.id_servicio} value={s.id_servicio}>
                {s.nombre} ({s.duracion_minutos} min.) - ${s.precio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Fila 3: Fecha y Hora */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <TextField
            fullWidth
            required
            label="Fecha del Turno"
            type="date"
            name="date"
            value={formData.date}
            // 🛑 El handler es compatible con TextField
            onChange={handleChange} 
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            fullWidth
            required
            label="Hora del Turno"
            type="time"
            name="time"
            value={formData.time}
            // 🛑 El handler es compatible con TextField
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Box>
        
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Agendando...' : 'Agendar Turno'}
        </Button>
      </Box>
    </Box>
  );
};

export default TurnoForm;