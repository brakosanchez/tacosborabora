'use client';

import { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import Button from '../ui/Button';

interface PaymentSectionProps {
  onBack: () => void;
}

type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export default function PaymentSection({ onBack }: PaymentSectionProps) {
  const { state, setPaymentMethod, submitOrder } = useOrder();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const calculateTotal = () => {
    const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = subtotal * 0.16;
    return (subtotal + iva).toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setPaymentMethod(selectedMethod);
      
      // Simular envío de orden al servidor
      const response = await submitOrder();
      
      // En una implementación real, esto vendría del servidor
      setOrderNumber(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderSuccess(true);
      
      // Redirigir a la página de confirmación después de 3 segundos
      setTimeout(() => {
        // Aquí iría la redirección a la página de confirmación
        console.log('Redirigiendo a la página de confirmación...');
      }, 3000);
      
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      // Mostrar mensaje de error
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'efectivo', label: 'Efectivo', icon: '💵' },
    { id: 'tarjeta', label: 'Tarjeta', icon: '💳' },
    { id: 'transferencia', label: 'Transferencia', icon: '🏦' },
  ];

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-green-500/20 text-center">
        <div className="text-green-400 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">¡Pedido realizado con éxito!</h2>
        <p className="text-gray-300 mb-6">Tu pedido ha sido registrado correctamente.</p>
        
        <div className="bg-white/5 p-6 rounded-lg mb-6">
          <p className="text-gray-300">Número de pedido:</p>
          <p className="text-2xl font-bold text-orange-400">{orderNumber}</p>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-300">Total a pagar:</p>
            <p className="text-3xl font-bold">${calculateTotal()}</p>
            
            {selectedMethod === 'efectivo' && (
              <p className="mt-2 text-sm text-gray-400">Paga al momento de recibir tu pedido</p>
            )}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm">Te hemos enviado un correo con los detalles de tu pedido.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 rounded-xl backdrop-blur-sm border border-orange-500/20 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-400 mb-6">Método de pago</h2>
          
          <div className="space-y-4 mb-8">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div>
                    <h3 className="font-medium">{method.label}</h3>
                    {method.id === 'efectivo' && (
                      <p className="text-sm text-gray-400">Paga al recibir tu pedido</p>
                    )}
                    {method.id === 'tarjeta' && (
                      <p className="text-sm text-gray-400">Pago con tarjeta de crédito/débito</p>
                    )}
                    {method.id === 'transferencia' && (
                      <p className="text-sm text-gray-400">Transferencia bancaria</p>
                    )}
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id 
                        ? 'border-orange-500 bg-orange-500' 
                        : 'border-gray-500'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Detalles del pago */}
          <div className="bg-black/30 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-3">Resumen del pedido</h3>
            <div className="space-y-2">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.quantity} × {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(parseFloat(calculateTotal()) / 1.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>IVA (16%)</span>
                <span>${(parseFloat(calculateTotal()) * 0.16).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-400">${calculateTotal()}</span>
              </div>
            </div>
          </div>
          
          {/* Términos y condiciones */}
          <div className="mb-6">
            <label className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                className="mt-1 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
                required
              />
              <span className="text-sm text-gray-300">
                Acepto los <a href="/terminos" className="text-orange-400 hover:underline">Términos y Condiciones</a> y la 
                <a href="/privacidad" className="text-orange-400 hover:underline ml-1">Política de Privacidad</a>
              </span>
            </label>
          </div>
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Regresar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Nota importante */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg text-sm text-blue-200">
        <p className="font-medium">Nota importante:</p>
        <p className="mt-1">
          {selectedMethod === 'efectivo' 
            ? 'Por favor, ten el pago exacto listo. Nuestro repartidor no siempre tendrá cambio disponible.'
            : selectedMethod === 'tarjeta'
            ? 'Serás redirigido a una pasarela de pago segura para completar tu transacción.'
            : 'Por favor, envía el comprobante de pago al número de WhatsApp 123-456-7890 con tu número de pedido.'}
        </p>
      </div>
    </div>
  );
}
