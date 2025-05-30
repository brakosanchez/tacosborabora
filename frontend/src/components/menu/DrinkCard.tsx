'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface DrinkCardProps {
  name: string;
  description: string;
  price: number;
  image?: string;
  emoji?: string;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ name, description, price, image, emoji }) => {
  return (
    <motion.div 
      className="bg-[#1a120b] rounded-lg overflow-hidden border border-[#FCB235]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#FCB235]/40"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          {image ? (
            <div className="w-16 h-16 relative mr-4">
              <Image 
                src={image} 
                alt={name} 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center text-4xl mr-4">
              {emoji || '🍹'}
            </div>
          )}
          <h3 className="text-xl font-yeseva text-[#FCB235] flex-1">{name}</h3>
          <span className="text-lg font-bold text-white bg-[#FCB235] px-3 py-1 rounded-full">
            ${price}
          </span>
        </div>
        <p className="text-gray-300 text-sm font-unbounded">{description}</p>
      </div>
    </motion.div>
  );
};

export default DrinkCard;
