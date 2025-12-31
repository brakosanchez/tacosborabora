'use client';

import { Heart, Users, Award, Calendar, ChefHat, Home, MapPin, Clock, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import { teamMembers } from '@/config/team';

// Componente TimelineItem
const TimelineItem = ({ date, title, description, isLast = false }: { date: string; title: string; description: string; isLast?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div 
      ref={ref}
      className="relative pl-8 pb-8"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        }
      }}
    >
      {!isLast && (
        <motion.div 
          className="absolute left-3.5 top-4 -bottom-4 w-0.5 bg-bora-yellow/30"
          initial={{ scaleY: 0, originY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      )}
      <motion.div 
        className="absolute left-0 w-7 h-7 rounded-full bg-bora-yellow flex items-center justify-center z-10"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
      >
        <motion.div 
          className="w-3 h-3 rounded-full bg-white"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.4 }}
        />
      </motion.div>
      <div className="ml-2">
        <motion.span 
          className="text-bora-yellow font-medium text-sm block mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.3 }}
        >
          {date}
        </motion.span>
        <motion.h4 
          className="font-bebas text-2xl md:text-3xl text-white mt-1 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.4 }}
        >
          {title}
        </motion.h4>
        <motion.p 
          className="text-gray-300 text-base md:text-lg mt-1 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.5 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Componente TeamMember con acordeón
const TeamMember = ({ name, role, bio, image, small = false }: { name: string; role: string; bio: string; image: string; small?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300 ${small ? 'flex flex-col items-center text-center cursor-pointer' : 'text-center'} hover:shadow-lg hover:shadow-bora-yellow/10`}
      onClick={() => small && setIsExpanded(!isExpanded)}
    >
      <div className={`${small ? 'w-16 h-16' : 'w-32 h-32 mx-auto mb-4'} rounded-full overflow-hidden border-2 border-bora-yellow/50 flex-shrink-0`}>
        <Image 
          src={image}
          alt={name}
          width={small ? 64 : 128}
          height={small ? 64 : 128}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/placeholder-user.jpg';
          }}
        />
      </div>
      <div className={`${small ? 'w-full' : ''} transition-all duration-300`}>
        <h3 className={`font-bebas ${small ? 'text-xl' : 'text-2xl'} text-bora-yellow glow-title`}>
          {name}
          {small && (
            <span className="ml-2 text-bora-yellow/70">
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </h3>
        <p className="text-bora-orange text-sm mb-1">{role}</p>
        
        {small ? (
          <div 
            className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-2' : 'max-h-0'}`}
          >
            <p className="text-gray-300 text-sm bg-bora-brown/20 p-2 rounded">
              {bio}
            </p>
          </div>
        ) : (
          <p className="text-gray-300 text-sm">{bio}</p>
        )}
      </div>
    </div>
  );
};

// Componente para la banca con acordeón
const BenchMember = ({ name, role, description, image }: { name: string; role: string; description: string; image: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-bora-yellow/30 mr-3 flex-shrink-0">
          <Image 
            src={image}
            alt={name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/placeholder-user.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bebas text-lg text-bora-yellow truncate">{name}</h4>
              <p className="text-xs text-bora-orange">{role}</p>
            </div>
            <span className="ml-2 text-bora-yellow/70 text-sm">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
          <div 
            className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-2' : 'max-h-0'}`}
          >
            <p className="text-xs text-gray-300 bg-bora-brown/10 p-2 rounded">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function HistoriaPage() {
  // Estado para controlar si estamos en el cliente (para hidratación)
  const [isClient, setIsClient] = useState(false);
  
  // Efecto para marcar que estamos en el cliente
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true);
  }
  return (
    <div 
      className="min-h-screen relative text-white" 
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Fondo con efecto de partículas */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-bora-brown/5 to-black">
          {/* Efecto de partículas */}
          <ParticleBackground 
            particleCount={30}
            particleColor="rgba(234, 179, 8, 0.1)"
            minSize={1}
            maxSize={6}
            minDuration={10}
            maxDuration={25}
          />
          
          {/* Efecto de luz suave */}
          <div className="absolute inset-0 bg-gradient-to-b from-bora-yellow/5 via-transparent to-bora-orange/5"></div>
          
          {/* Efecto de grano sutil */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
          }}></div>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative min-h-[95vh] pt-28 md:pt-36 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90">
              <div className="absolute inset-0 opacity-30" style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.1) 0%, rgba(0,0,0,0) 70%)'
              }}></div>
            </div>
          </div>
          
          <div className="container-bora relative z-10 px-4">
            <div className="max-w-5xl mx-auto text-center">
              {/* Elementos decorativos flotantes */}
              <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-bora-yellow/5 blur-3xl"></div>
              <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-bora-orange/5 blur-3xl"></div>
              
              {/* Título principal con efecto de gradiente */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="font-bebas text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-bora-yellow via-bora-orange to-amber-200 mb-4 leading-none glow-title">
                  <span className="block">HISTORIA</span>
                  <span className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider">TACOS BORA BORA</span>
                </h1>
              </motion.div>
              
              {/* Línea decorativa */}
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-transparent via-bora-yellow to-transparent mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
              
              {/* Subtítulo con efecto de aparición */}
              <motion.div
                className="relative inline-block max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-bora-yellow/5 to-bora-orange/5 rounded-2xl blur-xl -z-10"></div>
                <p className="font-yeseva text-xl md:text-2xl text-gray-200 px-8 py-6 backdrop-blur-sm rounded-xl border border-bora-yellow/20 relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-br from-bora-yellow/5 to-transparent opacity-50"></span>
                  <span className="relative z-10">
                    De la cochera familiar a una experiencia culinaria inolvidable. <span className="text-bora-yellow font-semibold">Cada taco es una historia de pasión, tradición y sabor auténtico.</span>
                  </span>
                </p>
              </motion.div>
              
              {/* Flecha de scroll */}
              <motion.div 
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-bora-yellow">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              
              {/* Línea decorativa con animación */}
              <div className="mt-10 flex justify-center">
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-bora-yellow to-transparent transform transition-all duration-1000 group-hover:w-48"></div>
                <div className="w-4 h-4 rounded-full bg-bora-yellow mx-2 animate-pulse"></div>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-bora-yellow to-transparent transform transition-all duration-1000 group-hover:w-48"></div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 mt-20 md:mt-28">
          {/* Origin Story */}
          <div className="container-bora max-w-5xl px-4 mb-24">
            <div className="space-y-8">
              {/* Tarjeta 1: Inicios */}
              <div className="group bg-bora-brown/5 backdrop-blur-sm border border-bora-brown/20 rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-bora-yellow/10 flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h2 className="font-bebas text-3xl text-bora-yellow glow-title">Nuestros Inicios</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  <span className="text-bora-yellow font-medium">Todo comenzó con ganas y ganas de familia.</span> Mi nombre es Abraham Sánchez (Taquero) y junto con mi papá Francisco Sánchez (Capitán) decidimos transformar un sueño en comida: No teniamos claro donde venderiamos, pero sabiamos que el Servicio, la Calidad y el deseo de imprimir un sello familiar estaba muy claro, en nuestra comunidad era dificil pensar que un producto premium funcionara, pero justo eso inspiro nuestro nombre, Bora Bora es una Isla de la Polinesia Francesa, un pequeño lugar tropical enmedio de la nada, con riqueza cultural y gastronómica.
                </p>
              </div>

              {/* Tarjeta 2: Primeros Pasos */}
              <div className="group bg-bora-brown/5 backdrop-blur-sm border border-bora-brown/20 rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-bora-yellow/10 flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h2 className="font-bebas text-3xl text-bora-yellow glow-title">Julio 2021</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  En plena pandemia, arrancamos desde la cochera de la casa con lo que teníamos: utensilios heredados de la abuela, ollas prestadas y muchas ganas de aprender. Los primeros meses vendimos muy poco —solo fines de semana— pero cada taco que servíamos era una lección. Poco a poco fuimos puliendo recetas, probando salsas y cuidando los detalles que hoy nos definen, teniendo en claro que la calidad y la experiencia eran lo que nos diferenciaba de los demás.
                </p>
              </div>

              {/* Tarjeta 3: Punto de Inflexión */}
              <div className="group bg-bora-brown/5 backdrop-blur-sm border border-bora-brown/20 rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-bora-yellow/10 flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h2 className="font-bebas text-3xl text-bora-yellow glow-title">El Momento Clave</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Un fin de semana probamos suerte en la esquina de la Pavimentada de Nextlalpan con Alondras y aquello cambió todo: la afluencia nos permitió vender toda la mercancía y entender que estábamos en buen camino. Con el paso del tiempo volvimos a la cochera —porque preferimos mantener nuestra independencia frente a pagos municipales injustificados— y descubrimos que el espacio de la casa, con su vegetación, transmitía la identidad que queríamos: un pequeño paraíso, nuestra Isla del Sabor, un lugar para compartir un buen taco con todos ustedes.
                </p>
              </div>

              {/* Tarjeta 4: Crecimiento */}
              <div className="group bg-bora-brown/5 backdrop-blur-sm border border-bora-brown/20 rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-bora-yellow/10 flex items-center justify-center mr-4">
                    <ChefHat className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h2 className="font-bebas text-3xl text-bora-yellow glow-title">Nuestro Crecimiento</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Con el apoyo de proveedores locales fuimos creciendo: primero el Mixiote con la ayuda de mi tia Lilia y el consomé que fue una receta espontanea un fusion entre birria y jugo de carne; poco a poco hicimos alianzas con la Señora Lili Flores que aparte de surtir las verduras de su Carniceria Sol & Luna (localizada en C.Alondras a un costado de el 'Supercito') surtia las frutas, verduras y longaniza de Tacos Bora Bora,  en 2024 comenzamos a ofrecer tacos a la plancha (bistec, longaniza, aguja, pollo) y en diciembre de 2024 sumamos cecina y arrachera. Hoy, en 2025, trabajamos en nuevas ideas —ensaladas, mejor logística y una appweb— para asegurar calidad, consistencia y una experiencia que merezca la visita.
                </p>
                
                <div className="space-y-8">
                  <blockquote className="italic text-xl text-gray-200 mb-4">
                    "De nuestra cochera para el mundo: cada paso lo dimos con trabajo y con el corazón."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-bora-yellow/20 flex items-center justify-center mr-3">
                      <Heart className="w-5 h-5 text-bora-yellow" />
                    </div>
                    <span className="text-bora-yellow font-medium">Francisco Sánchez</span>
                  </div>

                  <blockquote className="italic text-xl text-gray-200 mb-4 mt-8">
                    "Cada taco, salsa y bebida, es un reto para satisfacer a nuestros clientes"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-bora-yellow/20 flex items-center justify-center mr-3">
                      <Heart className="w-5 h-5 text-bora-yellow" />
                    </div>
                    <span className="text-bora-yellow font-medium">Abraham Sánchez</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-bora-brown/5 py-16 md:py-24 overflow-hidden">
            <div className="container-bora max-w-4xl px-4">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-bebas text-5xl md:text-6xl text-bora-yellow mb-4 glow-title">NUESTRO VIAJE</h2>
                <div className="w-24 h-1 bg-bora-yellow mx-auto transform transition-all duration-1000 group-hover:w-32"></div>
              </motion.div>
              
              <div className="relative">
                <ParticleBackground 
                  particleCount={30}
                  particleColor="rgba(234, 179, 8, 0.1)"
                  minSize={1}
                  maxSize={6}
                  minDuration={10}
                  maxDuration={25}
                />
                <motion.div 
                  className="absolute left-8 top-0 bottom-0 w-0.5 bg-bora-yellow/30"
                  initial={{ scaleY: 0, originY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                
                <div className="space-y-12 md:space-y-16">
                  <TimelineItem 
                    date="JULIO 2021"
                    title="Los inicios en la cochera"
                    description="Comenzamos con mixiote y recetas familiares, vendiendo solo fines de semana desde la cochera de casa. Usando utensilios heredados y mucha pasión, cada taco era hecho con dedicación y amor por la cocina tradicional mexicana."
                  />
                  <TimelineItem 
                    date="AGOSTO 2021 - DICIEMBRE 2022"
                    title="De Ambulantes en esquina Pavimentada de Nextlalpan y Alondras"
                    description="Nos aventuramos como vendedores ambulantes en Pavimentada de Nextlalpan con un pequeño puesto tubular. Durante año y medio, aprendimos el valor del trabajo duro en las calles, atendiendo a clientes que pronto se convirtieron en fieles seguidores de nuestros sabores auténticos."
                  />
                  <TimelineItem 
                    date="2022 - 2023"
                    title="Crecimiento y consolidación"
                    description="Establecimos relaciones sólidas con proveedores locales de ingredientes frescos. Expandimos nuestra oferta de bebidas artesanales y perfeccionamos nuestras recetas familiares, manteniendo siempre la calidad y autenticidad que nos caracteriza."
                  />
                  <TimelineItem 
                    date="ENERO 2024"
                    title="Nuevos sabores en el menú"
                    description="Lanzamos nuestra exitosa línea de tacos a la plancha,gracias a mi abuelo Pepe Bautista y Mimi Bautista, incluyendo Bistec, Longaniza, Aguja y Pollo. Cada corte es marinado con nuestras especias secretas y cocinado al momento para garantizar el mejor sabor."
                  />
                  <TimelineItem 
                    date="DICIEMBRE 2024"
                    title="Expansión de menú premium"
                    description="Incorporamos cortes selectos de Cecina y Arrachera a nuestro menú principal, ofreciendo una experiencia gastronómica más completa y sofisticada para nuestros clientes más exigentes."
                  />
                  <TimelineItem 
                    date="2025"
                    title="Innovación y crecimiento"
                    description="Enfocados en llevar nuestra experiencia a más personas, trabajamos en el desarrollo de nuestra identidad de marca, aplicación móvil y menús digitales para mejorar la experiencia de nuestros clientes y mantenernos a la vanguardia."
                    isLast
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="py-16 md:py-24">
            <div className="container-bora max-w-6xl px-4">
              <div className="text-center mb-16">
                <h2 className="font-bebas text-4xl md:text-5xl text-bora-yellow mb-4">NUESTRO EQUIPO</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Detrás de cada taco hay una familia y un equipo entregado.</p>
                <div className="w-16 h-1 bg-bora-yellow mx-auto mt-4"></div>
              </div>
              
              {/* Formación del equipo */}
              <div className="max-w-4xl mx-auto mb-16">
                {/* Capitán */}
                <div className="flex justify-center mb-8">
                  <TeamMember 
                    name={teamMembers[0].name}
                    role={teamMembers[0].role}
                    bio={teamMembers[0].bio}
                    image={teamMembers[0].image}
                  />
                </div>
                
                {/* Defensa (4) - Los Pilares */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {teamMembers.slice(1, 5).map((member, index) => (
                    <TeamMember 
                      key={member.name}
                      name={member.name}
                      role={member.role}
                      bio={member.bio}
                      image={member.image}
                      small
                    />
                  ))}
                </div>
                
                {/* Media (3) - Los Creativos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {teamMembers.slice(5).map((member) => (
                    <TeamMember 
                      key={member.name}
                      name={member.name}
                      role={member.role}
                      bio={member.bio}
                      image={member.image}
                      small
                    />
                  ))}
                </div>
              </div>
              
              {/* Banca */}
              <div className="mt-16">
                <h3 className="font-bebas text-3xl text-bora-yellow text-center mb-6">NUESTRA BANCA</h3>
                <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">El equipo que nos apoya en momentos clave con toda su energía y dedicación.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <BenchMember 
                    name="Sandy Hernandez"
                    role="Especialista en Guarniciones"
                    description="Nuestro ángel guardián en momentos clave, siempre dispuesta a ayudarnos con papas y nopales cuando más lo necesitamos. Su apoyo ha sido fundamental para mantener nuestra producción en los momentos más demandantes."
                    image="/images/team/avatardefault.png"
                  />
                  <BenchMember 
                    name="Alison"
                    role="Ayudante de Fin de Semana"
                    description="Joven trabajadora que nos apoya con mucha energía y entusiasmo cada fin de semana."
                    image="/images/team/avatardefault.png"
                  />
                  <BenchMember 
                    name="Luciana"
                    role="Aprendiz"
                    description="La más pequeña del equipo, aprendiendo el valor del trabajo duro entre semana."
                    image="/images/team/avatardefault.png"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-bora-brown/10 to-bora-yellow/5 py-16">
            <div className="container-bora max-w-4xl text-center px-4">
              <h2 className="font-bebas text-4xl text-bora-yellow mb-6">¿LISTO PARA PROBAR NUESTRA HISTORIA?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Cada taco cuenta nuestra pasión por la buena comida y el servicio excepcional.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/menu" className="bg-bora-yellow hover:bg-bora-orange text-bora-brown font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block">
                  VER MENÚ COMPLETO
                </Link>
                <a href="https://wa.me/525549655305" target="_blank" rel="noopener noreferrer" className="border-2 border-bora-yellow text-bora-yellow hover:bg-bora-yellow/10 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block">
                  PEDIR A DOMICILIO
                </a>
              </div>
            </div>
          </div>

          {/* Visit Us */}
          <div className="py-16 md:py-24 bg-bora-brown/5">
            <div className="container-bora max-w-5xl px-4">
              <div className="text-center mb-12">
                <h2 className="font-bebas text-4xl md:text-5xl text-bora-yellow mb-4">VISÍTANOS</h2>
                <div className="w-16 h-1 bg-bora-yellow mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-black/80 backdrop-blur-sm rounded-lg border border-bora-yellow/20 shadow-lg shadow-black/30 hover:shadow-bora-yellow/10 hover:border-bora-yellow/40 transition-all duration-300">
                  <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                    <MapPin className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h3 className="font-yeseva text-xl text-bora-yellow mb-3 glow-title">Ubicación</h3>
                  <p className="text-gray-200 leading-relaxed">Alondras 410, Los Aguiluchos<br/>Nextlalpan, Estado de México, 55796</p>
                </div>
                
                <div className="text-center p-6 bg-black/80 backdrop-blur-sm rounded-lg border border-bora-yellow/20 shadow-lg shadow-black/30 hover:shadow-bora-yellow/10 hover:border-bora-yellow/40 transition-all duration-300">
                  <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                    <Clock className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h3 className="font-yeseva text-xl text-bora-yellow mb-3 glow-title">Horario</h3>
                  <p className="text-gray-200 leading-relaxed">
                    Lunes a Viernes: 11:00 AM - 4:00 PM<br/>
                    Sábado y Domingo: 9:00 AM - 4:00 PM
                  </p>
                </div>
                
                <div className="text-center p-6 bg-black/80 backdrop-blur-sm rounded-lg border border-bora-yellow/20 shadow-lg shadow-black/30 hover:shadow-bora-yellow/10 hover:border-bora-yellow/40 transition-all duration-300">
                  <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                    <Phone className="w-6 h-6 text-bora-yellow" />
                  </div>
                  <h3 className="font-yeseva text-xl text-bora-yellow mb-3 glow-title">Contacto</h3>
                  <p className="text-gray-200">
                    <a href="tel:+525549655305" className="hover:text-bora-yellow transition-colors block text-base mb-1">+52 55 4965 5305</a>
                    <a href="mailto:tacosborabora@gmail.com" className="hover:text-bora-yellow transition-colors text-sm opacity-90 hover:opacity-100">tacosborabora@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <div className="mt-16 bg-black/30 rounded-xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-bora-brown/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Home className="w-12 h-12 text-bora-yellow/30 mx-auto mb-4" />
                    <h3 className="font-bebas text-2xl text-bora-yellow mb-2 glow-title">PRÓXIMAMENTE</h3>
                    <p className="text-gray-400">Galería de nuestro espacio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}