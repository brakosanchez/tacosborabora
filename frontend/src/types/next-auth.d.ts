import 'next-auth';

declare module 'next-auth' {
  /**
   * Extiende la interfaz de usuario de NextAuth
   */
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    accessToken: string;
  }

  /**
   * Extiende la interfaz de sesión de NextAuth
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      accessToken: string;
    };
    expires: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extiende la interfaz de JWT de NextAuth
   */
  interface JWT {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
