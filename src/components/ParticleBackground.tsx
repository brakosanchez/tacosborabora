'use client';

import { useEffect, useState } from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  className?: string;
}

export default function ParticleBackground({
  particleCount = 20,
  particleColor = 'rgba(234, 179, 8, 0.1)', // Color amarillo con transparencia
  minSize = 2,
  maxSize = 8,
  minDuration = 10,
  maxDuration = 20,
  className = ''
}: ParticleBackgroundProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0">
        {[...Array(particleCount)].map((_, i) => {
          const size = Math.random() * (maxSize - minSize) + minSize;
          const duration = Math.random() * (maxDuration - minDuration) + minDuration;
          const delay = Math.random() * 5;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: particleColor,
                animation: `float ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) translateX(-5px);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.3;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
