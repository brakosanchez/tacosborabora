import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Paleta de colores para el tema claro
const lightPalette = {
  primary: {
    main: '#FCB235', // Amarillo cálido
    light: '#FFC74A',
    dark: '#E69B2C',
    contrastText: '#000000',
  },
  secondary: {
    main: '#EF432E', // Rojo vibrante
    light: '#FF6B56',
    dark: '#C4361C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D04D38', // Rojo quemado
  },
  warning: {
    main: '#F68B31', // Naranja intenso
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
};

// Paleta de colores para el tema oscuro
const darkPalette = {
  primary: {
    main: '#FCB235', // Amarillo cálido
    light: '#FFC74A',
    dark: '#E69B2C',
    contrastText: '#000000',
  },
  secondary: {
    main: '#EF432E', // Rojo vibrante
    light: '#FF6B56',
    dark: '#C4361C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D04D38', // Rojo quemado
  },
  warning: {
    main: '#F68B31', // Naranja intenso
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
  },
};

// Función para crear el tema
export function createCustomTheme(mode: PaletteMode): Theme {
  const isDark = mode === 'dark';

  const theme = createTheme({
    palette: {
      mode,
      ...(isDark ? darkPalette : lightPalette),
    },
    typography: {
      fontFamily: `'Bebas Neue', 'Yeseva One', 'Arial', sans-serif`,
      h1: {
        fontFamily: 'Bebas Neue',
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '1px',
      },
      h2: {
        fontFamily: 'Bebas Neue',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.5px',
      },
      h3: {
        fontFamily: 'Bebas Neue',
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '0.5px',
      },
      h4: {
        fontFamily: 'Bebas Neue',
        fontWeight: 600,
        letterSpacing: '0.5px',
      },
      h5: {
        fontFamily: 'Bebas Neue',
        fontWeight: 500,
        letterSpacing: '0.5px',
      },
      h6: {
        fontFamily: 'Bebas Neue',
        fontWeight: 500,
        letterSpacing: '0.5px',
      },
      body1: {
        fontFamily: 'Bebas Neue',
        fontWeight: 400,
        letterSpacing: '0.5px',
      },
      body2: {
        fontFamily: 'Bebas Neue',
        fontWeight: 400,
        letterSpacing: '0.5px',
      },
      button: {
        fontFamily: 'Bebas Neue',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '12px 24px',
            textTransform: 'uppercase',
            fontWeight: 700,
            '&:hover': {
              boxShadow: '0 4px 15px rgba(252, 178, 53, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDark ? '#444' : '#E0E0E0',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#666' : '#BDBDBD',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FCB235',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#B0B0B0' : '#666666',
            },
            '& .MuiInputBase-input': {
              color: isDark ? '#FFFFFF' : '#333333',
            },
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}

// Crear los temas
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

// Tema por defecto (para compatibilidad)
export const theme = darkTheme;
