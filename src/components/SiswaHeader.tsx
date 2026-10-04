'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  KeyRound,
  LogOut,
  Bell,
  X,
  CalendarCheck,
  BookOpen,
  Send,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SiswaHeaderProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

/* ── Search palette items ── */
const SEARCH_ITEMS = [
  { label: 'Dashboard Siswa', sub: 'Utama', icon: LayoutDashboard, href: '/dashboard/siswa', color: 'bg-blue-100 text-blue-600' },
  { label: 'Pengajuan Tempat Magang', sub: 'Pra-Magang', icon: Send, href: '/dashboard/siswa/pengajuan', color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Absensi Harian', sub: 'Aktivitas Harian', icon: CalendarCheck, href: '/dashboard/siswa/absensi', color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Jurnal Kegiatan Harian', sub: 'Aktivitas Harian', icon: BookOpen, href: '/dashboard/siswa/jurnal', color: 'bg-violet-100 text-violet-600' },
];

/* ── Notifications ── */
const NOTIFICATIONS = [
  { icon: CalendarCheck, title: 'Absensi Hari Ini', desc: 'Lakukan absen masuk dan pulang magang', color: 'bg-emerald-100 text-emerald-600', href: '/dashboard/siswa/absensi' },
  { icon: BookOpen, title: 'Jurnal Kegiatan Harian', desc: 'Laporkan aktivitas dan kendala harian Anda', color: 'bg-violet-100 text-violet-600', href: '/dashboard/siswa/jurnal' },
  { icon: Building2, title: 'Status Penempatan', desc: 'Periksa status pengajuan dan guru pembimbi...', color: 'bg-blue-100 text-blue-600', href: '/dashboard/siswa/pengajuan' },
];

export default function SiswaHeader({ title, sidebarCollapsed, onToggleSidebar }: SiswaHeaderProps) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Search palette
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── click-outside ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── keyboard shortcut ⌘K / Ctrl+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
        setSearchQuery('');
      }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const filteredSearch = searchQuery.trim()
    ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.sub.toLowerCase().includes(searchQuery.toLowerCase()))
    : SEARCH_ITEMS;

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    setLoggingOut(true);
    // Simulate validation & logout process
    setTimeout(() => { 
      logout(); 
      router.push('/'); 
    }, 3000); // 3 detik loading untuk validasi
  };

  const handleSavePassword = () => {
    if (newPassword.length < 6) { setPasswordError('Minimal 6 karakter'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Kata sandi tidak cocok'); return; }
    setPasswordError('');
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'SM';

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
        {/* Left: toggle + title */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Sidebar toggle button — matches screenshot: rounded square with panel icon */}
          <button
            onClick={onToggleSidebar}
            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-150"
            title={sidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {sidebarCollapsed
              ? <PanelLeftOpen className="h-4 w-4" />
              : <PanelLeftClose className="h-4 w-4" />
            }
          </button>
          {/* Page icon + title */}
          <LayoutDashboard className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <span className="text-sm font-semibold text-slate-800 truncate">{title}</span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search button → opens palette */}
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
              onClick={() => { setNotifOpen(v => !v); setDropdownOpen(false); }}
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-700">AKTIVITAS &amp; NOTIFIKASI</span>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{NOTIFICATIONS.length} item</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {NOTIFICATIONS.map(({ icon: Icon, title: t, desc, color, href }) => (
                    <button
                      key={t}
                      onClick={() => { setNotifOpen(false); router.push(href); }}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition"
                    >
                      <div className={`mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="h-4 w-4" />
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition"
            >
              <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {initials}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">Siswa</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{currentUser?.name || 'Siswa Magang'}</p>
                      <p className="text-xs text-slate-500 truncate">@{currentUser?.username || currentUser?.nip_nisn || 'siswa'}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Peserta Magang
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); setShowPasswordModal(true); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <KeyRound className="h-4 w-4 text-slate-400" />Ubah Kata Sandi
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4" />Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Command-palette search overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
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
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="py-1">
              {filteredSearch.map(({ label, sub, icon: Icon, href, color }) => (
                <button
                  key={href}
                  onClick={() => { setSearchOpen(false); router.push(href); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left"
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <span className="text-[11px] border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 shrink-0">Buka</span>
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-400">Gunakan panah atau klik untuk memilih</span>
              <span className="text-xs border border-slate-200 bg-white text-slate-500 rounded px-1.5 py-0.5 font-mono">ESC untuk keluar</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Password modal ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Ubah Kata Sandi</h3>
                  <p className="text-xs text-slate-500">Perbarui kata sandi akun Anda.</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400"><X className="h-4 w-4" /></button>
            </div>
            <label className="text-xs font-semibold text-slate-600">Kata Sandi Baru</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" className="mt-1 mb-3 w-full px-3 py-2.5 rounded-xl border border-blue-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            <label className="text-xs font-semibold text-slate-600">Ulangi Kata Sandi Baru</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ketik ulang kata sandi baru" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            {passwordError && <p className="text-xs text-red-600 mt-2">{passwordError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700">Batal</button>
              <button onClick={handleSavePassword} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logout confirm ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Konfirmasi Keluar</h3>
            <p className="text-sm text-slate-500 mb-5">Apakah Anda yakin ingin keluar dari akun SIMMAS Anda?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium">Batal</button>
              <button onClick={handleConfirmLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
