/**
 * Configuración de las 30 ranas escondidas a lo largo de todas las secciones.
 * Todas usan posiciones relativas seguras (porcentajes con margen interior)
 * para asegurar que NUNCA queden fuera de la pantalla en celulares ni en escritorios.
 */

export const TOTAL_FROGS = 30;

export const FROGS_CONFIG = [
  // ==========================================
  // SECCIÓN 1: INICIO (8 ranas)
  // ==========================================
  {
    id: 'frog-home-1',
    section: 'home',
    clue: 'Escondida cerca del título que dice cuánto te amo',
    foundMessage: '¡Croac! Yo también te amo un montón 🐸💜',
    style: { top: '8%', left: '85%' },
    size: 26
  },
  {
    id: 'frog-home-2',
    section: 'home',
    clue: 'Espiando el botón travieso',
    foundMessage: '¡Jeje! Te vi intentando atrapar el botón No 😜',
    style: { top: '48%', left: '8%' },
    size: 24
  },
  {
    id: 'frog-home-3',
    section: 'home',
    clue: 'Acurrucada en el marco de nuestra foto de gala',
    foundMessage: '¡Qué facha teníamos en esa fiesta! 🥂',
    style: { top: '82%', left: '12%' },
    size: 28
  },
  {
    id: 'frog-home-4',
    section: 'home',
    clue: 'Asomándose entre los corazones',
    foundMessage: '¡Latidos a mil por vos! 💓',
    style: { top: '22%', left: '14%' },
    size: 22
  },
  {
    id: 'frog-home-5',
    section: 'home',
    clue: 'Abajo de todo, vigilando el pie de página',
    foundMessage: '¡Pispeando desde abajo! Hermosa mía 🌸',
    style: { top: '94%', left: '86%' },
    size: 25
  },
  {
    id: 'frog-home-6',
    section: 'home',
    clue: 'Camuflada junto a la frase cariñosa',
    foundMessage: '¡Sos la más linda de todas, Porfiada! ✨',
    style: { top: '65%', left: '90%' },
    size: 23
  },
  {
    id: 'frog-home-7',
    section: 'home',
    clue: 'Detrás del destello del amor',
    foundMessage: '¡Te amo más que a nada en el mundo! 🌟',
    style: { top: '35%', left: '92%' },
    size: 24
  },
  {
    id: 'frog-home-8',
    section: 'home',
    clue: 'Escondida en la esquina superior izquierda del cartel',
    foundMessage: '¡Pillada! Te ganaste un beso de Lucas 💋',
    style: { top: '15%', left: '7%' },
    size: 26
  },

  // ==========================================
  // SECCIÓN 2: NUESTROS PLANES (11 ranas)
  // ==========================================
  {
    id: 'frog-plans-1',
    section: 'plans',
    clue: 'Descansando cerca de los filtros de planes',
    foundMessage: '¡Organizando nuestras próximas salidas juntos! 🗺️',
    style: { top: '12%', left: '82%' },
    size: 26
  },
  {
    id: 'frog-plans-2',
    section: 'plans',
    clue: 'Subida a la tarjeta de lugares por visitar',
    foundMessage: '¡Vamos a viajar y conocer el mundo entero! ✈️',
    style: { top: '28%', left: '88%' },
    size: 24
  },
  {
    id: 'frog-plans-3',
    section: 'plans',
    clue: 'Buscando cosas para comprar juntos',
    foundMessage: '¡Anotá esa compra que queremos los dos! 🛍️',
    style: { top: '42%', left: '6%' },
    size: 25
  },
  {
    id: 'frog-plans-4',
    section: 'plans',
    clue: 'Al lado del botón de agregar un nuevo plan',
    foundMessage: '¡Tengo una idea nueva para hacer juntos! 💡',
    style: { top: '18%', left: '10%' },
    size: 27
  },
  {
    id: 'frog-plans-5',
    section: 'plans',
    clue: 'Festejando los planes cumplidos',
    foundMessage: '¡Cada sueño cumplido a tu lado es inolvidable! 🥂',
    style: { top: '55%', left: '86%' },
    size: 25
  },
  {
    id: 'frog-plans-6',
    section: 'plans',
    clue: 'Entre las notas secretas de un deseo',
    foundMessage: '¡Leí tus notas y me enamoré más! 📝💜',
    style: { top: '68%', left: '10%' },
    size: 22
  },
  {
    id: 'frog-plans-7',
    section: 'plans',
    clue: 'En la foto del parque al atardecer',
    foundMessage: '¡Qué linda tarde pasamos paseando al aire libre! 🌳',
    style: { top: '35%', left: '75%' },
    size: 26
  },
  {
    id: 'frog-plans-8',
    section: 'plans',
    clue: 'Camuflada con el color lila de la Porfiada',
    foundMessage: '¡El lila es tu color definitivo, princesa! 👑',
    style: { top: '78%', left: '85%' },
    size: 24
  },
  {
    id: 'frog-plans-9',
    section: 'plans',
    clue: 'Cerca del distintivo negro de Lucas',
    foundMessage: '¡Lucas aprueba este plan al 100%! 🖤',
    style: { top: '85%', left: '8%' },
    size: 25
  },
  {
    id: 'frog-plans-10',
    section: 'plans',
    clue: 'Asomándose entre las opciones de orden',
    foundMessage: '¡Croac! ¡Vamos a cumplir todos y cada uno de estos planes! 🚀',
    style: { top: '50%', left: '92%' },
    size: 23
  },
  {
    id: 'frog-plans-11',
    section: 'plans',
    clue: 'En el fondo del listado, mirando hacia arriba',
    foundMessage: '¡Ya casi completás la colección de ranitas! 🏆',
    style: { top: '93%', left: '48%' },
    size: 28
  },

  // ==========================================
  // SECCIÓN 3: RESEÑAS GASTRONÓMICAS (11 ranas)
  // ==========================================
  {
    id: 'frog-reviews-1',
    section: 'reviews',
    clue: 'Oliendo el café recién tostado de Edison',
    foundMessage: '¡Mmm, qué rico café para desayunar con vos! ☕',
    style: { top: '10%', left: '82%' },
    size: 26
  },
  {
    id: 'frog-reviews-2',
    section: 'reviews',
    clue: 'Espiando la carta en la foto de la confitería',
    foundMessage: '¡Esa carita tierna leyendo el menú me derrite! 😍',
    style: { top: '25%', left: '10%' },
    size: 25
  },
  {
    id: 'frog-reviews-3',
    section: 'reviews',
    clue: 'Metida en la categoría meriendas',
    foundMessage: '¡Una merienda con tostadas y licuado para dos! 🥐',
    style: { top: '35%', left: '88%' },
    size: 23
  },
  {
    id: 'frog-reviews-4',
    section: 'reviews',
    clue: 'Contando las 5 estrellas de puntuación',
    foundMessage: '¡Vos te merecés 5 estrellas todos los días! ⭐⭐⭐⭐⭐',
    style: { top: '45%', left: '6%' },
    size: 26
  },
  {
    id: 'frog-reviews-5',
    section: 'reviews',
    clue: 'Comprobando si volveríamos al lugar',
    foundMessage: '¡Si es con vos, vuelvo a cualquier lado mil veces! 💖',
    style: { top: '58%', left: '84%' },
    size: 24
  },
  {
    id: 'frog-reviews-6',
    section: 'reviews',
    clue: 'Escondida cerca del precio aproximado',
    foundMessage: '¡Valió cada centavo esa comidita rica! 🍕',
    style: { top: '65%', left: '12%' },
    size: 25
  },
  {
    id: 'frog-reviews-7',
    section: 'reviews',
    clue: 'Comparando la opinión de Lucas y de Nerea',
    foundMessage: '¡A veces opinamos distinto pero nos amamos igual! 💑',
    style: { top: '75%', left: '88%' },
    size: 24
  },
  {
    id: 'frog-reviews-8',
    section: 'reviews',
    clue: 'Cerca de los manteles a cuadros',
    foundMessage: '¡Cenas que quedan grabadas en el corazón! 🍝',
    style: { top: '82%', left: '15%' },
    size: 26
  },
  {
    id: 'frog-reviews-9',
    section: 'reviews',
    clue: 'Asomándose entre los filtros de comida',
    foundMessage: '¿Hamburguesa, pizza o sushi la próxima? 🍔',
    style: { top: '20%', left: '90%' },
    size: 22
  },
  {
    id: 'frog-reviews-10',
    section: 'reviews',
    clue: 'Acompañando el postre con moño',
    foundMessage: '¡Sos mi postre favorito de la vida entera! 🍰',
    style: { top: '88%', left: '78%' },
    size: 25
  },
  {
    id: 'frog-reviews-11',
    section: 'reviews',
    clue: 'La última ranita gastronómica, lista para el premio',
    foundMessage: '¡INCREÍBLE! ¡Descubriste casi todas las ranitas! 🎉',
    style: { top: '95%', left: '20%' },
    size: 28
  }
];
