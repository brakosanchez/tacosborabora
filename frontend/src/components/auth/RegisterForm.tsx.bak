'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Alert from '@/components/ui/Alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirm_password: z.string().min(1, 'Confirmar contraseña es requerido'),
  full_name: z.string().min(1, 'Nombre completo es requerido'),
  phone: z.string()
    .min(10, 'El teléfono debe tener 10 dígitos')
    .max(10, 'El teléfono debe tener 10 dígitos')
    .regex(/^[0-9]+$/, 'El teléfono solo debe contener números'),
  street_address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  neighborhood: z.string().min(3, 'La colonia debe tener al menos 3 caracteres'),
  allergies: z.array(z.string()).default([]),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { register: authRegister } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      allergies: [],
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const userData = {
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        full_name: data.full_name,
        phone: data.phone,
        street_address: data.street_address,
        neighborhood: data.neighborhood,
        allergies: data.allergies || [],
      };

      await authRegister(userData);
      
      toast.success('¡Registro exitoso! Redirigiendo...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      if (error.response) {
        const { data, status } = error.response;
        
        if (status === 400) {
          setError('Datos de registro inválidos. Por favor, verifica la información.');
        } else if (status === 409) {
          setError('Este correo electrónico ya está registrado.');
        } else if (status === 422) {
          if (data.detail) {
            const errorMessages = Array.isArray(data.detail) 
              ? data.detail.map((err: any) => 
                  typeof err === 'string' 
                    ? err 
                    : err.msg || err.message || JSON.stringify(err)
                )
              : [data.detail];
            
            setError(errorMessages.join('\n'));
          } else {
            setError('Error de validación. Por favor, verifica los datos ingresados.');
          }
        } else {
          setError(`Error del servidor: ${status} ${data.detail || data.message || 'Error desconocido'}`);
        }
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        setError(error.message || 'Error al procesar la solicitud');
      }
      
      toast.error('Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Crear una cuenta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa tus datos para crear una cuenta
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="correo@ejemplo.com"
              disabled={loading}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                type="text"
                {...register('full_name')}
                placeholder="Juan Pérez"
                disabled={loading}
                className="mt-1"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="1234567890"
                disabled={loading}
                className="mt-1"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street_address">Dirección</Label>
              <Input
                id="street_address"
                type="text"
                {...register('street_address')}
                placeholder="Calle y número"
                disabled={loading}
                className="mt-1"
              />
              {errors.street_address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.street_address.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="neighborhood">Colonia</Label>
              <Input
                id="neighborhood"
                type="text"
                {...register('neighborhood')}
                placeholder="Colonia"
                disabled={loading}
                className="mt-1"
              />
              {errors.neighborhood && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                disabled={loading}
                className="mt-1"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales
              </p>
            </div>

            <div>
              <Label htmlFor="confirm_password">Confirmar contraseña</Label>
              <Input
                id="confirm_password"
                type="password"
                {...register('confirm_password')}
                placeholder="••••••••"
                disabled={loading}
                className="mt-1"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="allergies">Alergias (opcional)</Label>
            <Input
              id="allergies"
              type="text"
              {...register('allergies.0')}
              placeholder="Ej: Maní, mariscos, etc."
              disabled={loading}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separa las alergias con comas si son varias
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            'Crear cuenta'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

const registerSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirm_password: z.string().min(1, 'Confirmar contraseña es requerido'),
  full_name: z.string().min(1, 'Nombre completo es requerido'),
  phone: z.string()
    .min(10, 'El teléfono debe tener 10 dígitos')
    .max(10, 'El teléfono debe tener 10 dígitos')
    .regex(/^[0-9]+$/, 'El teléfono solo debe contener números'),
  street_address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  neighborhood: z.string().min(3, 'La colonia debe tener al menos 3 caracteres'),
  allergies: z.array(z.string()).default([]),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { register: authRegister } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      allergies: [],
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    
    try {
      // Preparar los datos para enviar al servidor
      const userData = {
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        full_name: data.full_name,
        phone: data.phone,
        street_address: data.street_address,
        neighborhood: data.neighborhood,
        allergies: data.allergies || [],
      };

      // Usar el método de registro del contexto de autenticación
      await authRegister(userData);
      
      // Mostrar mensaje de éxito
      toast.success('¡Registro exitoso! Redirigiendo...');
      
      // Redirigir al dashboard después de un breve retraso
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error de la API
        const { data, status } = error.response;
        
        if (status === 400) {
          setError('Datos de registro inválidos. Por favor, verifica la información.');
        } else if (status === 409) {
          setError('Este correo electrónico ya está registrado.');
        } else if (status === 422) {
          // Errores de validación del servidor
          if (data.detail) {
            const errorMessages = Array.isArray(data.detail) 
              ? data.detail.map((err: any) => 
                  typeof err === 'string' 
                    ? err 
                    : err.msg || err.message || JSON.stringify(err)
                )
              : [data.detail];
            
            setError(errorMessages.join('\n'));
          } else {
            setError('Error de validación. Por favor, verifica los datos ingresados.');
          }
        } else {
          setError(`Error del servidor: ${status} ${data.detail || data.message || 'Error desconocido'}`);
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        // Error al configurar la solicitud
        setError(error.message || 'Error al procesar la solicitud');
      }
      
      toast.error('Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Crear una cuenta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa tus datos para crear una cuenta
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="correo@ejemplo.com"
              disabled={loading}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                type="text"
                {...register('full_name')}
                placeholder="Juan Pérez"
                disabled={loading}
                className="mt-1"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="1234567890"
                disabled={loading}
                className="mt-1"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street_address">Dirección</Label>
              <Input
                id="street_address"
                type="text"
                {...register('street_address')}
                placeholder="Calle y número"
                disabled={loading}
                className="mt-1"
              />
              {errors.street_address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.street_address.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="neighborhood">Colonia</Label>
              <Input
                id="neighborhood"
                type="text"
                {...register('neighborhood')}
                placeholder="Colonia"
                disabled={loading}
                className="mt-1"
              />
              {errors.neighborhood && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                disabled={loading}
                className="mt-1"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales
              </p>
            </div>

            <div>
              <Label htmlFor="confirm_password">Confirmar contraseña</Label>
              <Input
                id="confirm_password"
                type="password"
                {...register('confirm_password')}
                placeholder="••••••••"
                disabled={loading}
                className="mt-1"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="allergies">Alergias (opcional)</Label>
            <Input
              id="allergies"
              type="text"
              {...register('allergies.0')}
              placeholder="Ej: Maní, mariscos, etc."
              disabled={loading}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separa las alergias con comas si son varias
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            'Crear cuenta'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
