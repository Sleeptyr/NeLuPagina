import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CONTENT } from '../config/content';
import { PHOTO_SLOTS } from '../config/photos';
import { FROGS_CONFIG } from '../config/frogs';
import HiddenFrog from '../components/HiddenFrog';
import SignedImage from '../components/SignedImage';
import { Star, Coffee, Utensils, Pizza, Sparkles, Plus, Trash2, Edit3, X, ThumbsUp, ThumbsDown, Calendar, DollarSign } from 'lucide-react';

export default function Reviews() {
  const { user, profile, isNerea } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros y orden
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'rating'

  // Modal para crear / editar reseña
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Campos del formulario
  const [placeName, setPlaceName] = useState('');
  const [category, setCategory] = useState('merienda');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [itemsOrdered, setItemsOrdered] = useState('');
  const [priceApprox, setPriceApprox] = useState('');
  const [wouldReturn, setWouldReturn] = useState(true);
  const [visitedAt, setVisitedAt] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  // Las 11 ranitas asignadas a Reseñas
  const reviewsFrogs = FROGS_CONFIG.filter((f) => f.section === 'reviews');

  // Cargar reseñas
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:author (
            display_name,
            nickname,
            color
          )
        `)
        .order('visited_at', { ascending: false });

      if (error || !data) {
        // Fallback demo local
        const local = localStorage.getItem('pagina_amor_reviews_demo');
        if (local) {
          setReviews(JSON.parse(local));
        } else {
          // Datos iniciales cariñosos de muestra con fotos reales de sus salidas
          const initialMock = [
            {
              id: 'rev-demo-1',
              place_name: 'Café Edison',
              category: 'merienda',
              rating: 5,
              comment: 'El café de especialidad y la pastelería estuvieron increíbles. La compañía, insuperable.',
              items_ordered: 'Capuchino, latte frío y medialunas rellenas.',
              priceApprox: 9500,
              would_return: true,
              visited_at: '2026-09-20',
              author: '00000000-0000-0000-0000-000000000002',
              profiles: { display_name: 'Lucas', nickname: null, color: '#1E1B18' }
            },
            {
              id: 'rev-demo-2',
              place_name: 'Pato Gula',
              category: 'almuerzo-cena',
              rating: 5,
              comment: '¡Las hamburguesas más ricas de todas! Nos reímos un montón esa noche.',
              items_ordered: 'Hamburguesas completas con papas cheddar y gaseosa.',
              priceApprox: 18000,
              would_return: true,
              visited_at: '2026-08-14',
              author: '00000000-0000-0000-0000-000000000001',
              profiles: { display_name: 'Nerea', nickname: 'Porfiada', color: '#9B5DE5' }
            }
          ];
          setReviews(initialMock);
          localStorage.setItem('pagina_amor_reviews_demo', JSON.stringify(initialMock));
        }
      } else {
        setReviews(data);
      }
    } catch (err) {
      console.error('Error cargando reseñas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreateModal = () => {
    setEditingReview(null);
    setPlaceName('');
    setCategory('merienda');
    setRating(5);
    setComment('');
    setItemsOrdered('');
    setPriceApprox('');
    setWouldReturn(true);
    setVisitedAt(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setPlaceName(review.place_name);
    setCategory(review.category);
    setRating(review.rating);
    setComment(review.comment || '');
    setItemsOrdered(review.items_ordered || '');
    setPriceApprox(review.price_approx || review.priceApprox || '');
    setWouldReturn(review.would_return);
    setVisitedAt(review.visited_at);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeName.trim()) return;

    setSubmitting(true);

    const payload = {
      place_name: placeName.trim(),
      category,
      rating: Number(rating),
      comment: comment.trim(),
      items_ordered: itemsOrdered.trim(),
      price_approx: priceApprox ? Number(priceApprox) : null,
      would_return: wouldReturn,
      visited_at: visitedAt,
      author: user?.id || '00000000-0000-0000-0000-000000000002'
    };

    try {
      if (editingReview) {
        const { error } = await supabase
          .from('reviews')
          .update(payload)
          .eq('id', editingReview.id);

        if (error) {
          // Fallback local
          setReviews((prev) =>
            prev.map((r) =>
              r.id === editingReview.id
                ? { ...r, ...payload, profiles: editingReview.profiles }
                : r
            )
          );
        } else {
          await fetchReviews();
        }
      } else {
        const { error } = await supabase.from('reviews').insert(payload);

        if (error) {
          // Fallback local
          const localItem = {
            ...payload,
            id: `rev-${Date.now()}`,
            profiles: {
              display_name: profile?.display_name || (isNerea ? 'Nerea' : 'Lucas'),
              nickname: profile?.nickname || (isNerea ? 'Porfiada' : null),
              color: profile?.color || (isNerea ? '#9B5DE5' : '#1E1B18')
            }
          };
          setReviews((prev) => [localItem, ...prev]);
        } else {
          await fetchReviews();
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error guardando reseña:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Querés eliminar esta reseña?')) return;

    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await supabase.from('reviews').delete().eq('id', id);
    } catch (err) {
      console.warn('Error eliminando reseña:', err);
    }
  };

  // Filtrado y orden
  const filteredReviews = reviews
    .filter((r) => categoryFilter === 'all' || r.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return new Date(b.visited_at) - new Date(a.visited_at);
    });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'desayuno':
        return { label: 'Desayuno', icon: <Coffee size={13} />, bg: '#FFF3E0', color: '#E65100' };
      case 'merienda':
        return { label: 'Merienda', icon: <Utensils size={13} />, bg: '#F3ECFD', color: '#8A4FFF' };
      case 'almuerzo-cena':
        return { label: 'Almuerzo / Cena', icon: <Pizza size={13} />, bg: '#FFEBEE', color: '#C62828' };
      default:
        return { label: 'Lugarcito', icon: <Sparkles size={13} />, bg: '#E8F5E9', color: '#2E7D32' };
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Ranas escondidas de Reseñas */}
      {reviewsFrogs.map((frog) => (
        <HiddenFrog key={frog.id} frog={frog} />
      ))}

      {/* Cabecera con foto de cafetería / comida */}
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
            {CONTENT.reviews.title}
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
            {CONTENT.reviews.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="polaroid-card" style={{ maxWidth: '170px', padding: '0.5rem 0.5rem 0.8rem 0.5rem' }}>
            <div className="polaroid-img-wrapper" style={{ aspectRatio: '1/1' }}>
              <SignedImage
                storagePath={PHOTO_SLOTS.reviewsHero.storagePath}
                fallbackUrl={PHOTO_SLOTS.reviewsHero.localFallback}
                alt={PHOTO_SLOTS.reviewsHero.title}
                className="polaroid-img"
              />
            </div>
            <div className="polaroid-caption" style={{ fontSize: '1rem', marginTop: '0.35rem' }}>
              {PHOTO_SLOTS.reviewsHero.title}
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="continue-site-btn"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
          >
            <Plus size={18} />
            <span>{CONTENT.reviews.createButton}</span>
          </button>
        </div>
      </div>

      {/* Filtros de Categoría y Orden */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <button
            className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            Todas las categorías
          </button>
          <button
            className={`filter-chip ${categoryFilter === 'desayuno' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('desayuno')}
          >
            ☕ Desayunos
          </button>
          <button
            className={`filter-chip ${categoryFilter === 'merienda' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('merienda')}
          >
            🧁 Meriendas
          </button>
          <button
            className={`filter-chip ${categoryFilter === 'almuerzo-cena' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('almuerzo-cena')}
          >
            🍕 Almuerzos / Cenas
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-crema-border)',
              background: '#FFFFFF',
              fontSize: '0.88rem',
              color: 'var(--text-body)'
            }}
          >
            <option value="date">Más recientes</option>
            <option value="rating">Mejor puntuación</option>
          </select>
        </div>
      </div>

      {/* Listado de Reseñas */}
      {filteredReviews.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px dashed var(--color-crema-border)'
        }}>
          <span style={{ fontSize: '2.5rem' }}>☕🍰✨</span>
          <p style={{ marginTop: '0.75rem', color: 'var(--text-body)', fontSize: '1.05rem' }}>
            {CONTENT.reviews.emptyState}
          </p>
          <button
            onClick={openCreateModal}
            className="continue-site-btn"
            style={{ marginTop: '1.25rem', padding: '0.65rem 1.25rem' }}
          >
            <Plus size={16} />
            <span>Sumar nuestra primera reseña</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredReviews.map((review) => {
            const catBadge = getCategoryBadge(review.category);
            const author = review.profiles?.display_name || 'Lucas';
            const authorNickname = review.profiles?.nickname;
            const isNereaAuthor = author.toLowerCase().includes('nerea') || authorNickname === 'Porfiada';

            return (
              <div key={review.id} className="content-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: catBadge.bg,
                        color: catBadge.color,
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {catBadge.icon}
                        <span>{catBadge.label}</span>
                      </span>

                      {/* Autor y color */}
                      <span className={`user-badge ${isNereaAuthor ? 'nerea' : 'lucas'}`}>
                        {isNereaAuthor ? '💜 Nerea' : '🖤 Lucas'}
                      </span>

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        <Calendar size={13} />
                        {new Date(review.visited_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        color: 'var(--text-main)'
                      }}>
                        {review.place_name}
                      </h3>

                      {/* Estrellas */}
                      <div style={{ display: 'inline-flex', gap: '0.15rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={17}
                            color={star <= review.rating ? '#F59E0B' : '#E5E7EB'}
                            fill={star <= review.rating ? '#F59E0B' : 'none'}
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <p style={{ fontSize: '0.96rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                        "{review.comment}"
                      </p>
                    )}

                    {/* Detalles modulares (qué pedimos, precio, volveríamos) */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      background: 'var(--color-crema-50)',
                      border: '1px solid var(--color-crema-border)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem'
                    }}>
                      {review.items_ordered && (
                        <div>
                          <strong style={{ color: 'var(--text-body)' }}>{CONTENT.reviews.labels.itemsOrdered} </strong>
                          <span style={{ color: 'var(--text-muted)' }}>{review.items_ordered}</span>
                        </div>
                      )}

                      {(review.price_approx || review.priceApprox) && (
                        <div>
                          <strong style={{ color: 'var(--text-body)' }}>{CONTENT.reviews.labels.priceApprox} </strong>
                          <span style={{ color: 'var(--text-muted)' }}>
                            ${Number(review.price_approx || review.priceApprox).toLocaleString('es-AR')}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <strong style={{ color: 'var(--text-body)' }}>{CONTENT.reviews.labels.wouldReturn} </strong>
                        {review.would_return ? (
                          <span style={{ color: '#2E7D32', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <ThumbsUp size={13} /> {CONTENT.reviews.labels.wouldReturnYes}
                          </span>
                        ) : (
                          <span style={{ color: '#C62828', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <ThumbsDown size={13} /> {CONTENT.reviews.labels.wouldReturnNo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => openEditModal(review)}
                      style={{ color: 'var(--text-light)', padding: '0.35rem' }}
                      title="Editar reseña"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      style={{ color: '#E07A5F', padding: '0.35rem' }}
                      title="Eliminar reseña"
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

      {/* Modal Crear / Editar Reseña */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-lila-dark)' }}>
                {editingReview ? 'Editar Reseña' : 'Sumar Reseña Gastronómica'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  Nombre del lugar *
                </label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Ej: Café Edison, Pato Gula..."
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-crema-border)',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="desayuno">☕ Desayuno</option>
                    <option value="merienda">🧁 Merienda</option>
                    <option value="almuerzo-cena">🍕 Almuerzo o Cena</option>
                    <option value="otra">✨ Otro lugarcito</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                    Puntuación
                  </label>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', height: '45px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        style={{ padding: '0.2rem' }}
                      >
                        <Star
                          size={22}
                          color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                          fill={star <= rating ? '#F59E0B' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  ¿Qué pedimos?
                </label>
                <input
                  type="text"
                  value={itemsOrdered}
                  onChange={(e) => setItemsOrdered(e.target.value)}
                  placeholder="Ej: Dos capuchinos con tostadas y palta"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-crema-border)',
                    background: '#FFFFFF'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                    Precio aprox ($)
                  </label>
                  <input
                    type="number"
                    value={priceApprox}
                    onChange={(e) => setPriceApprox(e.target.value)}
                    placeholder="Ej: 12000"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-crema-border)',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                    Fecha de visita
                  </label>
                  <input
                    type="date"
                    value={visitedAt}
                    onChange={(e) => setVisitedAt(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-crema-border)',
                      background: '#FFFFFF'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  ¿Volveríamos?
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                    <input
                      type="radio"
                      checked={wouldReturn === true}
                      onChange={() => setWouldReturn(true)}
                    />
                    <span>¡Sí, obvio que sí! 😍</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                    <input
                      type="radio"
                      checked={wouldReturn === false}
                      onChange={() => setWouldReturn(false)}
                    />
                    <span>Paso, no volvería 😅</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
                  Comentario u opinión
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Qué nos pareció la comida, la atención y el momento..."
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
                {submitting ? 'Guardando...' : (editingReview ? 'Guardar Cambios' : '¡Publicar Nuestra Reseña! ☕🍕')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
