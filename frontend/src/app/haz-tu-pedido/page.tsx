'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CartModal from '@/components/CartModal';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import ProductCard from './components/ProductCard';
import type { IProduct, ProductCustomization } from './components/ProductCard';

// Types
type ServiceType = 'dine-in' | 'takeaway' | 'delivery';
type OrderStep = 'service-type' | 'customer-info' | 'scheduling' | 'menu' | 'review' | 'payment';
type ProductCategory = 'tacos' | 'bebidas' | 'postres' | 'extras' | 'complementos';

interface CartItem extends Omit<IProduct, 'description'> {
  key: string;
  quantity: number;
  customizations?: ProductCustomization;
  originalPrice: number;
}

// Service Type Selector Component
const ServiceTypeSelector = ({ onSelect }: { onSelect: (type: ServiceType) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
    {[
      { type: 'dine-in', icon: '🍽️', title: 'Comer aquí', description: 'Disfruta de nuestros tacos en el local' },
      { type: 'takeaway', icon: '🥡', title: 'Para llevar', description: 'Recoge tu pedido cuando esté listo' },
      { type: 'delivery', icon: '🚴', title: 'A domicilio', description: 'Te lo llevamos hasta tu puerta' },
    ].map((service) => (
      <button
        key={service.type}
        onClick={() => onSelect(service.type as ServiceType)}
        className="p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-orange-500/80 hover:border-orange-300/50 transition-all duration-300 flex flex-col items-center transform hover:-translate-y-1 hover:shadow-lg"
      >
        <span className="text-4xl mb-3">{service.icon}</span>
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-white/90 text-sm text-center">{service.description}</p>
      </button>
    ))}
  </div>
);

// Order Progress Component
const OrderProgress = ({ currentStep }: { currentStep: OrderStep }) => {
  const steps: { id: OrderStep; label: string }[] = [
    { id: 'service-type', label: 'Tipo de servicio' },
    { id: 'customer-info', label: 'Datos' },
    { id: 'menu', label: 'Menú' },
    { id: 'review', label: 'Revisar' },
    { id: 'payment', label: 'Pagar' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center z-10">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStepIndex
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm mt-2 ${
                index <= currentStepIndex ? 'text-orange-400' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700 -z-10">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Define products data
const productsData: Record<ProductCategory, IProduct[]> = {
  tacos: [
    { 
      id: 'taco-mixiote', 
      name: 'Taco de Mixiote', 
      price: 30, 
      image: '/productos/tacos/tacodemixiote.png', 
      category: 'tacos',
      description: 'Delicioso taco de mixiote de res'
    },
    { 
      id: 'taco-bistec', 
      name: 'Taco de Bistec', 
      price: 30, 
      image: '/productos/tacos/tacodebistec.png', 
      category: 'tacos',
      description: 'Taco de bistec asado'
    },
    { 
      id: 'taco-longaniza', 
      name: 'Taco de Longaniza', 
      price: 30, 
      image: '/productos/tacos/tacodelonganiza.png', 
      category: 'tacos',
      description: 'Taco de longaniza estilo casero'
    },
    { 
      id: 'taco-aguja', 
      name: 'Taco de Aguja', 
      price: 30, 
      image: '/productos/tacos/tacodeaguja.png', 
      category: 'tacos',
      description: 'Taco de aguja de res'
    },
    { 
      id: 'taco-pollo', 
      name: 'Taco de Pollo', 
      price: 30, 
      image: '/productos/tacos/tacodepollo.png', 
      category: 'tacos',
      description: 'Taco de pollo desmenuzado'
    },
    { 
      id: 'taco-campechano-pollo',
      name: 'Taco Campechano de Pollo',
      price: 30,
      image: '/productos/tacos/tacocampepollo.png',
      category: 'tacos',
      description: 'Mezcla de carnes con pollo'
    },
    { 
      id: 'taco-campechano-res',
      name: 'Taco Campechano de Res',
      price: 35,
      image: '/productos/tacos/tacocampebistec.png',
      category: 'tacos',
      description: 'Mezcla de carnes de res'
    },
    { 
      id: 'taco-arrachera', 
      name: 'Taco de Arrachera', 
      price: 35, 
      image: '/productos/tacos/tacodearrachera.png', 
      category: 'tacos',
      description: 'Taco de arrachera premium'
    },
    { 
      id: 'taco-cecina', 
      name: 'Taco de Cecina', 
      price: 35, 
      image: '/productos/tacos/tacodececina.png', 
      category: 'tacos',
      description: 'Taco de cecina estilo tradicional'
    }
  ],
  complementos: [
    { 
      id: 'mixiote-kilo', 
      name: 'Mixiote por kilo', 
      price: 330, 
      image: '/productos/kilodemixiote.png', 
      category: 'complementos',
      description: 'Delicioso mixiote de res por kilo'
    },
    { 
      id: 'consome-chico', 
      name: 'Consomé chico', 
      price: 10, 
      image: '/productos/consome.png', 
      category: 'complementos',
      description: 'Vaso pequeño de consomé'
    },
    { 
      id: 'consome-litro', 
      name: 'Consomé por litro', 
      price: 50, 
      image: '/productos/consome-litro.png', 
      category: 'complementos',
      description: 'Un litro de consomé'
    },
    { 
      id: 'frijoles-charros', 
      name: 'Frijoles Charros', 
      price: 25, 
      image: '/productos/frijoles-charros.png', 
      category: 'complementos',
      description: 'Porción de frijoles charros'
    }
  ],
  extras: [
    { 
      id: 'tortilla-harina', 
      name: 'Tortilla de harina', 
      price: 10, 
      image: '/productos/extras/tortilla-harina.png', 
      category: 'extras',
      description: 'Cambio a tortilla de harina'
    },
    { 
      id: 'extra-queso', 
      name: 'Queso Extra', 
      price: 10, 
      image: '/productos/extras/queso.png', 
      category: 'extras',
      description: 'Porción extra de queso'
    },
    { 
      id: 'tortilla-queso', 
      name: 'Tortilla de harina con queso', 
      price: 20, 
      image: '/productos/extras/tortilla-queso.png', 
      category: 'extras',
      description: 'Tortilla de harina con queso'
    }
  ],
  bebidas: [
    { 
      id: 'coca-cola', 
      name: 'Coca-Cola', 
      price: 20, 
      image: '/productos/Bebidas/Cocacola.png', 
      category: 'bebidas',
      description: 'Refresco de cola de 600ml'
    },
    { 
      id: 'sprite', 
      name: 'Sprite', 
      price: 20, 
      image: '/productos/Bebidas/sprite.png', 
      category: 'bebidas',
      description: 'Refresco de limón de 600ml'
    },
    { 
      id: 'fanta', 
      name: 'Fanta', 
      price: 20, 
      image: '/productos/Bebidas/fanta.png', 
      category: 'bebidas',
      description: 'Refresco de naranja de 600ml'
    },
    { 
      id: 'fresca', 
      name: 'Fresca', 
      price: 20, 
      image: '/productos/Bebidas/fresca.png', 
      category: 'bebidas',
      description: 'Refresco de toronja de 600ml'
    },
    { 
      id: 'delaware-punch', 
      name: 'Delaware Punch', 
      price: 20, 
      image: '/productos/Bebidas/delawarepunch.png', 
      category: 'bebidas',
      description: 'Bebida de frutas de 600ml'
    },
    { 
      id: 'boing-mango', 
      name: 'Boing Mango', 
      price: 20, 
      image: '/productos/Bebidas/logoboing.png', 
      category: 'bebidas',
      description: 'Bebida de mango de 600ml'
    },
    { 
      id: 'boing-guayaba', 
      name: 'Boing Guayaba', 
      price: 20, 
      image: '/productos/Bebidas/logoboing.png', 
      category: 'bebidas',
      description: 'Bebida de guayaba de 600ml'
    },
    { 
      id: 'mundet-manzana', 
      name: 'Mundet Manzana', 
      price: 20, 
      image: '/productos/Bebidas/mundet.png', 
      category: 'bebidas',
      description: 'Refresco de manzana de 600ml'
    },
    { 
      id: 'topo-chico', 
      name: 'Topo Chico', 
      price: 25, 
      image: '/productos/Bebidas/logotopochico.png', 
      category: 'bebidas',
      description: 'Agua mineral gasificada de 500ml'
    },
    { 
      id: 'coca-light', 
      name: 'Coca Light/Zero', 
      price: 20, 
      image: '/productos/Bebidas/logobelight.png', 
      category: 'bebidas',
      description: 'Refresco de cola light/zero de 600ml'
    }
  ],
  postres: [
    { 
      id: 'chocoflan', 
      name: 'Chocoflan', 
      price: 40, 
      image: '/productos/postres/chocoflan.png', 
      category: 'postres',
      description: 'Pastel de chocolate y flan'
    },
    { 
      id: 'torta-de-chocolate', 
      name: 'Torta de Chocolate', 
      price: 45, 
      image: '/productos/postres/tortadechocolate.png', 
      category: 'postres',
      description: 'Torta de chocolate para 6 personas'
    },
    { 
      id: 'torta-de-vanilla', 
      name: 'Torta de Vanilla', 
      price: 45, 
      image: '/productos/postres/tortadevanilla.png', 
      category: 'postres',
      description: 'Torta de vainilla para 6 personas'
    }
  ]
};

const HazTuPedidoPage = () => {
  // State management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OrderStep>('service-type');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('tacos');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate cart total
  const cartTotal = useMemo(() => 
    cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    [cart]
  );

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    const products = productsData[activeCategory] || [];
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term))
    );
  }, [activeCategory, searchTerm]);

  // Background style
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: "url('/fondoBora.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    position: 'relative'
  };

  // Calculate price based on customizations
  const calculatePrice = (basePrice: number, customizations?: ProductCustomization): number => {
    if (!customizations) return basePrice;
    // Add any additional costs from customizations here
    let total = basePrice;
    // Example: if (customizations.extraCheese) total += 5;
    return total;
  };

  // Handle adding item to cart
  const handleAddToCart = (product: IProduct, customizations?: ProductCustomization) => {
    const price = calculatePrice(product.price, customizations);
    const newItem: CartItem = {
      ...product,
      key: `${product.id}-${Date.now()}`,
      quantity: 1,
      customizations,
      originalPrice: product.price,
      price // Use calculated price
    };
    setCart([...cart, newItem]);
    toast.success(`${product.name} agregado al carrito`);
  };

  // Render products for the current category
  const renderProducts = () => {
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen text-white" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400"
          >
            Tacos Bora Bora
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl text-orange-300 font-medium"
          >
            ¡Sabor que enamora en cada bocado!
          </motion.p>
        </header>

        {/* Service Type Selection */}
        {currentStep === 'service-type' && (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-8">Selecciona tu tipo de servicio</h1>
            <ServiceTypeSelector onSelect={(type) => {
              setServiceType(type);
              setCurrentStep('menu');
            }} />
          </div>
        )}

        {/* Menu */}
        {currentStep === 'menu' && (
          <div>
            <OrderProgress currentStep={currentStep} />
            
            {/* Category Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {Object.keys(productsData).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as ProductCategory)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {renderProducts()}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(id, quantity) => {
          setCart(cart.map(item => 
            item.key === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ));
        }}
        onRemoveItem={(id) => {
          setCart(cart.filter(item => item.key !== id));
        }}
        total={cartTotal}
      />
      
      {/* Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        aria-label="Ver carrito"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default HazTuPedidoPage;
