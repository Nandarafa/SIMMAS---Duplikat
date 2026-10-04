'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bell, Search, ChevronDown, LayoutDashboard, Users, BookOpen, MapPin,
  LogOut, Lock, Eye, EyeOff, X, CheckCircle2,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface GuruHeaderProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const SEARCH_ITEMS = [
  { label: 'Dashboard Guru', sub: 'Utama', icon: LayoutDashboard, href: '/dashboard/guru', color: 'bg-blue-100 text-blue-600' },
  { label: 'Daftar Siswa Bimbingan', sub: 'Bimbingan', icon: Users, href: '/dashboard/guru/siswa', color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Validasi Jurnal & Absensi', sub: 'Verifikasi', icon: BookOpen, href: '/dashboard/guru/jurnal', color: 'bg-amber-100 text-amber-600' },
  { label: 'Catatan Kunjungan DUDI', sub: 'Monitoring', icon: MapPin, href: '/dashboard/guru/kunjungan', color: 'bg-violet-100 text-violet-600' },
];

const NOTIFICATIONS = [
  { icon: BookOpen, title: 'Verifikasi Jurnal Kegiatan', desc: 'Validasi jurnal yang diunggah siswa bimbingan', color: 'bg-blue-100 text-blue-600', href: '/dashboard/guru/jurnal' },
  { icon: Users, title: 'Daftar Siswa & Penilaian', desc: 'Beri nilai akhir bagi siswa yang selesai magang', color: 'bg-emerald-100 text-emerald-600', href: '/dashboard/guru/siswa' },
  { icon: MapPin, title: 'Agenda Kunjungan DUDI', desc: 'Catat pelaksanaan supervisi dan visitasi', color: 'bg-amber-100 text-amber-600', href: '/dashboard/guru/kunjungan' },
];

export default function GuruHeader({ title, sidebarCollapsed, onToggleSidebar }: GuruHeaderProps) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwShow, setPwShow] = useState({ current: false, newPass: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* ── keyboard shortcuts ── */
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

  /* ── click-outside ── */
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

  const openPasswordModal = () => {
    setShowProfile(false);
    setPwForm({ current: '', newPass: '', confirm: '' });
    setPwError('');
    setPwSuccess(false);
    setShowPasswordModal(true);
  };

  const handleSavePassword = () => {
    if (!pwForm.current || !pwForm.newPass || !pwForm.confirm) { setPwError('Semua field harus diisi'); return; }
    if (pwForm.newPass.length < 6) { setPwError('Password baru minimal 6 karakter'); return; }
    if (pwForm.newPass !== pwForm.confirm) { setPwError('Konfirmasi password tidak cocok'); return; }
    setPwError('');
    setPwSuccess(true);
    setTimeout(() => { setShowPasswordModal(false); setPwSuccess(false); }, 2000);
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
        {/* Left: sidebar toggle + title */}
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

        {/* Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search — like siswa: "Cari... ⌘K" pill */}
          <button
            onClick={() => { setSearchOpen(true); setSearchQuery(''); }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-400 bg-slate-50 hover:bg-white hover:border-slate-300 transition min-w-[140px]"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Cari...</span>
            <kbd className="ml-auto text-[10px] bg-white border border-slate-200 rounded px-1 font-mono">⌘K</kbd>
          </button>

          {/* Notif bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white" />
            </button>
            {showNotif && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-800">AKTIVITAS &amp; NOTIFIKASI</span>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{NOTIFICATIONS.length} item</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {NOTIFICATIONS.map(({ icon: Icon, title: t, desc, color, href }) => (
                    <button key={t} onClick={() => { setShowNotif(false); router.push(href); }} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition">
                      <div className={`mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon className="h-4 w-4" /></div>
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
              <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {currentUser?.name?.charAt(0) || 'G'}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">Guru</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {currentUser?.name?.charAt(0) || 'G'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{currentUser?.name || 'Guru Pembimbing'}</p>
                      <p className="text-xs text-slate-500 truncate">@{currentUser?.username || 'guru'}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Pembimbing
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button onClick={openPasswordModal} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <Lock className="h-4 w-4 text-slate-400" />Ubah Kata Sandi
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Search palette ── */}
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

      {/* ── Ubah Password Modal ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ubah Kata Sandi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Perbarui kata sandi akun Anda</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {pwSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-emerald-700 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />Password berhasil diubah!
                </div>
              )}
              {pwError && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{pwError}</p>}
              {(['current', 'newPass', 'confirm'] as const).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    {key === 'current' ? 'Password Saat Ini' : key === 'newPass' ? 'Password Baru' : 'Konfirmasi Password Baru'}
                  </label>
                  <div className="relative">
                    <input
                      type={pwShow[key] ? 'text' : 'password'}
                      value={pwForm[key]}
                      onChange={e => setPwForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={key === 'current' ? '••••••••' : key === 'newPass' ? 'Min. 6 karakter' : 'Ulangi password baru'}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                    />
                    <button type="button" onClick={() => setPwShow(prev => ({ ...prev, [key]: !prev[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {pwShow[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 flex gap-3 border-t border-slate-100">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">Batal</button>
              <button onClick={handleSavePassword} disabled={pwSuccess} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition disabled:opacity-60">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
