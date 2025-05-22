import type { Metadata } from 'next';
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HealthCheck from '../components/HealthCheck';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '../components/Cart';
import { AuthSessionProvider } from '../providers/SessionProvider';
import { metadata } from './metadata';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthSessionProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <div className="flex flex-col">
                  <Navbar />
                  <HealthCheck />
                  <Toaster position="top-right" />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
            </CartProvider>
          </AuthProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
