import React, { useEffect, useState } from 'react';
import { getSignedPhotoUrl } from '../lib/supabase';
import { STORAGE_BUCKET } from '../config/photos';

export default function SignedImage({
  storagePath,
  fallbackUrl,
  alt = 'Foto de Lucas y Nerea',
  className = '',
  style = {}
}) {
  const [imgSrc, setImgSrc] = useState(fallbackUrl || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function resolveUrl() {
      if (!storagePath) {
        setImgSrc(fallbackUrl);
        setLoading(false);
        return;
      }

      const signed = await getSignedPhotoUrl(STORAGE_BUCKET, storagePath, 86400, fallbackUrl);
      if (isMounted) {
        setImgSrc(signed || fallbackUrl);
        setLoading(false);
      }
    }

    resolveUrl();

    return () => {
      isMounted = false;
    };
  }, [storagePath, fallbackUrl]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.3s ease'
      }}
      onError={() => {
        // Si la URL firmada falla o expiró, usamos el fallback local
        if (imgSrc !== fallbackUrl) {
          setImgSrc(fallbackUrl);
        }
      }}
      loading="lazy"
    />
  );
}
