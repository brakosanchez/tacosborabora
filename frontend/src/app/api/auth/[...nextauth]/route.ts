import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { authConfig } from '@/auth.config';

const credentialsProvider = CredentialsProvider({
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
});

// Create a handler with the credentials provider
const handler = NextAuth({
  ...authConfig,
  providers: [credentialsProvider],
});

export { handler as GET, handler as POST };
