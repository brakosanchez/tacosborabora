'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './historia.module.css';

// Importar componentes con carga dinámica
const DeBrochasAOllas = dynamic(() => import('@/components/historia/DeBrochasAOllas'), {
  loading: () => <Loading />
});

const AContrarreloj = dynamic(() => import('@/components/historia/AContrarreloj'), {
  loading: () => <Loading />
});

const SaborQueNoSeRinde = dynamic(() => import('@/components/historia/SaborQueNoSeRinde'), {
  loading: () => <Loading />
});

// Componente de carga
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-brown">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
  </div>
);

export default function HistoriaPage() {
  // Efecto para el scroll suave al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className={`${styles.container} ${styles.globalVars}`}>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          background-color: #1a120b; /* Color de fondo oscuro para la página */
        }
      `}</style>
      
      {/* Fondo con blur para toda la página */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
          style={{
            backgroundImage: 'url(/fondoborabora.png)',
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
      </div>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden"
      >
        {/* Fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/fondoborabora.png)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-brown via-dark-brown/90 to-transparent" />
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10" />
        </div>
        
        {/* Contenido */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bebas tracking-wide mb-6">
              Nuestra <span className="text-yellow-500">Historia</span>
            </h1>
            <p className="text-xl md:text-2xl font-unbounded max-w-3xl mx-auto text-gray-300">
              Un viaje de esfuerzo, pasión y sabor que comenzó con un sueño y se convirtió en nuestro legado familiar.
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-8 py-3 rounded-full border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors cursor-pointer group">
              <span className="font-bebas text-yellow-500 text-lg group-hover:translate-y-[-2px] transition-transform">DESCUBRE NUESTRA HISTORIA</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>
        </div>
        
        {/* Elemento decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-brown to-transparent" />
      </motion.div>
      
      {/* Secciones de la historia */}
      <div className="relative z-10">
        <DeBrochasAOllas />
        <AContrarreloj />
        <SaborQueNoSeRinde />
      </div>
      
      {/* Sección de agradecimiento */}
      <div className="relative py-20 bg-gradient-to-b from-dark-brown to-black text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bebas mb-6">Gracias por ser parte de <span className="text-yellow-500">nuestra historia</span></h3>
          <p className="text-gray-300 max-w-3xl mx-auto font-unbounded mb-8">
            A nuestros clientes, amigos y familia: su apoyo ha sido el ingrediente secreto de nuestro éxito. 
            Los invitamos a seguir disfrutando de la auténtica experiencia Bora Bora.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-yellow-500 text-dark-brown font-bebas rounded-lg hover:bg-yellow-400 transition-colors">
              VER MENÚ
            </button>
            <button className="px-8 py-3 border border-yellow-500 text-yellow-500 font-bebas rounded-lg hover:bg-yellow-500/10 transition-colors">
              CONTÁCTANOS
            </button>
          </div>
        </div>
        
        {/* Elemento decorativo */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/10 rounded-full" />
      </div>

      {/* Sección de Eventos */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-brown/95 z-0" />
        
        {/* Elementos decorativos */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 rounded-full bg-yellow-500/10 -z-10" />
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-red-500/10 -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Imagen */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-500/30"
            >
              <Image 
                src="/4.jpg" 
                alt="Eventos y celebraciones con Tacos Bora Bora" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <p className="font-yeseva text-yellow-500 text-xl">¡Celebra con nosotros!</p>
              </div>
            </motion.div>
            
            {/* Contenido */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bebas mb-6">
                <span className="text-yellow-500">¿Tienes un evento especial?</span>
              </h2>
              <p className="text-lg mb-6">
                Lleva el auténtico sabor de Tacos Bora Bora a tu próxima celebración. 
                Ofrecemos paquetes especiales para todo tipo de eventos:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fiestas de cumpleaños
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reuniones familiares
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Eventos corporativos
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bodas y XV años
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://wa.me/5211234567890?text=Hola,%20me%20interesa%20cotizar%20para%20un%20evento" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 text-dark-brown font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.498 14.382v3.3c0 .66.535 1.204 1.274 1.247l.26.006c.71 0 1.36-.412 1.72-1.06.08-.14.125-.296.13-.456.04-.6.07-1.21.07-1.82 0-4.83-3.92-8.75-8.75-8.75h-5c-4.83 0-8.75 3.92-8.75 8.75 0 4.83 3.92 8.75 8.75 8.75h.06c.29 0 .58-.02.86-.05.5-.05.96-.3 1.32-.66l.94-.94c.32-.32.5-.75.5-1.2v-2.67c0-.48.2-.96.56-1.3l1.4-1.3c.37-.35.86-.54 1.38-.54zm-12.248-2.13c0-3.45 2.8-6.25 6.25-6.25h5c3.45 0 6.25 2.8 6.25 6.25 0 .34-.03.69-.06 1.02-.04.47-.39.85-.86.85h-1.56c-.24 0-.46.11-.61.3l-1.4 1.3c-.5.47-1.17.74-1.89.74h-.06c-3.45 0-6.25-2.8-6.25-6.25z"/>
                  </svg>
                  Cotizar por WhatsApp
                </a>
                <a 
                  href="tel:+5211234567890" 
                  className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Llamar ahora
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
