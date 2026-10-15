import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFrogs } from '../context/FrogsContext';
import { Heart, MapPin, Utensils, LogOut } from 'lucide-react';

export default function Navbar() {
  const { profile, logout, isNerea, switchIdentity } = useAuth();
  const { foundCount, totalFrogs, setShowCouponModal } = useFrogs();

  return (
    <header className="navbar">
      <NavLink to="/" className="nav-brand">
        <Heart size={20} color="var(--color-heart)" fill="var(--color-heart)" />
        <span>Para Nerea</span>
      </NavLink>

      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Heart size={15} />
              <span>Inicio</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/planes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <MapPin size={15} />
              <span>Planes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/resenas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Utensils size={15} />
              <span>Reseñas</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="nav-actions">
        {/* Contador discreto de ranas */}
        <button
          className="frog-counter-pill"
          onClick={() => {
            if (foundCount >= totalFrogs) {
              setShowCouponModal(true);
            }
          }}
          title={foundCount >= totalFrogs ? '¡Tocar para ver tu cupón premio!' : `Has encontrado ${foundCount} de ${totalFrogs} ranitas`}
        >
          <span className="frog-counter-icon">🐸</span>
          <span>{foundCount}/{totalFrogs}</span>
        </button>

        {/* Badge del usuario activo (clickeable para alternar si hace falta) */}
        {profile && (
          <button
            onClick={() => switchIdentity(isNerea ? 'lucas' : 'nerea')}
            className={`user-badge ${isNerea ? 'nerea' : 'lucas'}`}
            title={`Conectado como ${isNerea ? 'Nerea' : 'Lucas'}. Clic para alternar a ${isNerea ? 'Lucas' : 'Nerea'}`}
            style={{ cursor: 'pointer' }}
          >
            {isNerea ? '💜 Nerea' : '🖤 Lucas'}
          </button>
        )}

        {/* Botón de logout sutil */}
        <button
          onClick={logout}
          className="nav-link"
          style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
