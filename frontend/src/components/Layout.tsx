import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Cart } from './Cart';
import { MenuHamburguesa } from './MenuHamburguesa';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <MenuHamburguesa />
        
        <main className="flex-1">
          {children}
        </main>
      </div>

      <Footer />

      {/* Cart Modal */}
      {session && (
        <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Carrito</h2>
            <Cart />
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
