import Link from 'next/link';
import { signOut } from 'next-auth/react';

const menuItems = [
  { href: '/admin', label: 'Panel Principal' },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/inventario', label: 'Inventario' },
  { href: '/admin/ventas', label: 'Ventas' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold text-primary-600">
          Admin Panel
        </h1>
      </div>

      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full text-left text-red-500 hover:text-red-600"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
