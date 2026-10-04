'use client';

import { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, Clock, MapPin, Calendar, User, Briefcase, Search } from 'lucide-react';
import GuruLayout from '@/components/GuruLayout';
import { useAuth } from '@/context/AuthContext';
import type { Placement } from '@/types/database';

export default function GuruPengajuanPage() {
  const { placements, updatePlacementStatus } = useAuth();
  const [search, setSearch] = useState('');
  const [reviewModal, setReviewModal] = useState<Placement | null>(null);

  // Pending placements that need guru approval
  const pendingPlacements = placements.filter(p => p.status === 'pending');
  const approvedPlacements = placements.filter(p => p.status === 'approved' || p.status === 'aktif');
  const rejectedPlacements = placements.filter(p => p.status === 'ditolak');

  const filteredPending = pendingPlacements.filter(p =>
    !search ||
    p.student_name.toLowerCase().includes(search.toLowerCase()) ||
    p.dudi_name.toLowerCase().includes(search.toLowerCase()) ||
    p.student_class?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async () => {
    if (!reviewModal) return;
    await updatePlacementStatus(reviewModal.id, 'approved');
    setReviewModal(null);
    alert('Pengajuan tempat magang berhasil disetujui! ✓');
  };

  const handleReject = async () => {
    if (!reviewModal) return;
    const reason = prompt('Alasan penolakan (opsional):');
    await updatePlacementStatus(reviewModal.id, 'ditolak');
    setReviewModal(null);
    alert('Pengajuan tempat magang ditolak.');
  };

  const stats = [
    { label: 'Menunggu Persetujuan', value: pendingPlacements.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Disetujui', value: approvedPlacements.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ditolak', value: rejectedPlacements.length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <GuruLayout title="Pengajuan Tempat Magang">
      <div className="space-y-5">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-600" />
            Persetujuan Pengajuan Magang
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review dan setujui pengajuan tempat magang dari siswa bimbingan Anda</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">{label}</p>
                <div className={`h-8 w-8 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Search */}
          <div className="p-5 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama siswa, tempat magang, kelas..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filteredPending.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-700">Tidak Ada Pengajuan Pending</p>
                <p className="text-sm text-slate-500 mt-1">Semua pengajuan sudah ditinjau atau belum ada pengajuan baru.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempat Magang</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Periode</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPending.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {p.student_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{p.student_name}</p>
                            <p className="text-xs text-slate-400">NIS: {p.student_nisn || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{p.student_class || '-'}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{p.dudi_name}</p>
                        <p className="text-xs text-slate-500">{p.division || p.industry || '-'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {new Date(p.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(p.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setReviewModal(p)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-violet-50">
              <h3 className="font-bold text-lg text-slate-900">Review Pengajuan Tempat Magang</h3>
              <p className="text-sm text-slate-600 mt-1">Periksa detail pengajuan sebelum menyetujui atau menolak</p>
            </div>

            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">
              {/* Student Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Siswa</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {reviewModal.student_name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg">{reviewModal.student_name}</h4>
                    <p className="text-sm text-slate-600">NIS: {reviewModal.student_nisn || '-'} • Kelas: {reviewModal.student_class || '-'}</p>
                  </div>
                </div>
              </div>

              {/* DUDI Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Tempat Magang (DUDI)</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Nama Perusahaan/Instansi</p>
                    <p className="font-bold text-slate-900">{reviewModal.dudi_name}</p>
                  </div>
                  {reviewModal.dudi_address && (
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Alamat</p>
                      <p className="text-sm text-slate-700">{reviewModal.dudi_address}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {reviewModal.industry && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Bidang Industri</p>
                        <p className="text-sm font-semibold text-slate-800">{reviewModal.industry}</p>
                      </div>
                    )}
                    {reviewModal.division && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Divisi</p>
                        <p className="text-sm font-semibold text-slate-800">{reviewModal.division}</p>
                      </div>
                    )}
                  </div>
                  {reviewModal.mentor_name && (
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Pembimbing Lapangan</p>
                      <p className="text-sm font-semibold text-slate-800">{reviewModal.mentor_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Period */}
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-4 w-4 text-violet-600" />
                  <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Periode Magang</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tanggal Mulai</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(reviewModal.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tanggal Selesai</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(reviewModal.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-violet-200">
                  <p className="text-xs text-slate-600">
                    Durasi: <span className="font-bold text-slate-900">
                      {Math.ceil((new Date(reviewModal.end_date).getTime() - new Date(reviewModal.start_date).getTime()) / (1000 * 60 * 60 * 24))} hari
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Tolak
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </GuruLayout>
  );
}
