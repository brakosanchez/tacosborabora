'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CartButton } from './cart/CartButton';

interface NavbarProps {
  onThemeChange?: (mode: 'light' | 'dark' | 'system') => void;
  currentTheme?: 'light' | 'dark' | 'system';
}

export default function Navbar({ onThemeChange, currentTheme }: NavbarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Cerrar menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Overlay cuando el menú está abierto */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-500 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-black/60 backdrop-blur-sm shadow-md' : 'bg-black/50 backdrop-blur-sm'
        }`}
      >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/LogoSoloBora.png" 
              alt="Tacos Bora Bora" 
              className="h-8 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/LogoBoraBora.png';
              }}
            />
            <span className="text-2xl font-bold text-orange-400 font-bebas">TACOS BORA BORA</span>
          </Link>

          {/* Menu Button and Cart */}
          <div className="flex items-center space-x-3">
            <CartButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="group p-1.5 focus:outline-none transition-all"
              aria-label="Menú"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-5 flex items-center justify-center">
                <span className={`absolute h-[1.5px] w-5 bg-orange-400 group-hover:bg-orange-300 transition-all duration-300 ease-out ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                <span className={`absolute h-[1.5px] w-5 bg-orange-400 group-hover:bg-orange-300 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute h-[1.5px] w-5 bg-orange-400 group-hover:bg-orange-300 transition-all duration-300 ease-out ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable lateral derecho */}
      <div 
        className={`fixed top-16 right-4 w-64 bg-black/70 backdrop-blur-sm z-50 transition-all duration-500 ease-in-out overflow-hidden rounded-b-xl shadow-2xl ${
          mobileMenuOpen ? 'max-h-[calc(100vh-5rem)] opacity-100' : 'max-h-0 opacity-0'
        }`}
        id="mobile-menu"
        aria-hidden={!mobileMenuOpen}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          {/* Botón de cerrar */}
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-orange-400 hover:text-orange-300 focus:outline-none transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Lista de enlaces */}
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-orange-200 hover:bg-orange-900/30 rounded-md group transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-orange-900/30 my-2"></div>
            
            <Link
              href="/haz-tu-pedido"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md group transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="truncate">Haz tu pedido</span>
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/perfil"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-orange-200 hover:bg-orange-900/30 rounded-md group transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="truncate">Mi Perfil</span>
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/login' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-orange-200 hover:bg-orange-900/30 rounded-md group transition-colors"
                >
                  <span className="truncate">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-orange-600/90 hover:bg-orange-700 rounded-md group transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="truncate">Iniciar Sesión</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
      </nav>
    </>
  );
}
