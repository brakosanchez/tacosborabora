'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onThemeChange?: (mode: 'light' | 'dark' | 'system') => void;
  currentTheme?: 'light' | 'dark' | 'system';
}

export default function Navbar({ onThemeChange, currentTheme }: NavbarProps) {
  const auth = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log('Menú abierto:', mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Elementos del menú de navegación
  const menuItems = [
    { label: 'Menú', href: '/menu' },
    { label: 'Historia', href: '/historia' },
    { label: 'Contacto', href: '/contacto' },
  ];

  const router = useRouter();
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Cerrar el menú al hacer clic en un enlace
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800/50 shadow-xl h-16 font-bebas">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/LogoSoloBora.png" 
                alt="Tacos Bora Bora" 
                className="h-12 w-auto drop-shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/LogoBoraBora.png';
                }}
              />
              <span className="text-3xl font-bold text-orange-500 drop-shadow-md">TACOS BORA BORA</span>
            </Link>

            {/* Controles del menú */}
            <div className="flex items-center space-x-4">
              {/* Carrito de compras */}
              <div className="relative">
                <button 
                  onClick={() => router.push('/carrito')}
                  className="p-2 text-orange-400 hover:text-orange-300 focus:outline-none relative"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Botón del menú hamburguesa */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-1.5 text-orange-400 hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 rounded-md z-50 transition-all duration-200 hover:bg-gray-800/50"
                aria-label="Menú"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span 
                    className={`block h-0.5 w-5 bg-orange-400 transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''} rounded-full`}
                  ></span>
                  <span 
                    className={`block h-0.5 w-5 bg-orange-400 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'} rounded-full`}
                  ></span>
                  <span 
                    className={`block h-0.5 w-5 bg-orange-400 transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''} rounded-full`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay del menú */}
      <div 
        className={`fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      >
        {/* Menú desplegable */}
        <div 
          className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-black/80 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col justify-between py-6 px-4">
            <div className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-orange-300 hover:bg-black/50 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              
              <Link
                href="/haz-tu-pedido"
                className="block w-full px-4 py-3 text-center text-white bg-orange-600 hover:bg-orange-700 rounded-lg mt-4 transition-colors"
                onClick={closeMobileMenu}
              >
                Haz tu pedido
              </Link>
              
              {auth.isAuthenticated ? (
                <>
                  <Link
                    href="/perfil"
                    className="block px-4 py-3 text-orange-300 hover:bg-black/50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      auth.logout();
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 text-center text-white bg-orange-600/90 hover:bg-orange-600 rounded-md mt-4 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 text-center text-white bg-orange-600 hover:bg-orange-700 rounded-md mt-4 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
}
