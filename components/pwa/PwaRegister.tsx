// components/pwa/PwaRegister.tsx
'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('CotizaExpress PWA registrada con éxito:', reg.scope);
          })
          .catch((err) => {
            console.error('Error registrando PWA:', err);
          });
      });
    }
  }, []);

  return null;
}