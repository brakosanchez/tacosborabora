import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const register = async (data: any) => {
    try {
      await authApi.register(data);
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await authApi.googleLogin(token);
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión con Google');
    }
  };

  const facebookLogin = async (token: string) => {
    try {
      const response = await authApi.facebookLogin(token);
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión con Facebook');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return {
    session,
    status,
    login,
    register,
    googleLogin,
    facebookLogin,
    logout,
    error,
  };
}
