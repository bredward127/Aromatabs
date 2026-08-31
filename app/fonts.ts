import localFont from 'next/font/local';

// Self-hosted. Nothing here touches a third-party font CDN, and the files are
// subset to latin by build/make_webfonts.py - four faces, 79KB total.

export const display = localFont({
  src: [
    { path: './fonts/source-serif-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-serif-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['ui-serif', 'Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

export const body = localFont({
  src: [
    { path: './fonts/source-sans-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-sans-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
