import { createTheme } from '@mui/material/styles';

const rgbToHex = (rgb) => {
  const match = rgb.match(/\d+/g);
  if (!match || match.length !== 3) return rgb;
  const r = parseInt(match[0]).toString(16).padStart(2, '0');
  const g = parseInt(match[1]).toString(16).padStart(2, '0');
  const b = parseInt(match[2]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
};

const coreColors = {
  primary: {
    main: 'rgb(0, 76, 180)',           // #004CB4 - Core primary
    container: 'rgb(0, 99, 229)',     // #0063E5 - Primary container
    onMain: 'rgb(255, 255, 255)',     // #FFFFFF - On primary
    onContainer: 'rgb(231, 236, 255)', // #E7ECFF - On primary container
    fixed: 'rgb(217, 226, 255)',      // #D9E2FF - Primary fixed
    fixedDim: 'rgb(176, 198, 255)',   // #B0C6FF - Primary fixed dim
  },
  
  secondary: {
    main: 'rgb(71, 93, 147)',         // #475D93 - Core secondary
    container: 'rgb(172, 195, 255)', // #ACC3FF - Secondary container
    onMain: 'rgb(255, 255, 255)',    // #FFFFFF - On secondary
    onContainer: 'rgb(56, 79, 132)', // #384F84 - On secondary container
    fixed: 'rgb(217, 226, 255)',     // #D9E2FF - Secondary fixed
    fixedDim: 'rgb(176, 198, 255)',  // #B0C6FF - Secondary fixed dim
  },
  
  tertiary: {
    main: 'rgb(61, 103, 0)',          // #3D6700 - Core tertiary
    container: 'rgb(79, 130, 0)',     // #4F8200 - Tertiary container
    onMain: 'rgb(255, 255, 255)',     // #FFFFFF - On tertiary
    onContainer: 'rgb(249, 255, 234)', // #F9FFEA - On tertiary container
    fixed: 'rgb(182, 245, 108)',      // #B6F56C - Tertiary fixed
    fixedDim: 'rgb(155, 216, 83)',    // #9BD853 - Tertiary fixed dim
  },
  
  error: {
    main: 'rgb(186, 26, 26)',         // #BA1A1A - Core error
    container: 'rgb(255, 218, 214)',  // #FFDAD6 - Error container
    onMain: 'rgb(255, 255, 255)',     // #FFFFFF - On error
    onContainer: 'rgb(147, 0, 10)',   // #93000A - On error container
  },
  
  neutral: {
    background: 'rgb(250, 248, 255)',  // #FAF8FF - Background
    surface: 'rgb(250, 248, 255)',     // #FAF8FF - Surface
    surfaceVariant: 'rgb(222, 226, 243)', // #DEE2F3 - Surface variant
    surfaceDim: 'rgb(216, 217, 228)',  // #D8D9E4 - Surface dim
    surfaceBright: 'rgb(250, 248, 255)', // #FAF8FF - Surface bright
    onBackground: 'rgb(25, 27, 35)',   // #191B23 - On background
    onSurface: 'rgb(25, 27, 35)',      // #191B23 - On surface
    onSurfaceVariant: 'rgb(66, 70, 84)', // #424654 - On surface variant
  },
  
  neutralVariant: {
    outline: 'rgb(114, 119, 134)',        // #727786 - Outline
    outlineVariant: 'rgb(194, 198, 215)', // #C2C6D7 - Outline variant
  },
  
  surfaceContainers: {
    lowest: 'rgb(255, 255, 255)',   // #FFFFFF
    low: 'rgb(242, 243, 254)',      // #F2F3FE
    default: 'rgb(236, 237, 248)',  // #ECEDF8
    high: 'rgb(231, 231, 243)',     // #E7E7F3
    highest: 'rgb(225, 226, 237)',  // #E1E2ED
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    
    primary: {
      main: rgbToHex(coreColors.primary.main),
      light: rgbToHex(coreColors.primary.container),
      dark: 'rgb(0, 50, 123)',
      contrastText: rgbToHex(coreColors.primary.onMain),
    },
    
    secondary: {
      main: rgbToHex(coreColors.secondary.main),
      light: rgbToHex(coreColors.secondary.container),
      dark: rgbToHex(coreColors.secondary.onContainer),
      contrastText: rgbToHex(coreColors.secondary.onMain),
    },
    
    tertiary: {
      main: rgbToHex(coreColors.tertiary.main),
      light: rgbToHex(coreColors.tertiary.container),
      dark: 'rgb(46, 79, 0)', // Daha koyu ton
      contrastText: rgbToHex(coreColors.tertiary.onMain),
    },
    
    error: {
      main: rgbToHex(coreColors.error.main),
      light: rgbToHex(coreColors.error.container),
      dark: rgbToHex(coreColors.error.onContainer),
      contrastText: rgbToHex(coreColors.error.onMain),
    },
    
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    
    success: {
      main: rgbToHex(coreColors.tertiary.main),
      light: rgbToHex(coreColors.tertiary.container),
      dark: 'rgb(46, 79, 0)',
      contrastText: rgbToHex(coreColors.tertiary.onMain),
    },
    
    background: {
      default: rgbToHex(coreColors.neutral.background),
      paper: rgbToHex(coreColors.neutral.surface),
    },
    
    text: {
      primary: rgbToHex(coreColors.neutral.onSurface),
      secondary: rgbToHex(coreColors.neutral.onSurfaceVariant),
    },
    
    divider: rgbToHex(coreColors.neutralVariant.outlineVariant),
    
    md3: {
      surface: {
        variant: rgbToHex(coreColors.neutral.surfaceVariant),
        dim: rgbToHex(coreColors.neutral.surfaceDim),
        bright: rgbToHex(coreColors.neutral.surfaceBright),
        container: {
          lowest: rgbToHex(coreColors.surfaceContainers.lowest),
          low: rgbToHex(coreColors.surfaceContainers.low),
          default: rgbToHex(coreColors.surfaceContainers.default),
          high: rgbToHex(coreColors.surfaceContainers.high),
          highest: rgbToHex(coreColors.surfaceContainers.highest),
        },
      },
      outline: {
        main: rgbToHex(coreColors.neutralVariant.outline),
        variant: rgbToHex(coreColors.neutralVariant.outlineVariant),
      },
      primary: {
        container: rgbToHex(coreColors.primary.container),
        onContainer: rgbToHex(coreColors.primary.onContainer),
        fixed: rgbToHex(coreColors.primary.fixed),
        fixedDim: rgbToHex(coreColors.primary.fixedDim),
      },
      secondary: {
        container: rgbToHex(coreColors.secondary.container),
        onContainer: rgbToHex(coreColors.secondary.onContainer),
        fixed: rgbToHex(coreColors.secondary.fixed),
        fixedDim: rgbToHex(coreColors.secondary.fixedDim),
      },
      tertiary: {
        container: rgbToHex(coreColors.tertiary.container),
        onContainer: rgbToHex(coreColors.tertiary.onContainer),
        fixed: rgbToHex(coreColors.tertiary.fixed),
        fixedDim: rgbToHex(coreColors.tertiary.fixedDim),
      },
      error: {
        container: rgbToHex(coreColors.error.container),
        onContainer: rgbToHex(coreColors.error.onContainer),
      },
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
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: rgbToHex(coreColors.primary.main),
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: rgbToHex(coreColors.neutral.onSurface),
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: rgbToHex(coreColors.neutral.onSurface),
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: rgbToHex(coreColors.neutral.onSurface),
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: rgbToHex(coreColors.neutral.onSurfaceVariant),
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '1rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 76, 180, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 76, 180, 0.4)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: rgbToHex(coreColors.surfaceContainers.default),
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: rgbToHex(coreColors.neutralVariant.outlineVariant),
            },
            '&:hover fieldset': {
              borderColor: rgbToHex(coreColors.neutralVariant.outline),
            },
            '&.Mui-focused fieldset': {
              borderColor: rgbToHex(coreColors.primary.main),
            },
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: rgbToHex(coreColors.neutral.surface),
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: rgbToHex(coreColors.primary.main),
          color: rgbToHex(coreColors.primary.onMain),
        },
      },
    },
  },
  
  spacing: 8,
});

export default theme;
