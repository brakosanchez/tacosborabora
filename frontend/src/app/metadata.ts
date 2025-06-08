import type { Metadata, Viewport } from 'next';

// Configuración de la vista
export const viewport: Viewport = {
  themeColor: '#FCB235',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  userScalable: true,
};

// Metadatos para la aplicación
export const defaultMetadata: Metadata = {
  title: {
    default: 'Tacos Bora Bora - Isla del Sabor',
    template: '%s | Tacos Bora Bora'
  },
  description: 'Descubre los auténticos tacos al estilo Bora Bora. Ingredientes frescos, sabores explosivos y una experiencia tropical en cada bocado.',
  keywords: 'tacos, comida mexicana, bora bora, isla del sabor, tacos al pastor, tacos de birria',
  metadataBase: new URL('https://tacosborabora.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tacos Bora Bora - Isla del Sabor',
    description: 'Descubre los auténticos tacos al estilo Bora Bora. Ingredientes frescos, sabores explosivos y una experiencia tropical en cada bocado.',
    url: 'https://tacosborabora.com',
    siteName: 'Tacos Bora Bora',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tacos Bora Bora - Isla del Sabor',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tacos Bora Bora - Isla del Sabor',
    description: 'Descubre los auténticos tacos al estilo Bora Bora',
    images: ['/og-image.jpg'],
    creator: '@tacosborabora',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    // Configuración para iOS/Safari
    apple: [
      { url: '/LogoSoloBora.png', sizes: '180x180', type: 'image/png' },
    ],
    // Otras configuraciones de íconos
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#FCB235' },
      { rel: 'shortcut icon', url: '/favicon.ico' },
      // Forzar el uso de LogoSoloBora.png para apple-touch-icon
      { rel: 'apple-touch-icon', url: '/LogoSoloBora.png', sizes: '180x180' },
      { rel: 'apple-touch-icon-precomposed', url: '/LogoSoloBora.png', sizes: '180x180' },
      // Agregar un enlace directo para apple-touch-icon.png
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'tu-codigo-de-verificacion-google',
    yandex: 'tu-codigo-de-verificacion-yandex',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
