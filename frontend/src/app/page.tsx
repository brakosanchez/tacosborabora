'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Componente de carga
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-brown">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCB235]"></div>
  </div>
);

// Importar componentes con carga dinámica para mejor rendimiento
const Hero = dynamic(() => import('@/components/Hero'), { 
  ssr: true,
  loading: () => <Loading />
});

const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), { 
  ssr: true,
  loading: () => <Loading />
});

const Home = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
      style={{
        backgroundImage: "url('/fondos/fondoelegante1.png')",
      }}
    >
      <div className="min-h-screen bg-black/60">
        <main className="relative">
          <Suspense fallback={<Loading />}>
            <Hero />
            <FeaturesSection />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Home;
