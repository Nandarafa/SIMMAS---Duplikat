'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, ChevronDown, LayoutDashboard, LogOut, Lock, Settings, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const SEARCH_ITEMS = [
  { label: 'Dashboard Admin', sub: 'Utama', icon: LayoutDashboard, href: '/dashboard/admin', color: 'bg-blue-100 text-blue-600' },
  { label: 'Manajemen Siswa', sub: 'Data Master', icon: LayoutDashboard, href: '/dashboard/admin/siswa', color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Manajemen Guru', sub: 'Data Master', icon: LayoutDashboard, href: '/dashboard/admin/guru', color: 'bg-violet-100 text-violet-600' },
  { label: 'Manajemen DUDI', sub: 'Data Master', icon: LayoutDashboard, href: '/dashboard/admin/dudi', color: 'bg-amber-100 text-amber-600' },
  { label: 'Penempatan Magang', sub: 'Pemetaan', icon: LayoutDashboard, href: '/dashboard/admin/penempatan', color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Monitoring Siswa', sub: 'Laporan', icon: LayoutDashboard, href: '/dashboard/admin/monitoring', color: 'bg-rose-100 text-rose-600' },
  { label: 'Pengaturan Sistem', sub: 'Konfigurasi', icon: Settings, href: '/dashboard/admin/pengaturan', color: 'bg-slate-100 text-slate-600' },
];

export default function AdminHeader({ title, sidebarCollapsed, onToggleSidebar }: AdminHeaderProps) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(v => !v); setSearchQuery(''); }
      if (e.key === 'Escape') { setSearchOpen(false); setShowNotif(false); setShowProfile(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSearch = searchQuery.trim()
    ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.sub.toLowerCase().includes(searchQuery.toLowerCase()))
    : SEARCH_ITEMS;

  const handleLogout = () => {
    setShowProfile(false);
    setLoggingOut(true);
    setTimeout(() => { logout(); router.push('/'); }, 3000);
  };

  if (loggingOut) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center">
        <div className="mb-8">
          <div className="h-20 w-20 rounded-[28px] bg-blue-600 flex items-center justify-center shadow-xl mx-auto relative">
            <LayoutDashboard className="h-10 w-10 text-white" />
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
    );
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-150"
            title={sidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <LayoutDashboard className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <span className="text-sm font-semibold text-slate-800 truncate">{title}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search button */}
          <button
            onClick={() => { setSearchOpen(true); setSearchQuery(''); }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-400 bg-slate-50 hover:bg-white hover:border-slate-300 transition min-w-[140px]"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Cari...</span>
            <kbd className="ml-auto text-[10px] bg-white border border-slate-200 rounded px-1 font-mono">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white" />
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-700">AKTIVITAS &amp; NOTIFIKASI</span>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">3 item</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'Pengajuan Magang Siswa', desc: 'Periksa dan tindak lanjuti pengajuan magang', color: 'bg-blue-100 text-blue-600', href: '/dashboard/admin/penempatan' },
                    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Monitoring Siswa & DUDI', desc: 'Pantau rekap kehadiran dan jurnal harian', color: 'bg-emerald-100 text-emerald-600', href: '/dashboard/admin/monitoring' },
                    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Audit Trail Sistem', desc: 'Tinjau log aktivitas dan riwayat mutasi data', color: 'bg-violet-100 text-violet-600', href: '/dashboard/admin/log' },
                  ].map(({ icon, title: t, desc, color, href }) => (
                    <button key={t} onClick={() => { setShowNotif(false); router.push(href); }} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition">
                      <div className={`mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(v => !v); setShowNotif(false); }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition"
            >
              <div className="h-7 w-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">Admin</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      {currentUser?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{currentUser?.name || 'Administrator'}</p>
                      <p className="text-xs text-slate-500 truncate">@{currentUser?.username || 'admin'}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Administrator
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button onClick={() => { setShowProfile(false); router.push('/dashboard/admin/pengaturan'); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <Settings className="h-4 w-4 text-slate-400" />Pengaturan Sistem
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                    <LogOut className="h-4 w-4" />Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search palette */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ketik halaman atau menu yang dituju..."
                className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="py-1">
              {filteredSearch.map(({ label, sub, icon: Icon, href, color }) => (
                <button key={href} onClick={() => { setSearchOpen(false); router.push(href); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <span className="text-[11px] border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 shrink-0">Buka</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-400">Gunakan panah atau klik untuk memilih</span>
              <span className="text-xs border border-slate-200 bg-white text-slate-500 rounded px-1.5 py-0.5 font-mono">ESC untuk keluar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
