'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import SiswaLayout from '@/components/SiswaLayout';
import CameraCapture from '@/components/CameraCapture';
import { useAuth } from '@/context/AuthContext';
import type { Journal } from '@/types/database';

interface JournalForm {
  activity_description: string;
  problems_faced: string;
  division: string;
  duration: string;
}
const EMPTY_FORM: JournalForm = {
  activity_description: '',
  problems_faced: '',
  division: '',
  duration: '',
};

const statusConfig: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  pending:  { bg: 'bg-slate-100',   dot: 'bg-slate-400',   text: 'text-slate-600',   label: 'Menunggu' },
  approved: { bg: 'bg-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Disetujui' },
  revision: { bg: 'bg-yellow-100',  dot: 'bg-yellow-500',  text: 'text-yellow-700',  label: 'Revisi' },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function JurnalPage() {
  const router = useRouter();
  const { currentUser, placements, journals, addJournal, updateJournal, deleteJournal } = useAuth();

  const myPlacement = placements.find(
    (p) => p.student_id === currentUser?.id && (p.status === 'aktif' || p.status === 'approved'),
  );
  const isActive = !!myPlacement;

  const myJournals: Journal[] = useMemo(
    () => journals.filter((j) => j.student_id === currentUser?.id),
    [journals, currentUser?.id],
  );

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [form, setForm] = useState<JournalForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return myJournals;
    const q = search.toLowerCase();
    return myJournals.filter(
      (j) =>
        j.activity_description.toLowerCase().includes(q) ||
        j.division.toLowerCase().includes(q),
    );
  }, [myJournals, search]);

  /* ── handlers ── */
  const openNew = () => {
    setIsEditMode(false);
    setSelectedJournal(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEditClick = (j: Journal) => {
    if (isActive) { setSelectedJournal(j); setShowErrorModal(true); return; }
    setSelectedJournal(j);
    setForm({
      activity_description: j.activity_description,
      problems_faced: (j as any).problems_faced || '',
      division: j.division || '',
      duration: j.duration || '',
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = (j: Journal) => {
    if (isActive) { setSelectedJournal(j); setShowErrorModal(true); return; }
    setSelectedJournal(j);
    setShowDeleteConfirm(true);
  };

  const handleAddPhotoClick = (j: Journal) => {
    setSelectedJournal(j);
    if (j.photo) setShowPhotoModal(true);
    else setShowCamera(true);
  };

  const handleSubmit = async () => {
    if (!form.activity_description.trim()) return;
    setSubmitting(true);
    try {
      if (isEditMode && selectedJournal) {
        await updateJournal(selectedJournal.id, {
          activity_description: form.activity_description,
          division: form.division || '-',
          duration: form.duration || '1 hari',
        });
      } else {
        await addJournal({
          student_id: currentUser?.id ?? '',
          student_name: currentUser?.name ?? '',
          dudi_name: myPlacement?.dudi_name ?? '-',
          date: new Date().toISOString().slice(0, 10),
          division: form.division || '-',
          activity_description: form.activity_description,
          duration: form.duration || '1 hari',
        });
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setIsEditMode(false);
      setSelectedJournal(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedJournal) return;
    setDeleting(true);
    try {
      await deleteJournal(selectedJournal.id);
      setShowDeleteConfirm(false);
      setSelectedJournal(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleCameraCapture = async (photoDataUrl: string) => {
    if (!selectedJournal) return;
    setUploadingPhoto(true);
    try {
      await updateJournal(selectedJournal.id, { photo: photoDataUrl });
      setShowCamera(false);
      setSelectedJournal(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* ── render ── */
  return (
    <SiswaLayout title="Jurnal Kegiatan">
      <div className="space-y-5">

        {/* Alert: belum aktif */}
        {!isActive && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-yellow-900">Akses Kegiatan Magang Belum Aktif</p>
              <p className="text-xs text-yellow-700 mt-0.5 leading-relaxed">
                Anda belum memiliki tempat magang yang disetujui. Jurnal baru bisa diisi setelah pengajuan disetujui Admin.
              </p>
              <button
                onClick={() => router.push('/dashboard/siswa/pengajuan')}
                className="mt-2.5 inline-flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Ajukan Tempat Magang <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Search + Tulis Jurnal */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kegiatan atau divisi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Tulis Jurnal
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Tanggal</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kegiatan</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Foto</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                      {search ? 'Tidak ada jurnal yang cocok' : 'Belum ada jurnal kegiatan'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((j) => {
                    const cfg = statusConfig[j.status] ?? statusConfig.pending;
                    return (
                      <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">{formatDate(j.date)}</td>
                        <td className="px-5 py-3.5 text-slate-700 max-w-xs">
                          <p className="line-clamp-2">{j.activity_description}</p>
                          {j.division && j.division !== '-' && (
                            <p className="text-xs text-slate-400 mt-0.5">{j.division}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleAddPhotoClick(j)}
                            className={`inline-flex items-center gap-1.5 border text-xs font-medium px-2.5 py-1.5 rounded-lg transition ${
                              j.photo
                                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {j.photo ? (
                              <img src={j.photo} alt="" className="h-7 w-7 rounded object-cover" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5" />
                            )}
                            {j.photo ? 'Lihat Foto' : 'Tambah Foto'}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditClick(j)}
                              title="Edit"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(j)}
                              title="Hapus"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Tulis / Edit Jurnal Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                {isEditMode ? 'Edit Jurnal Kegiatan' : 'Tulis Jurnal Kegiatan'}
              </h3>
              <button onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Kegiatan yang Dilakukan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Deskripsikan kegiatan yang Anda lakukan hari ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
                  value={form.activity_description}
                  onChange={(e) => setForm({ ...form, activity_description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kendala yang Dihadapi</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsikan kendala atau hambatan (opsional)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
                  value={form.problems_faced}
                  onChange={(e) => setForm({ ...form, problems_faced: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Divisi / Bagian</label>
                  <input
                    type="text"
                    placeholder="Contoh: IT Support"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                    value={form.division}
                    onChange={(e) => setForm({ ...form, division: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Durasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1 hari"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                disabled={submitting}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.activity_description.trim() || submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</>
                ) : (
                  <><Send className="h-4 w-4" />{isEditMode ? 'Update Jurnal' : 'Simpan Jurnal'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && selectedJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-red-600">Konfirmasi Hapus</h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-1">Anda yakin ingin menghapus jurnal ini?</p>
                  <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-600 mb-1">Tanggal: {formatDate(selectedJournal.date)}</p>
                <p className="text-sm text-slate-700 line-clamp-2">{selectedJournal.activity_description}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setSelectedJournal(null); }} disabled={deleting} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition disabled:opacity-50">Batal</button>
              <button onClick={handleConfirmDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <><span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Menghapus...</> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error Modal (edit/delete restriction) ── */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-red-600">Akses Ditolak</h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-1">Tidak Dapat Mengubah atau Menghapus Data</p>
                  <p className="text-sm text-slate-600">Setelah magang disetujui, hanya Administrator yang dapat mengubah data jurnal untuk menjaga integritas.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100">
              <button onClick={() => { setShowErrorModal(false); setSelectedJournal(null); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Photo viewer modal ── */}
      {showPhotoModal && selectedJournal?.photo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => { setShowPhotoModal(false); setSelectedJournal(null); }}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowPhotoModal(false); setSelectedJournal(null); }}
              className="absolute -top-3 -right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-lg z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={selectedJournal.photo} alt="Foto kegiatan" className="w-full rounded-2xl" />
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => { setShowPhotoModal(false); setShowCamera(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
              >
                Ambil Ulang Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Camera Capture ── */}
      {showCamera && selectedJournal && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => { setShowCamera(false); setSelectedJournal(null); }}
          title="Foto Kegiatan"
          subtitle="Ambil foto kegiatan magang Anda"
        />
      )}
    </SiswaLayout>
  );
}
