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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      // El endpoint de health está en la raíz, no en /api/health
      const healthUrl = `${apiUrl}/api/health`;
      
      console.log(`[HealthCheck] Checking health at: ${healthUrl}`);
      
      // Usar AbortController para manejar timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
      
      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('[HealthCheck] Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[HealthCheck] Failed with status:', response.status, 'Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('[HealthCheck] Response data:', data);
        
        const isHealthy = data?.status === 'healthy';
        
        setIsOnline(isHealthy);
        setLastCheck(new Date());
        return isHealthy;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.error('[HealthCheck] Request timed out');
          throw new Error('La solicitud ha excedido el tiempo de espera');
        }
        throw error;
      }
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

  // Mostrar estado de carga hasta la primera verificación
  if (isOnline === null) {
    return (
      <div 
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 ${className}`}
        title="Verificando estado del servidor..."
      >
        <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Conectando...
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 ${className}`}
      title={`Última verificación: ${lastCheck ? lastCheck.toLocaleTimeString() : 'Nunca'}`}
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
