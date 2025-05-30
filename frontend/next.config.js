/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración de imágenes optimizada
  images: {
    domains: [
      'localhost', 
      'tacosborabora.com',
      'tacos-bora-bora.vercel.app',
      'www.tacosborabora.com'
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configuración de tiempo de espera para generación estática
  staticPageGenerationTimeout: 180, // 3 minutos en segundos
  
  // Configuración experimental
  experimental: {
    isrMemoryCacheSize: 0,
    serverActions: true, // Habilita Server Actions
  },

  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://tacosborabora-backend.vercel.app',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://tacosborabora.com',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_DEBUG: process.env.NODE_ENV === 'development' ? '1' : '0',
  },

  // Configuración para exportación estática
  output: 'standalone',
  
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configuración para internacionalización
  i18n: {
    locales: ['es-MX'],
    defaultLocale: 'es-MX',
  },

  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Configuración de reescritura de API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || '[https://tacosborabora-backend.vercel.app](https://tacosborabora-backend.vercel.app)'}/:path*`,
      },
    ];
  },

  // Configuración de webpack
  webpack: (config, { isServer }) => {
    // Configuraciones personalizadas de webpack si es necesario
    return config;
  },

  // Configuración de comp