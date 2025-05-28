'use client';

import { useState, useMemo } from 'react';
import { useOrder } from '@/context/OrderContext';
import Button from '../ui/Button';

interface MenuSectionProps {
  onNext: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'tacos' | 'bebidas' | 'complementos';
  description?: string;
}

interface ProductCustomization {
  tortilla: 'maiz' | 'harina';
  acompanamiento: 'papas' | 'frijoles' | 'nada';
  queso: boolean;
  notas?: string;
}

const products: Record<string, Product[]> = {
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
      id: 'taco-arrachera', 
      name: 'Taco de Arrachera', 
      price: 35, 
      image: '/productos/tacos/tacodearrachera.png', 
      category: 'tacos',
      description: 'Taco de arrachera premium'
    },
  ],
  bebidas: [
    { 
      id: 'bebida-coca', 
      name: 'Coca Cola', 
      price: 20, 
      image: '/productos/Bebidas/Cocacola.png', 
      category: 'bebidas'
    },
    { 
      id: 'bebida-sprite', 
      name: 'Sprite', 
      price: 20, 
      image: '/productos/Bebidas/sprite.png', 
      category: 'bebidas'
    },
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
  ]
};

export default function MenuSection({ onNext }: MenuSectionProps) {
  const { addToCart, cartItems } = useOrder();
  const [activeCategory, setActiveCategory] = useState<string>('tacos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customization, setCustomization] = useState<ProductCustomization>({
    tortilla: 'maiz',
    acompanamiento: 'nada',
    queso: false,
    notas: ''
  });

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const finalPrice = selectedProduct.category === 'tacos' 
      ? selectedProduct.price + (customization.tortilla === 'harina' ? 10 : 0) + (customization.queso ? 10 : 0)
      : selectedProduct.price;
    
    addToCart({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: finalPrice,
      quantity: 1,
      category: selectedProduct.category,
      image: selectedProduct.image,
      customizations: selectedProduct.category === 'tacos' ? customization : undefined
    });
    
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {Object.keys(products).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products[activeCategory]?.map((product) => (
          <div 
            key={product.id} 
            className="bg-white/5 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="h-40 bg-gray-700 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              {product.description && (
                <p className="text-gray-400 text-sm mt-1">{product.description}</p>
              )}
              <div className="mt-2 flex justify-between items-center">
                <span className="text-orange-400 font-bold">${product.price}</span>
                <button 
                  className="text-sm bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={onNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
          >
            <span>Ver pedido ({cartItemCount})</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Product Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedProduct.category === 'tacos' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Tipo de tortilla</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['maiz', 'harina'].map((type) => (
                        <label 
                          key={type}
                          className={`p-3 border rounded-lg cursor-pointer ${
                            customization.tortilla === type 
                              ? 'border-orange-500 bg-orange-500/10' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="tortilla"
                              checked={customization.tortilla === type}
                              onChange={() => setCustomization(prev => ({
                                ...prev,
                                tortilla: type as 'maiz' | 'harina'
                              }))}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600"
                            />
                            <span className="ml-2 capitalize">
                              {type === 'maiz' ? 'Maíz' : 'Harina'}
                              {type === 'harina' && ' (+$10)'}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Acompañamiento</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'nada', label: 'Ninguno' },
                        { id: 'papas', label: 'Papas' },
                        { id: 'frijoles', label: 'Frijoles' }
                      ].map((item) => (
                        <label 
                          key={item.id}
                          className={`p-3 border rounded-lg cursor-pointer ${
                            customization.acompanamiento === item.id
                              ? 'border-orange-500 bg-orange-500/10' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="acompanamiento"
                              checked={customization.acompanamiento === item.id}
                              onChange={() => setCustomization(prev => ({
                                ...prev,
                                acompanamiento: item.id as 'nada' | 'papas' | 'frijoles'
                              }))}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600"
                            />
                            <span className="ml-2">{item.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customization.queso}
                        onChange={(e) => setCustomization(prev => ({
                          ...prev,
                          queso: e.target.checked
                        }))}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
                      />
                      <span>Extra queso (+$10)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Notas especiales (opcional)
                    </label>
                    <textarea
                      value={customization.notas || ''}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev,
                        notas: e.target.value
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ej: Sin cebolla, poca sal, etc."
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center">
                <div className="text-xl font-bold">
                  ${selectedProduct.category === 'tacos' 
                    ? selectedProduct.price + (customization.tortilla === 'harina' ? 10 : 0) + (customization.queso ? 10 : 0)
                    : selectedProduct.price}
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Agregar al pedido
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
