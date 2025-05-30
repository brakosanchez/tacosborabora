import React, { ReactNode } from 'react';

interface MenuSectionProps {
  title: React.ReactNode; // Cambiado a ReactNode para aceptar elementos React
  children: ReactNode;
  columns?: number;
}

const MenuSection: React.FC<MenuSectionProps> = ({ 
  title, 
  children, 
  columns = 2 
}) => {
  return (
    <section className="mb-12">
      <div className="max-w-6xl mx-auto bg-[#1a120b] rounded-xl p-4 sm:p-6 border border-[#FCB235]/20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-yeseva text-[#FCB235] text-center mb-6 md:mb-8 pb-3 md:pb-4 border-b border-[#FCB235]/30">
          {typeof title === 'string' ? (
            <span>{title}</span>
          ) : (
            title
          )}
        </h2>
        
        <div className={`grid grid-cols-1 ${columns > 1 ? 'md:grid-cols-2' : ''} ${columns > 2 ? 'lg:grid-cols-3' : ''} gap-4 md:gap-6`}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
