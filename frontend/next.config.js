/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost', 
      'tacosborabora.com',
      'tacos-bora-bora.vercel.app',
      'www.tacosborabora.com'
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://tacosborabora-backend.vercel.app',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
    NEXTAUTH_DEBUG: process.env.NODE_ENV === 'development' ? '1' : '0',
  },
  // Configuración para exportación estática si es necesario
  output: 'standalone',
  
  // Configuración para NextAuth
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Configuración para internacionalización si es necesario
  i18n: {
    locales: ['es-MX'],
    defaultLocale: 'es-MX',
  },
  // Configuración de encabezados de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Configuración de redirecciones si es necesario
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // Configuración de reescritura si es necesario
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://tacosborabora-backend.vercel.app'}/:path*`,
      },
    ];
  },
  // Configuración de webpack
  webpack: (config, { isServer }) => {
    // Configuraciones personalizadas de webpack si es necesario
    return config;
  },
  // Configuración de compresión
  compress: true,
  // Configuración de generación de mapas de fuente
  productionBrowserSourceMaps: false,
  // Configuración de optimización de imágenes
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
