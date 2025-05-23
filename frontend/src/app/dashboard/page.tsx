'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirección manejada por el useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Bienvenido, {user.full_name}!</h2>
              <p className="text-gray-600">Has iniciado sesión correctamente como <span className="font-medium">{user.email}</span>.</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Último inicio de sesión: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Primer inicio de sesión'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
