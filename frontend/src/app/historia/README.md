# Página de Historia - Tacos Bora Bora

Este directorio contiene los componentes y la lógica para la página de historia de Tacos Bora Bora. La página está dividida en tres secciones principales que cuentan la historia del negocio de manera cronológica.

## Estructura de Archivos

- `page.tsx` - Página principal que contiene el layout y la estructura general
- `components/historia/` - Componentes reutilizables para cada sección de la historia
  - `DeBrochasAOllas.tsx` - Primera sección: Los inicios del negocio
  - `AContrarreloj.tsx` - Segunda sección: Los desafíos superados
  - `SaborQueNoSeRinde.tsx` - Tercera sección: El éxito actual y la visión a futuro

## Imágenes

Las imágenes utilizadas en esta sección deben colocarse en el directorio `public/images/historia/` con los siguientes nombres:

- `hero-bg.jpg` - Imagen de fondo para el encabezado
- `inicio.jpg` - Imagen para la sección de inicios
- `av-carso.jpg` - Imagen para la sección de venta en la calle
- `local-actual.jpg` - Imagen del local actual

## Estilos

Los estilos utilizan la paleta de colores de la marca Bora Bora y las fuentes personalizadas:

- **Colores principales**:
  - `#FCB235` (Amarillo Bora Bora)
  - `#462F13` (Marrón oscuro)
  - `#EF432E` (Rojo vibrante)
  - `#000000` (Negro)
  - `#FFFFFF` (Blanco)

- **Fuentes**:
  - Bebas Neue (títulos)
  - Yeseva One (subtítulos)
  - Unbounded (texto)

## Animaciones

Se utiliza Framer Motion para las animaciones de desplazamiento y transiciones suaves entre secciones.

## Consideraciones de Rendimiento

- Las imágenes deben estar optimizadas para web
- Los componentes se cargan dinámicamente para mejorar el rendimiento
- Se utiliza lazy loading para las imágenes fuera del viewport
