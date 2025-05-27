import React from 'react';

interface TacoCustomization {
  tortilla: 'maiz' | 'harina';
  queso: boolean;
  notas?: string;
}

interface CartItem {
  id: string;
  key: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: TacoCustomization;
  originalPrice: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  total: number;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  total
}) => {
  const getCustomizationDisplay = (customizations?: TacoCustomization) => {
    if (!customizations) return null;
    
    const parts = [];
    if (customizations.tortilla === 'harina') parts.push('Tortilla de harina');
    if (customizations.queso) parts.push('Con queso');
    if (customizations.notas) parts.push(`Notas: ${customizations.notas}`);
    
    return parts.length > 0 ? (
      <p className="text-sm text-gray-400 mt-1">{parts.join(' • ')}</p>
    ) : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black/70 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="inline-block w-full max-w-2xl bg-gray-900 rounded-lg shadow-xl transform transition-all text-white overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  Tu pedido
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="mt-2 text-gray-300">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {cartItems.map((item) => (
                      <li key={item.key} className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-base font-medium text-white">
                                {item.quantity}x {item.name}
                              </h4>
                              <span className="text-orange-400 font-medium">
                                ${(item.price).toFixed(2)}
                              </span>
                            </div>
                            {getCustomizationDisplay(item.customizations)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateQuantity(item.key, item.quantity - 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-gray-600"
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateQuantity(item.key, item.quantity + 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-gray-600"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveItem(item.key);
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-xl font-bold text-orange-400">${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      // Handle checkout
                      console.log('Proceder al pago');
                    }}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Proceder al pago
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
