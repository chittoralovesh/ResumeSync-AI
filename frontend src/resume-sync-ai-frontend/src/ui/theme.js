import { createTheme } from 'tailwindcss-theming';

const theme = createTheme({
  colors: {
    primary: '#6B5BFF', // Purple
    secondary: '#00BFFF', // Cyan
    accent: '#FF6F61', // Coral
    background: '#1A1A2E', // Dark background
    surface: '#162447', // Darker surface
    error: '#FF3D00', // Error color
    text: {
      primary: '#EAEAEA', // Light text
      secondary: '#B0B0B0', // Secondary text
    },
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Satoshi', 'serif'],
      display: ['Clash Display', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
});

export default theme;