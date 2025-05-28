'use client';

import { useOrder } from '@/context/OrderContext';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { CustomerInfo } from '@/types/order';

interface CustomerInfoFormProps {
  onNext: () => void;
}

export default function CustomerInfoForm({ onNext }: CustomerInfoFormProps) {
  const { state, setCustomerInfo } = useOrder();
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerInfo>({
    defaultValues: state.customerInfo
  });

  const onSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-orange-500/20">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Información de contacto</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            id="nombre"
            {...register('nombre', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Tu nombre completo"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            {...register('telefono', { 
              required: 'Este campo es obligatorio',
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: 'Ingresa un número de teléfono válido'
              }
            })}
            className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="55 1234 5678"
          />
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-400">{errors.telefono.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Correo electrónico (opcional)
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        {state.serviceType === 'delivery' && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium text-orange-400 mb-4">Dirección de entrega</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="calle" className="block text-sm font-medium text-gray-300 mb-1">
                  Calle y número *
                </label>
                <input
                  type="text"
                  id="calle"
                  {...register('direccion.calle', { required: 'Este campo es obligatorio' })}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Calle y número"
                />
                {errors.direccion?.calle && (
                  <p className="mt-1 text-sm text-red-400">{errors.direccion.calle.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="colonia" className="block text-sm font-medium text-gray-300 mb-1">
                  Colonia *
                </label>
                <input
                  type="text"
                  id="colonia"
                  {...register('direccion.colonia', { required: 'Este campo es obligatorio' })}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Colonia"
                />
                {errors.direccion?.colonia && (
                  <p className="mt-1 text-sm text-red-400">{errors.direccion.colonia.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-300 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  id="codigoPostal"
                  {...register('direccion.codigoPostal', { 
                    required: 'Este campo es obligatorio',
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: 'Ingresa un código postal válido'
                    }
                  })}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Código Postal"
                />
                {errors.direccion?.codigoPostal && (
                  <p className="mt-1 text-sm text-red-400">{errors.direccion.codigoPostal.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-300 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="ciudad"
                  {...register('direccion.ciudad', { required: 'Este campo es obligatorio' })}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ciudad"
                />
                {errors.direccion?.ciudad && (
                  <p className="mt-1 text-sm text-red-400">{errors.direccion.ciudad.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  id="estado"
                  {...register('direccion.estado', { required: 'Este campo es obligatorio' })}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Estado"
                />
                {errors.direccion?.estado && (
                  <p className="mt-1 text-sm text-red-400">{errors.direccion.estado.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="referencias" className="block text-sm font-medium text-gray-300 mb-1">
                  Referencias (opcional)
                </label>
                <textarea
                  id="referencias"
                  {...register('direccion.referencias')}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: Casa blanca de dos pisos, portón negro, enfrente de una tienda"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-6">
          <Button type="submit" className="w-full">
            Continuar al menú
          </Button>
        </div>
      </form>
    </div>
  );
}
