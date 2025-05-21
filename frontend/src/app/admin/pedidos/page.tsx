import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Aquí iría la lógica para cargar los pedidos
    // Por ahora, simulamos con datos estáticos
    const mockOrders: Order[] = [
      {
        id: '1',
        customerName: 'Juan Pérez',
        total: 125.50,
        status: 'pending',
        items: [
          { name: 'Tacos al Pastor', quantity: 3, price: 25 },
          { name: 'Salsa Roja', quantity: 1, price: 10.50 },
        ],
        createdAt: '2025-05-20T20:00:00Z',
      },
      // ... más pedidos
    ];
    setOrders(mockOrders);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // Aquí iría la lógica para actualizar el estado del pedido
    console.log('Actualizando estado del pedido:', orderId, newStatus);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                <p className="text-gray-600">Cliente: {order.customerName}</p>
                <p className="text-gray-600">Fecha: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div
                className={`px-4 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total: ${order.total.toFixed(2)}</p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                  }}
                  variant="outline"
                >
                  Detalles
                </Button>
                <Button
                  onClick={() => handleStatusChange(order.id, 'preparing')}
                  variant="secondary"
                >
                  Preparar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalles del Pedido">
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Cliente</h3>
              <p>{selectedOrder.customerName}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Items</h3>
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.name} (${item.price.toFixed(2)} cada)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total</h3>
              <p>${selectedOrder.total.toFixed(2)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
