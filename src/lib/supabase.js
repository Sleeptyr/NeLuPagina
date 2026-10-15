import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-placeholder-key';

// Cliente Supabase con persistencia de sesión automática en localStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

// Cache en memoria para URLs firmadas (evita llamadas repetitivas innecesarias a la API de Storage)
const signedUrlCache = new Map();

/**
 * Obtiene una URL firmada para un recurso en un bucket privado de Supabase Storage.
 * @param {string} bucket - Nombre del bucket ('couple-photos')
 * @param {string} path - Nombre del archivo en el bucket
 * @param {number} expiresIn - Segundos de validez (por defecto 24 horas = 86400)
 * @param {string} fallbackUrl - URL local o imagen de respaldo si la consulta falla o no hay conexión
 */
export async function getSignedPhotoUrl(bucket, path, expiresIn = 86400, fallbackUrl = '') {
  if (!path) return fallbackUrl;

  const cacheKey = `${bucket}:${path}`;
  const cached = signedUrlCache.get(cacheKey);

  // Si ya tenemos una URL válida en caché y no está vencida (con margen de 5 minutos)
  if (cached && cached.expiresAt > Date.now() + 300000) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error || !data?.signedUrl) {
      // Si el bucket aún no existe o el archivo no se subió todavía en Supabase, usamos el fallback local
      console.warn(`[Supabase Storage] Usando fallback local para "${path}":`, error?.message || 'Sin URL');
      return fallbackUrl;
    }

    signedUrlCache.set(cacheKey, {
      url: data.signedUrl,
      expiresAt: Date.now() + (expiresIn * 1000)
    });

    return data.signedUrl;
  } catch (err) {
    console.warn(`[Supabase Storage] Error de conexión, usando fallback para "${path}":`, err);
    return fallbackUrl;
  }
}
