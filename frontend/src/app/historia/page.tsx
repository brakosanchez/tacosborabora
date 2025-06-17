'use client';

import { FaUtensils, FaUserTie, FaMotorcycle, FaLeaf, FaMobileAlt, FaChartLine } from 'react-icons/fa';
import Image from 'next/image';
import './gold-theme.css';

const timeline = [
  {
    year: 'Antes del inicio',
    title: 'El sueño compartido',
    description: 'Francisco Sánchez, capitán y visionario, trabajó muchos años en restaurantes y discotecas. Soñaba con tener su propio negocio. Abraham Sánchez, su hijo y taquero, volvió de León tras un fallido emprendimiento.',
    icon: <FaUserTie className="text-2xl text-amber-400" />
  },
  {
    year: 'Julio 2021',
    title: 'Nace Bora Bora en pandemia',
    description: 'En plena pandemia, nace el primer puesto de tacos Bora Bora en la cochera de casa. Solo se vendía Mixiote, y el consomé de res se agregó después. Los utensilios eran heredados de las abuelitas y de la familia.',
    icon: <FaUtensils className="text-2xl text-amber-400" />
  },
  {
    year: '2021 - 2022',
    title: 'Un giro inesperado',
    description: 'Durante una fiesta vecinal, probaron suerte en la esquina de Av. Carso. ¡Fue un éxito! Vendieron todo el producto ese mismo día. Comenzaron a vender casi a diario con un puesto de tubos y lona.',
    icon: <FaMotorcycle className="text-2xl text-amber-400" />
  },
  {
    year: '2023',
    title: 'Más variedad y sabor',
    description: 'Ampliaron la gama de bebidas y añadieron tacos a la plancha: Bistec, Longaniza y Aguja. Para diciembre de 2024, sumaron Pollo, Cecina y Arrachera, además de más variedad de salsas.',
    icon: <FaLeaf className="text-2xl text-amber-400" />
  },
  {
    year: '2025',
    title: 'Innovación y expansión',
    description: 'Desarrollo de una app web para gestión de pedidos, ventas y control de insumos. Preparación de materiales de capacitación y planes para lanzar ensaladas frescas mientras se fortalece la marca Bora Bora.',
    icon: <FaMobileAlt className="text-2xl text-amber-400" />
  }
];

const teamMembers = [
  {
    name: 'Francisco Sánchez',
    role: 'Fundador & Capitán',
    bio: 'Con años de experiencia en restaurantes, convirtió su sueño en realidad con dedicación y pasión por la cocina tradicional mexicana.',
    image: '/images/francisco.jpg'
  },
  {
    name: 'Abraham Sánchez',
    role: 'Taquero & Co-Fundador',
    bio: 'Especialista en cortes de carne y recetas tradicionales, combina técnicas modernas con sabores auténticos heredados de generaciones.',
    image: '/images/abraham.jpg'
  }
];

export default function HistoriaPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 to-black/90"></div>
        </div>
        <div className="text-center px-4 py-20 w-full max-w-6xl mx-auto relative z-10">
          <div className="inline-block mb-6">
            <span className="text-amber-400 text-lg font-medium tracking-widest">
              NUESTRA HISTORIA
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #f9f3a1 100%)',
              WebkitBackgroundClip: 'text',
              textShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
            }}
          >
            La Isla del Sabor
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Del corazón de México a tu paladar, una tradición familiar que se convierte en tu experiencia culinaria favorita.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #f9f3a1 100%)',
                WebkitBackgroundClip: 'text',
                textShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
              }}
            >
              Nuestro Viaje
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto my-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Desde nuestros humildes comienzos hasta convertirnos en un referente de sabor y tradición.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400/20 via-amber-400 to-amber-400/20 transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            <div className="space-y-20">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="md:w-1/2 p-6">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-8 h-full">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-full mr-4">
                          {item.icon}
                        </div>
                        <span className="text-amber-400 font-medium">{item.year}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center md:w-1/2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 border-4 border-black z-10"></div>
                  </div>
                  <div className="md:hidden flex items-center justify-center py-6">
                    <div className="w-6 h-6 rounded-full bg-amber-400 border-4 border-black z-10"></div>
                  </div>
                  <div className="md:hidden w-full p-6">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-8">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-full mr-4">
                          {item.icon}
                        </div>
                        <span className="text-amber-400 font-medium">{item.year}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #f9f3a1 100%)',
                WebkitBackgroundClip: 'text',
                textShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
              }}
            >
              Nuestro Equipo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto my-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conoce al equipo que hace posible la magia de Bora Bora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative">
                <div className="relative overflow-hidden rounded-xl border border-amber-400/20 transition-all duration-500 group-hover:border-amber-400/40">
                  <div className="aspect-w-4 aspect-h-5 w-full overflow-hidden">
                    <div className="w-full h-96 bg-gradient-to-br from-amber-900/20 to-black/80">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaUserTie className="text-amber-400/20 text-9xl" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-gradient-to-t from-black to-gray-900/80">
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-amber-400 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-300">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vision Section */}
          <div className="mt-24 text-center max-w-4xl mx-auto">
            <div className="inline-block p-2 bg-amber-500/10 rounded-full mb-6">
              <FaChartLine className="text-amber-400 text-2xl" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Nuestra Visión</h3>
            <p className="text-xl text-gray-300 mb-8">
              En Tacos Bora Bora, creemos que el esfuerzo merece recompensa. Nos esforzamos por ofrecer un servicio cercano, un sabor que conquista y una experiencia que te transporta a una isla de sabor en el corazón de Nextlalpan.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium">🫶 Servicio Cercano</span>
              <span className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium">🔥 Sabor que Conquista</span>
              <span className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium">🏖️ Experiencia Única</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
