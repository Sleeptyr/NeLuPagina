import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTENT } from '../config/content';
import { PHOTO_SLOTS } from '../config/photos';
import { FROGS_CONFIG } from '../config/frogs';
import { triggerHeartExplosion } from '../components/HeartExplosion';
import HiddenFrog from '../components/HiddenFrog';
import SignedImage from '../components/SignedImage';
import { Heart, Sparkles, ArrowRight, Stars } from 'lucide-react';

export default function Home() {
  const [yesClicked, setYesClicked] = useState(false);
  const [noPosition, setNoPosition] = useState(null);
  const noBtnRef = useRef(null);

  // Filtramos las 8 ranitas asignadas a la sección de Inicio
  const homeFrogs = FROGS_CONFIG.filter((f) => f.section === 'home');

  // Lógica de escape del botón "No" (Móvil y Escritorio)
  const moveNoButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const btn = noBtnRef.current;
    const btnWidth = btn ? btn.offsetWidth : 120;
    const btnHeight = btn ? btn.offsetHeight : 50;

    const padding = 20;
    const minTop = 80; // Evita tapar la barra de navegación superior
    const maxTop = window.innerHeight - btnHeight - padding;
    const minLeft = padding;
    const maxLeft = window.innerWidth - btnWidth - padding;

    // Nueva coordenada aleatoria asegurando márgenes visibles
    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;

    setNoPosition({
      top: `${Math.max(minTop, Math.min(randomTop, maxTop))}px`,
      left: `${Math.max(minLeft, Math.min(randomLeft, maxLeft))}px`
    });
  };

  const handleYes = () => {
    setYesClicked(true);
    triggerHeartExplosion();
  };

  return (
    <div className="home-hero">
      {/* Ranas escondidas de la sección Inicio */}
      {homeFrogs.map((frog) => (
        <HiddenFrog key={frog.id} frog={frog} />
      ))}

      {!yesClicked ? (
        <div className="romantic-banner">
          <div className="heart-float-badge">
            <Heart size={28} fill="currentColor" />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '2rem',
            color: 'var(--color-lila-primary)',
            marginBottom: '0.25rem'
          }}>
            {CONTENT.home.heroNotice}
          </h2>

          <h1 className="hero-title">
            {CONTENT.home.question}
          </h1>

          <p className="hero-subtitle">
            Tengo una certeza inmensa, pero me encanta preguntártelo siempre...
          </p>

          {/* Foto de portada elegante antes de responder */}
          <div style={{ margin: '1rem 0 2rem 0' }}>
            <div className="polaroid-card">
              <div className="polaroid-img-wrapper">
                <SignedImage
                  storagePath={PHOTO_SLOTS.hero.storagePath}
                  fallbackUrl={PHOTO_SLOTS.hero.localFallback}
                  alt={PHOTO_SLOTS.hero.title}
                  className="polaroid-img"
                />
              </div>
              <div className="polaroid-caption">
                {PHOTO_SLOTS.hero.title}
              </div>
            </div>
          </div>

          {/* Botones Sí y No esquivo */}
          <div className="hero-buttons-wrapper">
            <button
              onClick={handleYes}
              className="btn-yes"
              id="btn-yes-love"
            >
              <Heart size={20} fill="#FFFFFF" />
              <span>{CONTENT.home.yesButton}</span>
            </button>

            <button
              ref={noBtnRef}
              id="btn-no-love"
              className={`btn-no ${noPosition ? 'running' : ''}`}
              style={noPosition ? { top: noPosition.top, left: noPosition.left } : {}}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onPointerDown={moveNoButton}
              onClick={moveNoButton}
            >
              {CONTENT.home.noButton}
            </button>
          </div>
        </div>
      ) : (
        /* Estado revelado al presionar "Sí" */
        <div className="love-revealed">
          <div style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Stars size={32} color="var(--color-lila-primary)" />
            <Heart size={36} color="var(--color-heart)" fill="var(--color-heart)" />
            <Stars size={32} color="var(--color-lila-primary)" />
          </div>

          <h1 className="giant-love-text">
            {CONTENT.home.loveMoreTitle}
          </h1>

          {/* Mensaje exacto requerido por el SRS */}
          <div className="final-love-message-box">
            <p className="final-love-message-text">
              {CONTENT.home.finalLoveMessage}
            </p>
          </div>

          {/* Cuadrícula de fotos tiernas de celebración */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
            margin: '2rem 0'
          }}>
            <div className="polaroid-card">
              <div className="polaroid-img-wrapper">
                <SignedImage
                  storagePath={PHOTO_SLOTS.celebration.storagePath}
                  fallbackUrl={PHOTO_SLOTS.celebration.localFallback}
                  alt={PHOTO_SLOTS.celebration.title}
                  className="polaroid-img"
                />
              </div>
              <div className="polaroid-caption">
                {PHOTO_SLOTS.celebration.caption}
              </div>
            </div>

            <div className="polaroid-card tilt-right">
              <div className="polaroid-img-wrapper">
                <SignedImage
                  storagePath={PHOTO_SLOTS.sweetMemory.storagePath}
                  fallbackUrl={PHOTO_SLOTS.sweetMemory.localFallback}
                  alt={PHOTO_SLOTS.sweetMemory.title}
                  className="polaroid-img"
                />
              </div>
              <div className="polaroid-caption">
                {PHOTO_SLOTS.sweetMemory.caption}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/planes" className="continue-site-btn">
              <span>{CONTENT.home.continueButton}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
