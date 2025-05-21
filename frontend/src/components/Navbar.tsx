import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary-600">Tacos Bora Bora</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/menu" className="text-gray-600 hover:text-primary-600">
            Menú
          </Link>
          <Link href="/historia" className="text-gray-600 hover:text-primary-600">
            Historia
          </Link>
          <Link href="/contacto" className="text-gray-600 hover:text-primary-600">
            Contacto
          </Link>
          <Link href="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg">
            <div className="px-4 py-2">
              <Link
                href="/menu"
                className="block text-gray-600 hover:text-primary-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                Menú
              </Link>
              <Link
                href="/historia"
                className="block text-gray-600 hover:text-primary-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                Historia
              </Link>
              <Link
                href="/contacto"
                className="block text-gray-600 hover:text-primary-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/login"
                className="block text-gray-600 hover:text-primary-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
