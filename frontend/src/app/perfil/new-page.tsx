'use client';

import { useSession, signOut, getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';
import Image from 'next/image';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileForm from '@/components/profile/ProfileForm';
import axios from 'axios';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  ordersCount?: number;
  memberSince?: string;
  avatar?: string;
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

export default function Perfil() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Extender el tipo de sesión para incluir la propiedad image
  type ExtendedSession = typeof session & {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken: string;
    };
  };

  const extendedSession = session as ExtendedSession;

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          // Obtener la información extendida del usuario
          const user = session.user as any;
          
          // Simular carga de datos del perfil
          const userProfile: UserProfile = {
            id: user.id || 'user-123',
            name: user.name || 'Usuario',
            email: user.email || '',
            phone: user.phone || '+52 123 456 7890',
            address: user.address || 'Av. Principal #123, Col. Centro, Ciudad de México',
            ordersCount: 3,
            memberSince: 'Enero 2023',
            avatar: user.image || '/default-avatar.png',
          };
          
          // Datos de ejemplo para pedidos
          const mockOrders: Order[] = [
            {
              id: 'ORD-001',
              date: '2023-10-15T14:30:00',
              status: 'completed',
              total: 245.50,
              items: [
                { name: 'Orden de Tacos', quantity: 2, price: 180 },
                { name: 'Refresco', quantity: 1, price: 30 },
                { name: 'Postre', quantity: 1, price: 35.50 },
              ],
            },
            {
              id: 'ORD-002',
              date: '2023-10-10T20:15:00',
              status: 'processing',
              total: 320.00,
              items: [
                { name: 'Orden de Tacos Especial', quantity: 1, price: 250 },
                { name: 'Agua de Jamaica', quantity: 2, price: 70 },
              ],
            },
            {
              id: 'ORD-003',
              date: '2023-10-05T12:45:00',
              status: 'pending',
              total: 150.00,
              items: [
                { name: 'Orden de Tacos', quantity: 1, price: 90 },
                { name: 'Refresco', quantity: 2, price: 60 },
              ],
            },
          ];
          
          setUserData(userProfile);
          setOrders(mockOrders);
          setFormData({
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone || '',
            address: userProfile.address || '',
          });
        } catch (error) {
          console.error('Error al cargar el perfil:', error);
          setError('Error al cargar la información del perfil');
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [status, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Obtener el token de acceso de la sesión
      const session = await getSession();
      const accessToken = (session?.user as any)?.accessToken;

      if (!accessToken) {
        throw new Error('No se encontró el token de acceso');
      }

      // Actualizar el perfil en el backend
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Error al actualizar el perfil');
      }
      
      // Actualizar los datos del usuario localmente
      const updatedUser = {
        ...userData!,
        ...formData,
      };
      
      setUserData(updatedUser);
      
      // Actualizar la sesión con los nuevos datos
      const newSession = {
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
        },
      };

      await update(newSession);
      
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setError('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Cerrar sesión en el backend
      await axios.post('/api/auth/signout');
      
      // Cerrar sesión en NextAuth
      await signOut({ redirect: false });
      
      // Redirigir al inicio
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completado
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            En proceso
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Pendiente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a120b]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a120b]">
        <div className="p-8 max-w-md w-full">
          <h2 className="text-2xl text-yellow-400 mb-4">Acceso denegado</h2>
          <p className="text-yellow-200/60 mb-6">Debes iniciar sesión para ver tu perfil</p>
          <div className="flex flex-col space-y-4">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#1a120b]">
                Iniciar sesión
              </Button>
            </Link>
            <p className="text-sm text-yellow-200/60">
              ¿No tienes una cuenta?{' '}
              <Link href="/registro" className="text-yellow-400 hover:text-yellow-300">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a120b]">
        <div className="p-8 max-w-md w-full text-center">
          <p className="text-yellow-200">No se pudo cargar la información del perfil.</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostramos el perfil
  return (
    <div className="relative min-h-screen bg-[#1a120b]">
      {/* Espacio para el navbar */}
      <div className="h-20"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Barra lateral */}
          <div className="w-full lg:w-56">
            <div className="sticky top-28">
              <ProfileSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onSignOut={handleSignOut} 
              />
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert type="error" message={error} onClose={() => setError('')} />
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert type="success" message={success} onClose={() => setSuccess('')} />
              </motion.div>
            )}
            
            {activeTab === 'profile' && userData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1a120b] rounded-lg overflow-hidden border border-yellow-500/10"
              >
                <ProfileForm
                  userData={userData}
                  formData={formData}
                  isEditing={isEditing}
                  isLoading={isLoading}
                  onEdit={() => setIsEditing(true)}
                  onCancel={() => {
                    setIsEditing(false);
                    // Restaurar los datos originales
                    setFormData({
                      name: userData.name,
                      email: userData.email,
                      phone: userData.phone || '',
                      address: userData.address || '',
                    });
                  }}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                />
              </motion.div>
            )}
            
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1a120b] rounded-lg overflow-hidden border border-yellow-500/10"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-yellow-400 mb-6">Mis Pedidos</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-yellow-200/80">No hay pedidos recientes.</p>
                      <Link href="/menu" className="mt-4 inline-block">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-[#1a120b] mt-4">
                          Ver Menú
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border-b border-yellow-500/10 pb-6 last:border-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-yellow-400">Pedido #{order.id}</h3>
                              <p className="text-sm text-yellow-200/60">
                                {new Date(order.date).toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-yellow-200/80">
                                  {item.quantity} × {item.name}
                                </span>
                                <span className="text-yellow-400">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-yellow-500/10">
                            <span className="text-sm font-medium text-yellow-400">Total</span>
                            <span className="text-lg font-semibold text-yellow-400">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1a120b] rounded-lg overflow-hidden border border-yellow-500/10"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-yellow-400">Mis Direcciones</h2>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-[#1a120b]">
                      Agregar dirección
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-yellow-400">Casa</h3>
                          <p className="text-sm text-yellow-200/80 mt-1">
                            {userData.address || 'No se ha proporcionado una dirección'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-yellow-400 hover:text-yellow-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-yellow-500/30 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm text-yellow-200/60">Agrega una nueva dirección de envío</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
