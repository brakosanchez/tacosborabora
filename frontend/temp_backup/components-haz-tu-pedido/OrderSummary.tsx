'use client';

import { useOrder } from '@/context/OrderContext';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OrderSummary({ onEdit, onSubmit }: { onEdit: () => void; onSubmit: () => void }) {
  const { state } = useOrder();
  const { items, customerInfo, scheduledTime, serviceType } = state;

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const iva = subtotal * 0.16; // 16% de IVA
  const total = subtotal + iva;

  // Formatear la fecha y hora
  const formatDateTime = (date: Date) => {
    return format(date, "EEEE d 'de' MMMM 'a las' hh:mm a", { locale: es });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-orange-500/20">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Resumen de tu pedido</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Detalles del pedido */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Tu pedido</h3>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start border-b border-gray-700 pb-4">
                <div>
                  <p className="font-medium text-gray-200">
                    {item.quantity} × {item.name}
                  </p>
                  {item.customizations && (
                    <div className="mt-1 text-sm text-gray-400">
                      {item.customizations.tortilla === 'harina' && <p>• Tortilla de harina</p>}
                      {item.customizations.queso && <p>• Extra queso</p>}
                      {item.customizations.acompanamiento !== 'nada' && (
                        <p>• Acompañamiento: {item.customizations.acompanamiento}</p>
                      )}
                    </div>
                  )}
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Resumen de precios */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-300">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700 pb-4">
              <span className="text-gray-300">IVA (16%):</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-4 font-bold text-lg">
              <span>Total:</span>
              <span className="text-orange-400">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Información del cliente y entrega */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Información de contacto</h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-200">{customerInfo.nombre}</p>
              <p className="text-gray-400">{customerInfo.telefono}</p>
              {customerInfo.email && <p className="text-gray-400">{customerInfo.email}</p>}
              
              {serviceType === 'delivery' && customerInfo.direccion && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <h4 className="font-medium text-gray-200 mb-1">Dirección de entrega:</h4>
                  <p className="text-gray-400">
                    {customerInfo.direccion.calle} {customerInfo.direccion.numero}<br />
                    {customerInfo.direccion.colonia}<br />
                    {customerInfo.direccion.ciudad}, {customerInfo.direccion.estado}<br />
                    CP: {customerInfo.direccion.codigoPostal}
                    {customerInfo.direccion.referencias && (
                      <>
                        <br />
                        <span className="font-medium">Referencias:</span> {customerInfo.direccion.referencias}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Tipo de servicio</h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-200 capitalize">
                {serviceType === 'dine-in' ? 'Comer en el local' : 
                 serviceType === 'takeaway' ? 'Para llevar' : 'A domicilio'}
              </p>
              <p className="text-gray-400">
                {scheduledTime ? (
                  `Programado para: ${formatDateTime(new Date(scheduledTime))}`
                ) : 'Lo antes posible'}
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              type="button" 
              onClick={onEdit}
              variant="outline"
              className="w-full"
            >
              Editar pedido
            </Button>
            <Button 
              type="button" 
              onClick={onSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Confirmar y pagar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
