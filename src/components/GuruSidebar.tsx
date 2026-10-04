'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, LayoutDashboard, Users, BookOpen, MapPin, LogOut, FileCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface GuruSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/dashboard/guru', label: 'Dashboard', icon: LayoutDashboard, section: 'OVERVIEW' },
  { href: '/dashboard/guru/pengajuan', label: 'Pengajuan Tempat', icon: FileCheck, section: 'BIMBINGAN' },
  { href: '/dashboard/guru/siswa', label: 'Siswa Bimbingan', icon: Users, section: 'BIMBINGAN' },
  { href: '/dashboard/guru/jurnal', label: 'Jurnal & Absensi', icon: BookOpen, section: 'BIMBINGAN' },
  { href: '/dashboard/guru/kunjungan', label: 'Kunjungan Lapangan', icon: MapPin, section: 'BIMBINGAN' },
];

export default function GuruSidebar({ collapsed, onToggle }: GuruSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard/guru') return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    setShowModal(false);
    setLoggingOut(true);
    // Simulate validation & logout process
    setTimeout(() => { 
      logout(); 
      router.push('/'); 
    }, 3000); // 3 detik loading untuk validasi
  };

  const sections = ['OVERVIEW', 'BIMBINGAN'];

  return (
    <>
      {/* ── Logout overlay - with validation ── */}
      {loggingOut && (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-[28px] bg-blue-600 flex items-center justify-center shadow-xl mx-auto relative">
              <GraduationCap className="h-10 w-10 text-white" />
              <div className="absolute -right-1 -bottom-1 h-7 w-7 rounded-full bg-red-500 flex items-center justify-center border-4 border-slate-50">
                <LogOut className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-red-600 font-semibold text-sm">Mengakhiri Sesi</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Keluar dari Sistem...</h2>
          <p className="text-sm text-slate-500 mb-6">Mohon tunggu sebentar, sedang membersihkan sesi dan mengalihkan Anda.</p>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 text-xs text-slate-400">Validasi logout...</span>
          </div>
        </div>
      )}

      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? 'w-[64px]' : 'w-[220px]'
        }`}
      >
        {/* Logo */}
        <div className={`border-b border-slate-100 px-4 py-4 flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <Link href="/dashboard/guru" className="flex items-center gap-2.5 min-w-0" title="SIMMAS">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <b className="text-base block leading-none tracking-wide whitespace-nowrap">SIMMAS</b>
                <small className="text-[10px] text-slate-400 font-medium tracking-wide whitespace-nowrap">PEMBIMBING</small>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
          {sections.map((section) => (
            <div key={section} className="mb-4">
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">{section}</p>
              )}
              <div className="space-y-0.5">
                {navItems.filter(item => item.section === section).map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    title={label}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${collapsed ? 'justify-center' : ''} ${
                      isActive(href)
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className={`border-t border-slate-100 p-3 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser?.name?.charAt(0) || 'G'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{currentUser?.name || 'Guru Pembimbing'}</p>
                <p className="text-[11px] text-slate-400 truncate">@{currentUser?.username || 'guru'}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            title="Keluar Akun"
            className={`flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all ${
              collapsed ? 'w-10 h-10 px-0' : 'w-full'
            }`}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && 'Keluar Akun'}
          </button>
        </div>
      </aside>

      {/* Logout confirm modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Konfirmasi Keluar</h3>
              <p className="text-sm text-slate-500 mt-2">Apakah Anda yakin ingin keluar dari akun SIMMAS Anda?</p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">Batal</button>
              <button onClick={handleLogout} className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
