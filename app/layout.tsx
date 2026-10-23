// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import PwaRegister from '@/components/pwa/PwaRegister';
import './globals.css';

// Cargamos la tipografía Inter oficial de Smoke Studios
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CotizaExpress | Smoke Studios',
  description: 'Infraestructura ágil de cotización en terreno para contratistas.',
  applicationName: 'CotizaExpress',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CotizaExpress',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${inter.className}`}>
      <body className="bg-[#000000] text-zinc-100 antialiased min-h-screen">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}