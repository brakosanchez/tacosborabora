import Image from 'next/image';
import { FaHome, FaUtensils, FaGlassCheers } from 'react-icons/fa';

export default function SaborQueNoSeRinde() {
  return (
    <section className="py-16 bg-gradient-to-b from-dark-brown to-dark-brown/90 text-white relative overflow-hidden">
      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/images/tropical-pattern-2.png')] opacity-5" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-1 bg-yellow-500" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bebas tracking-wide mb-6">
            El Sabor que <span className="text-yellow-500">No Se Rinde</span>
          </h2>
          <p className="text-xl text-gray-300 font-unbounded max-w-3xl mx-auto">
            Transformando sueños en realidad, un taco a la vez
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Columna de imagen */}
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-500/30">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 to-transparent z-10" />
              <Image 
                src="/3.jpg" 
                alt="Nuestro local actual" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <p className="font-yeseva text-yellow-500 text-xl">2024</p>
                <p className="font-bebas text-2xl">Nuestro hogar, su lugar favorito</p>
              </div>
            </div>
          </div>
          
          {/* Columna de texto */}
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-4 text-gray-200 font-unbounded">
              <p>
                Transformamos nuestro hogar en un pequeño local. Instalamos el mismo puesto que nos había 
                acompañado desde el inicio, conseguimos refrigeración, y Coca-Cola nos apoyó con un segundo 
                refrigerador para los refrescos. La fe de mi mamá y las visitas de mi abuelito eran nuestra 
                fuerza silenciosa.
              </p>
              <p>
                A inicios de 2024 comenzamos a vender tacos a la plancha, marinados con cariño y perfeccionados 
                con práctica. Hoy, Tacos Bora Bora está por cumplir 
                <span className="text-yellow-500 font-bold"> cuatro años de vida</span>, y seguimos trabajando 
                como el primer día: con amor por la cocina y respeto por cada cliente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-full">
                  <FaHome className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bebas text-lg text-yellow-500">Hogar</h4>
                  <p className="text-sm">Convertimos nuestra casa en el lugar donde nacerían sueños</p>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-full">
                  <FaUtensils className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bebas text-lg text-yellow-500">Innovación</h4>
                  <p className="text-sm">Nuevos platillos que mantienen nuestra esencia</p>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-full">
                  <FaGlassCheers className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bebas text-lg text-yellow-500">Celebración</h4>
                  <p className="text-sm">4 años de sabor, esfuerzo y dedicación</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-6 py-3 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors cursor-pointer group">
                <span className="font-bebas text-yellow-500 text-lg group-hover:translate-x-1 transition-transform">CONOCE NUESTRO MENÚ</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elemento decorativo final */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-brown to-transparent z-0" />
    </section>
  );
}
