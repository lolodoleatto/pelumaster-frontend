import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ReportSummaryCard from '../components/ReportSummaryCard';
import { useFetch } from '../hooks/useFetch';
import { getBarberos, getReporteBarbero, type ReporteBarbero } from '../api/api';
import type { Barbero } from '../types/Barbero';
import { type Turno } from '../types/Turno'; // Asegúrate de que esta importación sea correcta

import {
    Container, Paper, Typography, Box, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem, Button, TextField, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';

// Importación de Íconos
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const Reportes: React.FC = () => {
    // 🛑 ESTADOS 🛑
    const [barberoId, setBarberoId] = useState<number>(0);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [reporte, setReporte] = useState<ReporteBarbero | null>(null);
    const [loadingReporte, setLoadingReporte] = useState(false);
    const [errorReporte, setErrorReporte] = useState<string | null>(null);

    // Carga la lista de barberos
    const { data: barberos, loading: loadingBarberos, error: errorBarberos } = useFetch<Barbero[]>(getBarberos);

    const generarReporte = async (e: React.FormEvent) => {
        e.preventDefault();
        if (barberoId === 0) {
            setErrorReporte('Debe seleccionar un barbero.');
            return;
        }

        setLoadingReporte(true);
        setErrorReporte(null);
        setReporte(null);

        try {
            const resultado = await getReporteBarbero(barberoId, fechaDesde, fechaHasta);
            setReporte(resultado);
        } catch (err: any) {
            setErrorReporte('Error al generar el reporte: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingReporte(false);
        }
    };

    const barberoSeleccionado = barberos?.find(b => b.id_barbero === barberoId);

    // ... (Estados de carga y error inicial)

    if (loadingBarberos) {
        return (
            <DashboardLayout title="Reportes y Análisis">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, mt: 8 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>Cargando datos iniciales...</Typography>
                </Box>
            </DashboardLayout>
        );
    }

    if (errorBarberos) {
        return (
            <DashboardLayout title="Reportes y Análisis">
                <Alert severity="error">Error al cargar la lista de barberos.</Alert>
            </DashboardLayout>
        );
    }

    // 🛑 CONTENIDO PRINCIPAL 🛑
    return (
        <DashboardLayout title="Reportes y Análisis">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                {/* 1. SECCIÓN DE FILTROS */}
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Box component="form" onSubmit={generarReporte}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >

                            {/* Selector de Barbero */}
                            <Box sx={{ flex: '0 0 30%' }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="barbero-select-label">Seleccionar Barbero</InputLabel>
                                    <Select
                                        labelId="barbero-select-label"
                                        value={barberoId}
                                        label="Seleccionar Barbero"
                                        onChange={(e) => setBarberoId(Number(e.target.value))}
                                    >
                                        <MenuItem value={0} disabled>Selecciona un Barbero</MenuItem>
                                        {barberos?.map((b) => (
                                            <MenuItem key={b.id_barbero} value={b.id_barbero}>
                                                {b.nombre} {b.apellido}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Filtro Desde */}
                            <Box sx={{ flex: '0 0 25%' }}>
                                <TextField
                                    fullWidth
                                    label="Desde"
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            {/* Filtro Hasta */}
                            <Box sx={{ flex: '0 0 25%' }}>
                                <TextField
                                    fullWidth
                                    label="Hasta"
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            {/* Botón de Generar */}
                            <Box sx={{ flex: '0 0 15%' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={barberoId === 0 || loadingReporte}
                                    sx={{ height: '56px' }}
                                >
                                    {loadingReporte ? <CircularProgress size={24} color="inherit" /> : 'Generar'}
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>

                {/* ================================================== */}
                {/* 2. VISTA DE RESULTADOS */}
                {/* ================================================== */}

                {errorReporte && <Alert severity="error" sx={{ mb: 2 }}>{errorReporte}</Alert>}

                {reporte && (
                    <React.Fragment>
                        {/* 🟢 LÓGICA DE FILTRADO Y CÁLCULO DE MÉTRICAS 🟢 */}

                        {/* 1. Filtrar turnos: Incluye realizado, en proceso, pendiente. EXCLUYE solo 'cancelado' */}
                        {/* Nota: Las variables deben declararse dentro de un bloque de expresión JSX si no están en el alcance superior */}
                        {
                            (() => {
                                const turnosActivos = reporte.turnos.filter((t: Turno) => t.estado !== 'cancelado');

                                const gananciaBruta = turnosActivos.reduce((sum, turno) => {
                                    return sum + (Number(turno.servicio.precio) || 0);
                                }, 0);

                                const turnosRealizadosCount = reporte.turnos.filter((t: Turno) => t.estado === 'realizado').length;

                                return (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 3,
                                            mb: 4
                                        }}
                                    >
                                        {/* Card 1: Total de Turnos (No Cancelados) */}
                                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33% - 16px)' } }}>
                                            <ReportSummaryCard
                                                title="TOTAL DE TURNOS"
                                                metric={turnosActivos.length} // Turnos no cancelados
                                                icon={<EventAvailableIcon />}
                                                color="#03A9F4"
                                                subText={`Turnos realizados: ${turnosRealizadosCount}`}
                                            />
                                        </Box>

                                        {/* Card 2: Valor Bruto (No Cancelados) */}
                                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33% - 16px)' } }}>
                                            <ReportSummaryCard
                                                title="VALOR BRUTO DE TURNOS"
                                                metric={`$${gananciaBruta.toFixed(2)}`} // Ganancia de turnos no cancelados
                                                icon={<AttachMoneyIcon />}
                                                color="#4CAF50"
                                                subText={`Barbero: ${barberoSeleccionado?.nombre || 'N/A'}`}
                                            />
                                        </Box>
                                    </Box>
                                );
                            })()
                        }

                        {/* TABLA DE DETALLE */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Detalle de Turnos
                            </Typography>

                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Servicio</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* 🛑 FILTRADO AQUÍ: SOLO MUESTRA TURNOS NO CANCELADOS EN LA TABLA 🛑 */}
                                        {reporte.turnos
                                            .filter((t: Turno) => t.estado !== 'cancelado')
                                            .map((turno) => (
                                                <TableRow key={turno.id_turno}>
                                                    <TableCell>{new Date(turno.fecha_hora).toLocaleDateString()}</TableCell>
                                                    <TableCell>{turno.cliente.nombre} {turno.cliente.apellido}</TableCell>
                                                    <TableCell>{turno.servicio.nombre}</TableCell>
                                                    <TableCell align="right">${Number(turno.servicio.precio).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        {/* 🛑 LÓGICA DE COLOR CORREGIDA (Usando el patrón completo) 🛑 */}
                                                        <Chip
                                                            label={turno.estado.toUpperCase()}
                                                            size="small"
                                                            // Usamos la lógica completa que mapea los estados
                                                            color={
                                                                turno.estado === 'realizado' ? 'success' :
                                                                    turno.estado === 'cancelado' ? 'error' :
                                                                        turno.estado === 'en proceso' ? 'info' :
                                                                            'warning'
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {reporte.turnos.filter((t: Turno) => t.estado !== 'cancelado').length === 0 && (
                                <Alert severity="info" sx={{ mt: 2 }}>No se encontraron turnos activos en el rango seleccionado.</Alert>
                            )}
                        </Paper>
                    </React.Fragment>
                )}
            </Container>
        </DashboardLayout>
    );
};

export default Reportes;