'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';

export default function Perfil() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Aquí iría la lógica para actualizar el perfil en el backend
      console.log('Actualizar perfil:', formData);
      setSuccess('Perfil actualizado exitosamente');
      setError('');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError('Error al actualizar el perfil');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso denegado</h2>
          <p className="mb-4">Debes iniciar sesión para ver tu perfil</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Información del perfil
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Actualiza tu información personal
            </p>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button type="submit">
                  Guardar cambios
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
