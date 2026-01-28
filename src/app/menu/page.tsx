'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Flame, Leaf, Star } from 'lucide-react'

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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const categoriesContainerRef = useRef<HTMLDivElement>(null)

  // Mapeo de imágenes de tacos y bebidas
  const tacoImages: { [key: string]: string } = {
    // Tacos (1-8)
    '1': '/images/menu/tacos/taco-mixiote.webp',
    '2': '/images/menu/tacos/taco-bistec.webp',
    '3': '/images/menu/tacos/taco-longaniza.webp',
    '4': '/images/menu/tacos/taco-pollo.webp',
    '5': '/images/menu/tacos/taco-arrachera.webp',
    '6': '/images/menu/tacos/taco-aguja.webp',
    '7': '/images/menu/tacos/taco-cecina.webp',
    '8': '/images/menu/tacos/taco-picaña.webp',
    
    // Campechanos (9-14)
    '9': '/images/menu/tacos/taco-campechanores.webp',
    '10': '/images/menu/tacos/taco-campechanopollo.webp',
    '11': '/images/menu/tacos/taco-campechanocecina.webp',
    '12': '/images/menu/tacos/taco-campechanoarrachera.webp',
    '13': '/images/menu/tacos/taco-campechanoaguja.webp',
    '14': '/images/menu/tacos/taco-campechanopicaña.webp',
    
    // Aguas Frescas (15-26)
    '15': '/images/menu/tacos/Agua-Limon-Kiwi.webp',
    '16': '/images/menu/tacos/Agua-Limon-Chia.webp',
    '17': '/images/menu/tacos/Agua-Fresa-Guayaba.webp',
    '18': '/images/menu/tacos/Agua-Fresa-Maracuya.webp',
    '19': '/images/menu/tacos/Agua-FrutosRojos.webp',
    '20': '/images/menu/tacos/Agua-Jamaica-Naranja.webp',
    '21': '/images/menu/tacos/Agua-Piña-Mango.webp',
    '22': '/images/menu/tacos/Agua-Piña-Maracuya.webp',
    '23': '/images/menu/tacos/Agua-Tamarindo.webp',
    '24': '/images/menu/tacos/Agua-Horchata.webp',
    '25': '/images/menu/tacos/Agua-Melon.webp',
    '26': '/images/menu/tacos/Agua-Limon-Maracuya.webp',
    
    // Refrescos (27-30)
    '27': '/images/menu/tacos/cocacola.webp',
    '28': '/images/menu/tacos/sprite.webp',
    '29': '/images/menu/tacos/Fanta.webp',
    '30': '/images/menu/tacos/Mundet.webp',
    
    // Tés (31-32)
    '31': '/images/menu/tacos/FuzeTea.webp',
    '32': '/images/menu/tacos/TopoChico.webp',
    
    // Jugos y Néctares (33-38)
    '33': '/images/menu/tacos/Boing-Guayaba.webp',
    '34': '/images/menu/tacos/Boing-Mango.webp',
    '35': '/images/menu/tacos/Nectar-Mango.webp',
    '36': '/images/menu/tacos/Nectar-Naranja.webp',
    '37': '/images/menu/tacos/Nectar-Piña.webp',
    '38': '/images/menu/tacos/Nectar-Uva.webp',
    
    // Malteadas (39-41)
    '39': '/images/menu/tacos/Malteada-Chocolate.webp',
    '40': '/images/menu/tacos/Malteada-Fresa.webp',
    '41': '/images/menu/tacos/Malteada-Vainilla.webp',
    
    // Bebidas adicionales (42-44)
    '42': '/images/menu/tacos/Arizona-Mango.webp',
    '43': '/images/menu/tacos/Arizona-Sandia.webp',
    '44': '/images/menu/tacos/Fresca.webp'
  };

  // Menú organizado por categorías
  const exampleMenu: MenuItem[] = [
    // Tacos (1-8)
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
      description: 'Jugoso bistec de res a la plancha, con un toque de mostaza y especias de casa.',
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
      name: 'Taco de Pechuga de Pollo',
      description: 'Pechuga de pollo marinada y asada, jugosa por dentro y dorada por fuera.',
      price: 30,
      category: 'Tacos',
      spicy: false,
      vegetarian: false,
      popular: true,
      image: tacoImages['4']
    },
    {
      id: '5',
      name: 'Taco de Arrachera',
      description: 'Cortes de arrachera premium, tiernos y jugosos, con toque de especias.',
      price: 35,
      category: 'Tacos',
      spicy: false,
      vegetarian: false,
      popular: true,
      image: tacoImages['5']
    },
    {
      id: '6',
      name: 'Taco de Aguja Norteña',
      description: 'Aguja norteña con toque de fuego y especias Bora Bora, con grasita pero rica.',
      price: 50,
      category: 'Tacos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['6']
    },
    {
      id: '7',
      name: 'Taco de Cecina',
      description: 'Cecina de res con toque especial, para que quede jugosa y suave.',
      price: 50,
      category: 'Tacos',
      spicy: false,
      vegetarian: false,
      popular: true,
      image: tacoImages['7']
    },
    {
      id: '8',
      name: 'Taco de Picaña',
      description: 'Deliciosa picaña de res, una grasita especial y una textura riquísima.',
      price: 35,
      category: 'Tacos',
      spicy: false,
      vegetarian: false,
      popular: true,
      image: tacoImages['8']
    },

    // Campechanos (9-14)
    {
      id: '9',
      name: 'Campechano de Res',
      description: 'Combinación de Longaniza con Bistec de Res.',
      price: 30,
      category: 'Campechanos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['9']
    },
    {
      id: '10',
      name: 'Campechano de Pollo',
      description: 'Combinación de Longaniza con Pechuga de Pollo y jugo sazonador.',
      price: 30,
      category: 'Campechanos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['10']
    },
    {
      id: '11',
      name: 'Campechano de Cecina',
      description: 'La mejor combinación: Longaniza + Cecina.',
      price: 35,
      category: 'Campechanos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['11']
    },
    {
      id: '12',
      name: 'Campechano de Arrachera',
      description: 'Exquisita mezcla de Longaniza + Arrachera.',
      price: 35,
      category: 'Campechanos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['12']
    },
    {
      id: '13',
      name: 'Campechano de Aguja',
      description: 'Deliciosa combinación de Longaniza + Aguja Norteña.',
      price: 35,
      category: 'Campechanos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['13']
    },
    {
      id: '14',
      name: 'Campechano de Picaña',
      description: 'Una deliciosa combinación de Longaniza con Picaña de Res.',
      price: 35 ,
      category: 'Campechanos',
      spicy: true,
      vegetarian: false,
      popular: true,
      image: tacoImages['14']
    },

    // Aguas Frescas (15-26)
    {
      id: '15',
      name: 'Agua de Limón con Kiwi',
      description: 'Refrescante agua de limón con kiwi. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['15']
    },
    {
      id: '16',
      name: 'Agua de Limón con Chía',
      description: 'Agua de limón con semillas de chía. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['16']
    },
    {
      id: '26',
      name: 'Agua de Limón con Maracuyá',
      description: 'Mezcla cítrica de limón con toque tropical de maracuyá. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['26']
    },
    {
      id: '17',
      name: 'Agua de Fresa con Guayaba',
      description: 'Deliciosa combinación de fresa y guayaba. (Sujeto a disponibilidad)',
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
      description: 'Mezcla refrescante de fresa y maracuyá. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['18']
    },
    {
      id: '19',
      name: 'Agua de Frutos Rojos',
      description: 'Mezcla de frutos rojos. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['19']
    },
    {
      id: '20',
      name: 'Agua de Jamaica con Naranja',
      description: 'Jamaica con toque cítrico de naranja. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['20']
    },
    {
      id: '21',
      name: 'Agua de Piña con Mango',
      description: 'Combinación tropical de piña y mango. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['21']
    },
    {
      id: '22',
      name: 'Agua de Piña con Maracuyá',
      description: 'Piña tropical con maracuyá. (Sujeto a disponibilidad)',
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
      description: 'Clásico sabor agridulce de tamarindo. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['23']
    },
    {
      id: '24',
      name: 'Horchata',
      description: 'Tradicional agua de horchata. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['24']
    },
    {
      id: '25',
      name: 'Agua de Melón',
      description: 'Refrescante agua de melón. (Sujeto a disponibilidad)',
      price: 45,
      category: 'Aguas Frescas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['25']
    },

    // Refrescos (26-29)
    {
      id: '26',
      name: 'Coca-Cola',
      description: 'Refresco de cola 600ml',
      price: 20,
      category: 'Refrescos',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['27']
    },
    {
      id: '27',
      name: 'Sprite',
      description: 'Refresco de lima-limón 600ml',
      price: 20,
      category: 'Refrescos',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['28']
    },
    {
      id: '28',
      name: 'Fanta',
      description: 'Refresco de naranja 600ml',
      price: 20,
      category: 'Refrescos',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['29']
    },
    {
      id: '29',
      name: 'Sidral Mundet',
      description: 'Refresco de manzana 600ml',
      price: 20,
      category: 'Refrescos',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['31']
    },

    // Tés y otras bebidas (30-31)
    {
      id: '30',
      name: 'Fuze Tea',
      description: 'Té helado sabor durazno 600ml',
      price: 25,
      category: 'Tés',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['30']
    },
    {
      id: '31',
      name: 'Topo Chico',
      description: 'Agua mineral con gas 500ml',
      price: 30 ,
      category: 'Tés',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['32']
    },

    // Jugos y Néctares (33-38)
    {
      id: '33',
      name: 'Boing de Guayaba',
      description: 'Jugo de guayaba 400ml',
      price: 20,
      category: 'Jugos y Néctares',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['33']
    },
    {
      id: '34',
      name: 'Boing de Mango',
      description: 'Jugo de mango 400ml',
      price: 20,
      category: 'Jugos y Néctares',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['34']
    },
    {
      id: '35',
      name: 'Néctar de Mango',
      description: 'Néctar de mango 400ml',
      price: 30,
      category: 'Jugos y Néctares',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['35']
    },
    {
      id: '36',
      name: 'Néctar de Naranja',
      description: 'Néctar de naranja 400ml',
      price: 30,
      category: 'Jugos y Néctares',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['36']
    },
    {
      id: '37',
      name: 'Néctar de Piña',
      description: 'Néctar de piña 400ml',
      price: 30,
      category: 'Jugos y Néctares',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['37']
    },
    {
      id: '38',
      name: 'Néctar de Uva',
      description: 'Néctar de uva 400ml',
      price: 30,
      category: 'Jugos y Néctares',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['38']
    },

    // Malteadas (39-41)
    {
      id: '39',
      name: 'Malteada de Chocolate',
      description: 'Malteada cremosa de chocolate con leche entera',
      price: 30,
      category: 'Malteadas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['39']
    },
    {
      id: '40',
      name: 'Malteada de Fresa',
      description: 'Deliciosa malteada de fresa natural',
      price: 30,
      category: 'Malteadas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['40']
    },
    {
      id: '41',
      name: 'Malteada de Vainilla',
      description: 'Clásica malteada de vainilla con toque de canela',
      price: 30,
      category: 'Malteadas',
      spicy: false,
      vegetarian: true,
      popular: true,
      image: tacoImages['41']
    },

   
  ];


  useEffect(() => {
    // Simular carga de API
    setTimeout(() => {
      setMenuItems(exampleMenu)
      setLoading(false)
    }, 500)
  }, [])

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleOrder = (item: MenuItem, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const message = `Hola, quiero ordenar: ${item.name} ($${item.price})`
    const whatsappUrl = `https://wa.me/+525549655305?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleImageClick = (e: React.MouseEvent, imageUrl?: string) => {
    e.stopPropagation();
    if (imageUrl) {
      setPreviewImage(imageUrl);
    }
  }

  return (
    <div 
      className="pt-20 min-h-screen relative"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="font-bebas text-6xl md:text-7xl mb-4">
            <span className="text-fire glow-title">NUESTRO MENÚ</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre los sabores únicos de la Isla del Sabor. 
            Cada taco es una experiencia tropical que te transportará al paraíso.
          </p>
          <div className="divider-tropical"></div>
        </div>

        {/* Category Filter - Con botones de navegación */}
        <div className="relative mb-12 w-full">
          <div className="relative w-full">
            {/* Botón de navegación izquierdo */}
            <button 
              onClick={() => {
                if (categoriesContainerRef.current) {
                  categoriesContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Desplazar categorías a la izquierda"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Contenedor de categorías */}
            <div 
              ref={categoriesContainerRef}
              className="flex overflow-x-auto pb-4 hide-scrollbar px-2 sm:px-6 scroll-smooth"
            >
              <div className="flex space-x-2 mx-auto min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap category-item ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-bora-orange to-yellow-500 text-white shadow-lg shadow-orange-500/30 flex-shrink-0'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm hover:text-white flex-shrink-0'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    {category === 'all' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        Todo
                      </>
                    ) : category === 'Tacos' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Campechanos' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Aguas Frescas' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Refrescos' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Tés' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Jugos y Néctares' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Malteadas' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {category}
                      </>
                    ) : category === 'Bebidas adicionales' ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {category}
                      </>
                    ) : (
                      category
                    )}
                  </span>
                  {selectedCategory === category && (
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-400 rounded-full"></span>
                  )}
                </button>
              ))}
              </div>
            </div>
            
            {/* Botón de navegación derecho */}
            <button 
              onClick={() => {
                if (categoriesContainerRef.current) {
                  categoriesContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/80 to-transparent z-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Desplazar categorías a la derecha"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <style jsx global>{`
            .hide-scrollbar {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE and Edge */
              scroll-behavior: smooth;
              scroll-snap-type: x mandatory;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
            .category-item {
              scroll-snap-align: start;
            }
            @media (max-width: 768px) {
              .card-tropical {
                animation: none !important;
              }
            }
          `}</style>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bora-yellow"></div>
            <p className="text-gray-400 mt-4">Cargando menú...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="card-tropical group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.image) {
                    setPreviewImage(item.image);
                  }
                }}
              >
                {/* Imagen del ítem */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div 
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={(e) => handleImageClick(e, item.image)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bebas text-2xl text-bora-yellow glow-title">
                      {item.name}
                    </h3>
                    <span className="font-bold text-xl text-bora-orange">
                      ${item.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {item.description}
                  </p>

                  <button
                    onClick={(e) => handleOrder(item, e)}
                    className="bg-bora-orange hover:bg-bora-yellow text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ordenar
                  </button>
                </div>
              </div>
            ))}
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
          <h3 className="font-bebas text-3xl text-bora-yellow mb-4 glow-title">
            ¿TIENES ALGUNA ALERGIA O PREFERENCIA?
          </h3>
          <p className="text-gray-300 mb-6">
            Háznoslo saber al momento de ordenar y adaptaremos tu taco a tus necesidades
          </p>
          <a
            href="https://wa.me/+525549655305"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      {/* Modal de vista previa de imagen */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(undefined)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
              onClick={() => setPreviewImage(undefined)}
            >
              ✕
            </button>
            <img 
              src={previewImage} 
              alt="Vista previa" 
              className="max-w-full max-h-[80vh] mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
