import type { Metadata } from 'next';
import { Bebas_Neue, Yeseva_One } from 'next/font/google'; // Eliminada la importación de Unbounded
import './globals.css';
import dynamic from 'next/dynamic';

// Importar metadatos y configuración de vista
import { defaultMetadata, viewport } from './metadata';

export { viewport };

// Importar proveedores
import MuiProvider from './_app';

// Configuración de fuentes
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
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener la sesión del servidor
  const { getServerSession } = await import('next-auth/next');
  const session = await getServerSession();

  return (
    <html lang="es" className={`${bebas.variable} ${yeseva.variable} font-sans`}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <MuiProvider>
          <ClientLayout session={session}>
            {children}
          </ClientLayout>
        </MuiProvider>
      </body>
    </html>
  );
}
