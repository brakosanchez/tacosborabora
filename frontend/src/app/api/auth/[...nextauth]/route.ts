import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { authConfig } from '@/auth.config';

// Los tipos están definidos en src/types/next-auth.d.ts

const credentialsProvider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      console.error('Faltan credenciales');
      return null;
    }

    try {
      // 1. Obtener token de acceso usando form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const tokenResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
        }
      );

      if (!tokenResponse.data?.access_token) {
        console.error('No se recibió token de acceso:', tokenResponse.data);
        return null;
      }

      const accessToken = tokenResponse.data.access_token;

      // 2. Obtener información del usuario desde la respuesta del login
      const userData = tokenResponse.data.user;

      if (!userData) {
        console.error('No se pudo obtener la información del usuario');
        return null;
      }

      // 3. Retornar objeto de usuario que se incluirá en el token JWT
      const user = {
        id: userData.id?.toString() || 'unknown',
        email: userData.email || credentials.email || '',
        name: userData.full_name || userData.email?.split('@')[0] || 'Usuario',
        accessToken: accessToken,
      } as const;
      
      console.log('Usuario autenticado:', { ...user, accessToken: '***' });
      return user;
    } catch (error) {
      console.error('Error en la autenticación:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de API:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }
      return null;
    }
  },
});

const handler = NextAuth({
  ...authConfig,
  providers: [credentialsProvider],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      console.log('JWT Callback - Token recibido:', { 
        tokenId: token.id, 
        hasAccessToken: !!token.accessToken,
        user: user ? { id: user.id, hasAccessToken: !!(user as any).accessToken } : 'no user' 
      });
      
      // Pasar el token de acceso al token JWT
      if (user) {
        const customUser = user as { id: string; email: string; name: string; accessToken: string };
        token.accessToken = customUser.accessToken;
        token.id = customUser.id;
        token.email = customUser.email;
        token.name = customUser.name;
      }
      
      console.log('JWT Callback - Token actualizado:', { 
        tokenId: token.id, 
        hasAccessToken: !!token.accessToken 
      });
      
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Token recibido:', { 
        tokenId: token.id, 
        hasAccessToken: !!token.accessToken 
      });
      
      // Pasar el token de acceso a la sesión
      if (session.user && token.accessToken) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            email: token.email as string,
            name: token.name as string,
            accessToken: token.accessToken as string
          }
        };
      }
      
      console.log('Session Callback - Sesión actualizada:', { 
        userId: session.user?.id,
        hasAccessToken: !!(session.user as any)?.accessToken 
      });
      
      return session;
    },
  },
  pages: {
    signIn: '/login',  // Ruta personalizada para el login
    error: '/login',   // Ruta para mostrar errores de autenticación
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',  // Usar JWT para la sesión
  },
});

export { handler as GET, handler as POST };

// Los tipos están definidos en src/types/next-auth.d.ts
