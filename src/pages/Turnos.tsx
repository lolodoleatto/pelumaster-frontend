import React, { useState } from 'react';
import TurnosList from '../components/TurnosList';
import TurnoForm from '../components/TurnoForm';
import DashboardLayout from '../components/DashboardLayout';
import { getBarberos, getClientes, getServicios, type TurnoFilters } from '../api/api';
import { useFetch } from '../hooks/useFetch';
import { ESTADOS_TURNO } from '../types/Turno';
import {
    Typography, Button, Box, Modal, Select, MenuItem, FormControl, InputLabel, TextField, type SelectChangeEvent, CircularProgress, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Turnos: React.FC = () => {
    // 🛑 ACCEDEMOS AL TEMA 🛑
    const theme = useTheme(); 
    const [openForm, setOpenForm] = useState(false);
    const [listKey, setListKey] = useState(0);

    const [filters, setFilters] = useState<TurnoFilters>({
        barberoId: 0,
        clienteId: 0,
        servicioId: 0,
        estado: '',
        fecha: '',
    });

    const { data: barberos, loading: loadingBarberos } = useFetch(getBarberos);
    const { data: clientes, loading: loadingClientes } = useFetch(getClientes);
    const { data: servicios, loading: loadingLoadingServicios } = useFetch(getServicios);

    const handleFilterChange = (e: SelectChangeEvent<any> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
        setListKey(prev => prev + 1);
    };

    const handleSuccess = () => {
        setOpenForm(false);
        setListKey(prev => prev + 1);
    };

    if (loadingBarberos || loadingClientes || loadingLoadingServicios) {
        return (
            <DashboardLayout title="Cargando...">
                <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
                    <CircularProgress />
                    <Typography variant="h6" color="text.secondary" mt={2}>Cargando datos iniciales de filtros...</Typography>
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Gestión de Turnos">
            
            <Box sx={{ padding: theme.spacing(3) }}> 
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        color="primary" // Usa el color primario (Celeste) del tema
                    >
                        Turnos Agendados
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenForm(true)}
                    >
                        Agendar Nuevo Turno
                    </Button>
                </Box>

                {/* 🛑 BARRA DE FILTROS 🛑 */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        mb: 4, 
                        flexWrap: 'wrap', 
                        p: 2, 
                        // 🛑 CORRECCIÓN: Usa el color de la paleta para el fondo 🛑
                        // bgcolor: theme.palette.background.paper, 
                        borderRadius: 1 
                    }}
                >
                    {/* Filtro por Barbero */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
                        <InputLabel>Barbero</InputLabel>
                        <Select
                            name="barberoId"
                            value={filters.barberoId || 0}
                            label="Barbero"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={0}>Todos los Barberos</MenuItem>
                            {barberos?.map((b) => (
                                <MenuItem key={b.id_barbero} value={b.id_barbero}>
                                    {b.nombre} {b.apellido}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Filtro por Cliente */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
                        <InputLabel>Cliente</InputLabel>
                        <Select
                            name="clienteId"
                            value={filters.clienteId || 0}
                            label="Cliente"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={0}>Todos los Clientes</MenuItem>
                            {clientes?.map((c) => (
                                <MenuItem key={c.id_cliente} value={c.id_cliente}>
                                    {c.nombre} {c.apellido}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Filtro por Servicio */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
                        <InputLabel>Servicio</InputLabel>
                        <Select
                            name="servicioId"
                            value={filters.servicioId || 0}
                            label="Servicio"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={0}>Todos los Servicios</MenuItem>
                            {servicios?.map((s) => (
                                <MenuItem key={s.id_servicio} value={s.id_servicio}>
                                    {s.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Filtro por Estado */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            name="estado"
                            value={filters.estado || ''}
                            label="Estado"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={''}>Todos los Estados</MenuItem>
                            {/* ESTADOS_TURNO contiene 'pendiente', 'realizado', etc. */}
                            {Object.values(ESTADOS_TURNO).map((estado) => (
                                <MenuItem key={estado} value={estado}>
                                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    {/* Filtro por Fecha */}
                    <TextField
                        sx={{ minWidth: 150, flexGrow: 1 }} 
                        name="fecha"
                        label="Fecha Específica"
                        type="date"
                        value={filters.fecha}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />

                </Box>
                {/* 🛑 FIN BARRA DE FILTROS 🛑 */}

                <TurnosList key={listKey} filters={filters} />

                {/* Modal para el Formulario */}
                <Modal
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    aria-labelledby="modal-title"
                >
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 600 }, 
                        // 🛑 CORRECCIÓN: Usa el color de fondo del Paper/Modal del tema 🛑
                        bgcolor: theme.palette.background.paper, 
                        boxShadow: 24, p: 4, borderRadius: 2
                    }}>
                        <Typography id="modal-title" variant="h5" component="h2" mb={3}>
                            Agendar Nuevo Turno
                        </Typography>
                        <TurnoForm
                            open={openForm} 
                            onSuccess={handleSuccess}
                            onClose={() => setOpenForm(false)}
                        />
                    </Box>
                </Modal>
                
            </Box>
        </DashboardLayout>
    );
};

export default Turnos;