'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

interface OrderStatus {
  id: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}

export default function EstadoPedido() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // Aquí iría la lógica para obtener el estado del pedido desde el backend
        setLoading(true);
        setError('');
        
        // Simulación de datos (a reemplazar con llamada real)
        const mockOrder: OrderStatus = {
          id: id as string,
          status: 'En preparación',
          items: [
            { name: 'Taco de Carnitas', quantity: 2, price: 35 },
            { name: 'Taco de Suadero', quantity: 1, price: 30 },
          ],
          total: 100,
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        };

        setOrder(mockOrder);
      } catch (err) {
        setError('Error al obtener el estado del pedido');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert type="error" message="Pedido no encontrado" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Estado del Pedido #{order.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Estado actual: {order.status}
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900">Detalles del pedido</h4>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.quantity} x ${item.price}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900">Información de entrega</h4>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Fecha de creación: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Entrega estimada: {new Date(order.estimatedDelivery).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => {
                // Aquí iría la lógica para contactar al restaurante
                console.log('Contactando al restaurante...');
              }}
            >
              Contactar al restaurante
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
