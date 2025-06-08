'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';

// Lista de alergias permitidas
const ALLOWED_ALLERGIES = [
  'ninguna', 'gluten', 'lacteos', 'huevo', 'pescado', 'mariscos', 'frutos_secos', 
  'cacahuates', 'soya', 'apio', 'mostaza', 'sesamo', 'sulfitos', 
  'altramuces', 'moluscos', 'cacahuate', 'piña'
];

// Opciones de género
const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
];

interface RegisterFormData {
  full_name: string;
  email: string;
  phone: string;
  street_address: string;
  neighborhood: string;
  allergies: string[];
  gender: string;
  password: string;
  confirm_password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: '',
    email: '',
    phone: '',
    street_address: '',
    neighborhood: '',
    allergies: [], // No default allergies
    gender: 'other', // Default gender
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateField = (name: string, value: any): string => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return `El campo ${name.replace('_', ' ')} es requerido`;
    }
    
    const stringValue = value as string;
    
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
          return 'Por favor ingresa un correo electrónico válido';
        }
        break;
        
      case 'phone':
        if (!/^\d{10}$/.test(stringValue)) {
          return 'El teléfono debe tener 10 dígitos';
        }
        break;
        
      case 'password':
        if (stringValue.length < 8) {
          return 'La contraseña debe tener al menos 8 caracteres';
        }
        break;
        
      case 'confirm_password':
        if (stringValue !== formData.password) {
          return 'Las contraseñas no coinciden';
        }
        break;
        
      case 'allergies':
        if (Array.isArray(value)) {
          for (const allergy of value) {
            if (!ALLOWED_ALLERGIES.includes(allergy)) {
              return `Alergia no válida: ${allergy}`;
            }
          }
        }
        break;
        
      case 'gender':
        if (!['male', 'female', 'other'].includes(stringValue)) {
          return 'Género no válido';
        }
        break;
        
      case 'street_address':
        if (stringValue.length < 5) {
          return 'La dirección debe tener al menos 5 caracteres';
        }
        break;
        
      case 'neighborhood':
        if (stringValue.length < 3) {
          return 'La colonia debe tener al menos 3 caracteres';
        }
        break;
        
      case 'full_name':
        if (stringValue.length < 2) {
          return 'El nombre debe tener al menos 2 caracteres';
        }
        break;
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox' && name === 'allergies') {
      const target = e.target as HTMLInputElement;
      const allergy = target.value;
      const checked = target.checked;
      
      setFormData(prev => {
        let newAllergies = [...prev.allergies];
        
        if (checked) {
          // Si se selecciona una alergia, agregarla si no está ya en la lista
          if (!newAllergies.includes(allergy)) {
            newAllergies.push(allergy);
          }
        } else {
          // Si se deselecciona, quitarla de la lista
          newAllergies = newAllergies.filter(a => a !== allergy);
        }
        
        return { ...prev, allergies: newAllergies };
      });
      return;
    }
    
    // Para otros campos
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    if (error) {
      setError(error);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validar contraseñas coincidan
      if (formData.password !== formData.confirm_password) {
        setError('Las contraseñas no coinciden');
        setIsSubmitting(false);
        return;
      }

      // Validar longitud mínima de contraseña
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        setIsSubmitting(false);
        return;
      }

      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor ingresa un correo electrónico válido');
        setIsSubmitting(false);
        return;
      }

      // Validar formato de teléfono (10 dígitos)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
        setError('Por favor ingresa un número de teléfono válido (10 dígitos)');
        setIsSubmitting(false);
        return;
      }

      // Validar que se haya seleccionado un género
      if (!formData.gender) {
        setError('Por favor selecciona tu género');
        setIsSubmitting(false);
        return;
      }

      // Validar que se haya ingresado un teléfono
      if (!formData.phone.trim()) {
        setError('Por favor ingresa tu número de teléfono');
        setIsSubmitting(false);
        return;
      }

      // Validar que se haya ingresado una dirección
      if (!formData.street_address.trim()) {
        setError('Por favor ingresa tu dirección');
        setIsSubmitting(false);
        return;
      }

      // Validar que se haya ingresado una colonia
      if (!formData.neighborhood.trim()) {
        setError('Por favor ingresa tu colonia');
        setIsSubmitting(false);
        return;
      }
      
      // Validar nombre completo
      if (formData.full_name.length < 2) {
        setError('El nombre debe tener al menos 2 caracteres');
        setIsSubmitting(false);
        return;
      }

      // Preparar los datos para enviar al servidor
      const dataToSend = {
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        street_address: formData.street_address.trim(),
        neighborhood: formData.neighborhood.trim(),
        allergies: formData.allergies && formData.allergies.length > 0 ? formData.allergies : [],
        gender: formData.gender,
        password: formData.password,
        confirm_password: formData.confirm_password,
        role: 'customer' // Rol por defecto para nuevos usuarios
      };
      
      console.log('Datos a enviar al servidor:', JSON.stringify(dataToSend, null, 2));

      // Llamada a la API para registrar al usuario
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      try {
        const response = await fetch(`${apiUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Error en la respuesta del servidor:', responseData);
          if (response.status === 422) {
            // Mostrar errores de validación
            const errorMessages = responseData.detail.map((err: any) => 
              `${err.loc.join('.')}: ${err.msg}`
            ).join('\n');
            throw new Error(`Error de validación:\n${errorMessages}`);
          }
          throw new Error(responseData.detail || 'Error al registrar el usuario');
        }
        
        setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');

        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Error en el registro:', error);
        setError(error instanceof Error ? error.message : 'Ocurrió un error al registrar el usuario');
      } finally {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error en el registro:', err);
      setError(err instanceof Error ? err.message : 'Error al registrar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url(/patternloginregister.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        paddingTop: '80px' // Add space for navbar
      }}
    >
      <div className="max-w-4xl w-full space-y-8 bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-400">Regístrate aquí</h1>
        </div>
        <Card className="p-8">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-300 border-b border-amber-500/30 pb-2">Información personal</h3>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-200">
                    Nombre completo *
                  </label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="mt-1 py-2.5 px-4 text-base"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Correo electrónico *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 py-2.5 px-4 text-base"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
                    Teléfono *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 py-2.5 px-4 text-base"
                    placeholder="5512345678"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-200">
                    Género *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-black/30 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:text-sm rounded-md"
                  >
                    <option value="">Selecciona una opción</option>
                    {GENDER_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-300 border-b border-amber-500/30 pb-2">Dirección</h3>

                <div>
                  <label htmlFor="street_address" className="block text-sm font-medium text-gray-200">
                    Calle y número *
                  </label>
                  <Input
                    id="street_address"
                    name="street_address"
                    type="text"
                    required
                    value={formData.street_address}
                    onChange={handleChange}
                    className="mt-1 py-2.5 px-4 text-base"
                    placeholder="Ej. Av. Principal #123"
                  />
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-200">
                    Colonia *
                  </label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className="mt-1 py-2.5 px-4 text-base"
                    placeholder="Ej. Centro"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Alergias alimentarias (opcional)
                  </label>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 mb-2">
                      Selecciona todas las alergias que tengas. Si no tienes alergias, puedes dejar esta sección sin marcar.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALLOWED_ALLERGIES.filter(a => a !== 'ninguna').map((allergy) => (
                        <div key={allergy} className="flex items-center">
                          <input
                            id={`allergy-${allergy}`}
                            name="allergies"
                            type="checkbox"
                            value={allergy}
                            checked={formData.allergies.includes(allergy)}
                            onChange={handleChange}
                            className="h-4 w-4 text-amber-400 focus:ring-amber-500 border-gray-400 rounded"
                          />
                          <label 
                            htmlFor={`allergy-${allergy}`} 
                            className="ml-2 block text-sm text-gray-200 capitalize"
                          >
                            {allergy.replace(/_/g, ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-amber-300 border-b border-amber-500/30 pb-2 mb-4">Contraseña</h3>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Contraseña *
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 py-2.5 px-4 text-base w-full"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <p className="mt-1 text-xs text-gray-300">
                      La contraseña debe tener al menos 8 caracteres.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-200">
                      Confirmar contraseña *
                    </label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="mt-1 py-2.5 px-4 text-base"
                      placeholder="Vuelve a escribir tu contraseña"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-6 border border-amber-400 rounded-md shadow-sm text-base font-medium text-black bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors duration-200"
                disabled={isSubmitting}
                variant="contained"
              >
                {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/70 text-gray-300">¿Ya tienes una cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/login">
                <Button
                  type="button"
                  variant="outlined"
                  className="w-full flex justify-center py-3 px-6 border border-amber-400 rounded-md shadow-sm text-base font-medium text-amber-100 bg-transparent hover:bg-amber-400/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                >
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
