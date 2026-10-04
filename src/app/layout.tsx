import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import '../styles/animations.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SIMMAS - Sistem Informasi Manajemen Magang Siswa',
  description: 'Platform terpusat pengelolaan magang SMK. Mudah, modern, dan efisien untuk Siswa, Guru, dan Admin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.className} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
