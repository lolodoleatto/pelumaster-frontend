import React, { useState, useCallback } from 'react';
import TurnosList from '../components/TurnosList';
import TurnoForm from '../components/TurnoForm';
import DashboardLayout from '../components/DashboardLayout';
import { getBarberos, getClientes, getServicios, type TurnoFilters } from '../api/api';
import { useFetch } from '../hooks/useFetch';
import { ESTADOS_TURNO } from '../types/Turno';
import {
    Container, Typography, Button, Box, Modal, Select, MenuItem, FormControl, InputLabel, TextField, type SelectChangeEvent, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Turnos: React.FC = () => {
    const [openForm, setOpenForm] = useState(false);
    const [listKey, setListKey] = useState(0);

    // 🛑 ESTADO DE LOS FILTROS 🛑
    const [filters, setFilters] = useState<TurnoFilters>({
        barberoId: 0,
        clienteId: 0,
        servicioId: 0,
        estado: '',
        fecha: '',
    });

    // Cargar listas para los Selects (Barberos, Clientes, Servicios)
    const { data: barberos, loading: loadingBarberos } = useFetch(getBarberos);
    const { data: clientes, loading: loadingClientes } = useFetch(getClientes);
    const { data: servicios, loading: loadingServicios } = useFetch(getServicios);

    // Manejador genérico de filtros
    const handleFilterChange = (e: SelectChangeEvent<any> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
        // Forzar recarga de la lista
        setListKey(prev => prev + 1);
    };

    const handleSuccess = () => {
        setOpenForm(false);
        setListKey(prev => prev + 1); // Forzar recarga de la lista
    };

    if (loadingBarberos || loadingClientes || loadingServicios) {
        return (
            <>
                <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
            </>
        );
    }

    return (
        <>
            <DashboardLayout title="Gestión de Turnos">


                <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', p: 3, bgcolor: '#f4f6f8' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" component="h1" sx={{ color: '#4a148c' }}>
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
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', bgcolor: 'white', p: 2, borderRadius: 1 }}>

                        {/* Filtro por Barbero */}
                        <FormControl sx={{ minWidth: 150 }}>
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
                        <FormControl sx={{ minWidth: 150 }}>
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
                        <FormControl sx={{ minWidth: 150 }}>
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
                        <FormControl sx={{ minWidth: 150 }}>
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
                                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Filtro por Fecha */}
                        <TextField
                            name="fecha"
                            label="Fecha Específica"
                            type="date"
                            value={filters.fecha}
                            onChange={handleFilterChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 180 }}
                        />

                    </Box>
                    {/* 🛑 FIN BARRA DE FILTROS 🛑 */}

                    {/* Lista de Turnos: Pasamos los filtros y la clave para forzar la recarga */}
                    <TurnosList key={listKey} filters={filters} />

                    {/* Modal para el Formulario */}
                    <Modal
                        open={openForm}
                        onClose={() => setOpenForm(false)}
                        aria-labelledby="modal-title"
                    >
                        <Box sx={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', md: 600 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
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
        </>
    );
};

export default Turnos;