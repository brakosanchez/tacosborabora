'use client';

import { Heart, Users, Award, Calendar, ChefHat, Home, MapPin, Clock, Phone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TimelineItem = ({ date, title, description, isLast = false }: { date: string; title: string; description: string; isLast?: boolean }) => (
  <div className="relative pl-8 pb-8">
    {!isLast && (
      <div className="absolute left-3.5 top-4 -bottom-4 w-0.5 bg-bora-yellow/30"></div>
    )}
    <div className="absolute left-0 w-7 h-7 rounded-full bg-bora-yellow flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-white"></div>
    </div>
    <div className="ml-2">
      <span className="text-bora-yellow font-medium text-sm">{date}</span>
      <h4 className="font-yeseva text-xl text-white mt-1">{title}</h4>
      <p className="text-gray-300 text-sm mt-1">{description}</p>
    </div>
  </div>
);

const TeamMember = ({ name, role, bio, image }: { name: string; role: string; bio: string; image: string }) => (
  <div className="bg-bora-brown/10 backdrop-blur-sm rounded-lg p-6 border border-bora-brown/20 hover:border-bora-yellow/30 transition-all duration-300">
    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-bora-yellow/50">
      <div className="w-full h-full bg-bora-brown/20 flex items-center justify-center">
        <User className="w-16 h-16 text-bora-yellow/50" />
      </div>
    </div>
    <h3 className="font-bebas text-2xl text-bora-yellow text-center">{name}</h3>
    <p className="text-bora-orange text-sm text-center mb-3">{role}</p>
    <p className="text-gray-300 text-sm text-center">{bio}</p>
  </div>
);

export default function HistoriaPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"></div>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('/images/patterns/tropical-pattern.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay'
            }}
          ></div>
        </div>
        
        <div className="container-bora relative z-10 text-center px-4">
          <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-bora-yellow mb-4">
            DE LA COCHERA A LA ISLA DEL SABOR
          </h1>
          <p className="font-yeseva text-xl text-gray-300 max-w-3xl mx-auto">
            Desde julio de 2021 hemos convertido recetas familiares y mucho empeño en tacos que cuentan historia.
          </p>
          <div className="w-24 h-1 bg-bora-yellow mx-auto mt-8"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-16 md:-mt-24">
        {/* Origin Story */}
        <div className="container-bora max-w-5xl px-4 mb-24">
          <div className="bg-bora-brown/5 backdrop-blur-sm border border-bora-brown/20 rounded-xl p-8 md:p-12 shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-bora-yellow"></div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-6">
                Todo comenzó con ganas y ganas de familia. Mi nombre es Abraham Sánchez (Taquero) y junto con mi papá Francisco Sánchez (Capitán) decidimos transformar un sueño en comida: crear un lugar donde el sabor tradicional mexicano conviviera con la frescura de una isla.
              </p>
              
              <p className="text-lg text-gray-300 mb-6">
                En julio de 2021, en plena pandemia, arrancamos desde la cochera de la casa con lo que teníamos: utensilios heredados de la abuela, ollas prestadas y muchas ganas de aprender. Los primeros meses vendimos muy poco —solo fines de semana— pero cada taco que servíamos era una lección. Poco a poco fuimos puliendo recetas, probando salsas y cuidando los detalles que hoy nos definen.
              </p>
              
              <p className="text-lg text-gray-300 mb-6">
                Un fin de semana probamos suerte en la esquina sobre la Av. Carso y aquello cambió todo: la afluencia nos permitió vender toda la mercancía y entender que estábamos en buen camino. Con el paso del tiempo volvimos a la cochera —porque preferimos mantener nuestra independencia frente a pagos municipales injustificados— y descubrimos que el espacio de la casa, con su vegetación, transmitía la identidad que queríamos: un pequeño paraíso, nuestra Isla del Sabor.
              </p>
              
              <p className="text-lg text-gray-300 mb-8">
                Con el apoyo de proveedores locales fuimos creciendo: primero el mixiote y el consomé; en 2024 comenzamos a ofrecer tacos a la plancha (bistec, longaniza, aguja, pollo) y en diciembre de 2024 sumamos cecina y arrachera. Hoy, en 2025, trabajamos en nuevas ideas —ensaladas, mejor logística y una appweb— para asegurar calidad, consistencia y una experiencia que merezca la visita.
              </p>
              
              <blockquote className="border-l-4 border-bora-yellow pl-6 py-3 my-8 italic text-xl text-gray-200">
                "De la cochera a la comunidad: cada paso lo dimos con trabajo y con el corazón."
                <footer className="mt-2 text-bora-yellow font-medium">— Francisco & Abraham Sánchez</footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-bora-brown/5 py-16 md:py-24">
          <div className="container-bora max-w-4xl px-4">
            <div className="text-center mb-16">
              <h2 className="font-bebas text-4xl md:text-5xl text-bora-yellow mb-4">NUESTRO VIAJE</h2>
              <div className="w-16 h-1 bg-bora-yellow mx-auto"></div>
            </div>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-bora-yellow/30"></div>
              
              <div className="space-y-2">
                <TimelineItem 
                  date="JULIO 2021"
                  title="Los inicios en la cochera"
                  description="Comenzamos con mixiote y recetas familiares, vendiendo solo fines de semana."
                />
                <TimelineItem 
                  date="2021"
                  title="Primera feria en Av. Carso"
                  description="Vendimos toda la mercancía y confirmamos que estábamos en el camino correcto."
                />
                <TimelineItem 
                  date="2022"
                  title="Consolidación"
                  description="Establecimos relaciones con proveedores locales y expandimos nuestra oferta de bebidas."
                />
                <TimelineItem 
                  date="2024"
                  title="Nuevos sabores"
                  description="Lanzamos nuestra línea de tacos a la plancha: Bistec, Longaniza, Aguja y Pollo."
                />
                <TimelineItem 
                  date="DICIEMBRE 2024"
                  title="Expansión de menú"
                  description="Incorporamos Cecina y Arrachera a nuestro menú principal."
                />
                <TimelineItem 
                  date="2025"
                  title="Nuevos horizontes"
                  description="Trabajando en branding, appweb y menús digitales para mejorar la experiencia."
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <TeamMember 
                name="Francisco Sánchez"
                role="El Capitán"
                bio="Con más de 30 años de experiencia en gastronomía, es el pilar de nuestras operaciones y el guardián de los sabores tradicionales."
                image="/images/team/capitan.jpg"
              />
              <TeamMember 
                name="Abraham Sánchez"
                role="El Taquero"
                bio="Encargado de la cocina y la innovación, combina técnicas tradicionales con toques modernos para crear sabores únicos."
                image="/images/team/taquero.jpg"
              />
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
              <div className="text-center p-6 bg-bora-brown/10 rounded-lg">
                <div className="w-12 h-12 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-bora-yellow" />
                </div>
                <h3 className="font-yeseva text-xl text-white mb-2">Ubicación</h3>
                <p className="text-gray-300">Av. Principal #123, Colonia Centro, CDMX</p>
              </div>
              
              <div className="text-center p-6 bg-bora-brown/10 rounded-lg">
                <div className="w-12 h-12 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-bora-yellow" />
                </div>
                <h3 className="font-yeseva text-xl text-white mb-2">Horario</h3>
                <p className="text-gray-300">Martes a Domingo<br/>12:00 PM - 10:00 PM</p>
              </div>
              
              <div className="text-center p-6 bg-bora-brown/10 rounded-lg">
                <div className="w-12 h-12 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-bora-yellow" />
                </div>
                <h3 className="font-yeseva text-xl text-white mb-2">Contacto</h3>
                <p className="text-gray-300">
                  <a href="tel:+525549655305" className="hover:text-bora-yellow transition-colors">55 4965 5305</a>
                </p>
              </div>
            </div>
            
            <div className="mt-16 bg-black/30 rounded-xl overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-bora-brown/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <Home className="w-12 h-12 text-bora-yellow/30 mx-auto mb-4" />
                  <h3 className="font-bebas text-2xl text-bora-yellow mb-2">PRÓXIMAMENTE</h3>
                  <p className="text-gray-400">Galería de nuestro espacio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
