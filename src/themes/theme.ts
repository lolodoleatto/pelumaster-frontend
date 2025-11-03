import { createTheme } from '@mui/material/styles';

// definimos el tema personalizado con modo oscuro

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#03A9F4',
      light: '#67daff',
      dark: '#007ac1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9CCC65',
      light: '#cfff95',
      dark: '#6b9b37',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#757575',
    },

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
          backgroundColor: '#1E1E1E',
          color: '#FFFFFF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(3, 169, 244, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(3, 169, 244, 0.15)',
            color: '#03A9F4',
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
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#282828',
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
              backgroundColor: '#282828',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666666',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#03A9F4',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#03A9F4',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-focused': {
            color: '#03A9F4',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
        },
      },
    },
  },
});

export default customTheme;