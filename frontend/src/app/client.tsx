'use client';

import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { Session } from 'next-auth';

// Importar componentes con carga dinámica
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const HealthCheck = dynamic(() => import('@/components/HealthCheck'), { ssr: false });

// Importar proveedores con carga dinámica
const CartProvider = dynamic(
  () => import('@/context/CartContext').then(mod => mod.CartProvider), 
  { ssr: false }
);

const OrderProvider = dynamic(
  () => import('@/context/OrderContext').then(mod => mod.OrderProvider), 
  { ssr: false }
);

const AuthSessionProvider = dynamic(
  () => import('@/providers/SessionProvider').then(mod => mod.AuthSessionProvider), 
  { ssr: false }
);

const AuthProvider = dynamic(
  () => import('@/context/AuthContext').then(mod => mod.AuthProvider), 
  { ssr: false }
);

type ThemeMode = 'light' | 'dark' | 'system';

interface ClientLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function ClientLayout({ children, session }: ClientLayoutProps) {
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
      <AuthSessionProvider session={session}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar onThemeChange={toggleTheme} currentTheme={mode} />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <Toaster position="bottom-right" />
                <HealthCheck />
              </div>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
