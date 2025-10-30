// src/theme.ts
import { createTheme } from '@mui/material/styles';

// Define tus colores personalizados
// Para el modo oscuro, queremos un fondo oscuro, texto claro y un color primario que resalte.
const customTheme = createTheme({
  palette: {
    mode: 'dark', // 🛑 ESTO ACTIVA EL MODO OSCURO GLOBALMENTE 🛑
    primary: {
      main: '#03A9F4', // Un celeste vibrante para el "good chupete en orto inside"
      light: '#67daff',
      dark: '#007ac1',
      contrastText: '#FFFFFF', // Texto blanco sobre el primario
    },
    secondary: {
      main: '#9CCC65', // Un verde sutil si necesitas un segundo color de acento (opcional)
      light: '#cfff95',
      dark: '#6b9b37',
      contrastText: '#000000', // Texto oscuro sobre el secundario
    },
    background: {
      default: '#121212', // Negro muy oscuro
      paper: '#1E1E1E', // Un gris oscuro ligeramente más claro para tarjetas y paneles
    },
    text: {
      primary: '#FFFFFF', // Texto principal blanco
      secondary: '#B0B0B0', // Texto secundario gris claro
      disabled: '#757575',
    },
    // Opcional: Personaliza otros colores como el error, warning, info, success
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFC107',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.75rem' },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1rem' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E', // Un poco más claro que el fondo para la barra superior
          color: '#FFFFFF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E', // Color del fondo del sidebar
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          color: '#B0B0B0', // Color del texto de la lista del sidebar
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(3, 169, 244, 0.08)', // Ligero celeste al pasar el mouse
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(3, 169, 244, 0.15)', // Celeste sutil para el seleccionado
            color: '#03A9F4', // Color del texto del elemento seleccionado
            '&:hover': {
              backgroundColor: 'rgba(3, 169, 244, 0.15)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E', // Color de fondo para tarjetas y paneles
          backgroundImage: 'none', // Asegura que no haya un gradiente blanco por defecto en dark mode
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#282828', // Color de fondo para la cabecera de la tabla
          '& .MuiTableCell-root': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            backgroundColor: '#1E1E1E',
            '&:hover': {
              backgroundColor: '#282828', // Un gris ligeramente más claro al pasar el mouse
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#FFFFFF', // Color del texto de las celdas
          borderBottom: '1px solid #333333', // Borde más oscuro para las celdas
        },
      },
    },
    MuiInputBase: { // Inputs de texto, selects
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666666', // Borde gris claro para inputs
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#03A9F4', // Borde celeste al pasar el mouse
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#03A9F4', // Borde celeste cuando está enfocado
          },
        },
      },
    },
    MuiInputLabel: { // Labels de inputs
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-focused': {
            color: '#03A9F4', // Celeste cuando está enfocado
          },
        },
      },
    },
    MuiSvgIcon: { // Íconos
      styleOverrides: {
        root: {
          color: '#B0B0B0', // Color de los íconos
        },
      },
    },
  },
});

export default customTheme;