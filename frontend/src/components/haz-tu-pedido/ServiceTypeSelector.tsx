'use client';

import { motion } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';

type ServiceType = 'dine-in' | 'takeaway' | 'delivery';

const serviceTypes = [
  {
    id: 'dine-in',
    title: 'Comer aquí',
    description: 'Disfruta de nuestros tacos en el local',
    icon: '🍽️',
  },
  {
    id: 'takeaway',
    title: 'Para llevar',
    description: 'Recoge tu pedido en nuestro local',
    icon: '🚗',
  },
  {
    id: 'delivery',
    title: 'A domicilio',
    description: 'Te lo llevamos hasta tu casa',
    icon: '🏠',
  },
] as const;

export default function ServiceTypeSelector() {
  const { setServiceType } = useOrder();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-500 font-bebas">
        ¿CÓMO QUIERES TU PEDIDO?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTypes.map((service) => (
          <motion.button
            key={service.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex flex-col items-center text-center"
            onClick={() => setServiceType(service.id as ServiceType)}
          >
            <span className="text-5xl mb-4" role="img" aria-label={service.title}>
              {service.icon}
            </span>
            <h3 className="text-xl font-bold text-orange-400 mb-2">
              {service.title}
            </h3>
            <p className="text-gray-300">{service.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
