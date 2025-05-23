'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Configuración global de axios
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.16:8000';
// Aseguramos que la URL base termine con /api
let normalizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
if (!normalizedBaseURL.endsWith('/api')) {
  normalizedBaseURL = `${normalizedBaseURL}/api`;
}

// Configuración global de Axios
axios.defaults.withCredentials = true;
console.log('API Base URL:', normalizedBaseURL); // Para depuración

const api = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Solo agregar el token si no es la solicitud de login
      if (!config.url?.includes('/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado, redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Si el error es 401 y no es una solicitud de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh-token', 
            new URLSearchParams({ refresh_token: refreshToken }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          const { access_token } = response.data;
          
          // Actualizar el token en localStorage
          localStorage.setItem('token', access_token);
          
          // Actualizar el header de autorización
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Reintentar la solicitud original
          return api(originalRequest);
        }
      } catch (error) {
        // Si hay un error al refrescar el token, cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Tipos
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    street_address: string;
    neighborhood: string;
    allergies: string[];
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Función para cargar el usuario desde el token
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar el usuario al montar el componente
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Crear los parámetros de la solicitud
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      // Configuración de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        withCredentials: true
      };
      
      // Realizar la solicitud directamente con axios en lugar de la instancia api
      // para evitar que el interceptor agregue el token de autorización
      console.log('Enviando solicitud de inicio de sesión...');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.16:8000'}/api/auth/login`,
        params.toString(),
        config
      );
      
      console.log('Respuesta del servidor:', response);
      console.log('Datos de la respuesta:', response.data);

      if (response.data && response.data.access_token) {
        const { access_token, user } = response.data;
        console.log('Token recibido:', access_token);
        console.log('Usuario recibido:', user);
        
        // Guardar el token y el usuario
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Establecer el token en el encabezado de autorización para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Establecer el usuario en el estado
        setUser(user);
        
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        throw new Error('No se recibió un token de acceso válido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error instanceof AxiosError) {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Error de respuesta:', error.response.data);
          console.error('Estado HTTP:', error.response.status);
          console.error('Encabezados:', error.response.headers);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
        } else {
          // Algo sucedió al configurar la solicitud
          console.error('Error al configurar la solicitud:', error.message);
        }
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Registrar un nuevo usuario
  const register = async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    street_address: string;
    neighborhood: string;
    allergies: string[];
  }) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/register', {
        ...userData,
        confirm_password: userData.password, // Asegurarse de que coincidan las contraseñas
      });

      // Iniciar sesión automáticamente después del registro
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Limpiar el token y la sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);

      // Redirigir al usuario a la página de login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error al refrescar el usuario:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Exportar la instancia de axios para usarla en otros lugares
export { api };
