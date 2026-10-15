import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTENT } from '../config/content';
import { PHOTO_SLOTS } from '../config/photos';
import { FROGS_CONFIG } from '../config/frogs';
import { triggerHeartExplosion } from '../components/HeartExplosion';
import HiddenFrog from '../components/HiddenFrog';
import SignedImage from '../components/SignedImage';
import { Heart, Sparkles, ArrowRight, Stars } from 'lucide-react';

import TiltCard from '../components/TiltCard';

const NO_PHRASES = [
  'No',
  '¿Segura? 👀',
  '¡Ni lo sueñes, Porfiada! 😜',
  '¡Casi me atrapás! 💨',
  '¡El No está de adorno! ✨',
  '¡Atrapame si podés! 🐸',
  '¡Te amo demasiado para un No! 💜',
  '¡No hay escapatoria, hermosa! 🥰'
];

export default function Home() {
  const [yesClicked, setYesClicked] = useState(false);
  const [noPosition, setNoPosition] = useState(null);
  const [noPhraseIndex, setNoPhraseIndex] = useState(0);
  const noBtnRef = useRef(null);

  // Filtramos las 8 ranitas asignadas a la sección de Inicio
  const homeFrogs = FROGS_CONFIG.filter((f) => f.section === 'home');

  // Lógica de escape del botón "No" (Móvil y Escritorio) con frases juguetonas
  const moveNoButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (navigator.vibrate) {
      try { navigator.vibrate(40); } catch (err) {}
    }

    const btn = noBtnRef.current;
    const btnWidth = btn ? btn.offsetWidth : 140;
    const btnHeight = btn ? btn.offsetHeight : 50;

    const padding = 20;
    const minTop = 80;
    const maxTop = window.innerHeight - btnHeight - padding;
    const minLeft = padding;
    const maxLeft = window.innerWidth - btnWidth - padding;

    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
    const randomRotate = (Math.random() * 16 - 8).toFixed(1);

    setNoPhraseIndex((prev) => (prev + 1) % NO_PHRASES.length);
    setNoPosition({
      top: `${Math.max(minTop, Math.min(randomTop, maxTop))}px`,
      left: `${Math.max(minLeft, Math.min(randomLeft, maxLeft))}px`,
      transform: `rotate(${randomRotate}deg)`
    });
  };

  const handleYes = () => {
    if (navigator.vibrate) {
      try { navigator.vibrate([100, 60, 200]); } catch (err) {}
    }
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
        <TiltCard maxTilt={6} className="romantic-banner">
          <div className="heart-float-badge">
            <Heart size={30} fill="currentColor" />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-handwriting)',
            fontSize: '2.2rem',
            color: 'var(--color-lila-primary)',
            marginBottom: '0.25rem',
            textShadow: '0 2px 10px rgba(162, 119, 255, 0.2)'
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
          <div style={{ margin: '1rem 0 2rem 0', display: 'flex', justifyContent: 'center' }}>
            <TiltCard maxTilt={10} scale={1.03}>
              <div className="polaroid-card">
                <div className="washi-tape-sticker" />
                <div className="polaroid-img-wrapper">
                  <SignedImage
                    storagePath={PHOTO_SLOTS.hero.storagePath}
                    fallbackUrl={PHOTO_SLOTS.hero.localFallback}
                    alt={PHOTO_SLOTS.hero.title}
                    className="polaroid-img"
                  />
                </div>
                <div className="polaroid-caption">
                  {PHOTO_SLOTS.hero.title} ✨
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Botones Sí y No esquivo */}
          <div className="hero-buttons-wrapper">
            <button
              onClick={handleYes}
              className="btn-yes"
              id="btn-yes-love"
            >
              <Heart size={22} fill="#FFFFFF" />
              <span>{CONTENT.home.yesButton}</span>
            </button>

            <button
              ref={noBtnRef}
              id="btn-no-love"
              className={`btn-no ${noPosition ? 'running' : ''}`}
              style={noPosition ? {
                top: noPosition.top,
                left: noPosition.left,
                transform: noPosition.transform
              } : {}}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onPointerDown={moveNoButton}
              onClick={moveNoButton}
            >
              {NO_PHRASES[noPhraseIndex]}
            </button>
          </div>
        </TiltCard>
      ) : (
        /* Estado revelado al presionar "Sí" */
        <div className="love-revealed">
          <div style={{ display: 'inline-flex', gap: '0.65rem', marginBottom: '1.25rem', animation: 'pulseGlow 2s infinite ease-in-out' }}>
            <Stars size={34} color="var(--color-lila-primary)" />
            <Heart size={40} color="var(--color-heart)" fill="var(--color-heart)" />
            <Stars size={34} color="var(--color-lila-primary)" />
          </div>

          <h1 className="giant-love-text">
            {CONTENT.home.loveMoreTitle}
          </h1>

          {/* Mensaje exacto requerido por el SRS */}
          <TiltCard maxTilt={8} className="final-love-message-box">
            <p className="final-love-message-text">
              {CONTENT.home.finalLoveMessage}
            </p>
          </TiltCard>

          {/* Cuadrícula de fotos tiernas de celebración */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            margin: '2.5rem 0'
          }}>
            <TiltCard maxTilt={12}>
              <div className="polaroid-card">
                <div className="washi-tape-sticker" />
                <div className="polaroid-img-wrapper">
                  <SignedImage
                    storagePath={PHOTO_SLOTS.celebration.storagePath}
                    fallbackUrl={PHOTO_SLOTS.celebration.localFallback}
                    alt={PHOTO_SLOTS.celebration.title}
                    className="polaroid-img"
                  />
                </div>
                <div className="polaroid-caption">
                  {PHOTO_SLOTS.celebration.caption} 💜
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={12}>
              <div className="polaroid-card tilt-right">
                <div className="washi-tape-sticker rose" />
                <div className="polaroid-img-wrapper">
                  <SignedImage
                    storagePath={PHOTO_SLOTS.sweetMemory.storagePath}
                    fallbackUrl={PHOTO_SLOTS.sweetMemory.localFallback}
                    alt={PHOTO_SLOTS.sweetMemory.title}
                    className="polaroid-img"
                  />
                </div>
                <div className="polaroid-caption">
                  {PHOTO_SLOTS.sweetMemory.caption} 💕
                </div>
              </div>
            </TiltCard>
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
