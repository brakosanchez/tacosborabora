'use client';

import { Product } from '@/lib/validators/sale';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleProductClick = (product: Product) => {
    if (product.id) {
      setClickedId(product.id);
      onAddToCart(product);
      
      // Resetear la animación después de 500ms
      setTimeout(() => setClickedId(null), 500);
    }
  };

  // Animaciones
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] // easeOutQuad
      }
    } as const),
    tap: { 
      scale: 0.95,
      transition: { 
        duration: 0.1 
      } 
    } as const
  } as const;

  const plusIconVariants = {
    initial: { scale: 1 },
    animate: (clicked: boolean) => ({
      scale: clicked ? 1.5 : 1,
      rotate: clicked ? 180 : 0,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 15
      }
    } as const)
  } as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            custom={index % 6} // Para stagger effect
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              transition: { duration: 0.2 }
            }}
            whileTap="tap"
            onClick={() => handleProductClick(product)}
            className="bg-white p-4 rounded-xl border border-gray-100 cursor-pointer relative overflow-hidden group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProductClick(product);
              }
            }}
          >
            {/* Efecto de resaltado al hacer clic */}
            {clickedId === product.id && (
              <motion.div 
                className="absolute inset-0 bg-yellow-100 opacity-0"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.6 }}
              />
            )}
            
            <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:from-yellow-50 group-hover:to-yellow-100 transition-colors">
              <motion.span 
                className="text-4xl text-yellow-400"
                custom={clickedId === product.id}
                variants={plusIconVariants}
                initial="initial"
                animate={clickedId === product.id ? 'animate' : 'initial'}
              >
                {clickedId === product.id ? '✓' : '🍽️'}
              </motion.span>
            </div>
            
            <div className="relative z-10">
              <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-yellow-600 font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
                <motion.span 
                  className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {product.category}
                </motion.span>
              </div>
            </div>
            
            {/* Efecto de hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-300 rounded-xl pointer-events-none transition-all duration-300" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;