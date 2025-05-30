'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme';

// Importar estilos de fuentes
import '@fontsource/bebas-neue/400.css';
import '@fontsource/yeseva-one/400.css';
import '@fontsource/unbounded/400.css';
import '@fontsource/unbounded/500.css';
import '@fontsource/unbounded/600.css';
import '@fontsource/unbounded/700.css';

export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
