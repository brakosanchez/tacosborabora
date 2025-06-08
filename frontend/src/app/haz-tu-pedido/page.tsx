'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CartModal from '@/components/CartModal';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import ProductCard from '@/app/haz-tu-pedido/components/ProductCard';
import DineInOptions from './components/DineInOptions';
import type { IProduct, ProductCustomization } from '@/app/haz-tu-pedido/components/ProductCard';

// Types
type ServiceType = 'dine-in' | 'takeaway' | 'delivery';
type OrderStep = 'service-type' | 'customer-info' | 'scheduling' | 'menu' | 'review' | 'payment' | 'dine-in-options';
type ProductCategory = 'tacos' | 'bebidas' | 'postres' | 'extras' | 'complementos';

interface CartItem extends Omit<IProduct, 'description'> {
  key: string;
  quantity: number;
  customizations?: ProductCustomization;
  originalPrice: number;
}

// Service Type Selector Component
const ServiceTypeSelector = ({ 
  onSelect
}: { 
  onSelect: (type: ServiceType) => void;
}) => {
  const handleSelect = (type: ServiceType) => {
    onSelect(type);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {[
        { type: 'dine-in', icon: '🍽️', title: 'Comer aquí', description: 'Disfruta de nuestros tacos en el local' },
        { type: 'takeaway', icon: '🥡', title: 'Para llevar', description: 'Recoge tu pedido cuando esté listo' },
        { type: 'delivery', icon: '🚴', title: 'A domicilio', description: 'Te lo llevamos hasta tu puerta' },
      ].map((service) => (
        <button
          key={service.type}
          onClick={() => handleSelect(service.type as ServiceType)}
          className="p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300 flex flex-col items-center transform hover:-translate-y-1 hover:shadow-lg hover:bg-orange-500/80 hover:border-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span className="text-4xl mb-3">{service.icon}</span>
          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-sm text-center text-white/80">{service.description}</p>
        </button>
      ))}
    </div>
  );
};

// Order Progress Component
const OrderProgress = ({ 
  currentStep, 
  onStepClick 
}: { 
  currentStep: OrderStep;
  onStepClick: (step: OrderStep) => void;
}) => {
  const steps: { id: OrderStep; label: string }[] = [
    { id: 'service-type', label: 'Tipo de servicio' },
    { id: 'customer-info', label: 'Datos' },
    { id: 'menu', label: 'Menú' },
    { id: 'review', label: 'Revisar' },
    { id: 'payment', label: 'Pagar' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Verificar si un paso está habilitado para hacer clic
  const isStepEnabled = (stepId: OrderStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    return stepIndex <= currentStepIndex + 1; // Permitir ir al siguiente paso o a cualquiera anterior
  };

  const handleStepClick = (step: OrderStep) => {
    if (isStepEnabled(step)) {
      onStepClick(step);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isClickable = isStepEnabled(step.id);
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center z-10 group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              aria-label={`Ir a ${step.label}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-orange-500 text-white scale-110' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-400'
                } ${isClickable && !isActive ? 'group-hover:bg-orange-400 group-hover:text-white' : ''}`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm mt-2 transition-colors ${
                  isActive 
                    ? 'text-orange-400 font-medium' 
                    : isCompleted 
                      ? 'text-green-400' 
                      : 'text-gray-500'
                } ${isClickable ? 'group-hover:text-orange-300' : ''}`}
              >
                {step.label}
              </span>
              
              {/* Línea conectiva */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-700 -z-10">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{
                      width: index < currentStepIndex ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Datos de los productos disponibles, organizados por categoría
 * Cada producto incluye: id, nombre, descripción, precio, imagen, etc.
 */
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
      image: '/productos/mixiote-kilo.jpg',
      category: 'complementos',
      description: 'Delicioso mixiote de res por kilo',
      sellByWeight: {
        enabled: true,
        pricePerKg: 330,
        minGrams: 500, // Mínimo 500g
        maxGrams: 2000, // Máximo 2kg
        step: 100, // Incrementos de 100g
        showCustomization: false // No mostrar opciones de personalización
      }
    },
    { 
      id: 'consome-chico', 
      name: 'Consomé chico', 
      price: 10, 
      image: '/productos/consome.png', 
      category: 'complementos',
      description: 'Vaso pequeño de consomé',
      allowQuantity: true // Permite seleccionar múltiples unidades
    },
    { 
      id: 'consome-litro', 
      name: 'Consomé por litro', 
      price: 50, 
      image: '/productos/consome-litro.png', 
      category: 'complementos',
      description: 'Un litro de consomé',
      allowQuantity: true // Permite seleccionar múltiples unidades
    },
    { 
      id: 'frijoles-charros', 
      name: 'Frijoles Charros', 
      price: 25, 
      image: '/productos/frijoles-charros.png', 
      category: 'complementos',
      description: 'Porción de frijoles charros',
      allowQuantity: true // Permite seleccionar múltiples unidades
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
      description: 'Refresco de cola de 600ml',
      allowQuantity: true
    },
    { 
      id: 'sprite', 
      name: 'Sprite', 
      price: 20, 
      image: '/productos/Bebidas/sprite.png', 
      category: 'bebidas',
      description: 'Refresco de limón de 600ml',
      allowQuantity: true
    },
    { 
      id: 'fanta', 
      name: 'Fanta', 
      price: 20, 
      image: '/productos/Bebidas/fanta.png', 
      category: 'bebidas',
      description: 'Refresco de naranja de 600ml',
      allowQuantity: true
    },
    { 
      id: 'fresca', 
      name: 'Fresca', 
      price: 20, 
      image: '/productos/Bebidas/fresca.png', 
      category: 'bebidas',
      description: 'Refresco de toronja de 600ml',
      allowQuantity: true
    },
    { 
      id: 'delaware-punch', 
      name: 'Delaware Punch', 
      price: 20, 
      image: '/productos/Bebidas/delawarepunch.png', 
      category: 'bebidas',
      description: 'Bebida de frutas de 600ml',
      allowQuantity: true
    },
    { 
      id: 'boing-mango', 
      name: 'Boing Mango', 
      price: 20, 
      image: '/productos/Bebidas/logoboing.png', 
      category: 'bebidas',
      description: 'Bebida de mango de 600ml',
      allowQuantity: true
    },
    { 
      id: 'boing-guayaba', 
      name: 'Boing Guayaba', 
      price: 20, 
      image: '/productos/Bebidas/logoboing.png', 
      category: 'bebidas',
      description: 'Bebida de guayaba de 600ml',
      allowQuantity: true
    },
    { 
      id: 'mundet-manzana', 
      name: 'Mundet Manzana', 
      price: 20, 
      image: '/productos/Bebidas/mundet.png', 
      category: 'bebidas',
      description: 'Refresco de manzana de 600ml',
      allowQuantity: true
    },
    { 
      id: 'topo-chico', 
      name: 'Topo Chico', 
      price: 25, 
      image: '/productos/Bebidas/logotopochico.png', 
      category: 'bebidas',
      description: 'Agua mineral gasificada de 500ml',
      allowQuantity: true
    },
    { 
      id: 'coca-light', 
      name: 'Coca Light/Zero', 
      price: 20, 
      image: '/productos/Bebidas/logobelight.png', 
      category: 'bebidas',
      description: 'Refresco de cola light/zero de 600ml',
      allowQuantity: true
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

/**
 * Página principal para realizar pedidos
 * 
 * Maneja el estado global del pedido, incluyendo:
 * - Tipo de servicio seleccionado
 * - Productos en el carrito
 * - Paso actual del flujo
 * - Datos del cliente
 * 
 * @returns {JSX.Element} Componente principal de la página de pedidos
 */
const HazTuPedidoPage = () => {
  // State management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OrderStep>('service-type');
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('tacos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Navegar a un paso específico con validaciones
  const navigateToStep = (step: OrderStep) => {
    console.log('Navegando a paso:', step, 'Tipo de servicio:', serviceType, 'Paso actual:', currentStep);
    
    // Definir los pasos posibles y su orden
    const steps: OrderStep[] = ['service-type', 'dine-in-options', 'customer-info', 'menu', 'review', 'payment'];
    
    // Si el paso actual no está en la lista de pasos, establecerlo como service-type
    const currentIndex = steps.indexOf(currentStep) >= 0 ? steps.indexOf(currentStep) : 0;
    const targetIndex = steps.indexOf(step);
    
    // Validar que se haya seleccionado un tipo de servicio para ciertos pasos
    if ((step === 'menu' || step === 'review' || step === 'payment' || step === 'dine-in-options') && !serviceType) {
      console.log('No se ha seleccionado tipo de servicio');
      setCurrentStep('service-type');
      toast.error('Por favor selecciona un tipo de servicio primero');
      return;
    }
    
    // Manejar la navegación basada en el tipo de servicio
    if (step === 'menu') {
      if (serviceType === 'dine-in' && currentStep !== 'dine-in-options') {
        // Si es comer aquí y no venimos de las opciones de comedor, ir a opciones primero
        console.log('Redirigiendo a opciones de comedor');
        setCurrentStep('dine-in-options');
      } else if (serviceType === 'takeaway' || serviceType === 'delivery' || currentStep === 'dine-in-options') {
        // Para llevar, a domicilio o si venimos de opciones de comedor, ir al menú
        console.log('Redirigiendo directamente al menú');
        setCurrentStep('menu');
      }
    } else {
      console.log('Navegación estándar a:', step);
      setCurrentStep(step);
    }
  };

  // Calculate cart total
  const cartTotal = useMemo(() => 
    cart.reduce((total, item) => total + item.price, 0),
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
  const addToCart = (product: IProduct, customizations?: ProductCustomization) => {
    // Si ya hay un precio unitario calculado, usarlo directamente
    if (customizations?.unitPrice !== undefined) {
      const finalPrice = customizations.unitPrice;
      const finalQuantity = customizations.quantity || 1;
      
      // Para productos por peso, incluir el peso en la clave y el nombre
      const isWeightedProduct = product.sellByWeight?.enabled && customizations.weightGrams;
      const itemKey = isWeightedProduct
        ? `${product.id}-${customizations.weightGrams}g`
        : `${product.id}-${JSON.stringify(customizations || {})}`;
      
      // Crear el nombre del producto con el peso si es necesario
      const productName = isWeightedProduct
        ? `${product.name} (${customizations.weightGrams}g)`
        : product.name;
      
      setCart(prevCart => {
        // Verificar si el producto ya está en el carrito
        const existingItemIndex = prevCart.findIndex(item => item.key === itemKey);
        
        if (existingItemIndex >= 0) {
          // Si ya existe, actualizar la cantidad y el precio
          const updatedCart = [...prevCart];
          const existingItem = updatedCart[existingItemIndex];
          
          // Para productos por peso, no sumar cantidades, sino crear un nuevo ítem
          if (isWeightedProduct) {
            // Crear una nueva clave única con un timestamp para evitar colisiones
            const newKey = `${itemKey}-${Date.now()}`;
            
            return [
              ...updatedCart,
              {
                ...product,
                name: productName,
                key: newKey,
                quantity: 1, // Siempre 1 para productos por peso
                price: finalPrice,
                customizations: customizations,
                originalPrice: product.price
              }
            ];
          } else {
            // Para productos normales, incrementar la cantidad y el precio
            updatedCart[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + finalQuantity,
              price: existingItem.price + finalPrice
            };
            
            return updatedCart;
          }
        } else {
          // Si no existe, agregar el nuevo ítem al carrito
          return [
            ...prevCart,
            {
              ...product,
              name: productName,
              key: itemKey,
              quantity: finalQuantity,
              price: finalPrice,
              customizations: customizations,
              originalPrice: product.price,
              sellByWeight: product.sellByWeight // Incluir información de venta por peso
            }
          ];
        }
      });
      
      toast.success(`¡${productName} agregado al carrito!`);
      return;
    }
    
    // Cálculo de precio y cantidad para la compatibilidad con el código existente
    const calculateFinalValues = () => {
      let finalPrice = product.price;
      let finalQuantity = 1;
      
      // Si es un producto por peso, calcular el precio basado en el peso
      if (product.sellByWeight?.enabled && customizations?.weightGrams) {
        const kg = customizations.weightGrams / 1000;
        finalPrice = Math.round(kg * product.sellByWeight.pricePerKg * 100) / 100;
      }
      // Si hay personalizaciones, aplicar los recargos correspondientes
      else if (customizations) {
        if (customizations.tortilla === 'harina') {
          finalPrice += 10; // $10 extra por tortilla de harina
        }
        
        if (customizations.queso) {
          finalPrice += 10; // $10 extra por queso
        }
        
        // Si hay una cantidad personalizada, aplicarla
        if (customizations.quantity) {
          finalQuantity = customizations.quantity;
          finalPrice *= finalQuantity;
        }
      }
      
      return {
        finalPrice,
        finalQuantity
      };
    };
    
    const { finalPrice, finalQuantity } = calculateFinalValues();
    
    // Si hay personalizaciones, clonarlas sin incluir el precio unitario ni la cantidad
    const { unitPrice, quantity, ...cleanCustomizations } = customizations || {};
    
    // Crear una clave única para este ítem en el carrito basada en el ID y las personalizaciones
    const itemKey = `${product.id}-${JSON.stringify(cleanCustomizations || {})}`;
    
    // Para productos que se venden por peso, incluir el peso en la descripción
    const productName = product.sellByWeight?.enabled && customizations?.weightGrams
      ? `${product.name} (${customizations.weightGrams}g)`
      : product.name;
    
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevCart.findIndex(item => item.key === itemKey);
      
      if (existingItemIndex >= 0) {
        // Si ya existe, actualizar la cantidad y el precio
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        
        // Para productos por peso, no sumar cantidades, sino crear un nuevo ítem
        if (product.sellByWeight?.enabled) {
          // Crear una nueva clave única con un timestamp para evitar colisiones
          const newKey = `${itemKey}-${Date.now()}`;
          
          return [
            ...updatedCart,
            {
              ...product,
              name: productName,
              key: newKey,
              quantity: 1, // Siempre 1 para productos por peso
              price: finalPrice,
              customizations: cleanCustomizations,
              originalPrice: product.price,
              sellByWeight: product.sellByWeight
            }
          ];
        } else {
          // Para productos normales, incrementar la cantidad y el precio
          updatedCart[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + finalQuantity,
            price: existingItem.price + finalPrice
          };
          
          return updatedCart;
        }
      } else {
        // Si no existe, agregar el nuevo ítem al carrito
        return [
          ...prevCart,
          {
            ...product,
            name: productName,
            key: itemKey,
            quantity: finalQuantity,
            price: finalPrice,
            customizations: cleanCustomizations,
            originalPrice: product.price, // Guardar el precio original para futuras actualizaciones
            sellByWeight: product.sellByWeight // Incluir información de venta por peso
          }
        ];
      }
    });
    
    toast.success(`${productName} agregado al carrito`);
  };

  // Alias para mantener compatibilidad con componentes existentes
  const handleAddToCart = addToCart;

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
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-8 p-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="w-[350px]">
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen text-white flex flex-col items-center" style={backgroundStyle}>
      <div className="w-full max-w-7xl px-4 py-8 relative z-10">
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
          >
            <h1 className="text-3xl font-bold mb-8">¿Cómo deseas tu pedido?</h1>
            <ServiceTypeSelector 
              onSelect={(type) => {
                console.log('Tipo de servicio seleccionado:', type);
                setServiceType(type);
                // Navegar directamente basado en el tipo de servicio
                if (type === 'dine-in') {
                  console.log('Navegando a opciones de comedor');
                  setCurrentStep('dine-in-options');
                } else {
                  console.log('Navegando directamente al menú');
                  setCurrentStep('menu');
                }
              }}
            />
          </motion.div>
        )}

        {/* Dine In Options */}
        {currentStep === 'dine-in-options' && serviceType === 'dine-in' && (
          <DineInOptions 
            onNext={() => {
              console.log('Siguiente desde opciones de comedor');
              setCurrentStep('menu');
            }}
            onBack={() => {
              console.log('Volviendo a selección de servicio');
              setCurrentStep('service-type');
            }}
          />
        )}

        {/* Menu */}
        {currentStep === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Nuestro Menú</h1>
              {cart.length > 0 && (
                <button 
                  onClick={() => navigateToStep('review')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <span>Revisar pedido</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </button>
              )}
            </div>
            
            {/* Pestañas de categorías */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {Object.keys(productsData).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as ProductCategory)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-black/40 text-white/80 hover:bg-black/60'
                  }`}
                >
                  {category === 'tacos' ? 'Tacos' : 
                   category === 'bebidas' ? 'Bebidas' : 
                   category === 'postres' ? 'Postres' : 
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <svg 
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Lista de productos */}
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-8 p-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="w-[350px]">
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Botón de volver */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigateToStep(serviceType === 'dine-in' ? 'dine-in-options' : 'service-type')}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Volver
              </button>
            </div>
            
            {/* Botón flotante para móviles */}
            {cart.length > 0 && (
              <div className="fixed bottom-20 left-0 right-0 md:hidden px-4">
                <button 
                  onClick={() => navigateToStep('review')}
                  className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-orange-600 transition-colors"
                  disabled={cart.length === 0}
                >
                  <span>Ver pedido</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {cart.reduce((total, item) => total + item.quantity, 0)} items
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(id, newQuantity) => {
          setCart(cart.map(item => {
            if (item.key !== id) return item;
            
            // Calcular el precio unitario basado en el precio original y las personalizaciones
            let unitPrice = item.originalPrice;
            
            // Aplicar cargos adicionales de personalizaciones
            if (item.customizations) {
              if (item.customizations.queso) unitPrice += 10;
              if (item.customizations.tortilla === 'harina') unitPrice += 10;
            }
            
            // Asegurarse de que la cantidad sea al menos 1
            const quantity = Math.max(1, newQuantity);
            
            return {
              ...item,
              quantity,
              price: unitPrice * quantity
            };
          }));
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
