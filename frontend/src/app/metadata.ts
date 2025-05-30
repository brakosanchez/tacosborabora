import type { Metadata } from 'next';

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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#1a120b',
  viewport: 'width=device-width, initial-scale=1',
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
