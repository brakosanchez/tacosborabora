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

export interface ProductCustomization extends TacoCustomization {}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  description?: string;
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
  const [showCustomization, setShowCustomization] = useState(false);
  
  // Estado que almacena las opciones de personalización seleccionadas
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCartWithQuantity = () => {
    // Precio base del taco
    let basePrice = product.price;
    
    // Agregar costo por tortilla de harina ($10)
    if (customization.tortilla === 'harina') {
      basePrice += 10;
    }
    
    // Agregar costo por queso ($10 por taco)
    if (customization.queso) {
      basePrice += 10;
    }
    
    // Calcular precio total (precio unitario * cantidad)
    const totalPrice = basePrice * quantity;
    
    // Crear un nuevo objeto de personalización con el precio total
    const finalCustomization = {
      ...customization,
      quantity,
      totalPrice,
      unitPrice: basePrice // Guardamos el precio unitario para mostrarlo en el carrito
    };
    
    onAddToCart(product, finalCustomization);
  };

  const handleAddToCart = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (product.category === 'tacos') {
      onAddToCart(product, customization);
      toast.success(`${product.name} personalizado agregado al carrito`);
    } else {
      onAddToCart(product);
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
    setShowCustomization(false);
    toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  // Si es un taco, mostramos el formulario de personalización
  if (product.category === 'tacos') {
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
          <p className="font-yeseva-one text-2xl text-yellow-400">${product.price.toFixed(2)}</p>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <form onSubmit={handleSubmitCustomization} className="space-y-4">
            {/* Selector de cantidad */}
            <div className="select-container">
              <label htmlFor="cantidad">Cantidad</label>
              <select
                id="cantidad"
                value={quantity}
                onChange={handleQuantityChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num} taco{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Selector de tortilla */}
            <div className="select-container">
              <label htmlFor="tortilla">Tipo de tortilla</label>
              <select
                id="tortilla"
                value={customization.tortilla}
                onChange={(e) => setCustomization({
                  ...customization,
                  tortilla: e.target.value as 'maiz' | 'harina'
                })}
              >
                <option value="maiz">Tortilla de Maíz</option>
                <option value="harina">Tortilla de Harina</option>
              </select>
            </div>

            {/* Selector de acompañamiento */}
            <div className="select-container">
              <label htmlFor="acompanamiento">Acompañamiento</label>
              <select
                id="acompanamiento"
                value={customization.acompanamiento}
                onChange={(e) => setCustomization({
                  ...customization,
                  acompanamiento: e.target.value as 'nada' | 'papas' | 'frijoles'
                })}
              >
                <option value="nada">Sin acompañamiento</option>
                <option value="papas">Con papas </option>
                <option value="frijoles">Con frijoles </option>
              </select>
            </div>

            {/* Checkbox de queso */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="queso"
                  checked={customization.queso}
                  onChange={handleCheeseChange}
                  className="h-4 w-4 text-orange-400 rounded border-gray-300 focus:ring-orange-400"
                />
                <label htmlFor="queso" className="text-sm font-medium text-white">
                  Queso (+$10)
                </label>
              </div>
              <span className="text-yellow-400 font-medium">${(quantity * 10).toFixed(2)}</span>
            </div>

            {/* Notas especiales */}
            <div>
              <label htmlFor="notas" className="block text-sm font-medium text-white mb-1">
                Notas especiales (opcional)
              </label>
              <textarea
                id="notas"
                rows={2}
                value={customization.notas}
                onChange={(e) => setCustomization({
                  ...customization,
                  notas: e.target.value
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Ej: Sin cebolla, extra salsa, etc."
              />
            </div>

            {/* Botón de agregar al carrito */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-between"
              >
                <span>Agregar {quantity} al carrito</span>
                <span className="font-yeseva-one text-lg">
                  ${(
                    (product.price + 
                    (customization.tortilla === 'harina' ? 10 : 0) + 
                    (customization.queso ? 10 : 0)) * quantity
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
