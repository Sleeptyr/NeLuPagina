import React from 'react';
import { useFrogs } from '../context/FrogsContext';
import { CONTENT } from '../config/content';

export default function CouponModal() {
  const { showCouponModal, setShowCouponModal, foundCount, totalFrogs } = useFrogs();

  if (!showCouponModal) return null;

  const coupon = CONTENT.frogs.coupon;

  return (
    <div className="modal-backdrop" onClick={() => setShowCouponModal(false)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>👑🐸💖</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            color: 'var(--color-lila-dark)',
            margin: '0.5rem 0'
          }}>
            {coupon.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {coupon.subtitle} ({foundCount}/{totalFrogs} ranitas)
          </p>
        </div>

        {/* Cupón estilo ticket */}
        <div className="coupon-ticket">
          <div style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-lila-primary)',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            Cupón Oficial de Amor Exclusivo
          </div>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: '600',
            color: 'var(--text-main)',
            lineHeight: 1.4,
            marginBottom: '1rem'
          }}>
            {coupon.prizeText}
          </p>

          <div style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '1.5rem',
            color: 'var(--color-lila-dark)',
            marginTop: '0.5rem'
          }}>
            {coupon.signature}
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginTop: '0.85rem',
            borderTop: '1px solid var(--color-crema-border)',
            paddingTop: '0.5rem'
          }}>
            {coupon.validity}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            className="continue-site-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setShowCouponModal(false)}
          >
            ¡Guardar y disfrutar mi regalo! 💜
          </button>
        </div>
      </div>
    </div>
  );
}
