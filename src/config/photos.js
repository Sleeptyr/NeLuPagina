/**
 * Configuración centralizada de las 5 fotos principales de la página.
 * Se sirven desde el bucket privado de Supabase Storage mediante URLs firmadas.
 * Se incluye fallback local para desarrollo previo a la subida al bucket.
 */

export const STORAGE_BUCKET = 'couple-photos';

export const PHOTO_SLOTS = {
  // 1. Portada / Hero de Inicio (El gran momento de celebración/pareja)
  hero: {
    id: 'photo-hero',
    storagePath: '77570f90-3019-402d-8444-d99b68a7921b.jpeg',
    localFallback: '/77570f90-3019-402d-8444-d99b68a7921b.jpeg',
    title: 'Nuestro momento de gala',
    caption: 'Siempre juntos en las mejores noches ✨',
    section: 'home'
  },

  // 2. Mensaje final tras el "Sí" (Abrazo tierno / selfie íntima)
  celebration: {
    id: 'photo-celebration',
    storagePath: 'IMG_8777.jpeg',
    localFallback: '/IMG_8777.jpeg',
    title: 'Mi lugar favorito',
    caption: 'Te amo con todo mi ser, hermosa mía 💜',
    section: 'home'
  },

  // 3. Sección Reseñas (Nerea eligiendo qué comer / en la cafetería)
  reviewsHero: {
    id: 'photo-reviews',
    storagePath: 'IMG_3381.jpeg',
    localFallback: '/IMG_3381.jpeg',
    title: 'Probando cositas ricas',
    caption: 'Cada merienda y comida con vos es una fiesta ☕🍰',
    section: 'reviews'
  },

  // 4. Sección Planes (Al aire libre, soñando planes futuros)
  plansHero: {
    id: 'photo-plans',
    storagePath: 'IMG_1175.jpeg',
    localFallback: '/IMG_1175.jpeg',
    title: 'Caminando la vida juntos',
    caption: 'Tantos lugares por conocer de tu mano 🌿',
    section: 'plans'
  },

  // 5. Rincón de recuerdos / Detalle tierno (Comiendo rico / sorpresa con moño en el auto)
  sweetMemory: {
    id: 'photo-memory',
    storagePath: 'IMG_2076.jpeg',
    localFallback: '/IMG_2076.jpeg',
    title: 'Esa sonrisa única',
    caption: 'Endulzándome los días siempre 🎀',
    section: 'general'
  }
};

// Lista plana para carruseles, polaroids o galerías
export const SITE_PHOTOS = Object.values(PHOTO_SLOTS);
