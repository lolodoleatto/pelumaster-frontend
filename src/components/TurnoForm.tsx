import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { createTurno, getBarberos, getClientes, getServicios} from '../api/api';
import type { Barbero } from '../types/Barbero';
import type { Cliente } from '../types/Cliente';
import type { Servicio } from '../types/Servicio';
import type { CreateTurnoDto } from '../types/Turno';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  type SelectChangeEvent,
  Autocomplete
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface TurnoFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function TurnoForm({ onSuccess, onClose }: TurnoFormProps) {
  const [formData, setFormData] = useState<Omit<CreateTurnoDto, 'fecha_hora'> & { date: string, time: string }>({
    clienteId: 0,
    barberoId: 0,
    servicioId: 0,
    date: '',
    time: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // carga de datos con errores tipados (AxiosError | null)
  const { data: barberos, loading: loadingBarberos, error: errorBarberos } = useFetch<Barbero[]>(getBarberos);
  const { data: clientes, loading: loadingClientes, error: errorClientes } = useFetch<Cliente[]>(getClientes);
  const { data: servicios, loading: loadingServicios, error: errorServicios } = useFetch<Servicio[]>(getServicios);

  // --- HANDLERS DE CAMBIO ---
  
  // manejador para Selects y TextFields
  const handleChange = (e: SelectChangeEvent<number> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isIdField = name === 'barberoId' || name === 'servicioId';
    const processedValue = isIdField ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    setSubmitError(null);
  };
  
  // manejador específico para el Autocomplete de Cliente
  const handleClienteChange = (event: React.SyntheticEvent, value: Cliente | null) => {
    const clienteId = value ? value.id_cliente : 0;
    setFormData(prev => ({
      ...prev,
      clienteId: clienteId,
    }));
    setSubmitError(null);
  };
  
  // --- SUBMIT ---

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
        const serverResponseData = err.response?.data;
        const message = serverResponseData?.mensaje || serverResponseData?.message || err.message || "Error desconocido al agendar el turno.";
        setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //  LÓGICA DE CARGA Y ERROR CORREGIDA 
  const loadingData = loadingBarberos || loadingClientes || loadingServicios;
  
  // Chequeamos los errores individualmente 
  const fetchError = errorBarberos || errorClientes || errorServicios;


  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Usamos la variable 'fetchError' para mostrar el error si existe
  if (fetchError) {
    return <Alert severity="error">Error al cargar datos para el formulario: {fetchError.message}</Alert>;
  }

  // --- RENDER ---
  
  const selectedClienteObject = clientes?.find(c => c.id_cliente === formData.clienteId) || null;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detalles del Nuevo Turno
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Fila 1: Cliente (Autocomplete) y Barbero */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          
          {/* COMPONENTE AUTOCMPLETE PARA CLIENTES */}
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={clientes || []}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido} `}
            value={selectedClienteObject}
            onChange={handleClienteChange}
            isOptionEqualToValue={(option, value) => option.id_cliente === value.id_cliente}
            renderInput={(params) => (
              <TextField 
                {...params} 
                required={!formData.clienteId} 
                label="Buscar Cliente" 
              />
            )}
            disabled={loadingClientes}
          />
          
          <FormControl fullWidth required sx={{ flex: 1 }}>
            <InputLabel id="barbero-label">Barbero</InputLabel>
            <Select
              labelId="barbero-label"
              name="barberoId"
              value={formData.barberoId}
              label="Barbero"
              onChange={handleChange}
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
            onChange={handleChange} 
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
