# Especificaciones para Fotos del Equipo

## 📸 Requisitos Técnicos
- **Formato:** WebP (preferido) o JPG de alta calidad
- **Tamaño:** 800x800 píxeles (relación 1:1)
- **Tamaño de archivo:** Máximo 200KB por imagen
- **Espacio de color:** sRGB
- **Resolución:** 72-96 PPI

## 📌 Recomendaciones
1. **Encuadre:** Rostro y hombros centrados
2. **Fondo:** Liso o con poca textura
3. **Iluminación:** Clara y uniforme
4. **Expresión:** Natural y amigable
5. **Vestimenta:** Coherente con la identidad de Tacos Bora Bora

## 📂 Nombres de Archivo
Usar formato `nombre-apellido.extension` en minúsculas:
- Ejemplo: `abraham-sanchez.webp`
- Para fotos de equipo: `equipo-completo.webp`

## 🖼️ Ejemplo de Uso en Código
```tsx
<Image 
  src="/images/team/abraham-sanchez.webp"
  alt="Abraham Sánchez - Taquero"
  width={200}
  height={200}
  className="rounded-full object-cover w-40 h-40 md:w-48 md:h-48"
/>
```

## 🛠 Herramientas Útiles
- [Squoosh](https://squoosh.app/) - Para optimización de imágenes
- [Remove.bg](https://www.remove.bg/) - Para eliminar fondos
- [Canva](https://www.canva.com/) - Para edición básica
