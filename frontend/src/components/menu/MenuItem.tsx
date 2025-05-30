import React from 'react';
import Image from 'next/image';

interface MenuItemProps {
  name: string;
  price: number;
  description?: string;
  image?: string;
  emoji?: string;
}

const getTacoImage = (name: string): string => {
  const tacoImages: Record<string, string> = {
    'Bistec': '/productos/tacos/tacodebistec.png',
    'Longaniza': '/productos/tacos/tacodelonganiza.png',
    'Pollo': '/productos/tacos/tacodepollo.png',
    'Aguja': '/productos/tacos/tacodeaguja.png',
    'Campechano Bistec': '/productos/tacos/tacocampebistec.png',
    'Campechano Pollo': '/productos/tacos/tacocampepollo.png',
    'Cecina': '/productos/tacos/tacodececina.png',
    'Arrachera': '/productos/tacos/tacodearrachera.png',
    'Mixiote': '/productos/tacos/tacodemixiote.png',
  };

  return tacoImages[name] || '';
};

const MenuItem: React.FC<MenuItemProps> = ({ 
  name, 
  price, 
  description, 
  image,
  emoji = '🌮' 
}) => {
  const tacoImage = image || getTacoImage(name);

  return (
    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-[#FCB235]/30 transition-colors h-full">
      {tacoImage ? (
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image 
            src={tacoImage} 
            alt={name} 
            fill
            className="object-contain"
            sizes="(max-width: 768px) 64px, 64px"
          />
        </div>
      ) : (
        <span className="text-4xl flex-shrink-0">{emoji}</span>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[#FCB235] text-lg font-medium font-yeseva">{name}</h3>
          <span className="text-lg text-[#FCB235] font-bold whitespace-nowrap">${price}</span>
        </div>
        {description && (
          <p className="text-gray-300 text-sm mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
