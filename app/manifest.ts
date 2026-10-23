// app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CotizaExpress - Presupuestos en Terreno',
    short_name: 'CotizaExpress',
    description: 'Plataforma comercial y cotizaciones rápidas para contratistas y maestros en Chile.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'es-CL',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}