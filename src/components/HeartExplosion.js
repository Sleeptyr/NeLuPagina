import confetti from 'canvas-confetti';

/**
 * Dispara una lluvia y explosión fluida de corazones animados,
 * optimizada para correr a 60 FPS incluso en teléfonos móviles modestos.
 */
export function triggerHeartExplosion() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  // 1. Gran explosión central inicial
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#FF5A79', '#A06CD5', '#FFA8BA', '#FFCAD4', '#D8B4FE', '#FFFFFF'],
    shapes: ['circle'],
    scalar: 1.4,
    ticks: 200
  });

  // 2. Lluvia continua desde ambos lados
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#FF5A79', '#A06CD5', '#FFA8BA', '#E8DFF5'],
      scalar: 1.2
    });

    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#FF5A79', '#A06CD5', '#FFA8BA', '#E8DFF5'],
      scalar: 1.2
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
}
