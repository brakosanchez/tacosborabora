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
      if (formData.password !== formData.confirm_password) {
        validationErrors.push('Las contraseñas no coinciden');
      }
      
      // Validar dirección
      if (formData.street_address.length < 5) {
        validationErrors.push('La dirección debe tener al menos 5 caracteres');
      }
      
      // Validar alergias
      if (formData.allergies.length === 0) {
        validationErrors.push('Debe seleccionar al menos una alergia o indicar "ninguna"');
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
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crea tu cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert type="error" message={error} />
          )}
          {success && (
            <Alert type="success" message={success} />
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                type="text"
                required
                placeholder="Nombre completo"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="tel"
                required
                placeholder="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="text"
                required
                placeholder="Calle y número"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="text"
                required
                placeholder="Colonia o Fraccionamiento"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
              />
            </div>
            <div>
              <select
                name="allergies"
                multiple
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.allergies}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({
                    ...prev,
                    allergies: selectedOptions
                  }));
                }}
              >
                <option value="cacahuate">Cacahuate</option>
                <option value="piña">Piña</option>
              </select>
            </div>
            <div>
              <Input
                type="email"
                required
                placeholder="Correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                placeholder="Confirmar contraseña"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
