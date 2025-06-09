'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { WaveContainer, WaveRotate, WaveText } from './ui/WaveEffect';

// Texto con efecto de ola optimizado
const AnimatedTitle = () => {
  // Usar useMemo para evitar recrear los componentes en cada render
  const TitlePart = ({ text, className = '', offset = 8, delay = 0 }) => (
    <WaveText 
      offset={offset} 
      duration={2.5} // Duración reducida para más fluidez
      delay={delay}
      className={className}
    >
      {text}
    </WaveText>
  );

  return (
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas text-yellow-500 mb-6">
      <div className="relative">
        <span className="text-white">
          <TitlePart text="Ven a la " offset={6} />
        </span>
        <span className="text-yellow-500">
          <TitlePart text="Isla del Sabor" offset={8} delay={0.1} />
        </span>
      </div>
    </h1>
  );
};

// Contenedor del logo con efecto de ola optimizado
const AnimatedLogo = () => {
  return (
    <div className="relative mb-6 mx-auto w-64 h-64 md:w-80 md:h-80">
      <WaveContainer offset={6} duration={3.5}>
        <WaveRotate angle={1.5} duration={6}>
          <img 
            src="/LogoBoraBora.png" 
            alt="Tacos Bora Bora" 
            className="w-full h-full object-contain"
            loading="eager"
          />
        </WaveRotate>
      </WaveContainer>
    </div>
  );
};

const Hero = () => {

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 md:py-32">
      {/* Contenido */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo con efecto de ola */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              filter: 'drop-shadow(0 0 15px rgba(252, 178, 53, 0.8))',
              transition: { duration: 0.3 }
            }}
          >
            <AnimatedLogo />
          </motion.div>

          {/* Título principal con efecto de ola */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedTitle />
          </motion.div>

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
            className="flex flex-col sm:flex-row justify-center gap-10 mb-4 md:mb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link 
              href="/menu" 
              className="btn-primary flex items-center justify-center px-10 py-1 text-lg font-unbounded"
            >
              Ver Menú
              <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              href="/haz-tu-pedido" 
              className="btn-secondary flex items-center justify-center px-10 py-1 text-lg font-unbounded"
            >
              Ordenar Ahora
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
