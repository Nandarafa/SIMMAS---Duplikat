'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, LogOut, Search, Bell, Menu, X, LayoutDashboard, Users, Building2, FileText, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UniversalNavbarProps {
  userRole?: 'admin' | 'guru' | 'siswa';
}

export default function UniversalNavbar({ userRole }: UniversalNavbarProps = {}) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const basePath = userRole ? `/dashboard/${userRole}` : '/dashboard';
  const menuItems = userRole === 'admin'
    ? [{ href: basePath, label: 'Dashboard', icon: LayoutDashboard }, { href: '#siswa', label: 'Data Siswa', icon: Users }, { href: '#guru', label: 'Data Guru', icon: Users }, { href: '#dudi', label: 'Mitra DUDI', icon: Building2 }, { href: '#laporan', label: 'Laporan', icon: FileText }]
    : userRole === 'guru'
      ? [{ href: basePath, label: 'Dashboard', icon: LayoutDashboard }, { href: '#siswa', label: 'Siswa Bimbingan', icon: Users }, { href: '#jurnal', label: 'Review Jurnal', icon: FileText }, { href: '#absensi', label: 'Absensi', icon: CalendarCheck }]
      : [];

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      router.push('/');
    }, 2000);
  };

  const getRoleBadgeColor = () => {
    switch (currentUser?.role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'guru': return 'bg-emerald-100 text-emerald-700';
      case 'siswa': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleLabel = () => {
    switch (currentUser?.role) {
      case 'admin': return 'Administrator';
      case 'guru': return 'Guru Pembimbing';
      case 'siswa': return 'Siswa';
      default: return 'User';
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <b className="text-lg block leading-none">SIMMAS</b>
              <small className="text-[10px] text-slate-400">SMK Negeri 1 Surabaya</small>
            </div>
          </Link>

          {menuItems.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 ml-8">
              {menuItems.map(({ href, label, icon: Icon }, index) => (
                <Link key={label} href={href} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${index === 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                  <Icon className="h-3.5 w-3.5" />{label}
                </Link>
              ))}
            </div>
          )}

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {menuItems.length > 0 && <button onClick={() => setMobileOpen((value) => !value)} className="lg:hidden p-2 rounded-lg hover:bg-slate-50" aria-label="Buka menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>}
            {/* Search (Optional) */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-50 rounded-lg transition">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{currentUser?.name || 'User'}</p>
                <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </p>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && menuItems.length > 0 && (
        <div className="lg:hidden sticky top-[61px] z-20 bg-white border-b border-slate-200 px-5 py-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map(({ href, label, icon: Icon }) => <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600"><Icon className="h-4 w-4 text-blue-600" />{label}</Link>)}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-center text-slate-800">Konfirmasi Keluar</h3>
              <p className="text-sm text-slate-500 text-center mt-2">
                Apakah Anda yakin ingin keluar dari akun SIMMAS Anda?
              </p>
            </div>

            {loggingOut ? (
              <div className="px-6 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-semibold text-slate-800">Keluar dari sistem...</p>
                  <p className="text-sm text-slate-500 mt-1">Mohon tunggu sebentar</p>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition"
                >
                  Ya, Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
