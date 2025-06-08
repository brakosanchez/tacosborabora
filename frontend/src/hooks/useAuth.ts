import { useState, useCallback } from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type UserData = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken: string;
};

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Registrar al usuario en el backend
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Iniciar sesión automáticamente después del registro
      await login(data.email, data.password);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      // Cerrar sesión en el backend si hay un token
      const session = await getSession();
      const accessToken = (session?.user as any)?.accessToken;
      
      if (accessToken) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el backend:', error);
    } finally {
      // Cerrar sesión en NextAuth
      await signOut({ redirect: false });
      router.push('/login');
      router.refresh();
    }
  }, [router]);

  const updateProfile = useCallback(async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      const session = await getSession();
      const accessToken = (session?.user as any)?.accessToken;

      if (!accessToken) {
        throw new Error('No se encontró el token de acceso');
      }

      // Actualizar el perfil en el backend
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Error al actualizar el perfil');
      }

      // Actualizar la sesión con los nuevos datos
      const newSession = {
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
        },
      };

      await update({
        ...newSession,
        user: newSession.user,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [update]);

  return {
    user: session?.user as UserData | null,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
}
