import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#FCB235]/30"></div>
      </div>
      <div className="relative flex items-center">
        <div className="w-8 h-8 bg-[#FCB235] opacity-20 rounded-full blur-sm mx-2"></div>
        <motion.h2 
          className="text-3xl font-bebas text-[#FCB235] px-4 bg-black z-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.h2>
        <div className="w-8 h-8 bg-[#FCB235] opacity-20 rounded-full blur-sm mx-2"></div>
      </div>
    </div>
  );
};

export default SectionTitle;
