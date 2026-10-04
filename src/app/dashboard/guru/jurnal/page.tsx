'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle2, Search, Check, X, RotateCcw, Image as ImageIcon, ZoomIn } from 'lucide-react';
import GuruLayout from '@/components/GuruLayout';
import { useAuth } from '@/context/AuthContext';
import type { Journal } from '@/types/database';

type JournalTab = 'jurnal' | 'absensi';

/* ── Photo Viewer Modal ── */
function PhotoViewerModal({ photo, onClose }: { photo: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xl z-10 transition"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src={photo}
          alt="Foto Kegiatan"
          className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
        />
        <div className="mt-4 text-center">
          <p className="text-white text-sm font-medium">Foto Kegiatan Magang Siswa</p>
        </div>
      </div>
    </div>
  );
}

export default function GuruJurnalPage() {
  const { currentUser, journals, attendances, verifyJournal, placements } = useAuth();
  const [tab, setTab] = useState<JournalTab>('jurnal');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [actionModal, setActionModal] = useState<{ id: string; type: 'approve' | 'revision'; journal?: Journal } | null>(null);
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  // Get student IDs from placements where this guru is assigned
  // SPECIAL: If logged in as guru@simmas.sch.id, show ALL students regardless of guru_id
  const isMainGuru = currentUser?.email === 'guru@simmas.sch.id';
  
  const myStudentIds = isMainGuru 
    ? placements.map(p => p.student_id)
    : placements
        .filter(p => p.guru_id === currentUser?.id || p.guru_id === 'u-guru-1')
        .map(p => p.student_id);
  
  const myJournals = journals.filter(j => myStudentIds.includes(j.student_id));
  const myAttendances = attendances.filter(a => myStudentIds.includes(a.student_id));

  const pending = myJournals.filter(j => j.status === 'pending');
  const approved = myJournals.filter(j => j.status === 'approved');
  const revision = myJournals.filter(j => j.status === 'revision');

  const filteredJournals = myJournals.filter(j =>
    !search ||
    j.student_name.toLowerCase().includes(search.toLowerCase()) ||
    j.activity_description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async () => {
    if (!actionModal) return;
    const fb = feedback[actionModal.id] || (actionModal.type === 'approve' ? 'Jurnal telah diverifikasi.' : '');
    await verifyJournal(actionModal.id, actionModal.type === 'approve' ? 'approved' : 'revision', fb);
    setActionModal(null);
  };

  const stats = [
    { label: 'Menunggu Validasi', value: pending.length, icon: RotateCcw, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Jurnal Disetujui', value: approved.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Perlu Revisi', value: revision.length, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <GuruLayout title="Jurnal Kegiatan">
      <div className="space-y-5 animate-fadeIn">

        {/* Page header */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Validasi Jurnal &amp; Absensi
          </h1>
        </div>

        {/* Single unified card: stats + tabs + table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-entrance">

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-200">
            {(['jurnal', 'absensi'] as JournalTab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'jurnal' ? 'Jurnal' : 'Absensi'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama siswa atau kegiatan..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* Tab content */}
          {tab === 'jurnal' ? (
            <div className="overflow-x-auto">
              {filteredJournals.length === 0 ? (
                <div className="text-center py-14 text-slate-400">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Tidak ada jurnal yang sesuai dengan kriteria</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal &amp; Siswa</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kegiatan</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJournals.map(j => (
                      <tr key={j.id} className="hover:bg-slate-50 transition-smooth">
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-slate-500">{j.date}</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{j.student_name}</p>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-xs text-slate-700 line-clamp-2">{j.activity_description}</p>
                          {j.division && <p className="text-xs text-slate-400 mt-0.5">{j.division}</p>}
                        </td>
                        <td className="py-3.5 px-4">
                          {j.photo ? (
                            <button
                              onClick={() => setPhotoModal(j.photo!)}
                              className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:shadow-sm group"
                            >
                              <div className="relative h-8 w-8 rounded overflow-hidden border border-blue-300">
                                <img src={j.photo} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                              <span>Lihat Foto</span>
                              <ZoomIn className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Tidak ada foto</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            j.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            j.status === 'revision' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              j.status === 'approved' ? 'bg-emerald-500' :
                              j.status === 'revision' ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`} />
                            {j.status === 'approved' ? 'Disetujui' : j.status === 'revision' ? 'Perlu Revisi' : 'Menunggu'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {j.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setActionModal({ id: j.id, type: 'approve', journal: j })}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                              >
                                <Check className="h-3 w-3" />Setujui
                              </button>
                              <button
                                onClick={() => setActionModal({ id: j.id, type: 'revision', journal: j })}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition"
                              >
                                Revisi
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {myAttendances.length === 0 ? (
                <div className="text-center py-14 text-slate-400">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Belum ada data absensi</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Masuk</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pulang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myAttendances.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-xs text-slate-500">{a.date}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-800">{a.student_name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            a.status === 'hadir' ? 'bg-emerald-100 text-emerald-700' :
                            a.status === 'izin' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              a.status === 'hadir' ? 'bg-emerald-500' :
                              a.status === 'izin' ? 'bg-blue-500' :
                              'bg-red-500'
                            }`} />
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{a.check_in || '—'}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{a.check_out || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
        {/* end unified card */}

      </div>

      {/* Action modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col modal-content">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-800">
                {actionModal.type === 'approve' ? 'Setujui Jurnal' : 'Minta Revisi'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {actionModal.type === 'approve' 
                  ? 'Berikan feedback positif untuk siswa' 
                  : 'Jelaskan bagian mana yang perlu diperbaiki'}
              </p>
            </div>

            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {/* Journal Details Preview */}
              {actionModal.journal && (
                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-500">SISWA</span>
                        <span className="text-sm font-bold text-slate-800">{actionModal.journal.student_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-500">TANGGAL</span>
                        <span className="text-sm text-slate-700">{actionModal.journal.date}</span>
                      </div>
                      {actionModal.journal.division && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">DIVISI</span>
                          <span className="text-sm text-slate-700">{actionModal.journal.division}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Photo Preview */}
                    {actionModal.journal.photo && (
                      <div className="shrink-0">
                        <button
                          onClick={() => setPhotoModal(actionModal.journal!.photo!)}
                          className="group relative block"
                        >
                          <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-slate-300 group-hover:border-blue-500 transition-all shadow-sm group-hover:shadow-md">
                            <img 
                              src={actionModal.journal.photo} 
                              alt="Foto Kegiatan" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl flex items-center justify-center transition-all">
                            <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                        <p className="text-xs text-center text-slate-500 mt-1">Klik untuk perbesar</p>
                      </div>
                    )}
                  </div>

                  {/* Activity Description */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Kegiatan</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{actionModal.journal.activity_description}</p>
                  </div>

                  {/* Learning Outcomes if exists */}
                  {actionModal.journal.learning_outcomes && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Hasil Pembelajaran</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{actionModal.journal.learning_outcomes}</p>
                    </div>
                  )}

                  {/* Duration if exists */}
                  {actionModal.journal.duration && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-500 uppercase">Durasi:</span>
                      <span className="text-slate-700">{actionModal.journal.duration}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {actionModal.type === 'approve' ? 'Catatan Persetujuan (Opsional)' : 'Catatan Revisi (Wajib)'}
                </label>
                <textarea
                  value={feedback[actionModal.id] || ''}
                  onChange={e => setFeedback(prev => ({ ...prev, [actionModal.id]: e.target.value }))}
                  placeholder={
                    actionModal.type === 'approve' 
                      ? 'Contoh: Jurnal sudah lengkap dan detail. Pertahankan kualitas kerja yang baik!' 
                      : 'Contoh: Harap lengkapi deskripsi teknik yang digunakan dan sertakan tangkapan layar hasil kerja.'
                  }
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
                {actionModal.type === 'revision' && !feedback[actionModal.id]?.trim() && (
                  <p className="text-xs text-red-500 mt-1.5">* Catatan revisi wajib diisi</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
              <button
                onClick={() => setActionModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
              >
                Batal
              </button>
              <button
                onClick={handleAction}
                disabled={actionModal.type === 'revision' && !feedback[actionModal.id]?.trim()}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {actionModal.type === 'approve' ? '✓ Setujui Jurnal' : '→ Kirim Revisi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {photoModal && (
        <PhotoViewerModal photo={photoModal} onClose={() => setPhotoModal(null)} />
      )}
    </GuruLayout>
  );
}
