'use client';

import { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '../ui/Button';

export default function ScheduleTimePicker({ onNext }: { onNext: () => void }) {
  const { state, setScheduledTime } = useOrder();
  const [selectedOption, setSelectedOption] = useState<'now' | 'later'>('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Generar opciones de tiempo disponibles (cada 15 minutos dentro del horario de atención)
  useEffect(() => {
    const times = [];
    const now = new Date();
    
    // Si es antes de las 10 AM, empezar desde las 10 AM
    const startHour = now.getHours() < 10 ? 10 : now.getHours();
    // Si es después de las 8 PM, no permitir pedidos para hoy
    const endHour = 20; // 8 PM
    
    // Redondear a los próximos 15 minutos
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    let currentHour = minutes === 60 ? startHour + 1 : startHour;
    let currentMinute = minutes === 60 ? 0 : minutes;
    
    // Si estamos en la última hora, asegurarnos de que no pasemos del cierre
    if (currentHour < endHour || (currentHour === endHour && currentMinute < 45)) {
      while (currentHour < endHour || (currentHour === endHour && currentMinute <= 45)) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        times.push(timeString);
        
        // Añadir 15 minutos
        currentMinute += 15;
        if (currentMinute >= 60) {
          currentHour++;
          currentMinute = 0;
        }
      }
    }
    
    setAvailableTimes(times);
    
    // Establecer la hora predeterminada (la más temprana disponible)
    if (times.length > 0) {
      setSelectedTime(times[0]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let scheduledTime: Date;
    
    if (selectedOption === 'now') {
      scheduledTime = new Date();
      // Redondear a los próximos 15 minutos
      const minutes = Math.ceil(scheduledTime.getMinutes() / 15) * 15;
      scheduledTime.setMinutes(minutes, 0, 0);
    } else {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      scheduledTime = new Date();
      
      // Si la hora seleccionada es anterior a la hora actual, asumir que es para mañana
      const now = new Date();
      const selectedDateObj = new Date(selectedDate);
      
      // Si no se seleccionó una fecha, usar hoy o mañana según la hora
      if (!selectedDate) {
        if (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes())) {
          // Si la hora ya pasó hoy, programar para mañana
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
      } else {
        // Usar la fecha seleccionada
        scheduledTime = new Date(selectedDate);
      }
      
      scheduledTime.setHours(hours, minutes, 0, 0);
    }
    
    setScheduledTime(scheduledTime);
    onNext();
  };

  // Calcular la fecha mínima (hoy) y máxima (7 días a partir de hoy)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-orange-500/20">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">
        {state.serviceType === 'delivery' ? '¿Cuándo lo quieres?' : '¿Cuándo vendrás por tu pedido?'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="now"
              name="scheduleOption"
              checked={selectedOption === 'now'}
              onChange={() => setSelectedOption('now')}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600"
            />
            <label htmlFor="now" className="ml-3 block text-sm font-medium text-gray-300">
              Lo antes posible
            </label>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id="later"
                name="scheduleOption"
                checked={selectedOption === 'later'}
                onChange={() => setSelectedOption('later')}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="later" className="font-medium text-gray-300 mb-2 block">
                Programar para después
              </label>
              
              {selectedOption === 'later' && (
                <div className="mt-2 space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="date"
                      min={today}
                      max={maxDateStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                      Hora
                    </label>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time} hrs
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full">
            Continuar con el pedido
          </Button>
        </div>
      </form>
    </div>
  );
}
