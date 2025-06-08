'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DineInOptionsProps {
  onNext: () => void;
  onBack: () => void;
}

const DineInOptions: React.FC<DineInOptionsProps> = ({ onNext, onBack }) => {
  const [reservationTime, setReservationTime] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [orderNow, setOrderNow] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNow === null) return;
    
    // Validar que la hora esté dentro del rango permitido (9 AM - 4 PM)
    if (reservationTime) {
      const [hours] = reservationTime.split(':').map(Number);
      if (hours < 9 || hours >= 16) {
        alert('Por favor, selecciona una hora entre las 9:00 AM y las 4:00 PM');
        return;
      }
    }
    
    onNext();
  };
  
  // Generar opciones de hora de 9 AM a 4 PM
  const timeOptions = [];
  for (let hour = 9; hour < 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) { // Opciones cada 30 minutos
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(
        <option key={timeString} value={timeString}>
          {`${hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`}
        </option>
      );
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/10"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Reserva tu mesa</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Hora de llegada</label>
          <select
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="">Selecciona una hora</option>
            {timeOptions}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Número de personas</label>
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'persona' : 'personas'}
              </option>
            ))}
            <option value="9">9 o más personas</option>
          </select>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-medium mb-2">¿Deseas ordenar ahora o prefieres ver el menú en el restaurante?</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOrderNow(true)}
              className={`p-4 rounded-lg border-2 transition-all ${
                orderNow === true
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-gray-600 hover:border-orange-400/50'
              }`}
            >
              <div className="text-3xl mb-2">🍽️</div>
              <span className="font-medium">Ordenar ahora</span>
              <p className="text-xs mt-1">Ver menú y ordenar</p>
            </button>
            
            <button
              type="button"
              onClick={() => setOrderNow(false)}
              className={`p-4 rounded-lg border-2 transition-all ${
                orderNow === false
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-gray-600 hover:border-orange-400/50'
              }`}
            >
              <div className="text-3xl mb-2">📋</div>
              <span className="font-medium">Ordenar después</span>
              <p className="text-xs mt-1">Ver menú en el lugar</p>
            </button>
          </div>
        </div>
        
        <div className="pt-2 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={orderNow === null}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              orderNow === null
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {orderNow === true ? 'Ver menú' : 'Reservar mesa'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default DineInOptions;
