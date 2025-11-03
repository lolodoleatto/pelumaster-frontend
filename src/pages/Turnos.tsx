import React, { useState } from 'react';
import TurnosList from '../components/TurnosList';
import TurnoForm from '../components/TurnoForm';
import DashboardLayout from '../components/DashboardLayout';
import { getBarberos, getClientes, getServicios} from '../api/api';
import { useFetch } from '../hooks/useFetch';
import { ESTADOS_TURNO, type TurnoFilters } from '../types/Turno';
import {
    Typography, Button, Box, Modal, Select, MenuItem, FormControl, InputLabel, TextField, type SelectChangeEvent, CircularProgress, useTheme,
    Autocomplete 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Cliente } from '../types/Cliente'; 

export default function Turnos() {
    const theme = useTheme();
    const [openForm, setOpenForm] = useState(false);
    const [listKey, setListKey] = useState(0); // Para forzar el refetch

    const [filters, setFilters] = useState<TurnoFilters>({
        barberoId: 0,
        clienteId: 0,
        servicioId: 0,
        estado: '',
        fecha: '',
    });

    const { data: barberos, loading: loadingBarberos } = useFetch(getBarberos);
    const { data: clientes, loading: loadingClientes } = useFetch(getClientes);
    const { data: servicios, loading: loadingServicios } = useFetch(getServicios);

    const handleFilterChange = (e: SelectChangeEvent<any> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
        setListKey(prev => prev + 1);
    };

    const handleClienteFilterChange = (event: React.SyntheticEvent, value: Cliente | null) => {
        const clienteId = value ? value.id_cliente : 0;
        setFilters(prev => ({
            ...prev,
            clienteId: clienteId,
        }));
        setListKey(prev => prev + 1);
    };

    const handleSuccess = () => {
        setOpenForm(false);
        setListKey(prev => prev + 1); // forzar recarga de la lista tras crear un turno
    };

    // buscar el objeto cliente actualmente seleccionado para autocomplete
    const selectedClienteFilter = clientes?.find(c => c.id_cliente === filters.clienteId) || null;


    if (loadingBarberos || loadingClientes || loadingServicios) {
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


            <Box
                sx={{
                    mt: 2,
                    textAlign: 'center',
                    maxWidth: 900,
                    mx: 'auto' // Centra el contenido en pantallas grandes
                }}
            >
                <Typography variant="h2" component="h1" gutterBottom color="primary">
                    Bienvenido a PeluMaster
                </Typography>
                <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
                    Tu sistema integral para la gestión de turnos y barberos.
                </Typography>
            </Box>

            <Box sx={{ padding: theme.spacing(3) }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography
                        variant="h4"
                        component="h1"
                        color="primary"
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

                {/*  BARRA DE FILTROS  */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 4,
                        flexWrap: 'wrap',
                        p: 2,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 1
                    }}
                >
                    {/* Filtro por Barbero (SELECT) */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }} size="small">
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

                    {/* Filtro por Cliente (AUTOCMPLETE) */}
                    <Box sx={{ minWidth: 150, flexGrow: 1 }}>
                        <Autocomplete
                            options={clientes || []}
                            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
                            value={selectedClienteFilter}
                            onChange={handleClienteFilterChange}
                            isOptionEqualToValue={(option, value) => option.id_cliente === value.id_cliente}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Buscar Cliente"
                                    size="small" 
                                />
                            )}
                            clearText="Limpiar"
                            selectOnFocus
                        />
                    </Box>

                    {/* Filtro por Servicio (SELECT) */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }} size="small"> 
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

                    {/* Filtro por Estado (SELECT) */}
                    <FormControl sx={{ minWidth: 150, flexGrow: 1 }} size="small"> 
                        <InputLabel>Estado</InputLabel>
                        <Select
                            name="estado"
                            value={filters.estado || ''}
                            label="Estado"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={''}>Todos los Estados</MenuItem>
                            {Object.values(ESTADOS_TURNO).map((estado) => (
                                <MenuItem key={estado} value={estado}>
                                    {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Filtro por Fecha (TEXTFIELD) */}
                    <TextField
                        sx={{ minWidth: 150, flexGrow: 1 }}
                        name="fecha"
                        label="Fecha Específica"
                        type="date"
                        value={filters.fecha}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        size="small" 
                    />

                </Box>
                {/* FIN BARRA DE FILTROS */}

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
                        bgcolor: theme.palette.background.paper,
                        boxShadow: 24, p: 4, borderRadius: 2
                    }}>
                        <Typography id="modal-title" variant="h5" component="h2" mb={3}>
                            Agendar Nuevo Turno
                        </Typography>
                        <TurnoForm
                            onSuccess={handleSuccess}
                            onClose={() => setOpenForm(false)}
                        />
                    </Box>
                </Modal>

            </Box>
        </DashboardLayout>
    );
};
