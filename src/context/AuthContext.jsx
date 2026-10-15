import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga o recupera el perfil de usuario desde Supabase, o lo auto-sincroniza
  const fetchProfile = async (userId, userEmail, preferredIdentity = null) => {
    try {
      const emailLower = (userEmail || '').toLowerCase();
      const storedRole = localStorage.getItem('pagina_amor_active_role');
      
      // Determinar la identidad deseada: 1. Explícita, 2. LocalStorage, 3. Email, 4. Por defecto Nerea
      let targetRole = preferredIdentity || storedRole;
      if (!targetRole) {
        if (emailLower.includes('lucas')) {
          targetRole = 'lucas';
        } else {
          // Si es Nerea o cualquier otro email, la destinataria del regalo es Nerea
          targetRole = 'nerea';
        }
      }

      const isTargetNerea = targetRole.toLowerCase() === 'nerea';

      // 1. Intentar leer el perfil existente de Supabase
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && data.display_name) {
        // Si el usuario eligió explícitamente un rol o cambió de rol, sincronizamos la base
        if (preferredIdentity && data.display_name.toLowerCase() !== targetRole.toLowerCase()) {
          const updatedProfile = {
            id: userId,
            display_name: isTargetNerea ? 'Nerea' : 'Lucas',
            nickname: isTargetNerea ? 'Porfiada' : null,
            color: isTargetNerea ? '#9B5DE5' : '#1E1B18'
          };
          try {
            await supabase.from('profiles').upsert(updatedProfile);
          } catch (e) {}
          localStorage.setItem('pagina_amor_active_role', targetRole);
          setProfile(updatedProfile);
          return updatedProfile;
        }

        setProfile(data);
        localStorage.setItem('pagina_amor_active_role', data.display_name.toLowerCase());
        return data;
      }

      // 2. Si no existe en la base, creamos el perfil con la identidad resuelta
      const resolvedProfile = {
        id: userId,
        display_name: isTargetNerea ? 'Nerea' : 'Lucas',
        nickname: isTargetNerea ? 'Porfiada' : null,
        color: isTargetNerea ? '#9B5DE5' : '#1E1B18'
      };

      try {
        await supabase.from('profiles').upsert(resolvedProfile);
      } catch (upsertErr) {
        console.warn('No se pudo auto-guardar el perfil en Supabase (verificar RLS):', upsertErr);
      }

      localStorage.setItem('pagina_amor_active_role', isTargetNerea ? 'nerea' : 'lucas');
      setProfile(resolvedProfile);
      return resolvedProfile;
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Obtener sesión activa de Supabase
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        localStorage.removeItem('pagina_amor_demo_user');
        setUser(session.user);
        const storedRole = localStorage.getItem('pagina_amor_active_role');
        await fetchProfile(session.user.id, session.user.email, storedRole);
      } else {
        const savedDemo = localStorage.getItem('pagina_amor_demo_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } catch (e) {
            localStorage.removeItem('pagina_amor_demo_user');
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        localStorage.removeItem('pagina_amor_demo_user');
        setUser(session.user);
        const storedRole = localStorage.getItem('pagina_amor_active_role');
        await fetchProfile(session.user.id, session.user.email, storedRole);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('pagina_amor_demo_user');
        localStorage.removeItem('pagina_amor_active_role');
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Iniciar sesión con Supabase Auth garantizando el rol seleccionado
  const login = async (email, password, chosenRole = null) => {
    setLoading(true);
    try {
      if (chosenRole) {
        localStorage.setItem('pagina_amor_active_role', chosenRole);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setLoading(false);
        return { data: null, error };
      }

      localStorage.removeItem('pagina_amor_demo_user');
      setUser(data.user);
      
      const roleToUse = chosenRole || localStorage.getItem('pagina_amor_active_role');
      await fetchProfile(data.user.id, data.user.email, roleToUse);
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Permite alternar manualmente entre Lucas y Nerea en cualquier momento
  const switchIdentity = async (newRole) => {
    const isNereaRole = newRole.toLowerCase() === 'nerea';
    const updated = {
      id: user?.id || profile?.id || '00000000-0000-0000-0000-000000000001',
      display_name: isNereaRole ? 'Nerea' : 'Lucas',
      nickname: isNereaRole ? 'Porfiada' : null,
      color: isNereaRole ? '#9B5DE5' : '#1E1B18'
    };

    localStorage.setItem('pagina_amor_active_role', isNereaRole ? 'nerea' : 'lucas');
    setProfile(updated);

    if (user?.id) {
      try {
        await supabase.from('profiles').upsert(updated);
      } catch (err) {
        console.warn('No se pudo actualizar perfil en Supabase:', err);
      }
    }
  };

  // Registrar nueva cuenta privada en Supabase Auth
  const signUp = async (email, password, chosenRole = 'nerea') => {
    setLoading(true);
    try {
      if (chosenRole) {
        localStorage.setItem('pagina_amor_active_role', chosenRole);
      }

      const isNereaRole = chosenRole.toLowerCase() === 'nerea';
      const displayName = isNereaRole ? 'Nerea' : 'Lucas';
      const nickname = isNereaRole ? 'Porfiada' : null;
      const color = isNereaRole ? '#9B5DE5' : '#1E1B18';

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            display_name: displayName,
            nickname: nickname,
            color: color,
            role: chosenRole
          }
        }
      });

      if (error) {
        setLoading(false);
        return { data: null, error };
      }

      if (data?.user) {
        localStorage.removeItem('pagina_amor_demo_user');
        setUser(data.user);

        const newProfile = {
          id: data.user.id,
          display_name: displayName,
          nickname: nickname,
          color: color
        };

        try {
          await supabase.from('profiles').upsert(newProfile);
        } catch (upsertErr) {
          console.warn('Error al auto-crear perfil tras registro:', upsertErr);
        }

        setProfile(newProfile);
      }

      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const logout = async () => {
    localStorage.removeItem('pagina_amor_demo_user');
    localStorage.removeItem('pagina_amor_active_role');
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
  };

  // Identidad reactiva garantizada
  const activeRoleName = profile?.display_name?.toLowerCase();
  const storedRole = localStorage.getItem('pagina_amor_active_role');

  const isNerea =
    profile?.nickname === 'Porfiada' ||
    activeRoleName === 'nerea' ||
    storedRole === 'nerea';

  const isLucas = !isNerea;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isNerea,
      isLucas,
      login,
      signUp,
      logout,
      switchIdentity,
      fetchProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
