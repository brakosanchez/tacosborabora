'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CartButton } from './cart/CartButton';

interface NavbarProps {
  onThemeChange?: (mode: 'light' | 'dark' | 'system') => void;
  currentTheme?: 'light' | 'dark' | 'system';
}

export default function Navbar({ onThemeChange, currentTheme }: NavbarProps) {
  const auth = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Elementos del menú de navegación
  const menuItems = [
    { label: 'Menú', href: '/menu' }, // Enlace a la página del menú
    { label: 'Historia', href: '/historia' }, // Enlace a la página de historia
    { label: 'Contacto', href: '/contacto' }, // Enlace a la página de contacto
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-black/70 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="/LogoSoloBora.png" 
              alt="Tacos Bora Bora" 
              className="h-10 w-auto drop-shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/LogoBoraBora.png';
              }}
            />
            <span className="text-3xl font-bold text-orange-500 drop-shadow-md font-bebas">TACOS BORA BORA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            <Link 
              href="/haz-tu-pedido" 
              className="ml-4 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-orange-500/30"
            >
              Haz tu pedido
            </Link>
            
            <div className="ml-2">
              <CartButton />
            </div>
            
            {auth.isAuthenticated ? (
              <>
                <Link
                  href="/perfil"
                  className="ml-2 px-4 py-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Perfil
                </Link>
                <button
                  onClick={auth.logout}
                  className="ml-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-orange-500/30"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-orange-500/30"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <CartButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-orange-400 hover:text-orange-300 focus:outline-none"
              aria-label="Menú"
            >
              <div className="space-y-1.5 w-6">
                <span className={`block h-0.5 bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 bg-current ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil (solo visible en pantallas pequeñas) */}
      <div 
        className={`md:hidden bg-black/95 shadow-lg transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0' // Animación de despliegue/plegado
        }`}
        id="mobile-menu"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="container mx-auto px-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-lg text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          <Link
            href="/haz-tu-pedido"
            className="block px-4 py-3 text-lg text-center text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-md hover:shadow-orange-500/30"
            onClick={() => setMobileMenuOpen(false)}
          >
            Haz tu pedido
          </Link>
          
          {auth.isAuthenticated ? (
            <>
              <Link
                href="/perfil"
                className="block px-4 py-3 text-lg text-center text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  auth.logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-lg text-center text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-md hover:shadow-orange-500/30"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block px-4 py-3 text-lg text-center text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-md hover:shadow-orange-500/30"
              onClick={() => setMobileMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
