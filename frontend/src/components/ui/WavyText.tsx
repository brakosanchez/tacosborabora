'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect } from 'react';

interface WavyTextProps {
  text: string;
  className?: string;
  delay?: number;
  y?: number;
}

const WavyText: React.FC<WavyTextProps> = ({
  text,
  className = '',
  delay = 0,
  y = 10,
}) => {
  // Dividir el texto en caracteres, incluyendo espacios
  const characters = Array.from(text);
  
  // Variante para el contenedor
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  // Variante para cada letra
  const letter: Variants = {
    hidden: {
      opacity: 0,
      y: y,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 12,
        delay: i * 0.03,
      },
    }),
  };

  return (
    <motion.span
      style={{ display: 'inline-flex', overflow: 'hidden' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={letter}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default WavyText;
