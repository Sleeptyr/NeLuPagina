import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FrogsProvider } from './context/FrogsContext';
import Navbar from './components/Navbar';
import FrogCelebrationModal from './components/FrogCelebrationModal';
import CouponModal from './components/CouponModal';
import FloatingBackground from './components/FloatingBackground';

import Home from './pages/Home';
import Plans from './pages/Plans';
import Reviews from './pages/Reviews';
import Login from './pages/Login';

// Componente para proteger las rutas privadas
function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-lila-dark)',
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem'
      }}>
        Cargando nuestro rincón... 💜🐸
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <FrogCelebrationModal />
      <CouponModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FrogsProvider>
        <BrowserRouter>
          <FloatingBackground />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedLayout>
                  <Home />
                </ProtectedLayout>
              }
            />
            <Route
              path="/planes"
              element={
                <ProtectedLayout>
                  <Plans />
                </ProtectedLayout>
              }
            />
            <Route
              path="/resenas"
              element={
                <ProtectedLayout>
                  <Reviews />
                </ProtectedLayout>
              }
            />
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FrogsProvider>
    </AuthProvider>
  );
}
