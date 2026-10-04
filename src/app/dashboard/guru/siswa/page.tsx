'use client';

import { useState } from 'react';
import { Users, Search, BookOpen, CheckCircle2, X, MapPin, Calendar, Clock } from 'lucide-react';
import GuruLayout from '@/components/GuruLayout';
import { useAuth } from '@/context/AuthContext';

export default function GuruSiswaPage() {
  const { currentUser, placements, journals, attendances } = useAuth();
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState<string | null>(null);

  // SPECIAL: If logged in as guru@simmas.sch.id, show ALL students
  const isMainGuru = currentUser?.email === 'guru@simmas.sch.id';
  
  const myStudents = isMainGuru 
    ? placements // Show ALL placements
    : placements.filter(p =>
        p.guru_id === currentUser?.id || p.guru_id === 'u-guru-1'
      );

  const aktif = myStudents.filter(p => p.status === 'aktif' || p.status === 'approved');
  const selesai = myStudents.filter(p => p.status === 'completed');

  const filtered = myStudents.filter(p =>
    !search || p.student_name.toLowerCase().includes(search.toLowerCase()) ||
    p.student_nisn?.includes(search) || p.student_class?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStudent = detailModal ? filtered.find(p => p.id === detailModal) : null;
  const studentAttendances = selectedStudent ? attendances.filter(a => a.student_id === selectedStudent.student_id) : [];
  const studentJournals = selectedStudent ? journals.filter(j => j.student_id === selectedStudent.student_id) : [];

  return (
    <GuruLayout title="Manajemen Siswa">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Bimbingan Siswa
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Bimbingan', value: myStudents.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Siswa pilihan Anda' },
            { label: 'Sedang Aktif', value: aktif.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Aktif di tempat magang' },
            { label: 'Selesai (Dinilai)', value: selesai.length, icon: BookOpen, color: 'text-slate-600', bg: 'bg-slate-50', sub: 'Sudah diberi nilai' },
          ].map(({ label, value, icon: Icon, color, bg, sub }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">{label}</p>
                <div className={`h-8 w-8 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Search & table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, NIS, atau kelas..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-700">Belum ada siswa bimbingan</p>
              <p className="text-sm text-slate-500 mt-1">Siswa yang di-plot ke Anda oleh admin akan muncul di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">NIS</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempat Magang</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kehadiran</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurnal</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left pb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(p => {
                    const studentAttendances = attendances.filter(a => a.student_id === p.student_id);
                    const studentJournals = journals.filter(j => j.student_id === p.student_id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-2 text-xs text-slate-500">{p.student_nisn || '-'}</td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {p.student_name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{p.student_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 text-xs text-slate-500">{p.student_class || '-'}</td>
                        <td className="py-3.5 px-2">
                          <p className="text-xs font-semibold text-slate-700">{p.dudi_name}</p>
                          <p className="text-xs text-slate-400">{p.guru_name}</p>
                        </td>
                        <td className="py-3.5 px-2 text-sm font-semibold text-slate-700">{studentAttendances.length}</td>
                        <td className="py-3.5 px-2 text-sm font-semibold text-slate-700">{studentJournals.length}</td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            p.status === 'aktif' || p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'aktif' || p.status === 'approved' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {p.status === 'aktif' || p.status === 'approved' ? 'Berlangsung' : p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <button onClick={() => setDetailModal(p.id)} className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">Detail</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Detail Siswa Bimbingan</h3>
                <p className="text-sm text-slate-500 mt-0.5">Rincian magang dan aktivitas siswa</p>
              </div>
              <button onClick={() => setDetailModal(null)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {/* Student Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                    {selectedStudent.student_name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg">{selectedStudent.student_name}</h4>
                    <p className="text-sm text-slate-500">NIS: {selectedStudent.student_nisn || '-'} • Kelas: {selectedStudent.student_class || '-'}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full mt-2 ${
                      selectedStudent.status === 'aktif' || selectedStudent.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${selectedStudent.status === 'aktif' || selectedStudent.status === 'approved' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {selectedStudent.status === 'aktif' || selectedStudent.status === 'approved' ? 'Sedang Magang' : selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Placement Info */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tempat Magang</p>
                  </div>
                  <p className="font-semibold text-slate-900">{selectedStudent.dudi_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedStudent.dudi_address || '-'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Periode Magang</p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {new Date(selectedStudent.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-500">
                    s/d {new Date(selectedStudent.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Kehadiran</p>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-emerald-900">{studentAttendances.length}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">hari hadir</p>
                </div>
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Jurnal</p>
                    <BookOpen className="h-4 w-4 text-violet-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-violet-900">{studentJournals.length}</p>
                  <p className="text-xs text-violet-600 mt-0.5">laporan ditulis</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Aktivitas Terbaru
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...studentAttendances.slice(0, 3).map(a => ({ type: 'absensi', date: a.date, desc: `Absen ${a.status.toUpperCase()} • Masuk ${a.check_in || '-'} • Pulang ${a.check_out || '-'}` })),
                    ...studentJournals.slice(0, 3).map(j => ({ type: 'jurnal', date: j.date, desc: j.activity_description }))
                  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'absensi' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        {item.type === 'absensi' ? <CheckCircle2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{item.desc}</p>
                        <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setDetailModal(null)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </GuruLayout>
  );
}
