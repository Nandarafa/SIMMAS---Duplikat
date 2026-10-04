'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, CheckCircle2, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRedirect() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [dots, setDots] = useState('');

  // Animate the loading dots
  useEffect(() => {
    const t = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    const target =
      currentUser.role === 'admin' ? '/dashboard/admin'
      : currentUser.role === 'guru' ? '/dashboard/guru'
      : '/dashboard/siswa';

    const t = setTimeout(() => router.push(target), 800);
    return () => clearTimeout(t);
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb]">
      {/* Logo with pulse ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-[28px] bg-blue-100 animate-ping opacity-40" />
        <div className="relative h-20 w-20 rounded-[24px] bg-white shadow-xl flex items-center justify-center">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Status label */}
      <div className="flex items-center gap-1.5 text-blue-600 mb-3">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-semibold">Autentikasi Berhasil</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
        Mengalihkan ke Dashboard{dots}
      </h2>
      <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
        Mohon tunggu sebentar, sedang menyiapkan data dashboard Anda.
      </p>

      {/* Spinner pill */}
      <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5 text-sm text-slate-500 shadow-sm">
        <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
        Memuat halaman...
      </div>
    </div>
  );
}
