'use client';

import { motion, useAnimation } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Componentes dinámicos para SSR
const DynamicMotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const DynamicMotionSpan = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.span),
  { ssr: false }
);

// Tipos
type Variants = {
  hidden: { [key: string]: any };
  visible: (i?: number) => { [key: string]: any };
};

interface WaveEffectProps {
  children: ReactNode;
  className?: string;
  offset?: number;
  duration?: number;
  delay?: number;
}

export const WaveText = ({ 
  children, 
  className = '',
  offset = 10,
  duration = 2,
  delay = 0
}: WaveEffectProps) => {
  const text = String(children);
  const letters = Array.from(text);
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.02, // Reducido para mayor fluidez
        delayChildren: 0.02 * i, // Reducido para que empiecen más rápido
      },
    }),
  };

  const child: Variants = {
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: [0, -offset, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: duration * 0.8, // Duración ligeramente más corta
          ease: [0.25, 0.1, 0.25, 1], // Curva de aceleración más suave
          delay: delay + (custom * 0.02), // Retraso reducido entre letras
        },
      },
    }),
    hidden: {
      opacity: 0.5, // Opacidad inicial ligeramente visible para evitar parpadeo
      y: 0,
    },
  };

  // Agrupar letras para reducir el número de elementos animados
  const groupedLetters = [];
  for (let i = 0; i < text.length; i += 2) {
    groupedLetters.push(text.slice(i, i + 2));
  }

  return (
    <motion.span
      className={`inline-flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {groupedLetters.map((group, index) => (
        <motion.span 
          key={index} 
          custom={index}
          variants={child}
          className="inline-block"
        >
          {group.split('').map((letter, i) => (
            <span key={`${index}-${i}`}>
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const WaveContainer = ({ 
  children, 
  className = '',
  offset = 5,
  duration = 4,
  delay = 0
}: WaveEffectProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -offset, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: duration,
          ease: 'easeInOut',
          delay: delay,
        },
      },
    });
  }, [controls, offset, duration, delay]);

  return (
    <motion.div
      className={className}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export const WaveRotate = ({ 
  children, 
  className = '',
  angle = 2,
  duration = 8,
  delay = 0
}: WaveEffectProps & { angle?: number }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: [0, -angle, angle, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: duration,
          ease: 'easeInOut',
          delay: delay,
        },
      },
    });
  }, [controls, angle, duration, delay]);

  return (
    <motion.div
      className={className}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};
