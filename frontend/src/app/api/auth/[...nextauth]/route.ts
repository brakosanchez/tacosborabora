import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`, {
            username: credentials?.email,
            password: credentials?.password,
          });

          if (response.data.access_token) {
            return {
              id: response.data.user_id,
              email: credentials?.email,
              token: response.data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error('Error en el login:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
