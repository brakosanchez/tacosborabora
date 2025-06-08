'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';
import axios from 'axios';
import { api } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';
import Image from 'next/image';

// Tipos
type Allergy = {
  id: string;
  name: string;
};

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  street_address?: string;
  neighborhood?: string;
  gender?: 'male' | 'female' | 'other';
  allergies?: string[];
  role?: string;
  created_at?: string;
};

type Order = {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  
  // Datos del formulario
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    phone: string;
    street_address: string;
    neighborhood: string;
    gender: 'male' | 'female' | 'other';
    allergies: string[];
  }>({
    full_name: '',
    email: '',
    phone: '',
    street_address: '',
    neighborhood: '',
    gender: 'other',
    allergies: [],
  });

  // Lista de alergias disponibles
  const availableAllergies = [
    { id: 'gluten', name: 'Gluten' },
    { id: 'lacteos', name: 'Lácteos' },
    { id: 'huevo', name: 'Huevo' },
    { id: 'pescado', name: 'Pescado' },
    { id: 'mariscos', name: 'Mariscos' },
    { id: 'frutos_secos', name: 'Frutos secos' },
    { id: 'cacahuates', name: 'Cacahuates' },
    { id: 'soya', name: 'Soya' },
    { id: 'apio', name: 'Apio' },
    { id: 'mostaza', name: 'Mostaza' },
    { id: 'sesamo', name: 'Sésamo' },
    { id: 'sulfitos', name: 'Sulfitos' },
    { id: 'altramuces', name: 'Altramuces' },
    { id: 'moluscos', name: 'Moluscos' },
  ];

  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Estado de autenticación:', status);
      
      if (status === 'authenticated' && session?.user) {
        try {
          console.log('Iniciando carga del perfil...');
          console.log('Datos de la sesión:', {
            user: session.user,
            expires: session.expires,
            accessToken: session.accessToken
          });
          
          setIsLoading(true);
          
          // Obtener el token de la sesión o del localStorage
          const token = session.accessToken || localStorage.getItem('token');
          console.log('Token obtenido:', token ? 'Token presente' : 'No hay token');
          
          if (!token) {
            console.error('No se encontró token de autenticación');
            setAlert({ 
              type: 'error', 
              message: 'No estás autenticado. Por favor, inicia sesión nuevamente.' 
            });
            router.push('/auth/login');
            return;
          }
          
          console.log('Realizando petición a /users/me...');
          const response = await api.get('/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
            withCredentials: true
          });
          
          console.log('Respuesta recibida:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
          });
          
          if (response.status === 200 && response.data) {
            const userData = response.data;
            console.log('Datos del usuario:', userData);
            
            setUserData(userData);
            
            // Actualizar el formulario con los datos del usuario
            setFormData({
              full_name: userData.full_name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              street_address: userData.street_address || '',
              neighborhood: userData.neighborhood || '',
              gender: (userData.gender && ['male', 'female', 'other'].includes(userData.gender) 
                ? userData.gender 
                : 'other') as 'male' | 'female' | 'other',
              allergies: userData.allergies || [],
            });
            
            setAlert({ type: 'success', message: 'Perfil cargado correctamente' });
          } else {
            console.error('Error en la respuesta del servidor:', response);
            setAlert({ 
              type: 'error', 
              message: response.data?.message || 'Error al cargar el perfil. Intenta de nuevo más tarde.' 
            });
          }
          
        } catch (error: any) {
          console.error('Error al cargar el perfil:', error);
          
          let errorMessage = 'Error al cargar el perfil. Intenta de nuevo más tarde.';
          
          if (error.response) {
            // Error de respuesta del servidor
            console.error('Error response:', error.response);
            if (error.response.status === 401) {
              // No autorizado - redirigir a login
              errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
              router.push('/auth/login');
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            }
          } else if (error.request) {
            // La petición se realizó pero no hubo respuesta
            console.error('No se recibió respuesta del servidor:', error.request);
            errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
          } else {
            // Error al configurar la petición
            console.error('Error al configurar la petición:', error.message);
          }
          
          setAlert({ type: 'error', message: errorMessage });
          
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        console.log('Usuario no autenticado, redirigiendo a login...');
        router.push('/auth/login');
      }
    };

    fetchProfile();
  }, [status, session, router]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Asegurarse de que el género sea uno de los valores permitidos
    if (name === 'gender' && !['male', 'female', 'other'].includes(value)) {
      return; // No actualizar si el valor no es válido
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en las alergias
  const handleAllergyChange = (allergyId: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergies: isChecked
        ? [...prev.allergies, allergyId]
        : prev.allergies.filter(id => id !== allergyId)
    }));
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.accessToken) {
      setAlert({ type: 'error', message: 'No estás autenticado' });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await api.put('/users/me', formData, {
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      setUserData(response.data);
      setIsEditing(false);
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });
      
      // Actualizar la sesión si el nombre o email cambiaron
      if (formData.full_name !== session.user.name || formData.email !== session.user.email) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.full_name,
            email: formData.email,
          },
        });
      }
      
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Error al actualizar el perfil. Intenta de nuevo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Cargando tu perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Acceso no autorizado</h2>
            <p className="mt-2 text-gray-300">Debes iniciar sesión para ver esta página.</p>
            <div className="mt-6">
              <Link href="/auth/login">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Mi Cuenta
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Administra tu perfil y preferencias
          </p>
        </div>

        {alert && (
          <div className="mb-8">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
          <div className="px-4 py-5 sm:px-6 bg-gray-800 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-white">
                  Información del Perfil
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-300">
                  Actualiza tu información personal y preferencias.
                </p>
              </div>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <FiEdit2 className="mr-2 h-4 w-4" />
                  Editar perfil
                </Button>
              ) : (
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setIsEditing(false);
                      // Restaurar los datos originales
                      if (userData) {
                        setFormData({
                          full_name: userData.full_name || '',
                          email: userData.email || '',
                          phone: userData.phone || '',
                          street_address: userData.street_address || '',
                          neighborhood: userData.neighborhood || '',
                          gender: userData.gender || 'other',
                          allergies: userData.allergies || [],
                        });
                      }
                    }}
                    disabled={isLoading}
                    className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    {isLoading ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">
                      Nombre completo
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Correo electrónico
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                      Teléfono
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                      Género
                    </label>
                    <div className="mt-1">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => {
                          const value = e.target.value as 'male' | 'female' | 'other';
                          if (['male', 'female', 'other'].includes(value)) {
                            setFormData(prev => ({
                              ...prev,
                              gender: value
                            }));
                          }
                        }}
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-300 bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                      >
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="street_address" className="block text-sm font-medium text-gray-300">
                      Dirección
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="street_address"
                        id="street_address"
                        value={formData.street_address}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-300">
                      Colonia
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="neighborhood"
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Alergias
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableAllergies.map((allergy) => (
                        <div key={allergy.id} className="flex items-center">
                          <input
                            id={`allergy-${allergy.id}`}
                            name="allergies"
                            type="checkbox"
                            checked={formData.allergies.includes(allergy.id)}
                            onChange={(e) => handleAllergyChange(allergy.id, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-orange-500 focus:ring-orange-600"
                          />
                          <label htmlFor={`allergy-${allergy.id}`} className="ml-2 block text-sm text-gray-300">
                            {allergy.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FiUser className="mr-2 h-5 w-5 text-gray-400" />
                      Nombre completo
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.full_name || 'No especificado'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FiMail className="mr-2 h-5 w-5 text-gray-400" />
                      Correo electrónico
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.email || 'No especificado'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FiPhone className="mr-2 h-5 w-5 text-gray-400" />
                      Teléfono
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.phone || 'No especificado'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Género
                    </dt>
                    <dd className="mt-1 text-sm text-gray-200 capitalize">
                      {userData?.gender ? 
                        (userData.gender === 'male' ? 'Masculino' : 
                         userData.gender === 'female' ? 'Femenino' : 'Otro') : 
                        'No especificado'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FiMapPin className="mr-2 h-5 w-5 text-gray-400" />
                      Dirección
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.street_address || 'No especificada'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Colonia
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.neighborhood || 'No especificada'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Alergias
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.allergies && userData.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {userData.allergies.map((allergyId) => {
                            const allergy = availableAllergies.find(a => a.id === allergyId);
                            return (
                              <span 
                                key={allergyId} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900 text-orange-200"
                              >
                                {allergy ? allergy.name : allergyId}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        'Ninguna alergia registrada'
                      )}
                    </dd>
                  </div>
                  {userData?.created_at && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FiCalendar className="mr-2 h-5 w-5 text-gray-400" />
                        Miembro desde
                      </dt>
                      <dd className="mt-1 text-sm text-gray-200">
                        {formatDate(userData.created_at)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Sección de pedidos recientes */}
        <div className="mt-8">
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
            <div className="px-4 py-5 sm:px-6 bg-gray-800 border-b border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                <FiPackage className="mr-2 h-5 w-5 text-orange-500" />
                Mis Pedidos Recientes
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-300 text-center py-8">
                Aún no has realizado ningún pedido. ¡Visita nuestro menú para hacer tu primer pedido!
              </p>
              <div className="mt-6 text-center">
                <Link href="/menu">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Ver Menú
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
