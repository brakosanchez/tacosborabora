/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración de tiempo de espera para generación estática
  staticPageGenerationTimeout: 180, // 3 minutos en segundos
  
  // Configuración experimental
  experimental: {
    isrMemoryCacheSize: 0,
    serverActions: true, // Habilita Server Actions
    optimizeCss: true,
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
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
  
  // Configuración de compresión
  compress: true,
  
  // Deshabilitar mapas de fuente en producción
  productionBrowserSourceMaps: false,
  
  // Configuración de cabeceras de seguridad
  poweredByHeader: false,
  
  // Configuración de caché
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Configuración de compilación
  distDir: '.next',
  generateBuildId: async () => {
    return process.env.GIT_COMMIT_SHA || 'build-' + Date.now();
  },
  
  // Configuración de imágenes
  images: {
    domains: [
      'localhost',
      'tacosborabora.com',
      'www.tacosborabora.com',
      'tacos-bora-bora.vercel.app'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 semana
  },
  
  // Configuración de seguridad de cabeceras
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
  
  // Configuración de reescrituras de API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://tacosborabora-backend.vercel.app'}/:path*`,
      },
    ];
  },
  
  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Manejo de archivos SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Configuración de internacionalización
  i18n: {
    locales: ['es-MX'],
    defaultLocale: 'es-MX',
  },
  
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Configuración de caché para la compilación
  cache: {
    webpack: {
      enabled: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    },
  }
};