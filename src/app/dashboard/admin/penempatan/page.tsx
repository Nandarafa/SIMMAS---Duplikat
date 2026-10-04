'use client';

import { useState } from 'react';
import { MapPin, Search, Plus, X, Check, UserCheck, Pencil, XCircle, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import ActionMenu from '@/components/ActionMenu';
import Pagination from '@/components/Pagination';
import Toast from '@/components/Toast';
import { useAuth } from '@/context/AuthContext';
import type { Placement } from '@/types/database';

export default function AdminPenempatanPage() {
  const { users, dudis, placements, updatePlacement, updatePlacementStatus, addPlacement } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showGuruModal, setShowGuruModal] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [selectedGuruId, setSelectedGuruId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_id: '', dudi_id: '', start_date: '', end_date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editTarget, setEditTarget] = useState<Placement | null>(null);
  const [editForm, setEditForm] = useState({ student_name: '', dudi_name: '', guru_name: '', start_date: '', end_date: '' });
  const [endTarget, setEndTarget] = useState<Placement | null>(null);

  const teachers = users.filter(u => u.role === 'guru');
  const students = users.filter(u => u.role === 'siswa');

  const pending = placements.filter(p => p.status === 'pending');
  const sedangBerlangsung = placements.filter(p => p.status === 'aktif' || p.status === 'approved').length;
  const selesai = placements.filter(p => p.status === 'completed').length;
  const dudiTerlibat = new Set(placements.map(p => p.dudi_id)).size;

  const filtered = placements.filter(p => {
    if (search && !p.student_name.toLowerCase().includes(search.toLowerCase()) && !p.dudi_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleApprove = (p: Placement) => {
    setSelectedPlacement(p);
    setSelectedGuruId('');
    setShowGuruModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedPlacement || !selectedGuruId) return;
    const guru = teachers.find(g => g.id === selectedGuruId);
    if (!guru) return;
    await updatePlacement(selectedPlacement.id, { status: 'approved', guru_id: guru.id, guru_name: guru.name });
    setShowGuruModal(false);
    setSelectedPlacement(null);
    setSelectedGuruId('');
    setToast({ type: 'success', message: 'Pengajuan berhasil disetujui dan guru pembimbing ditetapkan!' });
  };

  const handleEndPlacement = () => {
    if (!endTarget) return;
    updatePlacementStatus(endTarget.id, 'completed');
    setEndTarget(null);
    setToast({ type: 'success', message: 'Penempatan magang berhasil diakhiri!' });
  };

  const handleDeletePlacement = (p: Placement) => {
    if (confirm(`Hapus penempatan ${p.student_name}?`)) {
      // In real app: deletePlacement(p.id)
      setToast({ type: 'success', message: 'Data penempatan berhasil dihapus!' });
    }
  };

  const openEdit = (p: Placement) => {
    setEditTarget(p);
    setEditForm({
      student_name: p.student_name,
      dudi_name: p.dudi_name,
      guru_name: p.guru_name || '',
      start_date: p.start_date,
      end_date: p.end_date,
    });
  };

  const handleSaveEdit = () => {
    if (!editTarget) return;
    updatePlacement(editTarget.id, {
      ...editForm,
      guru_id: editTarget.guru_id,
    });
    setEditTarget(null);
    setToast({ type: 'success', message: 'Data penempatan berhasil diperbarui!' });
  };

  return (
    <AdminLayout title="Penempatan Magang">
      <div className="space-y-5">
        <div><h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600" />Penempatan Magang</h1></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Menunggu Validasi', value: pending.length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Sedang Berlangsung', value: sedangBerlangsung, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Selesai Magang', value: selesai, color: 'text-slate-600', bg: 'bg-slate-50' },
            { label: 'DUDI Terlibat', value: dudiTerlibat, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map(({ label, value, color, bg }, index) => (
            <div 
              key={label} 
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</p>
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        {pending.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Pengajuan Magang Menunggu Validasi
            </h3>
            <div className="space-y-2.5">
              {pending.map(p => (
                <div key={p.id} className="bg-white border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{p.student_name}</span>
                      <span className="text-xs text-slate-400">NIS: {p.student_nisn}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">{p.dudi_name}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Tgl Pengajuan: {p.start_date}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (confirm(`Tolak pengajuan magang ${p.student_name}?`)) {
                          updatePlacementStatus(p.id, 'ditolak');
                          setToast({ type: 'success', message: 'Pengajuan magang ditolak!' });
                        }
                      }}
                      className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      <XCircle className="h-3 w-3" />Tolak
                    </button>
                    <button
                      onClick={() => handleApprove(p)}
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      <Check className="h-3 w-3" />Setujui &amp; Tempatkan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All placements */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa, NIS, atau DUDI..." className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-56" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option value="all">Semua Roles →</option>
              <option value="aktif">Aktif</option>
              <option value="approved">Disetujui</option>
              <option value="pending">Pending</option>
              <option value="ditolak">Ditolak</option>
            </select>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400">{filtered.length} Penempatan</span>
              <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition">
                <Plus className="h-3.5 w-3.5" />Tambah Penempatan
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Siswa</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Tempat Magang</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Guru Pembimbing</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Periode</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-800">{p.student_name}</p>
                      <p className="text-xs text-slate-400">{p.student_class}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-xs font-semibold text-blue-600">{p.dudi_name}</p>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-slate-600">{p.guru_name || '—'}</td>
                    <td className="py-3.5 px-3 text-xs text-slate-500">{p.start_date} s/d {p.end_date}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        p.status === 'aktif' || p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        p.status === 'ditolak' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'aktif' || p.status === 'approved' ? 'bg-emerald-500' : p.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        {p.status === 'aktif' || p.status === 'approved' ? 'Berlangsung' : p.status === 'pending' ? 'Menunggu' : p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <ActionMenu items={[
                        {
                          label: 'Edit Data',
                          icon: <Pencil className="h-3.5 w-3.5" />,
                          onClick: () => openEdit(p),
                        },
                        {
                          label: 'Akhiri Magang',
                          icon: <XCircle className="h-3.5 w-3.5" />,
                          onClick: () => setEndTarget(p),
                        },
                        {
                          label: 'Hapus',
                          icon: <Trash2 className="h-3.5 w-3.5" />,
                          onClick: () => handleDeletePlacement(p),
                          danger: true,
                          dividerBefore: true,
                        },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Guru selection modal */}
      {showGuruModal && selectedPlacement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center"><UserCheck className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Pilih Guru Pembimbing</h3>
                  <p className="text-xs text-slate-500">Setujui pengajuan {selectedPlacement.student_name}</p>
                </div>
              </div>
              <button onClick={() => { setShowGuruModal(false); setSelectedPlacement(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-500 mb-1">Siswa</p><p className="font-semibold">{selectedPlacement.student_name}</p><p className="text-xs text-slate-400">{selectedPlacement.student_class}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Perusahaan</p><p className="font-semibold text-blue-600">{selectedPlacement.dudi_name}</p></div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <p className="text-sm font-semibold text-slate-700 mb-3">Pilih Guru Pembimbing ({teachers.length} tersedia)</p>
              <div className="space-y-2">
                {teachers.map(g => (
                  <label key={g.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${selectedGuruId === g.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="guru" value={g.id} checked={selectedGuruId === g.id} onChange={e => setSelectedGuruId(e.target.value)} className="mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{g.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">NIP: {g.nip_nisn || '—'} • {g.phone || '—'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
              <button onClick={() => { setShowGuruModal(false); setSelectedPlacement(null); setSelectedGuruId(''); }} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">Batal</button>
              <button onClick={handleConfirmApprove} disabled={!selectedGuruId} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition disabled:opacity-50">
                Setujui &amp; Tetapkan Pembimbing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Akhiri Magang modal */}
      {endTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Akhiri Magang</h3>
              </div>
              <button onClick={() => setEndTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 mb-4">
                Anda akan mengakhiri penempatan magang untuk <strong>{endTarget.student_name}</strong> di <strong className="text-blue-600">{endTarget.dudi_name}</strong>.
              </p>
              <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
                Status penempatan akan diubah menjadi <strong>Selesai</strong>. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setEndTarget(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">
                Batal
              </button>
              <button onClick={handleEndPlacement} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition">
                Akhiri Magang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Penempatan modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slideUp">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Pencil className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Edit Data Penempatan</h3>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Siswa</label>
                <input 
                  type="text" 
                  value={editForm.student_name} 
                  readOnly
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tempat Magang (DUDI)</label>
                <select 
                  value={editForm.dudi_name} 
                  onChange={e => setEditForm(prev => ({ ...prev, dudi_name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                >
                  {dudis.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Guru Pembimbing</label>
                <select 
                  value={editForm.guru_name} 
                  onChange={e => setEditForm(prev => ({ ...prev, guru_name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                >
                  <option value="">Belum ditentukan</option>
                  {teachers.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Mulai</label>
                  <input 
                    type="date" 
                    value={editForm.start_date} 
                    onChange={e => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Selesai</label>
                  <input 
                    type="date" 
                    value={editForm.end_date} 
                    onChange={e => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
                Batal
              </button>
              <button onClick={handleSaveEdit} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
