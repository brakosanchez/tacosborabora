'use client';

import dynamic from 'next/dynamic';

// Importar motion de Framer Motion con SSR deshabilitado
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { 
  ssr: false 
});

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: 'Ingredientes Frescos',
    description: 'Utilizamos solo los ingredientes más frescos y de la más alta calidad para garantizar el mejor sabor en cada bocado.',
    icon: '🍅'
  },
  {
    title: 'Sabor Auténtico',
    description: 'Nuestras recetas tradicionales te transportarán directamente a las playas de Bora Bora con cada mordida.',
    icon: '🌶️'
  },
  {
    title: 'Experiencia Tropical',
    description: 'Disfruta de un ambiente único que combina los sabores de México con la esencia de la isla del sabor.',
    icon: '🏝️'
  },
  {
    title: 'Servicio Excepcional',
    description: 'Nuestro equipo está comprometido en ofrecerte una experiencia gastronómica inolvidable y un servicio de primera.',
    icon: '👨‍🍳'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bebas text-dark-brown mb-4">
           🔥 Una experiencia que despierta tus sentidos 🔥
          </h2>
          <div className="w-24 h-1 bg-yellow-700 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600">
            En Tacos Bora Bora fusionamos la auténtica cocina mexicana con la frescura de los sabores tropicales, 
            creando una experiencia única que te transportará a la Isla del Sabor.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <MotionDiv 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-600 text-xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
