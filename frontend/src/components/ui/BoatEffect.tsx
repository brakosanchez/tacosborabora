'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface BoatEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}

const BoatEffect: React.FC<BoatEffectProps> = ({
  children,
  className = '',
  intensity = 1,
  duration = 8,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (!isInView) return;
    
    const animate = async () => {
      while (isInView) {
        // Movimiento de balanceo más intenso y variable
        const rotation1 = (Math.random() * 2 - 1) * intensity * 3;
        const rotation2 = (Math.random() * 2 - 1) * intensity * 4;
        const rotation3 = (Math.random() * 2 - 1) * intensity * 3.5;
        
        const y1 = (Math.random() * 10 - 5) * intensity;
        const y2 = (Math.random() * 10 - 5) * intensity;
        const y3 = (Math.random() * 10 - 5) * intensity;
        
        const currentDuration = duration * (0.8 + Math.random() * 0.4); // Variación de duración
        
        await controls.start({
          rotate: [0, rotation1, rotation2, rotation3, 0],
          y: [0, y1, y2, y3, 0],
          x: [0, intensity * 5, -intensity * 3, intensity * 2, 0],
          transition: {
            duration: currentDuration,
            ease: 'easeInOut',
            times: [0, 0.3, 0.6, 0.9, 1],
            repeat: Infinity,
            repeatType: 'reverse',
          },
        });
      }
    };

    animate();
    
    return () => {
      controls.stop();
    };
  }, [controls, isInView, intensity, duration]);

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={controls}
      initial={{ rotate: 0, y: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default BoatEffect;
