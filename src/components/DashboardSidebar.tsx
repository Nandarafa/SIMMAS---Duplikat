'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Award, BookOpen, Building2, CalendarCheck, FileText, GraduationCap, LayoutDashboard, LoaderCircle, LogOut, Settings, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/database';
import type { LucideIcon } from 'lucide-react';

type Props = { activeRole?: UserRole; activeTab?: string; setActiveTab?: (tab: string) => void };
type MenuItem = [string, string, LucideIcon];

export default function DashboardSidebar({ activeRole, activeTab = 'overview', setActiveTab }: Props) {
  const router = useRouter();
  const { currentUser, logout, loginAsRole } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const role = activeRole || currentUser?.role || 'siswa';
  const navigateRole = (nextRole: UserRole) => { loginAsRole(nextRole); router.push(`/dashboard/${nextRole}`); };
  const items: MenuItem[] = role === 'admin'
    ? [['overview', 'Overview & Statistik', LayoutDashboard], ['dudi', 'Manajemen DUDI', Building2], ['placements', 'Plotting Penempatan', FileText], ['users', 'Data Siswa & Guru', Users], ['reports', 'Laporan & Rekapitulasi', Award], ['settings', 'Pengaturan Sekolah', Settings]]
    : role === 'guru'
      ? [['overview', 'Dashboard Bimbingan', LayoutDashboard], ['journals', 'Verifikasi Jurnal Harian', BookOpen], ['attendances', 'Presensi Siswa', CalendarCheck], ['evaluations', 'Penilaian & Nilai PKL', Award]]
      : [['overview', 'Status & Beranda', LayoutDashboard], ['attendance', 'Presensi Harian', CalendarCheck], ['journal', 'Jurnal Kegiatan', BookOpen], ['pengajuan', 'Pengajuan Magang', FileText], ['placement', 'Info DUDI & Surat', Building2]];

  if (loggingOut) return <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-slate-50/95 px-6 backdrop-blur-sm"><div className="text-center"><div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 animate-[float_2.2s_ease-in-out_infinite]"><LogOut className="h-9 w-9" /></div><div className="mb-2 flex items-center justify-center gap-2 text-blue-600"><span className="font-bold">Logout berhasil</span><span className="h-2 w-2 rounded-full bg-emerald-500" /></div><h2 className="text-2xl font-extrabold text-slate-900">Mengamankan sesi Anda...</h2><p className="mt-2 text-sm text-slate-500">Anda akan diarahkan ke halaman login.</p><div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-slate-500 shadow-md"><LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />Keluar dari sistem...</div></div></div>;
  return <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col justify-between shrink-0 h-screen sticky top-0">
    <div>
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><GraduationCap className="h-5 w-5" /></div><div><b className="text-lg block leading-none">SIMMAS</b><small className="text-[10px] text-slate-400">SMK Negeri 1 Surabaya</small></div></Link>
        <div className="mt-4 px-3 py-1.5 rounded-xl bg-slate-50 border text-xs font-bold uppercase tracking-wider text-slate-700"><span className={`inline-block w-2 h-2 rounded-full mr-2 ${role === 'admin' ? 'bg-purple-600' : role === 'guru' ? 'bg-emerald-500' : 'bg-blue-600'}`} />{role} Portal</div>
      </div>
      {/* Removed "Ganti Peran" section for admin */}
      <nav className="p-4 space-y-1.5">{items.map(([key, label, Icon]) => <button key={key as string} onClick={() => setActiveTab?.(key as string)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left ${activeTab === key ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}><Icon className="h-4 w-4" /><span>{label as string}</span></button>)}</nav>
    </div>
    <div className="p-4 border-t"><div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">{currentUser?.name?.charAt(0) || 'U'}</div><div className="overflow-hidden"><p className="text-xs font-bold truncate">{currentUser?.name || 'Pengguna SIMMAS'}</p><p className="text-[11px] text-slate-400 truncate">@{currentUser?.username || 'user'}</p></div></div><button onClick={() => { setLoggingOut(true); window.setTimeout(() => { logout(); window.location.assign('/login'); }, 1000); }} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold hover:text-red-600"><LogOut className="h-3.5 w-3.5" />Keluar Akun</button></div>
  </aside>;
}
