/**
 * Paleta de colores y tokens de diseño
 * Lila principal, crema secundario y distinción para Lucas y Nerea.
 */

export const THEME = {
  colors: {
    // Colores base
    lilaPrimary: '#A06CD5',
    lilaLight: '#E8DFF5',
    lilaSubtle: '#F4EEFA',
    lilaDark: '#6247AA',

    cremaBg: '#FAF7F2',
    cremaCard: '#FFFDF9',
    cremaBorder: '#EFE7DA',

    // Textos con excelente contraste y legibilidad
    textPrimary: '#2B2633',
    textSecondary: '#6B6275',
    textMuted: '#958C9F',

    // Identidad de los dos usuarios (SRS sección 1.4 y 4.7)
    nerea: {
      name: 'Nerea',
      nickname: 'Porfiada',
      badgeColor: '#8A4FFF',
      badgeBg: '#F3ECFD',
      borderColor: '#D4BDFC'
    },
    lucas: {
      name: 'Lucas',
      badgeColor: '#1A181B',
      badgeBg: '#EDEAE8',
      borderColor: '#595552'
    },

    // Acentos suaves
    mintFrog: '#52B788',
    mintFrogBg: '#E8F5E9',
    heartRed: '#FF5A79',
    heartRose: '#FFA8BA',
    accentGold: '#E9C46A'
  },

  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    handwriting: "'Caveat', cursive"
  },

  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    bouncy: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};
