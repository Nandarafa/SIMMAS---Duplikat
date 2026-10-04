'use client';

import { useState } from 'react';
import { Users, Search, Plus, X, Pencil, UserCheck, RefreshCw, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/Pagination';
import BulkActionBar from '@/components/BulkActionBar';
import Toast from '@/components/Toast';
import ActionMenu from '@/components/ActionMenu';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile } from '@/types/database';

export default function AdminSiswaPage() {
  const { users, placements, addUser, updateUser } = useAuth();
  const [search, setSearch] = useState('');
  const [kelasFilter, setKelasFilter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', nip_nisn: '', school_class: 'XII RPL 1', major: 'RPL', phone: '' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals
  const [editTarget, setEditTarget] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', nip_nisn: '', school_class: '', major: '', phone: '' });
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const students = users.filter(u => u.role === 'siswa');
  const sedangMagang = students.filter(u => placements.some(p => p.student_id === u.id && (p.status === 'aktif' || p.status === 'approved')));
  const belumMagang = students.filter(u => !placements.some(p => p.student_id === u.id));
  const lulusMagang = students.filter(u => placements.some(p => p.student_id === u.id && p.status === 'completed'));

  const getStudentPlacement = (id: string) => placements.find(p => p.student_id === id);
  const getStatusLabel = (id: string) => {
    const p = getStudentPlacement(id);
    if (!p) return { label: 'Belum Magang', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
    if (p.status === 'aktif' || p.status === 'approved') return { label: 'Sedang Magang', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
    if (p.status === 'pending') return { label: 'Menunggu', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
    return { label: p.status, color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
  };

  let filtered = students.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.nip_nisn?.includes(search) || u.email.includes(search)) &&
    (kelasFilter === 'all' || u.school_class === kelasFilter) &&
    (filterStatus === 'all' || (() => {
      const p = getStudentPlacement(u.id);
      if (filterStatus === 'aktif') return p?.status === 'aktif' || p?.status === 'approved';
      if (filterStatus === 'belum') return !p;
      return true;
    })())
  );

  // Pagination
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
    addUser({ ...form, role: 'siswa' });
    setForm({ name: '', email: '', nip_nisn: '', school_class: 'XII RPL 1', major: 'RPL', phone: '' });
    setShowForm(false);
    setToast({ type: 'success', message: 'Data siswa berhasil ditambahkan!' });
  };

  const openEdit = (u: UserProfile) => {
    setEditTarget(u);
    setEditForm({ name: u.name, email: u.email, nip_nisn: u.nip_nisn || '', school_class: u.school_class || '', major: u.major || '', phone: u.phone || '' });
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteModal(false);
    setToast({ type: 'success', message: `${selectedIds.length} data siswa berhasil dihapus!` });
    setSelectedIds([]);
  };

  return (
    <AdminLayout title="Manajemen Siswa">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Manajemen Siswa
          </h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Siswa', value: students.length },
            { label: 'Sedang Magang', value: sedangMagang.length },
            { label: 'Belum Magang', value: belumMagang.length },
            { label: 'Lulus Magang', value: lulusMagang.length },
          ].map(({ label, value }, index) => (
            <div 
              key={label} 
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, NIS, atau email..." className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                <option value="all">Semua Kelas →</option>
                <option value="XII RPL 1">XII RPL 1</option>
                <option value="XII RPL 2">XII RPL 2</option>
                <option value="XII TKJ 1">XII TKJ 1</option>
                <option value="XII TKJ 2">XII TKJ 2</option>
                <option value="XII ELIN 1">XII ELIN 1</option>
                <option value="XII METRO 1">XII METRO 1</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                <option value="all">Semua Status →</option>
                <option value="aktif">Sedang Magang</option>
                <option value="belum">Belum Magang</option>
              </select>
              <div className="ml-auto">
                <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition">
                  <Plus className="h-3.5 w-3.5" />Tambah Siswa
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
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">NIS</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Nama Siswa</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Kelas</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Tempat Magang</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map(u => {
                  const p = getStudentPlacement(u.id);
                  const st = getStatusLabel(u.id);
                  return (
                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(u.id) ? 'bg-blue-50' : ''}`}>
                      <td className="py-3.5 px-3">
                        <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={e => handleSelectOne(u.id, e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30" />
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{u.nip_nisn || '—'}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">{u.name?.charAt(0)}</div>
                          <div>
                            <p className="font-semibold text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          {u.school_class || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-xs font-semibold text-blue-600">{p?.dudi_name || '—'}</td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${st.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />{st.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <ActionMenu items={[
                          { label: 'Edit Data', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => openEdit(u) },
                          { label: 'Plot Pembimbing', icon: <UserCheck className="h-3.5 w-3.5" />, onClick: () => setToast({ type: 'success', message: `Plot pembimbing untuk ${u.name}` }) },
                          { label: 'Hapus', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => { setSelectedIds([u.id]); setShowBulkDeleteModal(true); }, danger: true, dividerBefore: true },
                        ]} />
                      </td>
                    </tr>
                  );
                })}
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
          onDelete={() => setShowBulkDeleteModal(true)}
        />
      )}

      {/* Tambah modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-lg">Tambah Siswa</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['name', 'Nama Lengkap', 'text'], ['email', 'Email', 'email'], ['nip_nisn', 'NIS', 'text'], ['phone', 'No. HP', 'text']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type as string} value={(form as any)[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kelas</label>
                <select value={form.school_class} onChange={e => setForm(prev => ({ ...prev, school_class: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                  <option>XII RPL 1</option>
                  <option>XII RPL 2</option>
                  <option>XII TKJ 1</option>
                  <option>XII TKJ 2</option>
                  <option>XII ELIN 1</option>
                  <option>XII METRO 1</option>
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
              <h3 className="font-bold text-lg">Edit Data Siswa</h3>
              <button onClick={() => setEditTarget(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['name', 'Nama Lengkap', 'text'], ['email', 'Email', 'email'], ['nip_nisn', 'NIS', 'text'], ['phone', 'No. HP', 'text']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type as string} value={(editForm as any)[key]} onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kelas</label>
                <select value={editForm.school_class} onChange={e => setEditForm(prev => ({ ...prev, school_class: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                  <option>XII RPL 1</option>
                  <option>XII RPL 2</option>
                  <option>XII TKJ 1</option>
                  <option>XII TKJ 2</option>
                  <option>XII ELIN 1</option>
                  <option>XII METRO 1</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">Batal</button>
              <button onClick={() => {
                if (editTarget) {
                  updateUser(editTarget.id, { ...editForm, school_class: editForm.school_class, major: editForm.major } as any);
                  setToast({ type: 'success', message: 'Data siswa berhasil diperbarui!' });
                }
                setEditTarget(null);
              }} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">Simpan</button>
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
              <h3 className="font-bold text-xl text-slate-900 mb-2">Hapus Data Siswa?</h3>
              <p className="text-sm text-slate-600">{selectedIds.length} akun siswa akan dihapus permanen.</p>
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
    </AdminLayout>
  );
}
