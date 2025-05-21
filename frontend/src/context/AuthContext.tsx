import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(status === 'loading');
  }, [status]);

  const login = async (email: string, password: string) => {
    try {
      // Aquí iría la lógica de login
      console.log('Login:', { email, password });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Aquí iría la lógica de logout
      console.log('Logout');
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
