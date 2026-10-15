import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { TOTAL_FROGS, FROGS_CONFIG } from '../config/frogs';
import confetti from 'canvas-confetti';

const FrogsContext = createContext(null);

export function FrogsProvider({ children }) {
  const { user } = useAuth();
  const [foundKeys, setFoundKeys] = useState(new Set());
  const [lastFoundFrog, setLastFoundFrog] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar ranas encontradas desde Supabase (o de localStorage en fallback)
  useEffect(() => {
    let isMounted = true;

    async function loadFoundFrogs() {
      // 1. Cargar desde localStorage primero para respuesta instantánea
      const localSaved = localStorage.getItem('pagina_amor_frogs_found');
      if (localSaved) {
        try {
          const keysArray = JSON.parse(localSaved);
          if (Array.isArray(keysArray) && isMounted) {
            setFoundKeys(new Set(keysArray));
          }
        } catch (e) {
          console.warn('Error al leer ranas locales:', e);
        }
      }

      // 2. Si hay usuario autenticado, consultar Supabase
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('frogs_found')
            .select('frog_key');

          if (!error && data && isMounted) {
            const dbKeys = new Set(data.map(item => item.frog_key));
            setFoundKeys(prev => {
              const merged = new Set([...prev, ...dbKeys]);
              localStorage.setItem('pagina_amor_frogs_found', JSON.stringify(Array.from(merged)));
              return merged;
            });
          }
        } catch (err) {
          console.warn('Error consultando Supabase frogs_found:', err);
        }
      }

      if (isMounted) setLoading(false);
    }

    loadFoundFrogs();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Registrar una rana como encontrada
  const findFrog = async (frog) => {
    if (!frog?.id || foundKeys.has(frog.id)) return;

    // Actualizar estado local
    const newFound = new Set(foundKeys);
    newFound.add(frog.id);
    setFoundKeys(newFound);
    localStorage.setItem('pagina_amor_frogs_found', JSON.stringify(Array.from(newFound)));

    setLastFoundFrog(frog);

    // Pequeño festejo con confeti sutil de ranitas verdes
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#52B788', '#B7E4C7', '#A06CD5']
    });

    // Guardar en Supabase si hay sesión
    if (user?.id) {
      try {
        await supabase
          .from('frogs_found')
          .insert({
            frog_key: frog.id,
            user_id: user.id
          });
      } catch (err) {
        console.warn('Error guardando rana en Supabase:', err);
      }
    }

    // Si completó las 30 ranas, abrimos el cupón y mega festejo!
    if (newFound.size >= TOTAL_FROGS) {
      setTimeout(() => {
        setShowCouponModal(true);
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FF5A79', '#A06CD5', '#E9C46A', '#52B788']
        });
      }, 700);
    }
  };

  const isFrogFound = (frogId) => foundKeys.has(frogId);

  return (
    <FrogsContext.Provider value={{
      foundKeys,
      foundCount: foundKeys.size,
      totalFrogs: TOTAL_FROGS,
      isFrogFound,
      findFrog,
      lastFoundFrog,
      setLastFoundFrog,
      showCouponModal,
      setShowCouponModal,
      loading
    }}>
      {children}
    </FrogsContext.Provider>
  );
}

export function useFrogs() {
  const context = useContext(FrogsContext);
  if (!context) {
    throw new Error('useFrogs debe ser usado dentro de FrogsProvider');
  }
  return context;
}
