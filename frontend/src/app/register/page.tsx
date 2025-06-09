'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    street_address: '',
    neighborhood: '',
    allergies: [],
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateField = (name: string, value: string | string[]) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.includes('@')) {
          error = 'El correo electrónico debe contener @';
        }
        break;
      case 'phone':
        if (value.length !== 10) {
          error = 'El teléfono debe tener 10 dígitos';
        }
        break;
      case 'password':
        if (value.length < 8) {
          error = 'La contraseña debe tener al menos 8 caracteres';
        }
        break;
      case 'confirm_password':
        if (value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
      case 'street_address':
        if (value.length < 5) {
          error = 'La dirección debe tener al menos 5 caracteres';
        }
        break;
      case 'neighborhood':
        if (value.length < 3) {
          error = 'La colonia debe tener al menos 3 caracteres';
        }
        break;
      case 'allergies':
        if (Array.isArray(value) && value.length === 0) {
          error = 'Por favor, selecciona al menos una alergia';
        } else if (Array.isArray(value)) {
          const invalidAllergies = value.filter(allergy => !['cacahuate', 'piña'].includes(allergy));
          if (invalidAllergies.length > 0) {
            error = 'Solo se permiten las alergias: cacahuate, piña';
          }
        }
        break;
      case 'full_name':
        if (value.length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) {
      setError(error);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const validations = {
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirm_password: validateField('confirm_password', formData.confirm_password),
      street_address: validateField('street_address', formData.street_address),
      neighborhood: validateField('neighborhood', formData.neighborhood),
    };

    const validationErrors = Object.values(validations).filter(Boolean);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Verificar que todos los campos requeridos tengan valor
    const requiredFields = ['email', 'full_name', 'phone', 'street_address', 'neighborhood', 'password'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      setError(`Los siguientes campos son requeridos: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      // Validar campos antes de enviar
      const validationErrors = [];
      
      // Validar correo electrónico
      if (!formData.email.includes('@')) {
        validationErrors.push('El correo electrónico debe contener @');
      }
      
      // Validar teléfono (10 dígitos)
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        validationErrors.push('El teléfono debe tener exactamente 10 dígitos');
      }
      
      // Validar contraseña
      if (formData.password.length < 8) {
        validationErrors.push('La contraseña debe tener al menos 8 caracteres');
      }
      
      // Validar dirección
      if (formData.street_address.length < 5) {
        validationErrors.push('La dirección debe tener al menos 5 caracteres');
      }
      
      // Validar colonia
      if (formData.neighborhood.length < 3) {
        validationErrors.push('La colonia debe tener al menos 3 caracteres');
      }
      
      // Validar nombre completo
      if (formData.full_name.length < 2) {
        validationErrors.push('El nombre debe tener al menos 2 caracteres');
      }

      if (validationErrors.length > 0) {
        setError(validationErrors.join('\n'));
        return;
      }

      const dataToSend = {
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        street_address: formData.street_address.trim(),
        neighborhood: formData.neighborhood.trim(),
        allergies: formData.allergies.length > 0 ? formData.allergies : 'ninguna',
        password: formData.password.trim(),
        confirm_password: formData.confirm_password.trim(),
        role: 'customer'
      };

      console.log('Datos a enviar:', dataToSend);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const errorData = await response.text();
          setError(errorData || 'Error al registrar. Por favor, intenta de nuevo.');
          return;
        }

        const data = await response.json();
        setSuccess('¡Registro exitoso!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Error en la petición:', error);
        setError('Error de conexión. Por favor, verifica que el servidor esté funcionando.');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setError('Error de conexión. Por favor, verifica que el servidor esté funcionando.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative" style={{
      backgroundImage: "url('/fondos/fondoelegante6.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      {/* Capa oscura para mejorar legibilidad */}
      <div className="fixed inset-0 -z-10 bg-black/60" />
      <div className="relative">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">Crear Cuenta</h1>
            <p className="text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        
          <Card className="p-8 bg-black/70 backdrop-blur-sm border border-gray-700/50 shadow-2xl text-white">
            {error && (
              <div className="mb-6">
                <Alert type="error" message={error} />
              </div>
            )}
            {success && (
              <div className="mb-6">
                <Alert type="success" message={success} />
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">
                    Nombre completo *
                  </label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                    required
                    className="w-full bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Correo electrónico *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Teléfono *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="1234567890"
                    maxLength={10}
                    required
                    className="w-full bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-300">
                    Colonia *
                  </label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    type="text"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="Ej. Centro"
                    required
                    className="w-full bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="street_address" className="block text-sm font-medium text-gray-300">
                  Dirección completa (Calle, número, referencia) *
                </label>
                <Input
                  id="street_address"
                  name="street_address"
                  type="text"
                  value={formData.street_address}
                  onChange={handleChange}
                  placeholder="Calle, número, piso, departamento, etc."
                  required
                  className="w-full bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Alergias *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['Cacahuate', 'Mariscos', 'Lácteos', 'Gluten'].map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="allergies"
                        value={allergy.toLowerCase()}
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          setFormData(prev => ({
                            ...prev,
                            allergies: checked
                              ? [...prev.allergies, value]
                              : prev.allergies.filter(a => a !== value)
                          }));
                        }}
                        className="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-gray-700"
                      />
                      <span className="text-sm text-gray-300">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Contraseña *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300">
                    Confirmar contraseña *
                  </label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Crear cuenta
                </Button>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black/70 text-gray-400">
                    O regístrate con
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path 
                      fill="currentColor" 
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
