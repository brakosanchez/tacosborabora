import Image from 'next/image';
import { FaBicycle, FaClock, FaUmbrellaBeach } from 'react-icons/fa';

export default function AContrarreloj() {
  return (
    <section className="py-16 bg-gradient-to-b from-dark-brown/90 to-dark-brown text-white relative overflow-hidden">
      {/* Fondo con textura sutil */}
      <div className="absolute inset-0 bg-[url('/texture.png')] opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          {/* Columna de texto */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-red-500" />
              <span className="font-bebas text-red-500 text-xl tracking-wider">SUPERANDO RETOS</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bebas tracking-wide">
              A Contrarreloj y <span className="text-red-500">Contra Todo</span>
            </h2>
            
            <div className="space-y-4 text-gray-200 font-unbounded">
              <p>
                Los primeros meses fueron una verdadera aventura. No teníamos todo resuelto: a veces corríamos por unas 
                servilletas, por unos limones, por una CocaCola. En muchas ocasiones, mi papá recorría casi 
                <span className="text-yellow-500 font-bold"> 10 kilómetros en bicicleta hasta Fuentes del Valle</span> 
                para conseguir entre 5 y 10 kilos de carne, todo para ahorrar lo del pasaje y que no nos faltara nada.
              </p>
              <p>
                Vendíamos en la Avenida Carso, como ambulantes. Luchábamos contra el clima, la inseguridad y el cansancio, 
                pero la clientela iba creciendo. Un día, el municipio nos pidió retirarnos, a pesar de que pagábamos 
                derecho de piso. Esa fue nuestra señal: era hora de establecer raíces.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
                  <FaBicycle className="text-red-500 text-xl" />
                </div>
                <h4 className="font-bebas text-lg">Esfuerzo</h4>
                <p className="text-sm text-gray-300">Recorriendo distancias para los mejores ingredientes</p>
              </div>
              
              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
                  <FaClock className="text-red-500 text-xl" />
                </div>
                <h4 className="font-bebas text-lg">Perseverancia</h4>
                <p className="text-sm text-gray-300">Días enteros de trabajo sin descanso</p>
              </div>
              
              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
                  <FaUmbrellaBeach className="text-red-500 text-xl" />
                </div>
                <h4 className="font-bebas text-lg">Visión</h4>
                <p className="text-sm text-gray-300">Soñando con un lugar propio para nuestros clientes</p>
              </div>
            </div>
          </div>
          
          {/* Columna de imagen */}
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/30">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 to-transparent z-10" />
              <Image 
                src="/2.jpg" 
                alt="Esfuerzo y dedicación en la calle" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <p className="font-yeseva text-red-500 text-xl">2021-2022</p>
                <p className="font-bebas text-2xl">Los días de la calle</p>
              </div>
            </div>
            
            {/* Elemento decorativo */}
            <div className="hidden lg:block absolute -top-8 -left-8 w-32 h-32 bg-red-500/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
