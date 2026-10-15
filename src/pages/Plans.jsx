import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CONTENT } from '../config/content';
import { PHOTO_SLOTS } from '../config/photos';
import { FROGS_CONFIG } from '../config/frogs';
import HiddenFrog from '../components/HiddenFrog';
import SignedImage from '../components/SignedImage';
import { MapPin, Sparkles, ShoppingBag, CheckCircle, Circle, Plus, Trash2, Edit3, X } from 'lucide-react';

export default function Plans() {
  const { user, profile, isNerea } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [kindFilter, setKindFilter] = useState('all'); // 'all', 'lugar', 'cosa', 'compra'

  // Modal para crear / editar plan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formKind, setFormKind] = useState('lugar');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Las 11 ranitas asignadas a Planes
  const plansFrogs = FROGS_CONFIG.filter((f) => f.section === 'plans');

  // Cargar planes
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select(`
          *,
          profiles:created_by (
            display_name,
            nickname,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error || !data) {
        // Fallback local si la base de datos aún no tiene registros
        const local = localStorage.getItem('pagina_amor_plans_demo');
        if (local) {
          setPlans(JSON.parse(local));
        } else {
          setPlans([]);
        }
      } else {
        setPlans(data);
      }
    } catch (err) {
      console.error('Error cargando planes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormTitle('');
    setFormKind('lugar');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormTitle(plan.title);
    setFormKind(plan.kind);
    setFormNotes(plan.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setSubmitting(true);

    try {
      if (editingPlan) {
        // Actualizar
        const { error } = await supabase
          .from('wishes')
          .update({
            title: formTitle.trim(),
            kind: formKind,
            notes: formNotes.trim()
          })
          .eq('id', editingPlan.id);

        if (error) {
          // Actualización en fallback local
          setPlans((prev) =>
            prev.map((p) =>
              p.id === editingPlan.id
                ? { ...p, title: formTitle.trim(), kind: formKind, notes: formNotes.trim() }
                : p
            )
          );
        } else {
          await fetchPlans();
        }
      } else {
        // Crear nuevo plan
        const newRecord = {
          title: formTitle.trim(),
          kind: formKind,
          notes: formNotes.trim(),
          done: false,
          created_by: user?.id || '00000000-0000-0000-0000-000000000002'
        };

        const { error } = await supabase.from('wishes').insert(newRecord);

        if (error) {
          // Creación en fallback local
          const localItem = {
            ...newRecord,
            id: `plan-${Date.now()}`,
            created_at: new Date().toISOString(),
            profiles: {
              display_name: profile?.display_name || (isNerea ? 'Nerea' : 'Lucas'),
              nickname: profile?.nickname || (isNerea ? 'Porfiada' : null),
              color: profile?.color || (isNerea ? '#9B5DE5' : '#1E1B18')
            }
          };
          setPlans((prev) => [localItem, ...prev]);
        } else {
          await fetchPlans();
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error guardando plan:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDone = async (plan) => {
    const updatedStatus = !plan.done;

    // Optimista
    setPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? { ...p, done: updatedStatus } : p))
    );

    try {
      await supabase
        .from('wishes')
        .update({ done: updatedStatus })
        .eq('id', plan.id);
    } catch (err) {
      console.warn('Error alternando estado en Supabase:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminamos este plan de la lista?')) return;

    setPlans((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from('wishes').delete().eq('id', id);
    } catch (err) {
      console.warn('Error eliminando plan:', err);
    }
  };

  // Filtrado de planes
  const filteredPlans = plans.filter((plan) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !plan.done) ||
      (statusFilter === 'completed' && plan.done);

    const matchesKind = kindFilter === 'all' || plan.kind === kindFilter;

    return matchesStatus && matchesKind;
  });

  const getKindBadge = (kind) => {
    switch (kind) {
      case 'lugar':
        return { label: 'Lugar', icon: <MapPin size={13} />, bg: '#F3ECFD', color: '#8A4FFF' };
      case 'cosa':
        return { label: 'Cosa para hacer', icon: <Sparkles size={13} />, bg: '#FFF0ED', color: '#E07A5F' };
      case 'compra':
        return { label: 'Compra', icon: <ShoppingBag size={13} />, bg: '#EAF7F3', color: '#2A9D8F' };
      default:
        return { label: kind, icon: null, bg: '#F5F5F5', color: '#666' };
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Ranas escondidas de Planes */}
      {plansFrogs.map((frog) => (
        <HiddenFrog key={frog.id} frog={frog} />
      ))}

      {/* Cabecera con foto tierna */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.4rem',
            color: 'var(--color-lila-dark)',
            lineHeight: 1.2
          }}>
            {CONTENT.plans.title}
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
            {CONTENT.plans.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="polaroid-card" style={{ maxWidth: '170px', padding: '0.5rem 0.5rem 0.8rem 0.5rem' }}>
            <div className="polaroid-img-wrapper" style={{ aspectRatio: '1/1' }}>
              <SignedImage
                storagePath={PHOTO_SLOTS.plansHero.storagePath}
                fallbackUrl={PHOTO_SLOTS.plansHero.localFallback}
                alt={PHOTO_SLOTS.plansHero.title}
                className="polaroid-img"
              />
            </div>
            <div className="polaroid-caption" style={{ fontSize: '1rem', marginTop: '0.35rem' }}>
              {PHOTO_SLOTS.plansHero.title}
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="continue-site-btn"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
          >
            <Plus size={18} />
            <span>{CONTENT.plans.createButton}</span>
          </button>
        </div>
      </div>

      {/* Barras de Filtros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div className="filter-bar">
          <button
            className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Todos los estados
          </button>
          <button
            className={`filter-chip ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Por cumplir ⏳
          </button>
          <button
            className={`filter-chip ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Cumplidos ✨
          </button>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-chip ${kindFilter === 'all' ? 'active' : ''}`}
            onClick={() => setKindFilter('all')}
          >
            Todos los tipos
          </button>
          <button
            className={`filter-chip ${kindFilter === 'lugar' ? 'active' : ''}`}
            onClick={() => setKindFilter('lugar')}
          >
            📍 Lugares
          </button>
          <button
            className={`filter-chip ${kindFilter === 'cosa' ? 'active' : ''}`}
            onClick={() => setKindFilter('cosa')}
          >
            ✨ Cosas para hacer
          </button>
          <button
            className={`filter-chip ${kindFilter === 'compra' ? 'active' : ''}`}
            onClick={() => setKindFilter('compra')}
          >
            🛍️ Compras
          </button>
        </div>
      </div>

      {/* Listado de planes */}
      {filteredPlans.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px dashed var(--color-crema-border)'
        }}>
          <span style={{ fontSize: '2.5rem' }}>💭✨</span>
          <p style={{ marginTop: '0.75rem', color: 'var(--text-body)', fontSize: '1.05rem' }}>
            {CONTENT.plans.emptyState}
          </p>
          <button
            onClick={openCreateModal}
            className="continue-site-btn"
            style={{ marginTop: '1.25rem', padding: '0.65rem 1.25rem' }}
          >
            <Plus size={16} />
            <span>Agregar nuestro primer plan</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPlans.map((plan) => {
            const kindBadge = getKindBadge(plan.kind);
            const author = plan.profiles?.display_name || 'Lucas';
            const authorNickname = plan.profiles?.nickname;
            const authorColor = plan.profiles?.color || '#1E1B18';
            const isNereaAuthor = author.toLowerCase().includes('nerea') || authorNickname === 'Porfiada';

            return (
              <div key={plan.id} className={`content-card ${plan.done ? 'done' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                    <button
                      onClick={() => toggleDone(plan)}
                      style={{
                        color: plan.done ? 'var(--color-mint-frog)' : 'var(--text-light)',
                        marginTop: '0.2rem',
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                      title={plan.done ? 'Marcar como pendiente' : 'Marcar como cumplido'}
                    >
                      {plan.done ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          background: kindBadge.bg,
                          color: kindBadge.color,
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {kindBadge.icon}
                          <span>{kindBadge.label}</span>
                        </span>

                        {/* Quién lo agregó */}
                        <span className={`user-badge ${isNereaAuthor ? 'nerea' : 'lucas'}`}>
                          {isNereaAuthor ? '💜 Nerea' : '🖤 Lucas'}
                        </span>

                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          {new Date(plan.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <h3 className="item-title" style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        marginBottom: plan.notes ? '0.35rem' : 0
                      }}>
                        {plan.title}
                      </h3>

                      {plan.notes && (
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.45 }}>
                          {plan.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => openEditModal(plan)}
                      style={{ color: 'var(--text-light)', padding: '0.35rem' }}
                      title="Editar plan"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      style={{ color: '#E07A5F', padding: '0.35rem' }}
                      title="Eliminar plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Plan */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-lila-dark)' }}>
                {editingPlan ? 'Editar Plan' : 'Nuevo Plan Juntos'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  ¿Qué queremos hacer? *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Probar la chocotorta de ese lugarcito nuevo"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-crema-border)',
                    background: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  Tipo de plan
                </label>
                <select
                  value={formKind}
                  onChange={(e) => setFormKind(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-crema-border)',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="lugar">📍 Lugar por visitar</option>
                  <option value="cosa">✨ Cosa para hacer</option>
                  <option value="compra">🛍️ Compra para los dos</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  Notas o detalles (opcional)
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Dirección, ideas o lo que no nos podemos olvidar..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-crema-border)',
                    background: '#FFFFFF',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="continue-site-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {submitting ? 'Guardando...' : (editingPlan ? 'Guardar Cambios' : '¡Agregar a Nuestros Planes! 💜')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
