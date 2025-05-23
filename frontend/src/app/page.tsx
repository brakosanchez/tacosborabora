'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Importar componentes con carga dinámica para mejor rendimiento
const Hero = dynamic(() => import('@/components/Hero'), { ssr: true });
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), { ssr: true });

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-brown/5 to-white">
      <Hero />
      <FeaturesSection />
    </div>
  );
};

export default Home;
