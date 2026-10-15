import React from 'react';
import { useFrogs } from '../context/FrogsContext';

export default function FrogCelebrationModal() {
  const { lastFoundFrog, setLastFoundFrog, foundCount, totalFrogs, setShowCouponModal } = useFrogs();

  if (!lastFoundFrog) return null;

  const isAllFound = foundCount >= totalFrogs;

  return (
    <div className="modal-backdrop" onClick={() => setLastFoundFrog(null)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem', animation: 'subtleBounce 1s infinite' }}>
          🐸✨
        </div>
        
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--color-lila-dark)',
          marginBottom: '0.5rem'
        }}>
          ¡Encontraste una ranita!
        </h3>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-body)',
          marginBottom: '1.25rem',
          fontWeight: '500'
        }}>
          "{lastFoundFrog.foundMessage}"
        </p>

        <div style={{
          display: 'inline-block',
          background: 'var(--color-mint-frog-bg)',
          color: '#2D6A4F',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: '600',
          fontSize: '0.95rem',
          marginBottom: '1.5rem'
        }}>
          Progreso: {foundCount} de {totalFrogs} ranas encontradas
        </div>

        <div>
          <button
            className="continue-site-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              setLastFoundFrog(null);
              if (isAllFound) {
                setShowCouponModal(true);
              }
            }}
          >
            {isAllFound ? '¡Ver mi premio final! 🏆' : '¡Seguir buscando! 💜'}
          </button>
        </div>
      </div>
    </div>
  );
}
