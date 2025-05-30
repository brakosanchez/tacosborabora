'use client';

import { useEffect, useState } from 'react';

interface HealthCheckProps {
  className?: string;
}

export default function HealthCheck({ className = '' }: HealthCheckProps) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      setIsOnline(response.ok);
      setLastCheck(new Date());
      return response.ok;
    } catch (error) {
      console.error('Error checking health:', error);
      setIsOnline(false);
      setLastCheck(new Date());
      return false;
    }
  };

  useEffect(() => {
    // Verificar al montar
    checkHealth();

    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // No mostrar nada hasta la primera verificación
  if (isOnline === null) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 ${className}`}
      title={lastCheck ? `Última verificación: ${lastCheck.toLocaleTimeString()}` : ''}
    >
      <span 
        className={`w-3 h-3 rounded-full transition-colors ${
          isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'
        }`}
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {isOnline ? 'Conectado' : 'Sin conexión'}
      </span>
    </div>
  );
}
