'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCheck, Building2, MapPin, Activity, Clock, ArrowRight } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';

/* ── Smooth SVG area+line chart (like the screenshot) ── */
function SmoothAreaChart({ placements }: { placements: any[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; month: string; v1: number; v2: number } | null>(null);

  const W = 460, H = 160, PAD = { t: 10, r: 10, b: 28, l: 10 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  // Calculate last 5 months from now
  const now = new Date();
  const monthData: { month: string; pengajuan: number; disetujui: number }[] = [];
  
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleDateString('id-ID', { month: 'short' });
    
    // Count placements created in this month
    const pengajuan = placements.filter(p => {
      if (!p.created_at) return false;
      const pDate = new Date(p.created_at);
      return pDate.getFullYear() === d.getFullYear() && pDate.getMonth() === d.getMonth();
    }).length;
    
    // Count approved placements in this month
    const disetujui = placements.filter(p => {
      if (!p.created_at) return false;
      const pDate = new Date(p.created_at);
      return pDate.getFullYear() === d.getFullYear() && 
             pDate.getMonth() === d.getMonth() && 
             (p.status === 'approved' || p.status === 'aktif');
    }).length;
    
    monthData.push({ month: monthName, pengajuan, disetujui });
  }

  const months = monthData.map(m => m.month);
  const series1 = monthData.map(m => m.pengajuan);
  const series2 = monthData.map(m => m.disetujui);
  const maxV = Math.max(...series1, ...series2, 1);

  const xOf = (i: number) => PAD.l + (i / (months.length - 1)) * cW;
  const yOf = (v: number) => PAD.t + cH - (v / maxV) * cH;

  // Catmull-Rom to cubic bezier smooth path
  const smooth = (pts: [number, number][]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  };

  const pts1: [number, number][] = months.map((_, i) => [xOf(i), yOf(series1[i])]);
  const pts2: [number, number][] = months.map((_, i) => [xOf(i), yOf(series2[i])]);

  const linePath1 = smooth(pts1);
  const linePath2 = smooth(pts2);

  const areaPath1 = linePath1 + ` L ${pts1[pts1.length - 1][0]} ${PAD.t + cH} L ${pts1[0][0]} ${PAD.t + cH} Z`;
  const areaPath2 = linePath2 + ` L ${pts2[pts2.length - 1][0]} ${PAD.t + cH} L ${pts2[0][0]} ${PAD.t + cH} Z`;

  // horizontal grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => PAD.t + cH - f * cH);

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-blue-200" />
          Pengajuan Masuk
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-blue-600" />
          Disetujui
        </div>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        className="overflow-visible"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridLines.map((y, i) => (
          <line key={i} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
        ))}

        {/* Area fills */}
        <path d={areaPath1} fill="url(#grad1)" />
        <path d={areaPath2} fill="url(#grad2)" />

        {/* Lines */}
        <path d={linePath1} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
        <path d={linePath2} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

        {/* X axis labels */}
        {months.map((m, i) => (
          <text key={m} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="11" fill="#94a3b8">{m}</text>
        ))}

        {/* Hover areas + dots */}
        {months.map((m, i) => (
          <g key={m}>
            {/* invisible wide hit area */}
            <rect
              x={xOf(i) - 24}
              y={PAD.t}
              width={48}
              height={cH}
              fill="transparent"
              onMouseEnter={() => setTooltip({ x: xOf(i), y: Math.min(pts1[i][1], pts2[i][1]) - 8, month: m, v1: series1[i], v2: series2[i] })}
            />
            {tooltip?.month === m && (
              <>
                {/* Vertical line */}
                <line x1={xOf(i)} y1={PAD.t} x2={xOf(i)} y2={PAD.t + cH} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
                {/* Dots */}
                <circle cx={pts1[i][0]} cy={pts1[i][1]} r="5" fill="white" stroke="#93c5fd" strokeWidth="2.5" />
                <circle cx={pts2[i][0]} cy={pts2[i][1]} r="5" fill="white" stroke="#2563eb" strokeWidth="2.5" />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs z-10"
          style={{ left: `${(tooltip.x / W) * 100}%`, top: `${(tooltip.y / H) * 100}%`, transform: 'translate(-50%, -110%)' }}
        >
          <p className="font-bold text-slate-700 mb-1">{tooltip.month}</p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="inline-block h-2 w-3 rounded-sm bg-blue-200" />
            Pengajuan Masuk<span className="font-bold text-slate-800 ml-1">{tooltip.v1}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
            <span className="inline-block h-2 w-3 rounded-sm bg-blue-600" />
            Disetujui<span className="font-bold text-slate-800 ml-1">{tooltip.v2}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { users, gurus, dudis, placements, journals } = useAuth();

  const totalSiswa = users.filter(u => u.role === 'siswa').length;
  const totalGuru = gurus.length; // Use gurus.length instead of filtering users
  const totalDudi = dudis.length;
  const pendingPlacements = placements.filter(p => p.status === 'pending');
  const approvedPlacements = placements.filter(p => p.status === 'approved' || p.status === 'aktif');

  const today = new Date();
  const dayName = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  // Status distribution
  const disetujui = placements.filter(p => p.status === 'approved' || p.status === 'aktif').length;
  const menunggu = placements.filter(p => p.status === 'pending').length;
  const ditolak = placements.filter(p => p.status === 'ditolak').length;
  const totalPl = disetujui + menunggu + ditolak || 1;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-5">
        {/* Welcome banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white overflow-hidden animate-fadeIn">
          <div className="absolute right-0 top-0 h-full w-1/4 opacity-10 pointer-events-none">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-[20px] border-white" />
            <div className="absolute right-16 bottom-4 h-24 w-24 rounded-full border-[14px] border-white" />
          </div>
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-blue-100 uppercase mb-2">{dayName}</p>
              <h1 className="text-2xl font-extrabold mb-1">Selamat datang kembali, Admin</h1>
              <p className="text-sm text-blue-100">
                Ada <span className="font-bold text-white">{pendingPlacements.length} pengajuan</span> yang menunggu validasi Anda hari ini.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/admin/penempatan')}
              className="shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-smooth"
            >
              <MapPin className="h-3.5 w-3.5" />
              Tinjau Pengajuan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Siswa', value: totalSiswa, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: '← Data real-time', href: '/dashboard/admin/siswa' },
            { label: 'Guru Pembimbing', value: totalGuru, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: '← Data real-time', href: '/dashboard/admin/guru' },
            { label: 'Mitra DUDI', value: totalDudi, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50', sub: '← Data real-time', href: '/dashboard/admin/dudi' },
            { label: 'Menunggu Validasi', value: pendingPlacements.length, icon: Clock, color: 'text-red-500', bg: 'bg-red-50', sub: '← Data real-time', href: '/dashboard/admin/penempatan' },
          ].map(({ label, value, icon: Icon, color, bg, sub, href }, idx) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="card-entrance hover-lift bg-white border border-slate-200 rounded-2xl p-5 text-left"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">{label}</p>
                <div className={`h-8 w-8 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-emerald-600 mt-1">{sub}</p>
            </button>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Smooth area/line chart */}
          <div className="card-entrance hover-lift bg-white border border-slate-200 rounded-2xl p-5" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800">Tren Pengajuan Magang</h3>
                <p className="text-xs text-slate-400 mt-0.5">Jumlah pengajuan &amp; persetujuan 6 bulan terakhir</p>
              </div>
            </div>
            <SmoothAreaChart placements={placements} />
          </div>

          {/* Status pie / distribution */}
          <div className="card-entrance hover-lift bg-white border border-slate-200 rounded-2xl p-5" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800">Status Pengajuan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Distribusi status pengajuan siswa</p>
              </div>
              <button onClick={() => router.push('/dashboard/admin/penempatan')} className="text-xs font-semibold text-blue-600 hover:underline">
                Detail &rsaquo;
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Disetujui', count: disetujui, color: 'bg-emerald-500', pct: Math.round((disetujui / totalPl) * 100) },
                { label: 'Menunggu', count: menunggu, color: 'bg-amber-400', pct: Math.round((menunggu / totalPl) * 100) },
                { label: 'Ditolak', count: ditolak, color: 'bg-red-400', pct: Math.round((ditolak / totalPl) * 100) },
              ].map(({ label, count, color, pct }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 w-20">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
                    <span className="text-xs text-slate-600">{label}</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-6">{count}</span>
                  <span className="text-xs text-slate-400 w-8">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Recent activity */}
          <div className="card-entrance hover-lift bg-white border border-slate-200 rounded-2xl p-5" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Aktivitas Sistem Terakhir</h3>
              <button onClick={() => router.push('/dashboard/admin/log')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Lihat semua log <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { action: 'LOGIN_SUCCESS', target: 'auth', user: 'admin@simmas.sch.id', time: '13:12:01', role: 'AD' },
                { action: 'LOGIN_SUCCESS', target: 'auth', user: 'admin@simmas.sch.id', time: '13:09:47', role: 'AD' },
                { action: 'LOGIN_SUCCESS', target: 'auth', user: 'guru@simmas.sch.id', time: '13:09:11', role: 'GP' },
                { action: 'LOGIN_SUCCESS', target: 'auth', user: 'admin@simmas.sch.id', time: '13:07:33', role: 'AD' },
                { action: 'LOGIN_SUCCESS', target: 'auth', user: 'admin@simmas.sch.id', time: '13:07:13', role: 'AD' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">{log.role}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700">{log.action}</p>
                    <p className="text-[11px] text-slate-400 truncate">{log.user} — {log.target}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{log.time}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">INFO</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kelola data shortcuts */}
          <div className="card-entrance hover-lift bg-white border border-slate-200 rounded-2xl p-5" style={{ animationDelay: '700ms' }}>
            <h3 className="font-bold text-slate-800 mb-1">Kelola Data</h3>
            <p className="text-xs text-slate-400 mb-4">Pintasan navigasi dan manajemen data master</p>
            <div className="space-y-2">
              {[
                { label: 'Data Siswa', sub: `${totalSiswa} siswa terdaftar`, icon: Users, href: '/dashboard/admin/siswa', color: 'bg-blue-50 text-blue-600' },
                { label: 'Data Guru', sub: '0 guru sedang monitoring aktif', icon: UserCheck, href: '/dashboard/admin/guru', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Mitra DUDI', sub: `${totalDudi} DUDI terverifikasi`, icon: Building2, href: '/dashboard/admin/dudi', color: 'bg-amber-50 text-amber-600' },
                { label: 'Penempatan Magang', sub: `${pendingPlacements.length} pengajuan menunggu validasi`, icon: MapPin, href: '/dashboard/admin/penempatan', color: 'bg-indigo-50 text-indigo-600' },
                { label: 'Monitoring Global', sub: 'Pantau absensi & jurnal semua siswa', icon: Activity, href: '/dashboard/admin/monitoring', color: 'bg-rose-50 text-rose-600' },
              ].map(({ label, sub, icon: Icon, href, color }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-smooth text-left"
                >
                  <div className={`h-8 w-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sebaran siswa per tempat magang */}
        <div className="card-entrance hover-lift bg-white border border-slate-200 rounded-2xl p-5" style={{ animationDelay: '800ms' }}>
          <h3 className="font-bold text-slate-800 mb-1">Sebaran Siswa per Tempat Magang</h3>
          <p className="text-xs text-slate-400 mb-4">Jumlah siswa aktif magang di tiap mitra DUDI</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Mitra DUDI</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Siswa Magang</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Proporsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dudis.map(d => {
                  const count = placements.filter(p => p.dudi_id === d.id && (p.status === 'aktif' || p.status === 'approved')).length;
                  const pct = d.quota > 0 ? Math.round((count / d.quota) * 100) : 0;
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-smooth">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800">{d.name}</p>
                        <p className="text-xs text-slate-400">{d.address}</p>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-700">{count}/{d.quota}</td>
                      <td className="py-3 px-3 w-40">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
