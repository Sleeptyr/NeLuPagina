import React, { useState, useEffect } from 'react';
import { Music, Disc3, X, ChevronUp, ChevronDown, Heart, Sparkles, ExternalLink } from 'lucide-react';

// Canción romántica de Lucas y Nerea
const DEFAULT_SPOTIFY_URI = 'https://open.spotify.com/embed/track/5zpZUFF7YyPG90nkR88RYd';

export default function SpotifyPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState(() => {
    // Si la guardada era la de prueba anterior, actualizamos a la canción de ellos
    const saved = localStorage.getItem('pagina_amor_spotify_track');
    if (!saved || saved.includes('0ct6r3EGTcDP8NavRVrr4l')) {
      localStorage.setItem('pagina_amor_spotify_track', DEFAULT_SPOTIFY_URI);
      return DEFAULT_SPOTIFY_URI;
    }
    return saved;
  });
  const [customInput, setCustomInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Convertir URL de Spotify común (incluso con prefijos intl-es) a Embed
  const formatEmbedUrl = (url) => {
    if (!url) return DEFAULT_SPOTIFY_URI;
    if (url.includes('/embed/')) return url;
    
    const match = url.match(/open\.spotify\.com\/(?:intl-[a-zA-Z-]+\/)?(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
    return url;
  };

  const handleSaveTrack = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const formatted = formatEmbedUrl(customInput.trim());
    setSpotifyUrl(formatted);
    localStorage.setItem('pagina_amor_spotify_track', formatted);
    setIsEditing(false);
    setCustomInput('');
  };

  return (
    <aside className="spotify-floating-widget" aria-label="Reproductor de música de la pareja">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="spotify-pill-btn"
          title="Tocar para escuchar nuestra canción 🎵"
          aria-expanded="false"
        >
          <Disc3 size={20} className="spinning-vinyl" />
          <span className="spotify-pill-text">Nuestra canción</span>
          <Heart size={14} fill="currentColor" color="currentColor" />
        </button>
      ) : (
        <div className="spotify-expanded-card">
          <div className="spotify-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Disc3 size={18} className="spinning-vinyl" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-lila-dark)' }}>
                Nuestra Música 💜
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="spotify-icon-btn"
                title="Cambiar canción de Spotify"
              >
                <Sparkles size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="spotify-icon-btn"
                title="Minimizar reproductor"
                aria-label="Cerrar reproductor"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Formulario para cambiar la canción en vivo */}
          {isEditing && (
            <form onSubmit={handleSaveTrack} style={{ padding: '0.65rem 0.85rem', background: '#F8F4FF', borderBottom: '1px solid var(--color-lila-200)' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '0.25rem' }}>
                Pegá el link de Spotify de su canción favorita:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="https://open.spotify.com/track/..."
                  style={{
                    flex: 1,
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-lila-300)',
                    background: '#FFFFFF'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.4rem 0.75rem',
                    background: 'var(--color-lila-primary)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: '600'
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          )}

          {/* Iframe oficial de Spotify */}
          <div className="spotify-iframe-container">
            <iframe
              src={spotifyUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
              style={{ borderRadius: '12px', display: 'block' }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
