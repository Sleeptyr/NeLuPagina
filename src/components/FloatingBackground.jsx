import React, { useMemo } from 'react';

/**
 * Romantic ambient floating particles (hearts, stars, bubbles)
 * and colorful glowing orbs that create a dreamy, enchanted 3D atmosphere.
 */
export default function FloatingBackground() {
  // Generate random stable particles
  const particles = useMemo(() => {
    const items = [];
    const symbols = ['💜', '💖', '✨', '🌸', '💫', '💕'];
    for (let i = 0; i < 22; i++) {
      items.push({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 4.5 + Math.random() * 4) % 96}%`,
        size: 14 + (i % 4) * 6,
        duration: 12 + (i % 6) * 3,
        delay: (i * 0.7) % 8,
        opacity: 0.25 + (i % 3) * 0.15
      });
    }
    return items;
  }, []);

  return (
    <div className="ambient-background-layer" aria-hidden="true">
      {/* Dynamic 3D ambient blur orbs */}
      <div className="ambient-orb orb-lila" />
      <div className="ambient-orb orb-rose" />
      <div className="ambient-orb orb-peach" />

      {/* Floating love particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-love-particle"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
