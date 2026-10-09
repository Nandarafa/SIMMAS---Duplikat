/**
 * ============================================================================
 * layout.tsx - Root Layout (Server Component)
 * ============================================================================
 * 
 * FUNGSI:
 * - Root layout yang wrap semua pages di aplikasi
 * - Setup font Inter dari Google Fonts
 * - Metadata untuk SEO (title, description)
 * - Wrap dengan AuthProvider untuk global state
 * 
 * CARA KERJA:
 * Setiap page otomatis di-wrap dengan layout ini:
 * <RootLayout>
 *   <AuthProvider>
 *     <YourPage />
 *   </AuthProvider>
 * </RootLayout>
 * 
 * CARA MENGUBAH:
 * - Ganti font: Import font lain dari 'next/font/google'
 * - Ubah metadata: Edit object metadata
 * - Tambah global provider: Wrap children dengan provider baru
 * - Tambah global components: Tambahkan sebelum/sesudah {children}
 * 
 * PENTING:
 * - File ini adalah Server Component (tidak bisa use useState/useEffect)
 * - AuthProvider adalah 'use client' component, jadi bisa wrap client logic
 * - Metadata hanya bisa di-set di layout/page Server Components
 * 
 * ============================================================================
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import '../styles/animations.css';
import { AuthProvider } from '@/context/AuthContext';

// Setup Inter font dari Google Fonts
// subsets: ['latin'] = hanya load karakter latin (lebih cepat)
const inter = Inter({ subsets: ['latin'] });

/**
 * metadata - SEO metadata untuk aplikasi
 * 
 * Muncul di:
 * - Browser tab title
 * - Search engine results
 * - Social media previews
 * 
 * Cara tambah meta tags:
 * - OpenGraph: untuk Facebook/LinkedIn preview
 * - Twitter: untuk Twitter card
 * - Icons: untuk favicon
 */
export const metadata: Metadata = {
  title: 'SIMMAS - Sistem Informasi Manajemen Magang Siswa',
  description: 'Platform terpusat pengelolaan magang SMK. Mudah, modern, dan efisien untuk Siswa, Guru, dan Admin.',
};

/**
 * RootLayout - Root layout component
 * 
 * STRUCTURE:
 * <html> - Set lang="id" dan font class
 *   <body> - Min height full screen
 *     <AuthProvider> - Global state management
 *       {children} - Page content dinamis
 * 
 * PROPS:
 * - children: React nodes (pages yang di-render)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.className} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* AuthProvider wrap semua pages dengan access ke auth context */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
