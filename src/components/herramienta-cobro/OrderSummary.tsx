import { Product } from '@/lib/validators/sale';

interface OrderItem {
  product: Product;
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  total: number;
}

const OrderSummary = ({ items, onUpdateQuantity, total }: OrderSummaryProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay productos en el pedido
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} c/u</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                aria-label="Reducir cantidad"
                onClick={() => onUpdateQuantity(item.product.id || '', item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <span>-</span>
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={() => onUpdateQuantity(item.product.id || '', item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <span>+</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;