import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tacos Bora Bora - Isla del Sabor',
  description: 'Tacos al estilo tropical con la mejor calidad. Vive la experiencia Bora Bora.',
  keywords: 'tacos, comida mexicana, bora bora, tacos tropicales, isla del sabor',
  authors: [{ name: 'Tacos Bora Bora' }],
  icons: {
    icon: '/images/logo/favicon.png',
    shortcut: '/images/logo/favicon.png',
    apple: '/images/logo/favicon.png',
  },
  openGraph: {
    title: 'Tacos Bora Bora - Isla del Sabor',
    description: 'Tacos al estilo tropical con la mejor calidad',
    type: 'website',
  },
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
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
