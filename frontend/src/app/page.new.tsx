import dynamic from 'next/dynamic';

// Importar componentes con carga dinámica para mejor rendimiento
const Hero = dynamic(() => import('@/components/Hero'), { ssr: true });
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), { ssr: true });

// Metadata para SEO
export const metadata = {
  title: 'Tacos Bora Bora - Isla del Sabor',
  description: 'Descubre los auténticos tacos al estilo Bora Bora. Ingredientes frescos, sabores explosivos y una experiencia tropical en cada bocado.',
  keywords: 'tacos, comida mexicana, bora bora, isla del sabor, tacos al pastor, tacos de birria',
  openGraph: {
    title: 'Tacos Bora Bora - Isla del Sabor',
    description: 'Descubre los auténticos tacos al estilo Bora Bora. Ingredientes frescos, sabores explosivos y una experiencia tropical en cada bocado.',
    url: 'https://tacosborabora.com',
    siteName: 'Tacos Bora Bora',
    images: [
      {
        url: '/images/og-image.jpg',
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
    images: ['/images/og-image.jpg'],
  },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-brown/5 to-white">
      <Hero />
      <FeaturesSection />
    </div>
  );
};

export default Home;
