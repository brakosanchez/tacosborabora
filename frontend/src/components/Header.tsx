'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHome, FiCoffee, FiShoppingBag, FiBookOpen, FiUsers } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '/', icon: <FiHome className="mr-2" /> },
    { name: 'Menú', href: '/menu', icon: <FiCoffee className="mr-2" /> },
    { name: 'Ordenar', href: '/ordenar', icon: <FiShoppingBag className="mr-2" /> },
    { name: 'Instructivos', href: '/instructivos', icon: <FiBookOpen className="mr-2" /> },
    { name: 'Admin', href: '/admin', icon: <FiUsers className="mr-2" /> },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-brown/95 shadow-lg' : 'bg-dark-brown/80'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-yellow-500 text-3xl font-bebas">TACOS BORA BORA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                  pathname === item.href 
                    ? 'text-yellow-500 bg-yellow-500/10' 
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* User and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-yellow-500 p-2 rounded-full hover:bg-yellow-500/10 transition-colors"
              aria-label="Iniciar sesión"
            >
              <FiUser className="h-5 w-5" />
            </Link>
            <button 
              className="relative text-white hover:text-yellow-500 p-2 rounded-full hover:bg-yellow-500/10 transition-colors"
              aria-label="Carrito de compras"
            >
              <FiShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-dark-brown text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'text-white hover:bg-yellow-500/10'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 flex justify-between px-4">
                <Link 
                  href="/login" 
                  className="flex items-center text-white hover:text-yellow-500 p-2 rounded-full hover:bg-yellow-500/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="h-5 w-5 mr-2" />
                  Iniciar sesión
                </Link>
                <button 
                  className="flex items-center text-white hover:text-yellow-500 p-2 rounded-full hover:bg-yellow-500/10 transition-colors"
                  onClick={() => {
                    // Abrir carrito
                    setIsOpen(false);
                  }}
                >
                  <FiShoppingCart className="h-5 w-5 mr-2" />
                  <span className="bg-yellow-500 text-dark-brown text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
