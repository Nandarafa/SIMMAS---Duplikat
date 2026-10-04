'use client';

import { useState } from 'react';
import { UserCheck, Search, Plus, X, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/Pagination';
import BulkActionBar from '@/components/BulkActionBar';
import Toast from '@/components/Toast';
import ActionMenu from '@/components/ActionMenu';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile, Guru } from '@/types/database';

export default function AdminGuruPage() {
  const { gurus, placements, addGuru, updateGuru, deleteGuru } = useAuth();
  const [search, setSearch] = useState('');
  const [jurusanFilter, setJurusanFilter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', nip_nisn: '', phone: '', jurusan: 'RPL' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [editTarget, setEditTarget] = useState<Guru | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', nip_nisn: '', phone: '', jurusan: 'RPL' });
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('Aktif');
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Guru | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const teachers = gurus; // Use gurus state instead of filtering users
  const aktif = teachers.filter(g => (g as any).status !== 'nonaktif');
  const perGuru = (id: string) => placements.filter(p => p.guru_id === id).length;

  let filtered = teachers.filter(g =>
    (!search || g.name.toLowerCase().includes(search.toLowerCase()) || g.nip?.includes(search)) &&
    (jurusanFilter === 'all' || (g as any).jurusan === jurusanFilter) &&
    (filterStatus === 'all' || 
      (filterStatus === 'aktif' && (g as any).status !== 'nonaktif') ||
      (filterStatus === 'nonaktif' && (g as any).status === 'nonaktif')
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map(u => u.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every(u => selectedIds.includes(u.id));

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setToast({ type: 'error', message: 'Nama dan email harus diisi!' });
      return;
    }
    addGuru({ 
      email: form.email, 
      username: form.email.split('@')[0],
      name: form.name, 
      nip: form.nip_nisn,
      phone: form.phone
    });
    setForm({ name: '', email: '', nip_nisn: '', phone: '', jurusan: 'RPL' });
    setShowForm(false);
    setToast({ type: 'success', message: 'Data guru berhasil ditambahkan!' });
  };

  const openEdit = (g: Guru) => {
    setEditTarget(g);
    setEditForm({ name: g.name, email: g.email, nip_nisn: g.nip || '', phone: g.phone || '', jurusan: (g as any).jurusan || 'RPL' });
  };

  const handleSaveEdit = () => {
    if (!editTarget || !editForm.name.trim()) {
      setToast({ type: 'error', message: 'Nama harus diisi!' });
      return;
    }
    updateGuru(editTarget.id, {
      name: editForm.name,
      email: editForm.email,
      nip: editForm.nip_nisn,
      phone: editForm.phone,
    });
    setEditTarget(null);
    setToast({ type: 'success', message: 'Data guru berhasil diperbarui!' });
  };

  const handleBulkChangeStatus = () => {
    // Update guru status
    selectedIds.forEach(id => {
      const guru = teachers.find(t => t.id === id);
      if (guru) {
        updateGuru(id, { ...(guru as any), status: bulkStatus.toLowerCase() });
      }
    });
    setShowBulkStatusModal(false);
    setToast({ type: 'success', message: `Status ${selectedIds.length} guru berhasil diubah menjadi ${bulkStatus}!` });
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    // Actually delete from database
    for (const id of selectedIds) {
      await deleteGuru(id);
    }
    setShowBulkDeleteModal(false);
    setToast({ type: 'success', message: `${selectedIds.length} data guru berhasil dihapus!` });
    setSelectedIds([]);
  };

  return (
    <AdminLayout title="Manajemen Guru">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Manajemen Guru Pembimbing
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Guru Pembimbing', value: teachers.length, sub: 'Semua terdaftar' },
            { label: 'Guru Aktif', value: aktif.length, sub: 'Sedang membimbing' },
            { label: 'Rata-rata Bimbingan', value: teachers.length ? Math.round(placements.length / teachers.length) : 0, sub: 'Siswa per guru' },
          ].map(({ label, value, sub }, index) => (
            <div 
              key={label} 
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau NIP..." className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <select value={jurusanFilter} onChange={e => setJurusanFilter(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                <option value="all">Semua Jurusan →</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
                <option value="METRO">METRO</option>
                <option value="ELIN">ELIN</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                <option value="all">Semua Status →</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <div className="ml-auto">
                <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition">
                  <Plus className="h-3.5 w-3.5" />Tambah Guru
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-3 w-12">
                    <input type="checkbox" checked={allSelected} onChange={e => handleSelectAll(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30" />
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">NIP</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Nama Lengkap</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Jurusan</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Siswa Bimbingan</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map(u => (
                  <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(u.id) ? 'bg-blue-50' : ''}`}>
                    <td className="py-3.5 px-3">
                      <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={e => handleSelectOne(u.id, e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30" />
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{u.nip || '—'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">{u.name?.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                        {(u as any).jurusan || 'RPL'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                          <span className="text-sm font-bold text-blue-600">{perGuru(u.id)}</span>
                        </div>
                        {perGuru(u.id) > 0 && (
                          <ActionMenu items={[
                            { label: 'Detail', icon: <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, onClick: () => setDetailTarget(u) },
                          ]} />
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {(u as any).status === 'nonaktif' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Nonaktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <ActionMenu items={[
                        { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => openEdit(u) },
                        { label: 'Ubah Status', icon: <RefreshCw className="h-3.5 w-3.5" />, onClick: () => { setSelectedIds([u.id]); setShowBulkStatusModal(true); } },
                        { label: 'Hapus', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => { setSelectedIds([u.id]); setShowBulkDeleteModal(true); }, danger: true, dividerBefore: true },
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
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onChangeStatus={() => setShowBulkStatusModal(true)}
          onDelete={() => setShowBulkDeleteModal(true)}
        />
      )}

      {/* Tambah modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-lg">Tambah Guru</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['name', 'Nama Lengkap', 'text'], ['email', 'Email', 'email'], ['nip_nisn', 'NIP', 'text'], ['phone', 'No. HP', 'text']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type as string} value={(form as any)[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jurusan</label>
                <select value={form.jurusan} onChange={e => setForm(prev => ({ ...prev, jurusan: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                  <option>RPL</option>
                  <option>TKJ</option>
                  <option>METRO</option>
                  <option>ELIN</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">Batal</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-lg">Edit Data Guru</h3>
              <button onClick={() => setEditTarget(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['name', 'Nama Lengkap', 'text'], ['email', 'Email', 'email'], ['nip_nisn', 'NIP', 'text'], ['phone', 'No. HP', 'text']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type as string} value={(editForm as any)[key]} onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jurusan</label>
                <select value={editForm.jurusan} onChange={e => setEditForm(prev => ({ ...prev, jurusan: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                  <option>RPL</option>
                  <option>TKJ</option>
                  <option>METRO</option>
                  <option>ELIN</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">Batal</button>
              <button onClick={() => {
                if (editTarget) {
                  handleSaveEdit();
                }
                setEditTarget(null);
              }} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Ubah Status Modal */}
      {showBulkStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Ubah Status Guru</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Perbarui status aktif untuk {selectedIds.length} guru.</p>
                </div>
              </div>
              <button onClick={() => setShowBulkStatusModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5">
              <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setShowBulkStatusModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">Batal</button>
              <button onClick={handleBulkChangeStatus} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Hapus Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md text-center">
            <div className="px-6 py-6">
              <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Hapus Data Guru?</h3>
              <p className="text-sm text-slate-600">{selectedIds.length} akun guru akan dihapus permanen.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowBulkDeleteModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">Batal</button>
              <button onClick={handleBulkDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Detail Siswa Bimbingan Modal */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Siswa Bimbingan</h3>
                <p className="text-xs text-slate-500 mt-0.5">{detailTarget.name} ({perGuru(detailTarget.id)} siswa)</p>
              </div>
              <button onClick={() => setDetailTarget(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                {placements.filter(p => p.guru_id === detailTarget.id).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {p.student_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800">{p.student_name}</p>
                      <p className="text-xs text-slate-400">{p.student_class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-blue-600">{p.dudi_name}</p>
                      <span className={`inline-block mt-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'aktif' || p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status === 'aktif' || p.status === 'approved' ? 'Aktif' : p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200">
              <button onClick={() => setDetailTarget(null)} className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
