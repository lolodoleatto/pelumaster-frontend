import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper, Alert } from '@mui/material';
import type { Turno } from '../types/Turno';

interface CortesPorDiaChartProps {
    turnos: Turno[];
    barberoNombre: string;
}

// SUMA 24 HORAS PARA CORREGIR EL DESFASE
const procesarDatosParaGrafico = (turnos: Turno[]) => {
    const cortesPorDia: { [key: string]: number } = {};

    // Contar cortes por día
    turnos.forEach(turno => {
        if (turno.estado === 'cancelado') {
            return; 
        }
        const fechaOriginal = new Date(turno.fecha_hora);
        
        // sumamos 24 horas (86,400,000 milisegundos) 
        // para compensar el ajuste de zona horaria (UTC medianoche -> Local)
        const fechaCorregida = new Date(fechaOriginal.getTime() + 86400000); 

        const fechaKey = fechaCorregida.toISOString().split('T')[0];
        
        cortesPorDia[fechaKey] = (cortesPorDia[fechaKey] || 0) + 1;
    });

    const fechasOrdenadas = Object.keys(cortesPorDia).sort();

    const dataFinal = {
        fechas: fechasOrdenadas.map(dateStr => new Date(dateStr)), 
        cantidades: fechasOrdenadas.map(fechaKey => cortesPorDia[fechaKey]),
    };

    return dataFinal;
};

export default function CortesPorDiaChart({ turnos, barberoNombre }: CortesPorDiaChartProps) {
    const { fechas, cantidades } = procesarDatosParaGrafico(turnos);

    if (fechas.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Cortes por Día ({barberoNombre})</Typography>
                <Alert severity="info">No hay datos de turnos realizados en el rango seleccionado.</Alert>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Cortes por Día ({barberoNombre})
            </Typography>
            <Box sx={{ height: 350, width: '100%' }}>
                <LineChart
                    series={[{ 
                        data: cantidades, 
                        label: 'Cortes (Realizados)', 
                        area: true, 
                        showMark: true,
                        curve: "linear"
                    }]}
                    
                    // CONFIGURACIÓN DEL EJE X 
                    xAxis={[{
                        data: fechas,
                        scaleType: 'time',
                        // El valueFormatter formatea el Date ya corregido
                        valueFormatter: (date) => date.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
                    }]}
                    
                    yAxis={[{ 
                        label: 'Cantidad de Cortes',
                        min: 0,
                        tickMinStep: 1, 
                    }]}
                    
                    height={300}
                    margin={{ top: 30, right: 30, left: 50, bottom: 40 }}
                />
            </Box>
        </Paper>
    );
};
