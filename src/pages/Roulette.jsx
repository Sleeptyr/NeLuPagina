import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { triggerHeartExplosion } from '../components/HeartExplosion';
import TiltCard from '../components/TiltCard';
import {
  Dices,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  Heart,
  PartyPopper,
  Filter,
  CheckCircle2,
  Circle,
  HelpCircle
} from 'lucide-react';

const DEFAULT_IDEAS = [
  { id: '1', text: 'Cena romántica a la luz de las velas 🕯️', category: 'Romántico', author: 'Ambos', active: true },
  { id: '2', text: 'Noche de pelis, pochoclos y mimos 🍿', category: 'En Casita', author: 'Nerea', active: true },
  { id: '3', text: 'Ir por helado o merienda dulce 🍨', category: 'Comida', author: 'Lucas', active: true },
  { id: '4', text: 'Cocinar pastas caseras juntos 🍝', category: 'Comida', author: 'Ambos', active: true },
  { id: '5', text: 'Paseo nocturno bajo las estrellas ✨', category: 'Paseos', author: 'Lucas', active: true },
  { id: '6', text: 'Día de spa y masajes en casa 💆', category: 'En Casita', author: 'Nerea', active: true },
  { id: '7', text: 'Plan sorpresa que elige Lucas 🖤', category: 'Sorpresa', author: 'Lucas', active: true },
  { id: '8', text: 'Plan sorpresa que elige Nerea 💜', category: 'Sorpresa', author: 'Nerea', active: true },
  { id: '9', text: 'Picnic al aire libre o plaza con mates 🧺', category: 'Paseos', author: 'Ambos', active: true },
  { id: '10', text: 'Noche de juegos de mesa y pizza 🍕', category: 'En Casita', author: 'Ambos', active: true }
];

const CATEGORIES = ['Todos', 'Romántico', 'Comida', 'En Casita', 'Paseos', 'Sorpresa'];

const SECTOR_COLORS = [
  '#FF6584',
  '#A277FF',
  '#FF85A1',
  '#7B2CBF',
  '#FF9E00',
  '#9B5DE5',
  '#E056FD',
  '#C084FC',
  '#FF758C',
  '#68D391',
  '#F6AD55',
  '#4FD1C5'
];

export default function Roulette() {
  const { profile, isNerea } = useAuth();

  // Ideas almacenadas
  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem('pagina_amor_roulette_ideas_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_IDEAS;
      }
    }
    return DEFAULT_IDEAS;
  });

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('pagina_amor_roulette_ideas_v2', JSON.stringify(ideas));
  }, [ideas]);

  // Filtro de categoría en la lista
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modal / formulario para nueva idea
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('Romántico');
  const [newAuthor, setNewAuthor] = useState(isNerea ? 'Nerea' : 'Lucas');

  // Estado para editar idea existente
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('Romántico');

  // Estado de la ruleta
  const [spinning, setSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const canvasRef = useRef(null);

  // Ideas activas para girar en la ruleta
  const activeIdeas = ideas.filter((idea) => idea.active);

  // Sonido físico de "tick" usando Web Audio API nativo
  const playTickSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {}
  }, []);

  // Dibujar la ruleta en el Canvas con soporte Retina / Alta Densidad
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const displaySize = 360;

    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    ctx.scale(dpr, dpr);

    const centerX = displaySize / 2;
    const centerY = displaySize / 2;
    const radius = displaySize / 2 - 12;

    ctx.clearRect(0, 0, displaySize, displaySize);

    if (activeIdeas.length === 0) {
      // Estado sin ideas activas
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#F3E8FF';
      ctx.fill();
      ctx.strokeStyle = '#D8B4FE';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#6B34A8';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('¡Activá al menos 2 ideas!', centerX, centerY);
      return;
    }

    const numSlices = activeIdeas.length;
    const arcSize = (2 * Math.PI) / numSlices;

    // Dibujar sectores
    activeIdeas.forEach((idea, index) => {
      const angle = index * arcSize;
      ctx.beginPath();
      ctx.fillStyle = SECTOR_COLORS[index % SECTOR_COLORS.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Borde del sector
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Texto de la idea
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = numSlices > 8 ? 'bold 11px Outfit, sans-serif' : 'bold 13px Outfit, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 4;

      // Truncar para que quede prolijo en pantalla
      const maxChars = numSlices > 10 ? 16 : 22;
      const cleanText = idea.text.length > maxChars ? `${idea.text.slice(0, maxChars - 2)}...` : idea.text;
      ctx.fillText(cleanText, radius - 18, 4);
      ctx.restore();
    });

    // Borde exterior decorativo con brillos dorados/lila
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Centro estilo joya / botón central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(107, 52, 168, 0.25)';
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#9B5DE5';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💜', centerX, centerY);
  }, [activeIdeas]);

  // Girar la ruleta
  const handleSpin = () => {
    if (spinning || activeIdeas.length < 2) return;

    if (navigator.vibrate) {
      try { navigator.vibrate([40, 30, 40]); } catch (e) {}
    }

    setSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    // Calcular giros aleatorios (entre 5 y 8 vueltas completas más desfase)
    const extraRounds = (Math.floor(Math.random() * 4) + 6) * 360;
    const randomExtraDegrees = Math.floor(Math.random() * 360);
    const targetRotation = rotationDegree + extraRounds + randomExtraDegrees;

    setRotationDegree(targetRotation);

    // Reproducir ticks rítmicos simulando desaceleración física
    let tickCount = 0;
    const maxTicks = 24;
    const runTicks = () => {
      if (tickCount >= maxTicks) return;
      playTickSound();
      tickCount++;
      const nextDelay = 70 + Math.pow(tickCount, 1.8) * 8;
      if (nextDelay < 4200) {
        setTimeout(runTicks, nextDelay);
      }
    };
    setTimeout(runTicks, 100);

    // Al finalizar el giro (4.5 segundos)
    setTimeout(() => {
      setSpinning(false);

      // El puntero está fijo en la parte superior (270 grados en canvas estándar)
      const degreesMod = targetRotation % 360;
      const arcDegrees = 360 / activeIdeas.length;
      const normalizedAngle = (360 - (degreesMod % 360) + 270) % 360;
      const winnerIndex = Math.floor(normalizedAngle / arcDegrees) % activeIdeas.length;

      const chosenWinner = activeIdeas[winnerIndex];
      setWinner(chosenWinner);
      setShowWinnerModal(true);
      triggerHeartExplosion();

      if (navigator.vibrate) {
        try { navigator.vibrate([100, 60, 200, 60, 300]); } catch (e) {}
      }
    }, 4500);
  };

  // Agregar nueva idea
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newIdea = {
      id: `idea-${Date.now()}`,
      text: newText.trim(),
      category: newCategory,
      author: newAuthor,
      active: true
    };

    setIdeas((prev) => [newIdea, ...prev]);
    setNewText('');
    setIsAddModalOpen(false);
  };

  // Iniciar edición de una idea
  const handleStartEdit = (idea) => {
    setEditingId(idea.id);
    setEditText(idea.text);
    setEditCategory(idea.category);
  };

  // Guardar edición
  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, text: editText.trim(), category: editCategory } : idea
      )
    );
    setEditingId(null);
  };

  // Alternar activo / inactivo
  const handleToggleActive = (id) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, active: !idea.active } : idea
      )
    );
  };

  // Eliminar idea
  const handleDelete = (id) => {
    if (ideas.length <= 2) {
      alert('La ruleta necesita tener al menos 2 ideas cargadas.');
      return;
    }
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  // Restablecer ideas por defecto
  const handleResetDefaults = () => {
    if (window.confirm('¿Querés restablecer las ideas originales de la ruleta?')) {
      setIdeas(DEFAULT_IDEAS);
      setWinner(null);
      setShowWinnerModal(false);
    }
  };

  // Activar o pausar todas
  const handleToggleAll = (activeState) => {
    setIdeas((prev) => prev.map((idea) => ({ ...idea, active: activeState })));
  };

  // Filtrado para la lista
  const displayedIdeas = ideas.filter((idea) => {
    if (selectedCategory === 'Todos') return true;
    return idea.category === selectedCategory;
  });

  return (
    <div className="roulette-page">
      {/* Encabezado */}
      <div className="section-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Dices size={28} color="var(--color-lila-primary)" />
          <h1 className="section-title" style={{ margin: 0 }}>Ruleta de Citas</h1>
          <Sparkles size={24} color="var(--color-heart)" />
        </div>
        <p className="section-subtitle">
          ¿No sabemos qué hacer hoy? ¡Giramos la ruleta y que el destino decida nuestro plan!
        </p>
      </div>

      <div className="roulette-layout">
        {/* LADO IZQUIERDO: La Ruleta y Botón Girar */}
        <div className="roulette-wheel-column">
          <TiltCard maxTilt={4} className="roulette-card">
            <div className="wheel-wrapper">
              {/* Puntero indicador superior con sombra 3D */}
              <div className="wheel-pointer">
                <div className="pointer-arrow" />
              </div>

              {/* Contenedor animado con la física de desaceleración */}
              <div
                className="wheel-canvas-container"
                style={{
                  transform: `rotate(${rotationDegree}deg)`,
                  transition: spinning ? 'transform 4.5s cubic-bezier(0.12, 0.96, 0.32, 1)' : 'none'
                }}
              >
                <canvas ref={canvasRef} className="wheel-canvas" />
              </div>
            </div>

            {/* Contador de activas */}
            <div style={{ textAlign: 'center', margin: '0.85rem 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {activeIdeas.length >= 2 ? (
                <span>Girando entre <strong>{activeIdeas.length}</strong> planes activos</span>
              ) : (
                <span style={{ color: '#E53E3E', fontWeight: 600 }}>⚠️ Activá al menos 2 planes para poder girar</span>
              )}
            </div>

            {/* Botón Principal de Giro */}
            <button
              onClick={handleSpin}
              disabled={spinning || activeIdeas.length < 2}
              className={`spin-action-btn ${spinning ? 'spinning' : ''}`}
            >
              <Play size={20} fill="#FFFFFF" />
              <span>{spinning ? 'Girando con amor...' : '¡GIRAR RULETA!'}</span>
            </button>

            {/* Tarjeta de Ganador debajo de la ruleta si ya salió */}
            {winner && (
              <div className="winner-announcement-box">
                <PartyPopper size={30} color="var(--color-heart)" />
                <div style={{ flex: 1 }}>
                  <div className="winner-label">¡Plan elegido por el destino!</div>
                  <h3 className="winner-title">{winner.text}</h3>
                  <div className="winner-badge-info">
                    <span>🏷️ {winner.category}</span>
                    <span>•</span>
                    <span>Sugerido por: {winner.author === 'Nerea' ? '💜 Nerea' : winner.author === 'Lucas' ? '🖤 Lucas' : '✨ Ambos'}</span>
                  </div>
                </div>
              </div>
            )}
          </TiltCard>
        </div>

        {/* LADO DERECHO: Panel de Opciones Modificables por Ambos */}
        <div className="roulette-management-column">
          <div className="roulette-options-card">
            <div className="options-card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-lila-dark)', margin: 0 }}>
                  Nuestras Ideas ({ideas.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Cualquiera de los dos puede agregar, editar o pausar planes.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="add-idea-top-btn"
                title="Agregar nuevo plan a la ruleta"
              >
                <Plus size={16} />
                <span>Agregar</span>
              </button>
            </div>

            {/* Filtros por Categoría */}
            <div className="category-filter-chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Barra de herramientas rápidas */}
            <div className="roulette-quick-bar">
              <button
                onClick={() => handleToggleAll(true)}
                className="quick-action-link"
              >
                Activar todas
              </button>
              <span>•</span>
              <button
                onClick={handleResetDefaults}
                className="quick-action-link"
                title="Restablecer ideas por defecto"
              >
                Restablecer iniciales
              </button>
            </div>

            {/* Lista Scrolleable de Ideas */}
            <div className="roulette-options-list">
              {displayedIdeas.map((idea, idx) => (
                <div
                  key={idea.id}
                  className={`roulette-option-item ${idea.active ? 'active-item' : 'paused-item'}`}
                >
                  {/* Checkbox para activar/pausar en la ruleta */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(idea.id)}
                    className="toggle-active-btn"
                    title={idea.active ? 'Pausar este plan de la ruleta' : 'Activar este plan en la ruleta'}
                  >
                    {idea.active ? (
                      <CheckCircle2 size={20} color="var(--color-lila-primary)" />
                    ) : (
                      <Circle size={20} color="#CBD5E0" />
                    )}
                  </button>

                  {/* Contenido / Modo Edición */}
                  {editingId === idea.id ? (
                    <div className="inline-edit-wrapper">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        maxLength={50}
                        className="inline-edit-input"
                        autoFocus
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="inline-edit-select"
                      >
                        {CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSaveEdit(idea.id)}
                        className="inline-btn-save"
                        title="Guardar cambios"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="inline-btn-cancel"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="option-main-info" onClick={() => handleToggleActive(idea.id)}>
                        <span className="option-text">{idea.text}</span>
                        <div className="option-sub-tags">
                          <span className="option-category-tag">{idea.category}</span>
                          <span className="option-author-tag">
                            {idea.author === 'Nerea' ? '💜 Nerea' : idea.author === 'Lucas' ? '🖤 Lucas' : '✨ Ambos'}
                          </span>
                        </div>
                      </div>

                      {/* Acciones de editar y borrar */}
                      <div className="option-item-actions">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(idea)}
                          className="item-action-btn"
                          title="Editar esta idea"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(idea.id)}
                          className="item-action-btn delete"
                          title="Eliminar de la ruleta"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA AGREGAR NUEVA IDEA */}
      {isAddModalOpen && (
        <div className="roulette-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="roulette-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-lila-dark)', fontWeight: 700 }}>
                Agregar Nueva Cita o Plan 🎡
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-body)' }}>
                  ¿Qué hacemos juntos? (Idea o plan):
                </label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Ej: Salir a merendar waffles y café 🧇"
                  maxLength={50}
                  required
                  className="modal-form-input"
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-body)' }}>
                    Categoría:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="modal-form-select"
                  >
                    {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-body)' }}>
                    Sugerido por:
                  </label>
                  <select
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="modal-form-select"
                  >
                    <option value="Ambos">✨ Ambos</option>
                    <option value="Nerea">💜 Nerea</option>
                    <option value="Lucas">🖤 Lucas</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="modal-cancel-btn"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                >
                  <Plus size={16} />
                  <span>Agregar a la Ruleta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CELEBRACIÓN DE GANADOR */}
      {showWinnerModal && winner && (
        <div className="roulette-modal-overlay" onClick={() => setShowWinnerModal(false)}>
          <div className="winner-celebration-modal" onClick={(e) => e.stopPropagation()}>
            <div className="celebration-sparkle-icon">
              <Sparkles size={38} color="#FF5A79" />
            </div>

            <span className="celebration-subtitle">¡EL DESTINO HA HABLADO!</span>
            <h2 className="celebration-winner-text">{winner.text}</h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.5rem 0 1.5rem 0' }}>
              Categoría: <strong>{winner.category}</strong> • Sugerido por: <strong>{winner.author}</strong>
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowWinnerModal(false)}
                className="accept-winner-btn"
              >
                <Heart size={18} fill="#FFFFFF" />
                <span>¡Aceptamos el Plan! 💜</span>
              </button>
              <button
                onClick={() => {
                  setShowWinnerModal(false);
                  handleSpin();
                }}
                className="spin-again-modal-btn"
              >
                <RotateCcw size={16} />
                <span>Girar de nuevo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
