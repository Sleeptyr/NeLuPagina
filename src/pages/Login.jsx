import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CONTENT } from '../config/content';
import { Lock, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const { user, login, signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chosenRole, setChosenRole] = useState('nerea');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Si ya hay sesión activa persistida, redirigir automáticamente a la portada
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleEmailChange = (val) => {
    setEmail(val);
    const lower = val.toLowerCase();
    if (lower.includes('lucas')) {
      setChosenRole('lucas');
    } else if (lower.includes('nerea') || lower.includes('porfiada') || lower.includes('nere')) {
      setChosenRole('nerea');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completá tu correo y contraseña');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    if (mode === 'register') {
      const { data, error } = await signUp(email, password, chosenRole);
      setSubmitting(false);

      if (error) {
        if (error.message?.includes('User already registered')) {
          setErrorMsg('Este correo ya está registrado. Probá iniciando sesión.');
        } else {
          setErrorMsg(error.message || 'No se pudo crear la cuenta.');
        }
      } else {
        navigate('/', { replace: true });
      }
    } else {
      const { data, error } = await login(email, password, chosenRole);
      setSubmitting(false);

      if (error) {
        if (error.message?.includes('Invalid login credentials') || error.code === 'invalid_credentials') {
          setErrorMsg('Correo o contraseña incorrectos. Si todavía no creaste tu cuenta, seleccioná "Registrarse" arriba.');
        } else if (error.message?.includes('Email not confirmed')) {
          setErrorMsg('El correo aún no fue confirmado en Supabase (desactivá "Confirm email" en Supabase Auth -> Providers -> Email).');
        } else {
          setErrorMsg(error.message || CONTENT.auth.errorInvalidCreds);
        }
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  const fillQuickLogin = (userType) => {
    setChosenRole(userType);
    if (userType === 'nerea') {
      setEmail('nerea@amor.com');
      setPassword('porfiada123');
    } else {
      setEmail('lucas@amor.com');
      setPassword('lucas123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div className="romantic-banner" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{
          width: '56px',
          height: '56px',
          background: 'var(--color-lila-100)',
          color: 'var(--color-lila-dark)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          {mode === 'register' ? <UserPlus size={26} /> : <Lock size={26} />}
        </div>

        {/* Pestañas Iniciar Sesión / Registrarse */}
        <div style={{
          display: 'flex',
          background: 'var(--color-crema-dark, #F2EFE9)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.25rem',
          border: '1px solid var(--color-crema-border)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? 'var(--color-lila-dark)' : 'var(--text-muted)',
              fontWeight: mode === 'login' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <LogIn size={15} /> Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'register' ? '#FFFFFF' : 'transparent',
              color: mode === 'register' ? 'var(--color-lila-dark)' : 'var(--text-muted)',
              fontWeight: mode === 'register' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <UserPlus size={15} /> Registrarse
          </button>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.85rem',
          color: 'var(--color-lila-dark)',
          marginBottom: '0.4rem'
        }}>
          {mode === 'register' ? 'Creá tu cuenta' : CONTENT.auth.title}
        </h1>

        <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
          {mode === 'register' 
            ? 'Elegí quién sos y creá tu contraseña para entrar juntos a nuestro rincón.' 
            : CONTENT.auth.subtitle}
        </p>

        {errorMsg && (
          <div style={{
            background: '#FFE8EC',
            color: '#B00020',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
            textAlign: 'left',
            lineHeight: 1.4
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '0.5rem' }}>
              {mode === 'register' ? '¿Quién se está registrando?' : '¿Quién está ingresando hoy?'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setChosenRole('nerea')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: chosenRole === 'nerea' ? '2px solid var(--color-lila-primary)' : '1px solid var(--color-crema-border)',
                  background: chosenRole === 'nerea' ? 'var(--color-user-nerea-bg)' : '#FFFFFF',
                  color: chosenRole === 'nerea' ? 'var(--color-user-nerea)' : 'var(--text-body)',
                  fontWeight: chosenRole === 'nerea' ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>💜</span> Soy Nerea
              </button>

              <button
                type="button"
                onClick={() => setChosenRole('lucas')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: chosenRole === 'lucas' ? '2px solid var(--color-user-lucas)' : '1px solid var(--color-crema-border)',
                  background: chosenRole === 'lucas' ? 'var(--color-user-lucas-bg)' : '#FFFFFF',
                  color: chosenRole === 'lucas' ? 'var(--color-user-lucas)' : 'var(--text-body)',
                  fontWeight: chosenRole === 'lucas' ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>🖤</span> Soy Lucas
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-crema-border)',
                background: '#FFFFFF',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-body)', display: 'block', marginBottom: '0.35rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Elegí una contraseña (mínimo 6 caracteres)' : 'Tu contraseña secreta'}
              required
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-crema-border)',
                background: '#FFFFFF',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="continue-site-btn"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '0.5rem',
              padding: '0.85rem'
            }}
          >
            {submitting 
              ? (mode === 'register' ? 'Creando cuenta...' : 'Ingresando...') 
              : (mode === 'register' ? 'Crear mi cuenta y entrar' : CONTENT.auth.loginButton)}
          </button>
        </form>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginTop: '1.25rem',
          lineHeight: 1.4
        }}>
          {mode === 'login' ? (
            <>
              ¿Todavía no creaste tu usuario?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-lila-dark)',
                  fontWeight: '600',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Registrate acá
              </button>
            </>
          ) : (
            <>
              ¿Ya tenías cuenta?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-lila-dark)',
                  fontWeight: '600',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Iniciá sesión acá
              </button>
            </>
          )}
        </p>

        {/* Acceso rápido de ayuda */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px dashed var(--color-crema-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Acceso rápido de prueba local:
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fillQuickLogin('nerea')}
              className="user-badge nerea"
              style={{ padding: '0.4rem 0.85rem', cursor: 'pointer' }}
            >
              💜 Probar con Nerea
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('lucas')}
              className="user-badge lucas"
              style={{ padding: '0.4rem 0.85rem', cursor: 'pointer' }}
            >
              🖤 Probar con Lucas
            </button>
          </div>
        </div>

        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: '1.25rem',
          lineHeight: 1.4
        }}>
          {CONTENT.auth.sessionPersistNotice}
        </p>
      </div>
    </div>
  );
}
