import type { Metadata } from 'next';
import { Unbounded, Bebas_Neue, Yeseva_One } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

// Importar metadatos por defecto
import { defaultMetadata } from './metadata';

// Importar proveedores
import MuiProvider from './_app';

// Configuración de fuentes
const unbounded = Unbounded({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-unbounded',
  preload: true,
});

const bebas = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
  preload: true,
});

const yeseva = Yeseva_One({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-yeseva',
  preload: true,
});

// Exportar metadatos
export const metadata: Metadata = {
  ...defaultMetadata,
  title: {
    default: 'Tacos Bora Bora - Los Mejores Tacos de la Ciudad',
    template: '%s | Tacos Bora Bora'
  },
  description: 'Disfruta de los auténticos sabores de México en Tacos Bora Bora. Tacos, bebidas y más en un ambiente único.',
};

// Importar componentes con carga dinámica
const ClientLayout = dynamic(() => import('./client'), { ssr: false });

// Este es un componente de servidor que envuelve al cliente
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`h-full ${unbounded.variable} ${bebas.variable} ${yeseva.variable}`}>
      <body className="min-h-screen flex flex-col font-unbounded bg-dark-brown text-white">
        <MuiProvider>
          <ClientLayout>
            <div className="flex-grow">
              {children}
            </div>
          </ClientLayout>
        </MuiProvider>
      </body>
    </html>
  );
}
