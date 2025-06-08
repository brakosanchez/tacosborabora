import type { AuthOptions } from 'next-auth';

export const authConfig: AuthOptions = {
  providers: [], // Se configuran en el route handler
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Actualizar el token si se actualiza la sesión
      if (trigger === 'update' && session?.user) {
        return { ...token, ...session.user };
      }
      
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          accessToken: token.accessToken as string,
        };
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log('User signed in', message);
    },
    async signOut() {
      console.log('User signed out');
      // Limpiar cualquier dato de sesión personalizado aquí
    },
    async session(message) {
      console.log('Session active', message);
    },
  },
};

// Extender el tipo de sesión para incluir el token de acceso
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
    };
  }
}
