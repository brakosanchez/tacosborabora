'use client';

import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import Navbar from '@/components/Navbar';
import Footer from '../components/Footer';
import HealthCheck from '../components/HealthCheck';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { AuthSessionProvider } from '../providers/SessionProvider';
import { AuthProvider } from '../context/AuthContext';

type ThemeMode = 'light' | 'dark' | 'system';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>('system');
  
  // Efecto para cargar la preferencia de tema guardada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
      if (savedMode) {
        setMode(savedMode);
      }
    }
  }, []);

  // Determinar el tema actual basado en la preferencia del usuario
  const theme = useMemo(() => {
    const resolvedMode = mode === 'system' 
      ? (prefersDarkMode ? 'dark' : 'light')
      : mode;
    
    // Guardar la preferencia
    if (typeof window !== 'undefined') {
      if (mode !== 'system') {
        localStorage.setItem('themeMode', mode);
      } else {
        localStorage.removeItem('themeMode');
      }
    }
    
    return resolvedMode === 'dark' ? darkTheme : lightTheme;
  }, [mode, prefersDarkMode]);

  // Función para cambiar el tema
  const toggleTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthSessionProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Navbar toggleTheme={toggleTheme} currentTheme={mode} />
              <HealthCheck />
              <Toaster position="top-right" />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
