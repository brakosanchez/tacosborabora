import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import ParticleBackground from '@/components/ParticleBackground'

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="hero-section relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/patterns/patronweb.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          backgroundColor: '#000'
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>
        
        {/* Efecto de partículas */}
        <ParticleBackground 
          particleCount={20}
          particleColor="rgba(234, 179, 8, 0.08)"
          minSize={1}
          maxSize={4}
          minDuration={12}
          maxDuration={30}
          className="opacity-20"
        />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-bora-yellow/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-bora-red/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-bora relative z-10">
          <div className="text-center fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="flame-effect w-48 h-48 md:w-64 md:h-64">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/images/logo/Logo1000px.png" 
                      alt="Tacos Bora Bora"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-contain relative z-10"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-bora-yellow/20 to-bora-red/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl mb-4 tracking-wider">
              <span className="text-fire glow-title">LA ISLA DEL SABOR</span>
            </h1>
            
            <p className="font-bebas text-2xl md:text-4xl text-bora-yellow mb-6">
              Deliciosos sabores autenticos que van a satisfacer tu paladar 
            </p>

            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Dejanos sorprenderte con la calidad de nuestros tacos, la frescura de nuestras bebidas y muchas de nuestras salsas que te van a enamorar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/menu" className="btn-primary inline-flex items-center">
                Quieres ver el menú
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/+525549655305?text=Hola,%20quiero%20hacer%20un%20pedido"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center"
              >
                Ordenar por WhatsApp
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="card-tropical text-center">
                <Clock className="w-10 h-10 text-bora-yellow mx-auto mb-3" />
                <h3 className="font-bebas text-2xl text-bora-yellow mb-2 glow-title">NUESTROS TACOS</h3>
                <p className="text-sm text-gray-300">
                  Lun-Vie: 11AM - 4PM<br />
                  Sáb-Dom: 9AM - 4PM
                </p>
              </div>

              <div className="card-tropical text-center">
                <MapPin className="w-10 h-10 text-bora-yellow mx-auto mb-3" />
                <h3 className="font-bebas text-2xl text-bora-yellow mb-2 glow-title">BEBIDAS REFRESCANTES</h3>
                <p className="text-sm text-gray-300">
                  Alondras 410, Los Aguiluchos <br />
                  Nextlalpan, Estado de México
                </p>
              </div>

              <div className="card-tropical text-center">
                <Star className="w-10 h-10 text-bora-yellow mx-auto mb-3" />
                <h3 className="font-bebas text-2xl text-bora-yellow mb-2 glow-title">CALIDAD</h3>
                <p className="text-sm text-gray-300">
                  Ingredientes frescos<br />
                  100% artesanales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/patterns/patronweb.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          backgroundColor: '#000'
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>
        
        {/* Efecto de partículas */}
        <ParticleBackground 
          particleCount={20}
          particleColor="rgba(234, 179, 8, 0.08)"
          minSize={1}
          maxSize={4}
          minDuration={12}
          maxDuration={30}
          className="opacity-20"
        />
        
        <div className="container-bora relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-bebas text-5xl md:text-6xl text-fire mb-4 glow-title">
              ¿POR QUÉ BORA BORA?
            </h2>
            <div className="divider-tropical"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🌴',
                title: 'Sabor Tropical',
                description: 'Recetas únicas inspiradas en la frescura de las islas'
              },
              {
                icon: '🔥',
                title: 'Calidad Premium',
                description: 'Solo los mejores ingredientes en cada preparación'
              },
              {
                icon: '⭐',
                title: 'Experiencia Única',
                description: 'Más que tacos, un viaje de sabores'
              },
              {
                icon: '❤️',
                title: 'Hecho con Amor',
                description: 'Cada taco preparado con dedicación y pasión'
              }
            ].map((feature, index) => (
              <div key={index} className="card-tropical text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bebas text-2xl text-bora-yellow mb-3 glow-title">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/patterns/patronweb.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          backgroundColor: '#000'
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>
        
        {/* Efecto de partículas */}
        <ParticleBackground 
          particleCount={20}
          particleColor="rgba(234, 179, 8, 0.08)"
          minSize={1}
          maxSize={4}
          minDuration={12}
          maxDuration={30}
          className="opacity-20"
        />
        
        <div className="container-bora text-center relative z-10">
          <h2 className="font-bebas text-5xl md:text-6xl text-fire mb-6">
            ¿LISTO PARA LA AVENTURA?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Descubre nuestro menú completo y déjate llevar por los sabores de la Isla del Sabor
          </p>
          <Link href="/menu" className="btn-primary inline-flex items-center text-lg">
            Explorar Menú Completo
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}
