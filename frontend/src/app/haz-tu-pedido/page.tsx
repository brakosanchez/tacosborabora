'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Types
type ProductCategory = 'tacos' | 'bebidas' | 'complementos';
type OrderStep = 'service-type' | 'menu' | 'sides' | 'drinks' | 'review' | 'checkout';
type ServiceType = 'dine-in' | 'takeaway' | 'delivery';

interface ProductCustomization {
  tortilla?: 'maiz' | 'harina';
  acompanamiento?: 'papas' | 'frijoles' | 'nada';
  queso?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  quantity?: number;
  customizations?: ProductCustomization;
}

interface CartItem extends Omit<Product, 'quantity' | 'customizations'> {
  quantity: number;
  customizations?: ProductCustomization;
}

// Products data
const products: Record<ProductCategory, Product[]> = {
  tacos: [
    { id: 'taco-mixiote', name: 'Taco de Mixiote', price: 30, image: '/productos/tacos/tacodemixiote.png', category: 'tacos' },
    { id: 'taco-bistec', name: 'Taco de Bistec', price: 30, image: '/productos/tacos/tacodebistec.png', category: 'tacos' },
    { id: 'taco-longaniza', name: 'Taco de Longaniza', price: 30, image: '/productos/tacos/tacodelonganiza.png', category: 'tacos' },
    { id: 'taco-aguja', name: 'Taco de Aguja', price: 30, image: '/productos/tacos/tacodeaguja.png', category: 'tacos' },
    { id: 'taco-pollo', name: 'Taco de Pollo', price: 30, image: '/productos/tacos/tacodepollo.png', category: 'tacos' },
    { id: 'taco-campechano-pollo', name: 'Taco Campechano de Pollo', price: 30, image: '/productos/tacos/tacocampepollo.png', category: 'tacos' },
    { id: 'taco-campechano-res', name: 'Taco Campechano de Res', price: 30, image: '/productos/tacos/tacocampebistec.png', category: 'tacos' },
    { id: 'taco-arrachera', name: 'Taco de Arrachera', price: 35, image: '/productos/tacos/tacodearrachera.png', category: 'tacos' },
    { id: 'taco-cecina', name: 'Taco de Cecina', price: 35, image: '/productos/tacos/tacodececina.png', category: 'tacos' },
  ],
  bebidas: [
    { id: 'bebida-coca', name: 'Coca Cola', price: 20, image: '/productos/Bebidas/Cocacola.png', category: 'bebidas' },
    { id: 'bebida-sprite', name: 'Sprite', price: 20, image: '/productos/Bebidas/sprite.png', category: 'bebidas' },
    { id: 'bebida-fanta', name: 'Fanta', price: 20, image: '/productos/Bebidas/fanta.png', category: 'bebidas' },
    { id: 'bebida-boing-mango', name: 'Boing de Mango', price: 20, image: '/productos/Bebidas/logoboing.png', category: 'bebidas' },
    { id: 'bebida-boing-guayaba', name: 'Boing de Guayaba', price: 20, image: '/productos/Bebidas/logoboing.png', category: 'bebidas' },
    { id: 'agua-fresca', name: 'Agua Fresca', price: 20, image: '/productos/Bebidas/fresca.png', category: 'bebidas' },
  ],
  complementos: [
    { id: 'mixiote-kilo', name: 'Mixiote por kilo', price: 330, image: '/productos/kilodemixiote.png', category: 'complementos' },
    { id: 'consome-chico', name: 'Consomé chico', price: 10, image: '/productos/consomechico.png', category: 'complementos' },
    { id: 'consome-litro', name: 'Consomé por litro', price: 50, image: '/productos/litroconsome.png', category: 'complementos' },
  ]
};

// Dynamic imports
const ServiceTypeSelector = dynamic(
  () => import('@/components/haz-tu-pedido/ServiceTypeSelector'),
  { ssr: false }
);

// Components
const ProductCard = ({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product, customizations?: ProductCustomization) => void;
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [customization, setCustomization] = useState<ProductCustomization>({
    tortilla: 'maiz',
    acompanamiento: 'nada',
    queso: false,
  });

  const handleAddToCart = () => {
    const baseProduct = {
      ...product,
      price: product.price + (customization.tortilla === 'harina' ? 10 : 0) + (customization.queso ? 10 : 0),
    };
    onAddToCart(baseProduct, customization);
    setShowCustomization(false);
    toast.success(`${product.name} agregado al carrito`);
  };

  const isTaco = product.category === 'tacos';

  if (showCustomization && isTaco) {
    return (
      <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
        <h3 className="text-lg font-medium mb-2">Personalizar {product.name}</h3>
        
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tortilla</label>
            <div className="flex space-x-2">
              {(['maiz', 'harina'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCustomization(c => ({ ...c, tortilla: type }))}
                  className={`px-3 py-1 text-sm rounded ${
                    customization.tortilla === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Acompañamiento</label>
            <div className="flex flex-wrap gap-2">
              {(['papas', 'frijoles', 'nada'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCustomization(c => ({ ...c, acompanamiento: type }))}
                  className={`px-2 py-1 text-xs rounded ${
                    customization.acompanamiento === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="queso"
              checked={customization.queso}
              onChange={(e) => setCustomization(c => ({ ...c, queso: e.target.checked }))}
              className="h-4 w-4 text-orange-500 rounded"
            />
            <label htmlFor="queso" className="ml-2 text-sm">
              Extra queso (+$10)
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setShowCustomization(false)}
            className="px-3 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddToCart}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg border border-orange-500/20 flex flex-col items-center">
      {product.image && (
        <div className="w-24 h-24 mb-2 relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h3 className="font-medium text-center">{product.name}</h3>
      <p className="text-orange-400 font-bold my-1">${product.price}</p>
      <button
        onClick={() => isTaco ? setShowCustomization(true) : onAddToCart(product)}
        className="mt-2 px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
      >
        {isTaco ? 'Personalizar' : 'Agregar'}
      </button>
    </div>
  );
};

const OrderProgress = ({ currentStep }: { currentStep: OrderStep }) => {
  const steps: OrderStep[] = ['service-type', 'menu', 'sides', 'drinks', 'review', 'checkout'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex justify-between relative">
        {steps.map((step) => {
          const stepIndex = steps.indexOf(step);
          const isCompleted = stepIndex < currentIndex;
          const isActive = stepIndex === currentIndex;
          const isFuture = stepIndex > currentIndex;

          return (
            <div key={step} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
                  ${isActive ? 'bg-orange-500 text-white' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isFuture ? 'bg-gray-700 text-gray-400' : ''}
                `}
              >
                {isCompleted ? '✓' : stepIndex + 1}
              </div>
              <span className={`text-xs ${isActive ? 'text-orange-400' : 'text-gray-400'}`}>
                {step.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          );
        })}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700 -z-10">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

const CartModal = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  total,
}: {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  total: number;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Tu Pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Tu carrito está vacío</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">${item.price} c/u</p>
                    {item.customizations && (
                      <div className="mt-1 text-xs text-gray-400">
                        {item.customizations.tortilla && (
                          <div>Tortilla: {item.customizations.tortilla}</div>
                        )}
                        {item.customizations.acompanamiento && (
                          <div>Acompañamiento: {item.customizations.acompanamiento}</div>
                        )}
                        {item.customizations.queso && <div>Extra queso</div>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-2 text-red-400 hover:text-red-300"
                      aria-label="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HazTuPedidoPage() {
  const [currentStep, setCurrentStep] = useState<OrderStep>('service-type');
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('tacos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter products based on search term and active category
  const filteredProducts = useMemo(() => {
    const categoryProducts = products[activeCategory] || [];
    if (!searchTerm.trim()) return categoryProducts;
    
    const term = searchTerm.toLowerCase();
    return categoryProducts.filter(product => 
      product.name.toLowerCase().includes(term)
    );
  }, [activeCategory, searchTerm]);

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Handle adding items to cart
  const handleAddToCart = (product: Product, customizations?: ProductCustomization) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && 
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
          customizations
        }
      ];
    });
  };

  // Update item quantity in cart
  const updateQuantity = (id: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Handle service type selection
  const handleServiceTypeSelect = (type: ServiceType) => {
    setServiceType(type);
    setCurrentStep('menu');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'service-type':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">Selecciona tu tipo de servicio</h1>
            <ServiceTypeSelector onSelect={handleServiceTypeSelect} />
          </div>
        );
      
      case 'menu':
        return (
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Nuestro Menú</h1>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
                aria-label="Ver carrito"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 mb-4">
                {(Object.keys(products) as ProductCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {filteredProducts.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No se encontraron productos</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Paso no implementado</h1>
            <p className="text-gray-400">Esta sección estará disponible pronto</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pt-24"> {/* Añadido pt-24 para el espacio del navbar */}
      <div className="max-w-6xl mx-auto">
        <OrderProgress currentStep={currentStep} />
        
        <main className="mt-8">
          {renderCurrentStep()}
        </main>

        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          total={cartTotal}
        />

        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
