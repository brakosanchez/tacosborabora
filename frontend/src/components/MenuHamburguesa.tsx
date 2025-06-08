import { useState } from 'react';
import Link from 'next/link';
import Button from './ui/Button';

export default function MenuHamburguesa() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/menu', label: 'Menú' },
    { href: '/historia', label: 'Historia' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/login', label: 'Iniciar Sesión' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-yellow-100 hover:text-yellow-300 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a120b] border border-yellow-900 rounded-md shadow-lg z-50">
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-yellow-100 hover:bg-yellow-900/30 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
