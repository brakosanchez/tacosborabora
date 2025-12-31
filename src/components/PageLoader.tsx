'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ParticleBackground from './ParticleBackground';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Iniciar animación de carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Cuando el progreso llegue al 100%
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [progress]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <ParticleBackground 
        particleCount={30}
        particleColor="rgba(252, 178, 53, 0.2)"
        minSize={1}
        maxSize={5}
        minDuration={8}
        maxDuration={20}
        className="absolute inset-0"
      />
      
      <div className="relative z-10 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="flame-effect">
            <Image
              src="/images/logo/Logo1000px.png"
              alt="Tacos Bora Bora"
              width={200}
              height={200}
              className="w-full h-full object-contain animate-pulse"
              priority
            />
          </div>
        </div>
        
        <div className="text-bora-yellow font-bebas text-xl tracking-wider mb-4">
          CARGANDO LA ISLA DEL SABOR...
        </div>
        
        <div className="w-48 h-1.5 bg-bora-yellow/20 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-bora-yellow to-bora-red"
            style={{
              width: `${progress}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
        
        <div className="mt-2 text-bora-yellow/80 text-sm">
          {progress}%
        </div>
      </div>
    </div>
  );
}
