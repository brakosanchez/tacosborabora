import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function AuthGuard({ children, redirectPath = '/' }: AuthGuardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectPath);
    }
  }, [status, router, redirectPath]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
