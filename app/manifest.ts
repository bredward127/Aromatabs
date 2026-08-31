import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.descriptor}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F3EEE4',
    theme_color: '#2E7D6F',
    icons: [
      { src: '/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/maskable-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
