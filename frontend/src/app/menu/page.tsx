'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { useRef, Suspense } from 'react';

// Importar componentes con carga dinámica
const MenuSection = dynamic(() => import('@/components/menu/MenuSection'), { ssr: false });
const MenuItem = dynamic(() => import('@/components/menu/MenuItem'), { ssr: false });
const WavyText = dynamic(() => import('@/components/ui/WavyText'), { ssr: false });
const BoatEffect = dynamic(() => import('@/components/ui/BoatEffect'), { ssr: false });

// Componente de carga
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCB235]"></div>
  </div>
);

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  emoji?: string;
}

const MenuPage: React.FC = () => {
  // Estilos para el fondo con imagen y desenfoque
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: "url('/fondos/fondoelegante2.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '2rem 0',
  };

  const overlayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    minHeight: '100vh',
    padding: '2rem 0',
  };

  // Sección de Tacos
  const tacosTradicionales: MenuItemProps[] = [
    { name: 'Bistec', price: 30, description: 'Carne de res asada al carbón con su jugo', emoji: '🥩' },
    { name: 'Longaniza', price: 30, description: 'Carne de cerdo adobada con especias especiales', emoji: '🌭' },
    { name: 'Pollo', price: 30, description: 'Pechuga de pollo marinada y asada', emoji: '🍗' },
    { name: 'Aguja', price: 30, description: 'Corte fino de res con un sabor único', emoji: '🥩' },
  ];

  const tacosEspeciales: MenuItemProps[] = [
    { name: 'Cecina', price: 35, description: 'Carne de cerdo adobada y secada al humo', emoji: '🥓' },
    { name: 'Arrachera', price: 35, description: 'Corte premium de res marinado al carbón', emoji: '🥩' },
    { name: 'Mixiote', price: 30, description: 'Carne de cerdo cocida a fuego lento en chile ancho', emoji: '🍖' },
  ];

  const tacosCampechanos: MenuItemProps[] = [
    { name: 'Campechano Bistec', price: 30, description: 'Mezcla de bistec con chorizo, una explosión de sabores', emoji: '🌮' },
    { name: 'Campechano Pollo', price: 30, description: 'Combinación perfecta de pollo con chorizo', emoji: '🌮' },
  ];

  // Sección de Bebidas
  const refrescos = [
    { name: 'Coca Cola', price: 30, description: 'Refresco de cola 600ml', emoji: '🥤' },
    { name: 'Sprite', price: 30, description: 'Refresco de limón 600ml', emoji: '🥤' },
    { name: 'Fanta', price: 30, description: 'Refresco de naranja 600ml', emoji: '🥤' },
    { name: 'Sidral Mundet', price: 30, description: 'Refresco de manzana 600ml', emoji: '🍏' },
    { name: 'Boing de Mango', price: 30, description: 'Bebida de mango 500ml', emoji: '🥭' },
    { name: 'Agua Embotellada', price: 20, description: 'Agua purificada 500ml', emoji: '💧' },
    { name: 'Agua de Sabor', price: 25, description: 'Agua fresca del día', emoji: '🍹' },
  ];

  const cervezas = [
    { name: 'Michelada Clásica', description: 'Limon y sal', price: 80, emoji: '🍺' },
    { name: 'Michelada Cubana', description: 'Salsas, limón y sal', price: 80, emoji: '🍺' },
    { name: 'Michelada Chabela', description: 'Con refresco de naranja', price: 80, emoji: '🍺' },
  ];

  const bebidasEspeciales = [
    { name: 'Azulito 1Lt', description: 'Vodka, curazao, energizante, sprite, menta y twist de limón', price: 90, emoji: '🔵' },
    { name: 'Pantera Rosa 1Lt', description: 'Vodka, licor de fresa, cerezas, ameyal, granadina', price: 90, emoji: '🌸' },
    { name: 'Piña Colada 1Lt', description: 'Ron, crema de coco y jugo de piña', price: 90, emoji: '🍍' },
    { name: 'Cuba Libre 1Lt', description: 'Ron, refresco de cola y limón', price: 90, emoji: '🥃' },
    { name: 'Mojito Tradicional 1Lt', description: 'Ron, hierbabuena, limón, azúcar y agua mineral', price: 90, emoji: '🌿' },
    { name: 'Mojito Frutos Rojos 1Lt', description: 'Ron, frutos rojos, hierbabuena y limón', price: 100, emoji: '🍓' },
  ];

  // Sección de Especialidades
  const especialidades: MenuItemProps[] = [
    { name: 'Gringa', price: 45, description: 'Taco al pastor con queso derretido en tortilla de harina', emoji: '🧀' },
    { name: 'Volcán', price: 50, description: 'Queso fundido con tu elección de carne', emoji: '🌋' },
    { name: 'Quesadilla Especial', price: 55, description: 'Tortilla de maíz rellena de queso y tu elección de carne', emoji: '🧀' },
  ];

  // Sección de Postres
  const postres: MenuItemProps[] = [
    { name: 'Flan Napolitano', price: 40, description: 'Delicioso flan casero con caramelo', emoji: '🍮' },
    { name: 'Pastel de Queso', price: 45, description: 'Rebanada de pastel de queso con frutos rojos', emoji: '🍰' },
    { name: 'Helado', price: 35, description: 'Helado de vainilla con chocolate caliente', emoji: '🍨' },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <motion.div 
        style={{ ...backgroundStyle, y: yBg }}
        className="absolute inset-0 z-0"
      />
      <div style={overlayStyle} className="relative z-10">
        <div className="min-h-screen text-white">
          {/* Header */}
          <header className="relative py-20 text-center">
            <BoatEffect intensity={1.2} duration={8}>
              <div className="overflow-hidden">
                <WavyText 
                  text="Tacos Bora Bora"
                  className="text-6xl md:text-7xl font-bebas text-[#FCB235] mb-4 tracking-wide"
                  delay={0.2}
                  y={10}
                />
              </div>
            </BoatEffect>
            <BoatEffect intensity={1.0} duration={10}>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-300 mt-4"
              >
                Bienvenido a la <span className="text-[#FCB235]">Isla del Sabor</span>
              </motion.p>
            </BoatEffect>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-32 h-1 bg-[#FCB235] mx-auto my-6"
            />
          </header>

          {/* Menú */}
          <main className="pb-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
                {/* Sección de Tacos Tradicionales */}
                <MenuSection 
                  title={
                    <BoatEffect intensity={1.1} duration={7}>
                      TACOS TRADICIONALES
                    </BoatEffect>
                  } 
                  columns={3}
                >
                  {tacosTradicionales.map((taco, index) => (
                    <MenuItem 
                      key={`trad-${index}`}
                      name={taco.name}
                      price={taco.price}
                      description={taco.description}
                      emoji={taco.emoji}
                    />
                  ))}
                </MenuSection>

                {/* Sección de Tacos Especiales */}
                <MenuSection 
                  title={
                    <BoatEffect intensity={1.0} duration={7.5}>
                      TACOS ESPECIALES
                    </BoatEffect>
                  } 
                  columns={3}
                >
                  {tacosEspeciales.map((taco, index) => (
                    <MenuItem 
                      key={`esp-${index}`}
                      name={taco.name}
                      price={taco.price}
                      description={taco.description}
                      emoji={taco.emoji}
                    />
                  ))}
                </MenuSection>

                {/* Sección de Tacos Campechanos */}
                <MenuSection 
                  title={
                    <BoatEffect intensity={1.05} duration={7.5}>
                      TACOS CAMPECHANOS
                    </BoatEffect>
                  } 
                  columns={3}
                >
                  {tacosCampechanos.map((taco, index) => (
                    <MenuItem 
                      key={`camp-${index}`}
                      name={taco.name}
                      price={taco.price}
                      description={taco.description}
                      emoji={taco.emoji}
                    />
                  ))}
                </MenuSection>

                {/* Sección de Especialidades */}
                <MenuSection 
                  title={
                    <BoatEffect intensity={1.1} duration={8}>
                      ESPECIALIDADES DE LA CASA
                    </BoatEffect>
                  } 
                  columns={3}
                >
                  {especialidades.map((item, index) => (
                    <MenuItem 
                      key={`esp-${index}`}
                      name={item.name}
                      price={item.price}
                      description={item.description}
                      emoji={item.emoji}
                    />
                  ))}
                </MenuSection>

                {/* Sección de Bebidas */}
                <MenuSection 
                  title={
                    <BoatEffect intensity={1.0} duration={8.5}>
                      BEBIDAS
                    </BoatEffect>
                  } 
                  columns={3}
                >
                  {refrescos.map((bebida, index) => (
                    <MenuItem 
                      key={`ref-${index}`}
                      name={bebida.name}
                      price={bebida.price}
                      description={bebida.description}
                      emoji={bebida.emoji}
                    />
                  ))}
                  
                  {cervezas.map((bebida, index) => (
                    <MenuItem 
                      key={`cerveza-${index}`}
                      name={bebida.name}
                      description={bebida.description}
                      price={bebida.price}
                      emoji={bebida.emoji}
                    />
                  ))}
                  
                  {bebidasEspeciales.map((bebida, index) => (
                    <MenuItem 
                      key={`especial-${index}`}
                      name={bebida.name}
                      description={bebida.description}
                      price={bebida.price}
                      emoji={bebida.emoji}
                    />
                  ))}
                </MenuSection>

                {/* Sección de Postres */}
                <MenuSection 
                  title={
                    <BoatEffect intensity={1.05} duration={7.5}>
                      POSTRES
                    </BoatEffect>
                  } 
                  columns={3}
                >
                  {postres.map((postre, index) => (
                    <MenuItem 
                      key={`postre-${index}`}
                      name={postre.name}
                      price={postre.price}
                      description={postre.description}
                      emoji={postre.emoji}
                    />
                  ))}
                </MenuSection>
              </motion.div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-[#1a120b] py-8 border-t border-[#FCB235]/20">
            <div className="container mx-auto px-4 text-center max-w-4xl">
              <div className="bg-[#2a1f15] p-6 rounded-lg border border-[#FCB235]/10">
                <h4 className="font-bold text-[#FCB235] text-lg mb-4">Avisos Importantes</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• **Los precios pueden cambiar sin previo aviso**</li>
                  <li>• No se realizan modificaciones a los productos</li>
                  <li>• Los precios no incluyen IVA</li>
                  <li>• Se recomienda discreción en el consumo de bebidas alcohólicas</li>
                </ul>
              </div>
              
              
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
