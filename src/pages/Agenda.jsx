import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import TiltCard from '../components/TiltCard';
import {
  Target,
  StickyNote,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Heart,
  Pin,
  CheckCircle2,
  Circle,
  Flag,
  PenTool
} from 'lucide-react';

// Semillas iniciales tiernas para que la agenda no esté vacía al abrir
const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Viaje juntos a la Patagonia ❄️🏔️',
    target_date: '2025-12-20',
    progress: 40,
    completed: false,
    author_name: 'Lucas',
    category: 'Viajes'
  },
  {
    id: 'goal-2',
    title: 'Cocinar comida casera juntos todos los domingos 🍝',
    target_date: '2025-06-18',
    progress: 75,
    completed: false,
    author_name: 'Nerea',
    category: 'Cotidiano'
  },
  {
    id: 'goal-3',
    title: 'Armar nuestro álbum físico de fotos de estos 2 años 📸',
    target_date: '2025-08-15',
    progress: 20,
    completed: false,
    author_name: 'Lucas',
    category: 'Recuerdos'
  }
];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    text: 'Acordate que sos lo más lindo que me pasó en la vida, Porfiada. Te amo un montón 💜',
    color: '#F4EBFC',
    pin_color: '#9B5DE5',
    author_name: 'Lucas',
    created_at: new Date().toISOString()
  },
  {
    id: 'note-2',
    text: '¡Sos mi persona favorita en el universo entero! Gracias por hacerme tan feliz 🥰',
    color: '#FFE5EC',
    pin_color: '#FF5A79',
    author_name: 'Nerea',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function Agenda() {
  const { profile, isNerea } = useAuth();

  const [activeTab, setActiveTab] = useState('metas'); // 'metas' | 'notas'
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('pagina_amor_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('pagina_amor_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  // Modales de creación
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Form states
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalCategory, setGoalCategory] = useState('Viajes');
  const [goalProgress, setGoalProgress] = useState(25);

  const [noteText, setNoteText] = useState('');
  const [noteColor, setNoteColor] = useState('#F4EBFC');

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('pagina_amor_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('pagina_amor_notes', JSON.stringify(notes));
  }, [notes]);

  const currentAuthor = profile?.display_name || (isNerea ? 'Nerea' : 'Lucas');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalTitle.trim(),
      target_date: goalDate || null,
      progress: Number(goalProgress),
      completed: Number(goalProgress) >= 100,
      author_name: currentAuthor,
      category: goalCategory
    };

    setGoals((prev) => [newGoal, ...prev]);
    setGoalTitle('');
    setGoalDate('');
    setGoalProgress(25);
    setIsGoalModalOpen(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      text: noteText.trim(),
      color: noteColor,
      pin_color: noteColor === '#F4EBFC' ? '#9B5DE5' : '#FF5A79',
      author_name: currentAuthor,
      created_at: new Date().toISOString()
    };

    setNotes((prev) => [newNote, ...prev]);
    setNoteText('');
    setIsNoteModalOpen(false);
  };

  const updateGoalProgress = (id, delta) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newProg = Math.max(0, Math.min(100, g.progress + delta));
        return {
          ...g,
          progress: newProg,
          completed: newProg >= 100
        };
      })
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="agenda-page">
      {/* Header romántico */}
      <div className="section-header">
        <h1 className="section-title">Nuestra Agenda & Metas</h1>
        <p className="section-subtitle">
          Los sueños que construimos juntos y las notitas que nos dejamos con amor.
        </p>

        {/* Selector de solapas estilo píldora */}
        <div className="agenda-tabs-wrapper">
          <button
            onClick={() => setActiveTab('metas')}
            className={`agenda-tab-btn ${activeTab === 'metas' ? 'active' : ''}`}
          >
            <Target size={18} />
            <span>Nuestras Metas ({goals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notas')}
            className={`agenda-tab-btn ${activeTab === 'notas' ? 'active' : ''}`}
          >
            <StickyNote size={18} />
            <span>Notitas de Amor ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN METAS */}
      {activeTab === 'metas' && (
        <div>
          <div className="action-bar-top">
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="add-primary-btn"
            >
              <Plus size={18} />
              <span>Nueva Meta Juntos</span>
            </button>
          </div>

          <div className="goals-grid">
            {goals.map((goal) => {
              const isNereaAuthor = goal.author_name.toLowerCase().includes('nerea');
              return (
                <TiltCard maxTilt={6} key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <span className="goal-category-badge">{goal.category}</span>
                    <span className={`user-badge ${isNereaAuthor ? 'nerea' : 'lucas'}`}>
                      {isNereaAuthor ? '💜 Nerea' : '🖤 Lucas'}
                    </span>
                  </div>

                  <h3 className={`goal-title ${goal.completed ? 'completed' : ''}`}>
                    {goal.title}
                  </h3>

                  {goal.target_date && (
                    <div className="goal-date-tag">
                      <Calendar size={13} />
                      <span>Meta para: {new Date(goal.target_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}

                  {/* Barra de progreso interactiva */}
                  <div className="goal-progress-section">
                    <div className="progress-labels">
                      <span>Progreso</span>
                      <strong>{goal.progress}% {goal.completed ? '🎉 ¡Cumplida!' : ''}</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${goal.progress}%`,
                          background: goal.completed ? 'var(--color-mint-frog)' : 'var(--grad-sunset)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Controles de avance rápido */}
                  <div className="goal-controls">
                    <button
                      type="button"
                      onClick={() => updateGoalProgress(goal.id, -25)}
                      className="goal-step-btn"
                      title="-25%"
                    >
                      -25%
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGoalProgress(goal.id, 25)}
                      className="goal-step-btn"
                      title="+25%"
                    >
                      +25%
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGoalProgress(goal.id, goal.completed ? -100 : 100)}
                      className={`goal-step-btn ${goal.completed ? 'done-btn' : ''}`}
                    >
                      {goal.completed ? 'Reabrir' : '¡Completada! 🥳'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="goal-delete-btn"
                      title="Eliminar meta"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN NOTITAS DE AMOR (POST-ITS VIRTUALES) */}
      {activeTab === 'notas' && (
        <div>
          <div className="action-bar-top">
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="add-primary-btn"
            >
              <PenTool size={18} />
              <span>Dejar una Notita</span>
            </button>
          </div>

          <div className="notes-corkboard">
            {notes.map((note) => {
              const isNereaAuthor = note.author_name.toLowerCase().includes('nerea');
              return (
                <TiltCard maxTilt={10} key={note.id} className="sticky-note-card" style={{ background: note.color }}>
                  <div className="pin-indicator" style={{ background: note.pin_color }} />
                  <p className="sticky-note-text">"{note.text}"</p>
                  <div className="sticky-note-footer">
                    <span className={`user-badge ${isNereaAuthor ? 'nerea' : 'lucas'}`}>
                      {isNereaAuthor ? '💜 Nerea' : '🖤 Lucas'}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      className="note-delete-btn"
                      title="Despegar nota"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CREAR META */}
      {isGoalModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsGoalModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-lila-dark)', marginBottom: '1rem' }}>
              Nueva Meta Compartida 🎯
            </h2>
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                  ¿Qué sueño o meta queremos cumplir?
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Ej: Viajar a Bariloche, adoptar una mascota..."
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-crema-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                    Categoría
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-crema-border)', background: '#FFF' }}
                  >
                    <option value="Viajes">✈️ Viajes</option>
                    <option value="Hogar">🏡 Hogar</option>
                    <option value="Cotidiano">🍝 Cotidiano</option>
                    <option value="Amor">💖 Amor</option>
                    <option value="Recuerdos">📸 Recuerdos</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                    Fecha estimada (opcional)
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-crema-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                  Progreso inicial: {goalProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={goalProgress}
                  onChange={(e) => setGoalProgress(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-lila-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-crema-border)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="continue-site-btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Guardar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR NOTITA */}
      {isNoteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNoteModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-lila-dark)', marginBottom: '1rem' }}>
              Dejar una Notita de Amor 💌
            </h2>
            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                  Escribí lo que sientas para tu pareja:
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Un recordatorio tierno, un gracias, o un 'te amo' espontáneo..."
                  rows={4}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-crema-border)', fontFamily: 'var(--font-handwriting)', fontSize: '1.35rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                  Color del Post-It
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { color: '#F4EBFC', label: 'Lila' },
                    { color: '#FFE5EC', label: 'Rosa' },
                    { color: '#EAF7E8', label: 'Menta' },
                    { color: '#FFF8E1', label: 'Vainilla' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setNoteColor(c.color)}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: c.color,
                        border: noteColor === c.color ? '2px solid #27232A' : '1px solid #D8D2C4',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-crema-border)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="continue-site-btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Pegar Notita 📌
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
