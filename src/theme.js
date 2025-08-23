import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  shape: { borderRadius: 12 },
  palette: {
    primary: { main: '#5B6CFF' },
    secondary: { main: '#00BFA6' },
    background: { default: '#f6f7fb' }
  },
  typography: {
    fontFamily: [
      'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'
    ].join(','),
    h6: { fontWeight: 700 }
  }
});
export default theme;
