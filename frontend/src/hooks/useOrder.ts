import { useState } from 'react';
import { useCart as useCartContext } from '../context/CartContext';
import { orderApi } from '../lib/api';
import { OrderRequest, TacoCustomization } from '../types/Order';

interface CartItemWithCustomization {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: TacoCustomization;
}

export function useOrder() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total: cartTotal } = useCartContext();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createOrder = async (data: any) => {
    try {
      const orderData: OrderRequest = {
        ...data,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          customizations: (item as CartItemWithCustomization).customizations,
        })),
        total: cartTotal,
      };

      await orderApi.createOrder(orderData);
      clearCart();
      setSuccess('Pedido creado exitosamente');
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el pedido');
      return { success: false };
    }
  };

  return {
    createOrder,
    error,
    success,
  };
}
