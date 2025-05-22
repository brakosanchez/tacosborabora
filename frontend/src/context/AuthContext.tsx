'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Configurar axios para incluir el token en todas las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setSession(data);
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`,
        new URLSearchParams({
          grant_type: 'password',
          username: email,
          password: password
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Guardar el token y el usuario
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Actualizar el estado con toda la información del usuario
      setSession(response.data.user);

      // Redirigir al usuario a la página principal
      window.location.href = '/';
    } catch (error) {
      console.error('Error en login:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        }
        throw new Error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
      throw new Error('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  const logout = async () => {
    try {
      // Limpiar el token y la sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setSession(null);

      // Redirigir al usuario a la página de login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading,
        isAuthenticated: !!session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading,
        isAuthenticated: !!session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
