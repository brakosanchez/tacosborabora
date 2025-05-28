import React from 'react';
import { motion } from 'framer-motion';

type ServiceType = 'dine-in' | 'takeout';

interface ServiceTypeSelectorProps {
  onSelect: (type: ServiceType) => void;
  selectedType: ServiceType | null;
}
const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({ onSelect, selectedType }) => {
  const serviceTypes = [
    {
      id: 'dine-in',
      title: 'Para comer aquí',
      description: 'Disfruta tu comida en nuestro local',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 'takeout',
      title: 'Para llevar',
      description: 'Recoge tu pedido en el mostrador',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {serviceTypes.map((service) => (
        <motion.button
          key={service.id}
          type="button"
          onClick={() => onSelect(service.id as ServiceType)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl text-left transition-all duration-200 ${
            selectedType === service.id
              ? 'bg-orange-500 text-white border-2 border-orange-500'
              : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-orange-400'
          }`}
        >
          <div className="flex items-start">
            <div className={`p-2 rounded-lg ${
              selectedType === service.id ? 'bg-white/20' : 'bg-gray-700'
            }`}>
              {service.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-sm mt-1">{service.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ServiceTypeSelector;
