'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await auth.login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card variant="primary" className="p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Iniciar Sesión
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Input
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
