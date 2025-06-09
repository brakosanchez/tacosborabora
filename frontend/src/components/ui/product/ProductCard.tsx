'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './SelectStyles.css';

// Types
type ProductCategory = 'tacos' | 'bebidas' | 'postres' | 'extras' | 'complementos';

interface TacoCustomization {
  tortilla: 'maiz' | 'harina';
  acompanamiento: 'nada' | 'papas' | 'frijoles';
  queso: boolean;
  notas?: string;
}

export interface ProductCustomization extends TacoCustomization {
  quantity?: number;
  weightGrams?: number;
  unitPrice?: number;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  description?: string;
  allowQuantity?: boolean; // Permite seleccionar múltiples unidades
  sellByWeight?: {
    enabled: boolean;
    pricePerKg: number;
    minGrams: number;
    maxGrams?: number; // Opcional, por defecto 5000 (5kg)
    step: number;
    showCustomization?: boolean; // Si se deben mostrar opciones de personalización
  };
}

interface ProductCardProps {
  product: IProduct;
  onAddToCart: (product: IProduct, customizations?: ProductCustomization) => void;
}

/**
 * Componente que muestra la tarjeta de un producto con opciones de personalización
 * @param product - Producto a mostrar
 * @param onAddToCart - Función que se ejecuta al agregar el producto al carrito
 */
export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Estado para controlar si se muestra el modal de personalización
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  
  // Estado que almacena las opciones de personalización seleccionadas
  const [quantity, setQuantity] = useState(1);
  // Inicializar con el valor mínimo de gramos del producto o 500g por defecto
  const [weightGrams, setWeightGrams] = useState<number>(
    product.sellByWeight?.enabled ? product.sellByWeight.minGrams : 500
  );
  const [customization, setCustomization] = useState<TacoCustomization>({
    tortilla: 'maiz',
    acompanamiento: 'nada',
    queso: false,
    notas: ''
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleCheeseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomization({
      ...customization,
      queso: e.target.checked
    });
  };

  /**
   * Calcula el precio basado en el peso para productos que se venden por peso
   */
  const calculatePriceByWeight = (grams: number): number => {
    if (!product.sellByWeight?.enabled) return product.price;
    
    const kg = grams / 1000;
    return Math.round(kg * product.sellByWeight.pricePerKg * 100) / 100; // Redondear a 2 decimales
  };

  const handleAddToCartWithQuantity = () => {
    // Para productos por peso, el precio se calcula basado en el peso
    if (product.sellByWeight?.enabled) {
      const finalPrice = calculatePriceByWeight(weightGrams);
      
      onAddToCart({
        ...product,
        price: finalPrice // Precio total basado en el peso
      }, {
        ...customization,
        quantity: 1, // Siempre 1 para productos por peso
        weightGrams: weightGrams,
        unitPrice: finalPrice // Precio total ya calculado
      });
      
      toast.success(`${product.name} (${weightGrams}g) agregado al carrito`);
      return;
    }
    
    // Para productos normales, calcular el precio unitario base (sin extras)
    let unitPrice = product.price;
    
    // Calcular extras
    if (customization.tortilla === 'harina') {
      unitPrice += 10; // $10 extra por tortilla de harina
    }
    
    if (customization.queso) {
      unitPrice += 10; // $10 extra por queso
    }
    
    // Calcular el precio total basado en la cantidad
    const finalQuantity = product.allowQuantity || product.category === 'tacos' ? quantity : 1;
    const totalPrice = unitPrice * finalQuantity;
    
    // Crear el objeto de personalización
    const finalCustomization: any = { 
      ...customization,
      quantity: finalQuantity,
      unitPrice: totalPrice // Precio total ya calculado
    };
    
    // Para productos por peso, agregar el peso en gramos
    if (product.sellByWeight?.enabled) {
      finalCustomization.weightGrams = weightGrams;
    }
    
    // Llamar a onAddToCart con el producto y las personalizaciones
    onAddToCart({
      ...product,
      price: unitPrice // Precio unitario sin multiplicar por cantidad
    }, finalCustomization);
    
    // Mostrar mensaje de éxito
    if (product.allowQuantity || product.category === 'tacos') {
      toast.success(`${finalQuantity} ${product.name}${finalQuantity > 1 ? 's' : ''} agregado${finalQuantity > 1 ? 's' : ''} al carrito`);
    } else {
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  const handleAddToCart = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Calcular el precio unitario base (sin extras)
    let unitPrice = product.price;
    
    // Calcular extras
    if (customization.tortilla === 'harina') {
      unitPrice += 10; // $10 extra por tortilla de harina
    }
    
    if (customization.queso) {
      unitPrice += 10; // $10 extra por queso
    }
    
    // Calcular el precio total basado en la cantidad
    const finalQuantity = product.allowQuantity || product.category === 'tacos' ? quantity : 1;
    const totalPrice = unitPrice * finalQuantity;
    
    // Pasar el precio total como unitPrice para que addToCart no lo multiplique de nuevo
    onAddToCart({
      ...product,
      price: unitPrice // Precio unitario sin multiplicar por cantidad
    }, {
      ...customization,
      quantity: finalQuantity,
      unitPrice: totalPrice // Precio total ya calculado
    });
    
    // Mostrar mensaje de éxito
    if (product.allowQuantity || product.category === 'tacos') {
      toast.success(`${finalQuantity} ${product.name}${finalQuantity > 1 ? 's' : ''} agregado${finalQuantity > 1 ? 's' : ''} al carrito`);
    } else {
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  /**
   * Maneja el envío del formulario de personalización
   * - Cierra el modal de personalización
   * - Agrega el producto al carrito con las personalizaciones seleccionadas
   * - Muestra una notificación de éxito
   * 
   * @function
   * @returns {void}
   */
  const handleSubmitCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddToCartWithQuantity();
    setShowCustomizationModal(false);
    toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  // Determinar si mostrar opciones de personalización
  const shouldShowCustomization = product.category === 'tacos' || 
    (product.sellByWeight?.enabled && product.sellByWeight.showCustomization !== false);
  
  // Mostrar el formulario de personalización si es necesario
  if (shouldShowCustomization || product.sellByWeight?.enabled || product.allowQuantity) {
    return (
      <motion.div 
        className="w-full h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all duration-300 transform hover:scale-105"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative w-full flex flex-col items-center py-6 px-4">
          <div className="relative w-40 h-40 mb-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/productos/default.jpg';
              }}
            />
          </div>
          <h3 className="text-white font-bold text-xl text-center mb-2">{product.name}</h3>
          <p className="font-yeseva-one text-2xl text-yellow-400">
            {product.sellByWeight?.enabled 
              ? `$${product.sellByWeight.pricePerKg.toFixed(2)}/kg`
              : `$${product.price.toFixed(2)}`
            }
          </p>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <form onSubmit={handleSubmitCustomization} className="space-y-4">
            {product.sellByWeight?.enabled ? (
              // Selector de peso para productos que se venden por peso
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white">
                    Peso: {weightGrams}g (Mínimo: {product.sellByWeight.minGrams}g)
                  </label>
                  <span className="text-yellow-400 font-medium">
                    ${calculatePriceByWeight(weightGrams).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={product.sellByWeight.minGrams}
                  max={product.sellByWeight.maxGrams || 5000} // Usar maxGrams o 5000g por defecto
                  step={product.sellByWeight.step || 100}
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{product.sellByWeight.minGrams}g</span>
                  <span>{product.sellByWeight.maxGrams ? `${product.sellByWeight.maxGrams.toLocaleString()}g (${product.sellByWeight.maxGrams / 1000}kg)` : '5,000g (5kg)'}</span>
                </div>
              </div>
            ) : (product.allowQuantity || product.category === 'tacos') && (
              // Selector de cantidad para productos con allowQuantity o tacos
              <div className="flex justify-between items-center">
                <label htmlFor="quantity" className="text-sm font-medium text-white">
                  Cantidad
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {shouldShowCustomization && (
              <>
                {/* Selector de tortilla */}
                <div className="select-container">
                  <label htmlFor="tortilla">Tipo de tortilla</label>
                  <select
                    id="tortilla"
                    value={customization.tortilla}
                    onChange={(e) => setCustomization({...customization, tortilla: e.target.value as 'maiz' | 'harina'})}
                  >
                    <option value="maiz">Tortilla de maíz</option>
                    <option value="harina">Tortilla de harina (+$10)</option>
                  </select>
                </div>

                {/* Selector de acompañamiento */}
                <div className="select-container">
                  <label htmlFor="acompanamiento">Acompañamiento</label>
                  <select
                    id="acompanamiento"
                    value={customization.acompanamiento}
                    onChange={(e) => setCustomization({...customization, acompanamiento: e.target.value as 'nada' | 'papas' | 'frijoles'})}
                  >
                    <option value="nada">Sin acompañamiento</option>
                    <option value="papas">Con papas</option>
                    <option value="frijoles">Con frijoles</option>
                  </select>
                </div>

                {/* Opción de queso */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="queso"
                    checked={customization.queso}
                    onChange={handleCheeseChange}
                    className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <label htmlFor="queso" className="text-sm text-white">
                    Agregar queso (+$10)
                  </label>
                </div>

                {/* Notas adicionales */}
                <div className="mt-2">
                  <label htmlFor="notas" className="block text-sm font-medium text-white mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    id="notas"
                    rows={2}
                    value={customization.notas}
                    onChange={(e) => setCustomization({...customization, notas: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ej: Sin cebolla, bien cocido, etc."
                  />
                </div>
              </>
            )}

            {/* Botón de agregar al carrito */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-between"
              >
                <span>Agregar {product.allowQuantity || product.category === 'tacos' ? quantity : ''} al carrito</span>
                <span className="font-yeseva-one text-lg">
                  ${(
                    (product.price + 
                    (customization.tortilla === 'harina' ? 10 : 0) + 
                    (customization.queso ? 10 : 0)) * (product.allowQuantity || product.category === 'tacos' ? quantity : 1)
                  ).toFixed(2)}
                </span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  // Para otros productos (bebidas, postres, etc.)
  return (
    <motion.div 
      className="w-full h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all duration-300 transform hover:scale-105"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative w-full flex justify-center py-6">
        <div className="relative w-24 h-24">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/productos/default.jpg';
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <h3 className="text-white font-bold text-lg">{product.name}</h3>
            <p className="text-orange-300 font-medium">${product.price.toFixed(2)}</p>
            {product.description && (
              <p className="text-sm text-gray-300 mt-1">{product.description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <button
          onClick={handleAddToCart}
          className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-between"
        >
          <span>Agregar</span>
          <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded">${product.price.toFixed(2)}</span>
        </button>
      </div>
    </motion.div>
  );
}
