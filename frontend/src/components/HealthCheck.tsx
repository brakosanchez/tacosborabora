'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function HealthCheck() {
  const [status, setStatus] = useState<string>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatus('healthy');
      toast.success('Conexión exitosa con el backend');
    } catch (err) {
      setStatus('unhealthy');
      setError(err instanceof Error ? err.message : 'Error desconocido');
      toast.error('No se pudo conectar con el backend');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Estado de la Conexión</h3>
      <div className="flex items-center">
        <div className={`w-4 h-4 rounded-full mr-2 ${
          status === 'healthy' ? 'bg-green-500' : 
          status === 'unhealthy' ? 'bg-red-500' : 
          'bg-yellow-500'
        }`} />
        <span className={`font-medium ${
          status === 'healthy' ? 'text-green-600' : 
          status === 'unhealthy' ? 'text-red-600' : 
          'text-yellow-600'
        }`}>
          {status === 'healthy' ? 'Conectado' : 
          status === 'unhealthy' ? 'Desconectado' : 
          'Verificando...'}
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2">Error: {error}</p>
      )}
    </div>
  );
}
