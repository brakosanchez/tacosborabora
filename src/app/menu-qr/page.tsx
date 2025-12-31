'use client'

import { useState, useEffect, useRef } from 'react'
import { Flame, Leaf, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  spicy: boolean
  vegetarian: boolean
  popular: boolean
  image?: string
}

export default function MenuQRPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const categoriesContainerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<{[key: string]: HTMLImageElement | null}>({})
  
  // Mapeo de imágenes con rutas corregidas
  const tacoImages: { [key: string]: string } = {
    // Tacos (1-7)
    '1': '/images/menu/tacos/taco-mixiote.webp',
    '2': '/images/menu/tacos/taco-bistec.webp',
    '3': '/images/menu/tacos/taco-longaniza.webp',
    '4': '/images/menu/tacos/taco-pollo.webp',
    '5': '/images/menu/tacos/taco-arrachera.webp',
    '6': '/images/menu/tacos/taco-aguja.webp',
    '7': '/images/menu/tacos/taco-cecina.webp',
    
    // Campechanos (8-12)
    '8': '/images/menu/tacos/taco-campechanores.webp', // Imagen corregida
    '9': '/images/menu/tacos/taco-campechanopollo.webp', // Imagen corregida
    '10': '/images/menu/tacos/taco-campechanocecina.webp', // Imagen corregida
    '11': '/images/menu/tacos/taco-campechanoarrachera.webp', // Imagen corregida
    '12': '/images/menu/tacos/taco-campechanoaguja.webp', // Imagen corregida
    
    // Aguas Frescas (13-24)
    '13': '/images/menu/tacos/Agua-Limon-Kiwi.webp',
    '14': '/images/menu/tacos/Agua-Limon-Chia.webp',
    '15': '/images/menu/tacos/Agua-Limon-Maracuya.webp',
    '16': '/images/menu/tacos/Agua-Melon.webp',
    '17': '/images/menu/tacos/Agua-Horchata.webp',
    '18': '/images/menu/tacos/Agua-Fresa-Maracuya.webp',
    '19': '/images/menu/tacos/Agua-Jamaica-Naranja.webp',
    '20': '/images/menu/tacos/Agua-Tamarindo.webp',
    '21': '/images/menu/tacos/Agua-Fresa-Guayaba.webp',
    '22': '/images/menu/tacos/Agua-Jamaica-Naranja.webp',
    '23': '/images/menu/tacos/Agua-Tamarindo.webp',
    '24': '/images/menu/tacos/Agua-FrutosRojos.webp',
    '50': '/images/menu/tacos/Agua-Piña-Maracuya.webp',
    '51': '/images/menu/tacos/Agua-Piña-Mango.webp',
    
    
    // Refrescos (25-30)
    '25': '/images/menu/tacos/cocacola.webp',
    '26': '/images/menu/tacos/sprite.webp',
    '27': '/images/menu/tacos/Fanta.webp',
    '28': '/images/menu/tacos/Mundet.webp',
    '29': '/images/menu/tacos/FuzeTea.webp',
    '30': '/images/menu/tacos/TopoChico.webp',
    '44': '/images/menu/tacos/Fresca.webp',
    '45': '/images/menu/tacos/Arizona-Mango.webp',
    '46': '/images/menu/tacos/Arizona-Sandia.webp',
    
    
    // Jugos y Néctares (31-36)
    '31': '/images/menu/tacos/Boing-Guayaba.webp',
    '32': '/images/menu/tacos/Boing-Mango.webp',
    '33': '/images/menu/tacos/Nectar-Mango.webp',
    '34': '/images/menu/tacos/Nectar-Naranja.webp',
    '35': '/images/menu/tacos/Nectar-Piña.webp',
    '36': '/images/menu/tacos/Nectar-Uva.webp',
    
    // Malteadas (42-44)
    '42': '/images/menu/tacos/Malteada-Chocolate.webp',
    '43': '/images/menu/tacos/Malteada-Fresa.webp',
    '49': '/images/menu/tacos/Malteada-Vainilla.webp',
    
    // Picaña (47-48)
    '47': '/images/menu/tacos/taco-picaña.webp',
    '48': '/images/menu/tacos/taco-campechanopicaña.webp'
  }

  // Menú real de Tacos Bora Bora
  const exampleMenu: MenuItem[] = [
  // Tacos
  {
    id: '1',
    name: 'Taco de Mixiote',
    description: 'Tradicional mixiote de borrego al vapor, con su jugo natural y especias.',
    price: 30,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['1']
  },
  {
    id: '2',
    name: 'Taco de Bistec de Res',
    description: 'Jugoso bistec de res a la plancha, servido con cebolla, cilantro y salsa al gusto.',
    price: 30,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['2']
  },
  {
    id: '3',
    name: 'Taco de Longaniza',
    description: 'Longaniza artesanal dorada, con su toque picante y jugoso.',
    price: 30,
    category: 'Tacos',
    spicy: true,
    vegetarian: false,
    popular: true,
    image: tacoImages['3']
  },
  {
    id: '4',
    name: 'Taco de Aguja Norteña',
    description: 'Aguja de res marinada y asada al carbón, con guarnición de piña y salsas tropicales.',
    price: 30,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['6']
  },
  {
    id: '5',
    name: 'Taco de Cecina',
    description: 'Cecina suave y salada, servida con guacamole, nopal cocido y chimichurri.',
    price: 35,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['7']
  },
  {
    id: '6',
    name: 'Taco de Arrachera',
    description: 'Arrachera premium con toque de fuego Bora Bora, jugosa y suave.',
    price: 35,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['5']
  },
  {
    id: '7',
    name: 'Taco de Pollo',
    description: 'Pechuga de pollo asada con sazón Bora Bora, acompañada de piña natural.',
    price: 30,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['4']
  },
  {
    id: '47',
    name: 'Taco de Picaña',
    description: 'Jugoso corte de picaña asada al carbón, servida con cebolla asada y guacamole.',
    price: 35,
    category: 'Tacos',
    spicy: false,
    vegetarian: false,
    popular: true,
    image: tacoImages['47']
  },
  {
    id: '8',
    name: 'Campechano de Res',
    description: 'Longaniza + Bistec de Res.',
    price: 30,
    category: 'Campechanos',
    spicy: true,
    vegetarian: false,
    popular: true,
    image: tacoImages['8']
  },
  {
    id: '9',
    name: 'Campechano de Pollo',
    description: 'Longaniza + Pollo.',
    price: 30,
    category: 'Campechanos',
    spicy: true,
    vegetarian: false,
    popular: false,
    image: tacoImages['9']
  },
  {
    id: '10',
    name: 'Campechano de Cecina',
    description: 'Longaniza + Cecina.',
    price: 35,
    category: 'Campechanos',
    spicy: true,
    vegetarian: false,
    popular: false,
    image: tacoImages['10']
  },
  {
    id: '11',
    name: 'Campechano de Arrachera',
    description: 'Longaniza + Arrachera.',
    price: 35,
    category: 'Campechanos',
    spicy: true,
    vegetarian: false,
    popular: false,
    image: tacoImages['11']
  },
  {
    id: '12',
    name: 'Campechano de Aguja',
    description: 'Longaniza + Aguja Norteña.',
    price: 30,
    category: 'Campechanos',
    spicy: true,
    vegetarian: false,
    popular: false,
    image: tacoImages['12']
  },
  {
    id: '48',
    name: 'Campechano de Picaña',
    description: 'Longaniza + Picaña. Una combinación perfecta de sabores.',
    price: 35,
    category: 'Campechanos',
    spicy: true,
    vegetarian: false,
    popular: true,
    image: tacoImages['48']
  },
  // Aguas Frescas
  {
    id: '13',
    name: 'Agua de Limón con Kiwi',
    description: 'Refrescante agua de limón con kiwi. (Sujeto a disponibilidad)',
    price: 50,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['13']
  },
  {
    id: '14',
    name: 'Agua de Limón con Chía',
    description: 'Agua de limón con semillas de chía. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['14']
  },
  {
    id: '15',
    name: 'Agua de Limón con Maracuyá',
    description: 'Agua de limón con maracuyá tropical. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['15']
  },
  {
    id: '16',
    name: 'Agua de Melón',
    description: 'Agua fresca de melón natural. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['16']
  },
  {
    id: '17',
    name: 'Horchata',
    description: 'Tradicional agua de horchata. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['17']
  },
  {
    id: '18',
    name: 'Agua de Fresa con Maracuyá',
    description: 'Combinación de fresa y maracuyá. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['18']
  },
  {
    id: '19',
    name: 'Agua de Piña con Maracuyá',
    description: 'Piña tropical con maracuyá. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['50']
  },
  {
    id: '20',
    name: 'Agua de Mango con Piña',
    description: 'Mango dulce con piña. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['51']
  },
  {
    id: '21',
    name: 'Agua de Fresa con Guayaba',
    description: 'Fresa con guayaba. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['21']
  },
  {
    id: '22',
    name: 'Agua de Jamaica con Naranja',
    description: 'Jamaica con toque de naranja. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['22']
  },
  {
    id: '23',
    name: 'Agua de Tamarindo',
    description: 'Clásica agua de tamarindo. (Sujeto a disponibilidad)',
    price: 45,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['23']
  },
  {
    id: '24',
    name: 'Agua de Frutos Rojos',
    description: 'Mezcla de frutos rojos. (Sujeto a disponibilidad)',
    price: 50,
    category: 'Aguas Frescas',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['24']
  },
  // Refrescos
  {
    id: '25',
    name: 'Coca-Cola',
    description: 'Refresco clásico.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['25']
  },
  {
    id: '26',
    name: 'Sprite',
    description: 'Refresco de lima-limón.',
    image: tacoImages['26'],
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
  },
  {
    id: '27',
    name: 'Fanta',
    description: 'Refresco de naranja.',
    image: tacoImages['27'],
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
  },
  {
    id: '28',
    name: 'Fresca',
    description: 'Refresco de toronja.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['44']
  },
  {
    id: '29',
    name: 'Mundet Manzana',
    description: 'Refresco de manzana.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['28']
  },
  {
    id: '30',
    name: 'Boing Mango',
    description: 'Jugo de mango.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['32']
  },
  {
    id: '31',
    name: 'Boing Guayaba',
    description: 'Jugo de guayaba.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['31']
  },
  {
    id: '32',
    name: 'Topo Chico Agua Mineral',
    description: 'Agua mineral natural.',
    price: 25,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['30']
  },
  {
    id: '33',
    name: 'Arizona Mango',
    description: 'Té helado sabor mango.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: true,
    image: tacoImages['45']
  },
  {
    id: '34',
    name: 'Arizona Sandía',
    description: 'Té helado sabor sandía.',
    price: 20,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['46']
  },
  {
    id: '35',
    name: 'Fuze Tea Té Negro Helado',
    description: 'Té negro helado.',
    price: 25,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['29']
  },
  
  {
    id: '38',
    name: 'Néctar de Naranja',
    description: 'Néctar de naranja natural.',
    price: 30,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['34']
  },
  {
    id: '39',
    name: 'Néctar de Piña',
    description: 'Néctar de piña natural.',
    price: 30,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
    image: tacoImages['35']
  },
  {
    id: '40',
    name: 'Néctar de Mango',
    description: 'Néctar de mango natural.',
    image: tacoImages['33'],
    price: 30,
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
  },
  {
    id: '41',
    name: 'Néctar de Uva',
    description: 'Néctar de uva natural.',
    price: 30,
    image: tacoImages['36'],
    category: 'Refrescos',
    spicy: false,
    vegetarian: true,
    popular: false,
  },
  // Malteadas
  {
    id: '42',
    name: 'Malteada de Chocolate',
    description: 'Cremosa malteada de chocolate.',
    price: 40,
    category: 'Malteadas',
    spicy: false,
    vegetarian: true,
    popular: true,
  },
  {
    id: '43',
    name: 'Malteada de Fresa',
    description: 'Deliciosa malteada de fresa.',
    price: 40,
    category: 'Malteadas',
    spicy: false,
    vegetarian: true,
    popular: true,
  },
  {
    id: '49',
    name: 'Malteada de Vainilla',
    description: 'Clásica malteada de vainilla.',
    price: 40,
    category: 'Malteadas',
    spicy: false,
    vegetarian: true,
    popular: false,
  },
];

  useEffect(() => {
    // Cargar el menú directamente sin verificar imágenes
    const loadMenu = () => {
      try {
        const menuWithImages = exampleMenu.map(item => ({
          ...item,
          image: item.image || tacoImages[item.id] || '/images/menu/tacos/placeholder-food.jpg'
        }));
        
        setMenuItems(menuWithImages);
      } catch (error) {
        console.error('Error al cargar el menú:', error);
      } finally {
        setLoading(false);
        setImagesLoaded(true);
      }
    };
    
    loadMenu();
  }, []);

  // Función para manejar clic en imagen
  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  // Cerrar vista previa
  const closePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(undefined);
  };

  // Filtrar por categoría
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Obtener categorías únicas
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-yellow-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-white text-lg font-medium">Cargando menú...</p>
          {!imagesLoaded && (
            <p className="text-yellow-400 text-sm mt-2">Cargando imágenes...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Fondo */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/patterns/patronweb.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          backgroundColor: '#000',
          zIndex: 0
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Filtros de categoría */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Lista de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="group relative"
          >
            {/* Tarjeta principal */}
            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-800/90 border border-gray-700/50 flex flex-col h-full">
            <div className="flex-1 flex flex-col">
              {/* Imagen */}
              {item.image ? (
                <div 
                  className="w-full h-48 md:h-56 bg-gray-700 overflow-hidden cursor-pointer relative group"
                  onClick={() => handleImageClick(item.image!)}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={item.popular}
                    onError={(e) => {
                      // Si falla la carga, mostrar imagen de reemplazo
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/menu/tacos/placeholder-food.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
              ) : (
                <div className="w-full h-48 md:h-56 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              
              {/* Contenido */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <span className="bg-yellow-500 text-gray-900 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                    ${item.price}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 flex-1">{item.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {item.spicy && (
                    <span className="inline-flex items-center bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">
                      <Flame className="w-3 h-3 mr-1 flex-shrink-0" /> Picante
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="inline-flex items-center bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                      <Leaf className="w-3 h-3 mr-1 flex-shrink-0" /> Vegetariano
                    </span>
                  )}
                  {item.popular && (
                    <span className="inline-flex items-center bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 mr-1 flex-shrink-0" /> Popular
                    </span>
                  )}
                </div>
              </div>
            </div>
            
              {/* Efecto de borde sutil */}
              <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5" />
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>

      {/* Modal de vista previa de imagen */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-yellow-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(undefined);
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-hidden rounded-lg">
              <Image
                src={previewImage}
                alt="Vista previa"
                width={800}
                height={600}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            No hay items en esta categoría
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 card-tropical text-center">
        <h3 className="font-bebas text-3xl text-bora-yellow mb-4">
          ¿LISTO PARA ORDENAR?
        </h3>
        <p className="text-gray-300 mb-6">
          Acércate a nuestro mostrador o llámanos para hacer tu pedido
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-center">
            <p className="text-bora-yellow font-bebas text-xl mb-2">TELÉFONO</p>
            <p className="text-white text-lg">+52 55 4965 5305</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-bora-yellow/30"></div>
          <div className="text-center">
            <p className="text-bora-yellow font-bebas text-xl mb-2">HORARIOS</p>
            <p className="text-white text-sm">Lun-Vie: 11AM-4PM | Sáb-Dom: 9AM-4PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
