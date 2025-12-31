import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './client-layout';
import PageLoader from '@/components/PageLoader';

export const metadata: Metadata = {
  title: 'Tacos Bora Bora - Isla del Sabor',
  description: 'Tacos al estilo tropical con la mejor calidad. Vive la experiencia Bora Bora.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Unbounded:wght@300;400;500;600;700&family=Yeseva+One&display=swap" 
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-bebas: 'Bebas Neue', system-ui, -apple-system, sans-serif;
              --font-yeseva: 'Yeseva One', Georgia, serif;
              --font-unbounded: 'Unbounded', system-ui, -apple-system, sans-serif;
            }
            body {
              font-family: var(--font-unbounded);
              background-color: #000;
              color: #fff;
              margin: 0;
              padding: 0;
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-bebas);
              letter-spacing: 0.05em;
              margin: 0;
            }
          `
        }} />
      </head>
      <body className="relative">
        <PageLoader />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
