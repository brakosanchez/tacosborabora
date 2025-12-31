import Link from 'next/link'
import { Instagram, MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import ParticleBackground from './ParticleBackground'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer 
      className="relative border-t border-bora-yellow/30 overflow-hidden"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-bora-brown/5 to-black">
          <ParticleBackground 
            particleCount={15}
            particleColor="rgba(234, 179, 8, 0.05)"
            minSize={1}
            maxSize={4}
            minDuration={15}
            maxDuration={25}
          />
        </div>
      </div>
      
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center h-16 mb-4">
              <Link href="/" className="flex items-center h-full w-auto">
                <Image 
                  src="/images/logo/logo.svg" 
                  alt="Tacos Bora Bora" 
                  width={180} 
                  height={50}
                  className="h-full w-auto object-contain"
                  priority
                />
              </Link>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Tacos al estilo tropical con la mejor calidad. 
              Vive la experiencia única de sabores que te transportan a una isla paradisíaca.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/tacosborabora"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bora-yellow hover:text-bora-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://wa.me/+525549655305"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bora-yellow hover:text-bora-orange transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-bebas text-xl text-bora-yellow mb-4">
              ENLACES RÁPIDOS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-bora-yellow transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-bora-yellow transition-colors text-sm">
                  Menú
                </Link>
              </li>
              <li>
                <Link href="/historia" className="text-gray-300 hover:text-bora-yellow transition-colors text-sm">
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-bora-yellow transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-300 hover:text-bora-yellow transition-colors text-sm">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bebas text-xl text-bora-yellow mb-4">
              CONTACTO
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-300 text-sm">
                <MapPin className="w-5 h-5 text-bora-orange flex-shrink-0 mt-0.5" />
                <span>Alondras 410, Los Aguiluchos<br />Nextlalpan, Estado de México, 55796</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone className="w-5 h-5 text-bora-orange flex-shrink-0" />
                <span>+52 55 4965 5305</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="w-5 h-5 text-bora-orange flex-shrink-0" />
                <span>tacosborabora@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Horarios */}
        <div className="mt-8 pt-8 border-t border-bora-yellow/20">
          <div className="text-center">
            <h4 className="font-bebas text-lg text-bora-yellow mb-2">
              HORARIOS
            </h4>
            <p className="text-gray-300 text-sm">
              Lunes a Viernes: 11:00 AM - 4:00 PM<br />
              Sábado y Domingo: 9:00 AM - 4:00 PM
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-bora-yellow/20 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Tacos Bora Bora. Todos los derechos reservados.
            <br />
            <span className="text-bora-orange">Desarrollado por Abraham Sanchez 🌴 para la Isla del Sabor</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
