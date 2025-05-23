'use client';

import { ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export function CartButton() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button 
      className="p-2 rounded-full hover:bg-gray-100 relative"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
