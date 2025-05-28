'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import Button from '../ui/Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { 
    state: { items: cartItems },
    updateCartItem, 
    removeFromCart, 
    cartTotal,
    itemCount
  } = useOrder();

  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% IVA
  };

  const handleQuantityChange = (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateCartItem(id, newQuantity);
      } else {
        removeFromCart(id);
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold">Tu Pedido</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white"
                  aria-label="Cerrar carrito"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <ShoppingCart size={48} className="mb-4 opacity-30" />
                    <p>Tu carrito está vacío</p>
                    <p className="text-sm mt-2">Agrega algunos productos</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        
                        {/* Customizations */}
                        {item.customizations && (
                          <div className="mt-1 text-xs text-gray-400 space-y-1">
                            {item.customizations.tortilla === 'harina' && (
                              <div className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
                                <span>Tortilla de harina (+$10)</span>
                              </div>
                            )}
                            {item.customizations.queso && (
                              <div className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
                                <span>Extra queso (+$10)</span>
                              </div>
                            )}
                            {item.customizations.acompanamiento !== 'nada' && (
                              <div className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
                                <span>Acompañamiento: {item.customizations.acompanamiento}</span>
                              </div>
                            )}
                            {item.customizations.notas && (
                              <div className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 mt-1.5 flex-shrink-0"></span>
                                <span className="text-xs text-gray-400">Nota: {item.customizations.notas}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item.id, -1);
                              }}
                              className="px-2 py-1 text-gray-300 hover:bg-gray-700 h-full"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1 bg-gray-700">{item.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item.id, 1);
                              }}
                              className="px-2 py-1 text-gray-300 hover:bg-gray-700 h-full"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400"
                        aria-label="Eliminar del carrito"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-800 p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">IVA (16%)</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-800">
                      <span>Total</span>
                      <span className="text-orange-400">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      onClose();
                      // Navegar al checkout
                      window.scrollTo(0, 0);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Proceder al pago
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Componente de ícono de carrito de compras (temporal, en un caso real usarías un paquete de íconos)
function ShoppingCart({ size = 24, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}
