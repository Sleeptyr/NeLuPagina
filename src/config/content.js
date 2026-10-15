/**
 * Textos, copys y mensajes afectuosos centralizados
 */

export const CONTENT = {
  general: {
    siteTitle: 'Para Nerea 💜',
    tagline: 'Nuestro rincón íntimo de recuerdos, risas y planes',
    authorNotice: 'Hecho con todo mi amor por Lucas para Nerea (Porfiada)'
  },

  home: {
    heroNotice: 'Te amo',
    question: '¿Tú me amas?',
    yesButton: '¡Sí, con todo mi corazón! 🥰',
    noButton: 'No 🤔',
    loveMoreTitle: 'TE AMO MÁS',
    // Exacto según SRS sección 4.2 RF-09 y 9:
    finalLoveMessage: 'TE AMO MAS HERMOSA LINDA DE MI CORAZON TE AMO CON TODO MI SERR!!',
    continueButton: 'Ver nuestro rincón juntos ✨',
    daysTogetherText: 'Cada día a tu lado es el mejor regalo.'
  },

  plans: {
    title: 'Nuestros Planes',
    subtitle: 'Lugares que soñamos visitar, cosas por hacer y compras para los dos',
    createButton: '+ Nuevo plan',
    tabs: {
      all: 'Todos',
      pending: 'Por cumplir',
      completed: 'Cumplidos'
    },
    types: {
      lugar: { label: 'Lugar por visitar', icon: 'MapPin', color: '#8A4FFF' },
      cosa: { label: 'Cosa para hacer', icon: 'Sparkles', color: '#E07A5F' },
      compra: { label: 'Compra para los dos', icon: 'ShoppingBag', color: '#2A9D8F' }
    },
    emptyState: 'Todavía no tenemos planes en esta lista. ¿Qué se te ocurre hacer juntos, hermosa?'
  },

  reviews: {
    title: 'Nuestras Reseñas',
    subtitle: 'Los lugares donde desayunamos, merendamos o comemos rico',
    createButton: '+ Sumar una reseña',
    categories: {
      desayuno: '☕ Desayuno',
      merienda: '🧁 Merienda',
      'almuerzo-cena': '🍕 Almuerzo o Cena',
      otra: '✨ Otro lugarcito'
    },
    labels: {
      itemsOrdered: '¿Qué pedimos?',
      priceApprox: 'Precio aprox:',
      wouldReturn: '¿Volveríamos?',
      wouldReturnYes: '¡Sí, obvio que sí!',
      wouldReturnNo: 'Paso, no volvería',
      visitedAt: 'Fecha de la visita:',
      authorRating: 'Puntuación de'
    },
    emptyState: 'Aún no cargamos ninguna reseña gastronómica. ¡El próximo café o cena lo anotamos acá!'
  },

  frogs: {
    totalCount: 30,
    counterLabel: 'Ranas encontradas',
    foundAlert: '¡Encontraste una ranita!',
    // Cupón final configurable (SRS RF-31)
    coupon: {
      title: '🎟️ ¡CUPÓN DE PREMIO FINAL!',
      subtitle: '¡Felicidades mi Porfiada hermosa! Encontraste las 30 ranas escondidas.',
      prizeText: 'Este cupón es válido por: Una salida a comer donde vos elijas, todo pago, más una tarde entera de mimos, helado y besos sin límite.',
      validity: 'Válido para siempre. Canjeable en cualquier momento con Lucas.',
      signature: 'Con todo mi amor, tu novio Lucas 🐸💜'
    }
  },

  auth: {
    title: 'Nuestro Lugar Privado 🔐',
    subtitle: 'Ingresá con tu cuenta para acceder a todos nuestros recuerdos y planes.',
    emailPlaceholder: 'Tu correo (Lucas o Nerea)',
    passwordPlaceholder: 'Tu contraseña secreta',
    loginButton: 'Entrar a nuestro rincón 💜',
    logoutButton: 'Cerrar sesión',
    sessionPersistNotice: 'Tu sesión se mantiene abierta en este dispositivo para que no tengas que escribirla siempre.',
    errorInvalidCreds: 'Correo o contraseña incorrectos. Revisá que esté bien escrito.',
    unauthorizedUserNotice: 'Esta página es privada y exclusiva para Lucas y Nerea.'
  }
};
