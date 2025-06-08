'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthSessionProvider({ 
  children,
  session
}: { 
  children: React.ReactNode;
  session?: any;
}) {
  const router = useRouter();

  // Forzar actualización de la sesión periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar la sesión cada 5 minutos
      if (typeof window !== 'undefined' && 'updateSession' in window) {
        (window as any).updateSession?.();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NextAuthSessionProvider 
      session={session}
      refetchInterval={5 * 60} // Revalidar la sesión cada 5 minutos
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}

export default AuthSessionProvider;
