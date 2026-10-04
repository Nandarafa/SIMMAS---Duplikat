'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  CalendarCheck,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface SiswaSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const utamaItems = [
  { href: '/dashboard/siswa', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/siswa/pengajuan', label: 'Pengajuan Magang', icon: Send },
];
const kegiatanItems = [
  { href: '/dashboard/siswa/absensi', label: 'Absensi Harian', icon: CalendarCheck },
  { href: '/dashboard/siswa/jurnal', label: 'Jurnal Kegiatan', icon: BookOpen },
];

export default function SiswaSidebar({ collapsed, onToggle }: SiswaSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard/siswa') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? 'w-[64px]' : 'w-[232px]'
      }`}
    >
      {/* Logo row — no toggle button here, it lives in the header */}
      <div className={`flex items-center border-b border-slate-100 px-4 py-4 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <Link href="/dashboard/siswa" className="flex items-center gap-2.5 min-w-0" title="SIMMAS">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <b className="text-base block leading-none tracking-wide whitespace-nowrap">SIMMAS</b>
              <small className="text-[10px] text-slate-400 font-medium tracking-wide whitespace-nowrap">PESERTA MAGANG</small>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Utama</p>
        )}
        <div className="space-y-0.5 mb-4">
          {utamaItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''} ${
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

        {!collapsed && (
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Kegiatan Magang</p>
        )}
        <div className="space-y-0.5">
          {kegiatanItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''} ${
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
      </nav>
    </aside>
  );
}
