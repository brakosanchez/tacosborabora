import { useState, useEffect } from 'react';
import { useCart as useCartContext } from '../context/CartContext';
import { orderApi } from '../lib/api';
import { Order, OrderItem } from '../types/Order';

export function useCart() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCartContext();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const createOrder = async (data: any) => {
    try {
      const orderData: Order = {
        ...data,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
        })),
        total: calculateTotal(),
      };

      await orderApi.createOrder(orderData);
      clearCart();
      setSuccess('Pedido creado exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el pedido');
    }
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: calculateTotal(),
    createOrder,
    error,
    success,
  };
}
