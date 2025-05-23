'use client';

import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect } from 'react';

// Componente para el efecto de ola en el texto
const WaveText = ({ text, className = '' }: { text: string; className?: string }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 2 + Math.random() * 2,
          ease: 'easeInOut',
        },
      },
    },
    hidden: {
      opacity: 0,
      y: 0,
    },
  };

  return (
    <motion.span
      className={`inline-flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

const Hero = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 4,
          ease: 'easeInOut',
        },
      },
    });
  }, [controls]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Fondo con gradiente y patrón */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-brown/95 to-black/80"></div>
        <div className="absolute inset-0 bg-[url('/tropical-pattern.png')] opacity-10"></div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo con efecto de ola */}
          <motion.div 
            className="relative mb-6 mx-auto w-64 h-64 md:w-80 md:h-80"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={controls}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              filter: 'drop-shadow(0 0 15px rgba(252, 178, 53, 0.8))',
              transition: { duration: 0.3 }
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -2, 2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse' as const,
                ease: 'easeInOut',
              }}
            >
              <img 
                src="/LogoBoraBora.png" 
                alt="Tacos Bora Bora" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Título principal con efecto de ola */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bebas text-yellow-500 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <span className="text-white">
                <WaveText text="Ven a la " />
              </span>
              <span className="text-yellow-500 relative">
                <WaveText text="Isla del Sabor" />
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                />
              </span>
            </div>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p 
            className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Descubre el auténtico sabor de los tacos al estilo Bora Bora. 
            Ingredientes frescos, sabores explosivos y una experiencia tropical en cada bocado.
          </motion.p>

          {/* Botones de acción */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link 
              href="/menu" 
              className="btn-primary flex items-center justify-center px-8 py-4 text-lg font-bold"
            >
              Ver Menú
              <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              href="/ordenar" 
              className="btn-secondary flex items-center justify-center px-8 py-4 text-lg font-bold"
            >
              Ordenar Ahora
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Elemento decorativo de flecha */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <svg 
          className="w-8 h-8 text-yellow-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
