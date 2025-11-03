import * as React from 'react';
import { Paper, Box, Typography, CardContent, Card, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icono de ejemplo

interface ReportSummaryCardProps {
  title: string;
  metric: string | number;
  icon: React.ReactNode;
  color: string;
  subText?: string;
}

export default function ReportSummaryCard({ title, metric, icon, color, subText }: ReportSummaryCardProps) {
  return (
    <Card elevation={3} sx={{ minWidth: 275, borderLeft: `5px solid ${color}` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          
          {/* Título y Métrica */}
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {metric}
            </Typography>
          </Box>

          {/* Icono */}
          <IconButton sx={{ color: color, bgcolor: `${color}10`, p: 1 }}>
            {icon}
          </IconButton>
        </Box>
        
        {/* Texto Secundario Opcional */}
        {subText && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <ArrowUpwardIcon sx={{ fontSize: 16, mr: 0.5 }} color="success" />
            <Typography variant="body2" color="text.secondary">
              {subText}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
