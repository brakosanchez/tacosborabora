import Image from 'next/image';
import { FaPaintRoller, FaUtensils, FaHeart } from 'react-icons/fa';

export default function DeBrochasAOllas() {
  return (
    <section className="py-16 bg-dark-brown/90 text-white relative overflow-hidden">
      {/* Fondo con patrón tropical sutil */}
      <div className="absolute inset-0 bg-[url('/tropical-pattern.png')] opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Columna de texto */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-yellow-500" />
              <span className="font-bebas text-yellow-500 text-xl tracking-wider">NUESTROS INICIOS</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bebas tracking-wide">
              De Brochas a Ollas: <span className="text-yellow-500">El Primer Paso</span>
            </h2>
            
            <div className="space-y-4 text-gray-200 font-unbounded">
              <p>
                Nuestro sueño comenzó desde cero. Mi papá y yo trabajábamos haciendo remodelaciones y pintura en casas. 
                Con esfuerzo y ahorros, compramos nuestras primeras ollas. Fue mi tía Lilia quien nos inspiró a dar el 
                salto: en julio del 2021 empezamos a vender mixiote con una receta familiar. Sin local, sin recursos, 
                pero con muchas ganas.
              </p>
              <p>
                Al poco tiempo, más familiares se unieron. Otros siguieron sus caminos, y dos grandes pilares nos dejaron: 
                mis abuelitas Meche y Rosa, en agosto y diciembre de ese mismo año. Su ausencia dolió, pero su ejemplo 
                nos empujó a seguir adelante. Así nació algo más que un negocio: un legado.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/30">
                <FaPaintRoller className="text-yellow-500" />
                <span className="font-bebas">HUMILDES COMIENZOS</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/30">
                <FaUtensils className="text-yellow-500" />
                <span className="font-bebas">PASIÓN POR COCINAR</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/30">
                <FaHeart className="text-yellow-500" />
                <span className="font-bebas">LEGADO FAMILIAR</span>
              </div>
            </div>
          </div>
          
          {/* Columna de imagen */}
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-500/30">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 to-transparent z-10" />
              <Image 
                src="/1.jpg" 
                alt="Los inicios de Tacos Bora Bora" 
                fill 
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <p className="font-yeseva text-yellow-500 text-xl">Julio 2021</p>
                <p className="font-bebas text-2xl">Nuestros humildes comienzos</p>
              </div>
            </div>
            
            {/* Elemento decorativo */}
            <div className="hidden lg:block absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-500/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
