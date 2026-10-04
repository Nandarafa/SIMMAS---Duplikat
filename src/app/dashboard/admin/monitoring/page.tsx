'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Activity, Users, Building2, UserCheck, Calendar, BookOpen, MapPin, X, GraduationCap } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';

type Tab = 'monitoring' | 'kunjungan';

function MonitoringContent() {
  const searchParams = useSearchParams();
  const dudiParam = searchParams?.get('dudi');
  
  const { users, attendances, journals, dudis } = useAuth();
  const [tab, setTab] = useState<Tab>('monitoring');
  const [kelasFilter, setKelasFilter] = useState('Semua Kelas');
  const [industriFilter, setIndustriFilter] = useState('Semua Industri');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [detailModal, setDetailModal] = useState<string | null>(null);

  // Set filter if DUDI param exists
  useEffect(() => {
    if (dudiParam) {
      setIndustriFilter(dudiParam);
      setTab('kunjungan');
    }
  }, [dudiParam]);

  // Mock kunjungan data
  const kunjungan = [
    { id: 1, tanggal: '2026-09-21', guru: 'Ahmad Fauzan Arif S.Pd', dudi: 'PT. Suka', catatan: 'Oke' },
    { id: 2, tanggal: '2026-09-20', guru: 'Yusa S.Pd', dudi: 'PT. Universal Big Data', catatan: 'Siswa mampu beradaptasi dengan sangat cepat' },
    { id: 3, tanggal: '2026-09-16', guru: 'Guru Pembimbing', dudi: 'PT. Universal Big Data', catatan: 'Monitoring rutin perkembangan siswa di industri. Kondisi baik dan lancar.' },
    { id: 4, tanggal: '2026-09-03', guru: 'Aluna Ayu Sekarsari S.Pd', dudi: 'PT. Jaya Glok', catatan: 'Anak anak bagus' },
    { id: 5, tanggal: '2026-08-24', guru: 'Guru Pembimbing', dudi: 'PT. Universal Big Data', catatan: 'Bagus' },
    { id: 6, tanggal: '2026-08-18', guru: 'Kholis S.Kom', dudi: 'DUDI', catatan: 'Bagus' },
    { id: 7, tanggal: '2026-08-11', guru: 'Krisadayanto, S.Pd.', dudi: 'DUDI', catatan: 'Siswa nya baik' },
  ];

  const siswaList = users.filter(u => u.role === 'siswa').map(u => {
    const kelas = u.id === 'u-siswa-1' ? 'XII RPL 1' : u.id === 'u-siswa-2' ? 'XII RPL 2' : 'XII TKJ 1';
    const dudi = u.id === 'u-siswa-1' ? 'PT. Universal Big Data' : u.id === 'u-siswa-2' ? 'PT. Telkom Sidoarjo' : 'PT. Jaya Glok';
    const guru = u.id === 'u-siswa-1' ? 'Drs. H. Budi Santoso, M.Kom' : 'Ahmad Fauzan Arif S.Pd';
    const myAttendances = attendances.filter(a => a.student_id === u.id);
    const hadir = myAttendances.filter(a => a.status === 'hadir').length;
    const sakit = myAttendances.filter(a => a.status === 'sakit').length;
    const izin = myAttendances.filter(a => a.status === 'izin').length;
    const alfa = myAttendances.filter(a => a.status === 'alpa').length;
    const myJournals = journals.filter(j => j.student_id === u.id).length;
    return { ...u, kelas, dudi, guru, hadir, sakit, izin, alfa, totalJurnal: myJournals };
  });

  // Filter siswa
  let filteredSiswa = siswaList;
  if (kelasFilter !== 'Semua Kelas') filteredSiswa = filteredSiswa.filter(s => s.kelas === kelasFilter);
  if (industriFilter !== 'Semua Industri') filteredSiswa = filteredSiswa.filter(s => s.dudi === industriFilter);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  if (searchQuery.trim()) {
    filteredSiswa = filteredSiswa.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.dudi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter kunjungan
  let filteredKunjungan = kunjungan;
  if (kelasFilter !== 'Semua Kelas') filteredKunjungan = kunjungan; // kunjungan tidak memiliki kelas
  if (industriFilter !== 'Semua Industri') filteredKunjungan = kunjungan.filter(k => k.dudi.includes(industriFilter));

  const selectedSiswa = detailModal ? siswaList.find(s => s.id === detailModal) : null;

  const kunjunganCount = kunjungan.length;

  return (
    <AdminLayout title="Monitoring Global">
      <div className="space-y-5">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Monitoring Global
          </h1>
          <p className="text-sm text-slate-500 mt-1">Pantau absensi, jurnal, dan kunjungan pembimbing secara real-time</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Siswa Magang Aktif', value: siswaList.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Mitra DUDI', value: dudis.length, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Guru Pembimbing', value: users.filter(u => u.role === 'guru').length, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Total Kunjungan', value: kunjunganCount, icon: MapPin, color: 'text-violet-600', bg: 'bg-violet-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
                <div className={`h-8 w-8 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Main card with tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setTab('monitoring')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
                tab === 'monitoring'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="h-4 w-4" />
              Monitoring Kehadiran & Jurnal Siswa
            </button>
            <button
              onClick={() => setTab('kunjungan')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
                tab === 'kunjungan'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MapPin className="h-4 w-4" />
              Kunjungan Guru Pembimbing ({kunjunganCount})
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama, kelas, atau tempat magang..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <select
              value={kelasFilter}
              onChange={e => setKelasFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
            >
              <option>Semua Kelas</option>
              <option>XII RPL 1</option>
              <option>XII RPL 2</option>
              <option>XII TKJ 1</option>
              <option>XII TKJ 2</option>
              <option>XII ELIN 1</option>
            </select>
            <select
              value={industriFilter}
              onChange={e => setIndustriFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
            >
              <option>Semua Industri</option>
              {dudis.map(d => (
                <option key={d.id}>{d.name}</option>
              ))}
            </select>
            {tab === 'monitoring' && (
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Libur</option>
              </select>
            )}
          </div>

          {/* Tab content */}
          {tab === 'monitoring' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempat Magang</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Guru Pembimbing</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kehadiran</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurnal</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSiswa.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.kelas}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{s.dudi}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{s.guru}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{s.hadir}H</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">{s.sakit}S</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">{s.izin}I</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">{s.alfa}A</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-bold text-slate-700">{s.totalJurnal}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setDetailModal(s.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          <Activity className="h-3 w-3" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Guru Pembimbing</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempat Magang (DUDI)</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Catatan Kunjungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKunjungan.map(k => (
                    <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{k.tanggal}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{k.guru}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{k.dudi}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-sm text-slate-600">{k.catatan}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && selectedSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Detail Monitoring Magang</h3>
                <p className="text-sm text-slate-500 mt-0.5">Rincian aktivitas dan progres magang siswa saat ini.</p>
              </div>
              <button onClick={() => setDetailModal(null)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Siswa</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{selectedSiswa.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempat Magang</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{selectedSiswa.dudi}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{selectedSiswa.kelas}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Guru Pembimbing</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{selectedSiswa.guru}</p>
                </div>
              </div>

              {/* Statistik kehadiran */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Statistik Kehadiran</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'HADIR', value: selectedSiswa.hadir, bg: 'bg-emerald-50', text: 'text-emerald-700' },
                    { label: 'SAKIT', value: selectedSiswa.sakit, bg: 'bg-amber-50', text: 'text-amber-700' },
                    { label: 'IZIN', value: selectedSiswa.izin, bg: 'bg-blue-50', text: 'text-blue-700' },
                    { label: 'ALFA', value: selectedSiswa.alfa, bg: 'bg-red-50', text: 'text-red-700' },
                  ].map(({ label, value, bg, text }) => (
                    <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                      <p className={`text-3xl font-extrabold ${text} leading-none`}>{value}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${text} mt-1`}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total jurnal */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-700 font-medium">Total Jurnal Dibuat</p>
                  <p className="text-xs text-blue-600 mt-0.5">Aktivitas terakhir sekitar 3 jam yang lalu</p>
                </div>
                <p className="text-3xl font-extrabold text-blue-600">{selectedSiswa.totalJurnal}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailModal(null)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function MonitoringGlobalPage() {
  return (
    <Suspense fallback={
      <AdminLayout title="Monitoring Global">
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
      </AdminLayout>
    }>
      <MonitoringContent />
    </Suspense>
  );
}
