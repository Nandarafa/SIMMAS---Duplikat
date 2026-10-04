'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Search, Plus, X, Pencil, MapPin, ShieldCheck, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import ActionMenu from '@/components/ActionMenu';
import Pagination from '@/components/Pagination';
import Toast from '@/components/Toast';
import { useAuth } from '@/context/AuthContext';
import type { Dudi } from '@/types/database';

export default function AdminDudiPage() {
  const router = useRouter();
  const { dudis, placements, addDudi, updateDudi } = useAuth();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', industry_type: '', address: '', pic_name: '', pic_phone: '', quota: '10' });
  const [editTarget, setEditTarget] = useState<Dudi | null>(null);
  const [editForm, setEditForm] = useState({ name: '', industry_type: '', address: '', pic_name: '', pic_phone: '', quota: '' });
  const [historyTarget, setHistoryTarget] = useState<Dudi | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const totalPerusahaan = dudis.length;
  const terverifikasi = dudis.filter(d => d.status === 'aktif' || d.status === 'active').length;
  const menuguValidasi = dudis.filter(d => d.status === 'inactive').length;
  const siswaAktif = placements.filter(p => p.status === 'aktif' || p.status === 'approved').length;

  const filtered = dudis.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.industry_type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addDudi({ name: form.name, industry_type: form.industry_type, address: form.address, pic_name: form.pic_name, pic_phone: form.pic_phone, quota: parseInt(form.quota) || 10, status: 'active' });
    setForm({ name: '', industry_type: '', address: '', pic_name: '', pic_phone: '', quota: '10' });
    setShowForm(false);
    setToast({ type: 'success', message: 'Data DUDI berhasil ditambahkan!' });
  };

  const openEdit = (d: Dudi) => {
    setEditTarget(d);
    setEditForm({ name: d.name, industry_type: d.industry_type, address: d.address, pic_name: d.pic_name, pic_phone: d.pic_phone, quota: String(d.quota) });
  };

  const handleSaveEdit = () => {
    if (!editTarget) return;
    updateDudi(editTarget.id, { ...editForm, quota: parseInt(editForm.quota) || editTarget.quota });
    setEditTarget(null);
    setToast({ type: 'success', message: 'Data DUDI berhasil diperbarui!' });
  };

  const toggleStatus = (d: Dudi) => {
    const next = (d.status === 'active' || d.status === 'aktif') ? 'inactive' : 'active';
    updateDudi(d.id, { status: next as Dudi['status'] });
    setToast({ type: 'success', message: 'Status validasi berhasil diubah!' });
  };

  const handleOpenHistory = (d: Dudi) => {
    // Show modal first, then redirect after 1.5 seconds
    setHistoryTarget(d);
    setTimeout(() => {
      setHistoryTarget(null);
      router.push(`/dashboard/admin/monitoring?dudi=${encodeURIComponent(d.name)}`);
    }, 1500);
  };

  return (
    <AdminLayout title="Manajemen DUDI">
      <div className="space-y-5">
        <div><h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-blue-600" />Manajemen DUDI</h1></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Perusahaan', value: totalPerusahaan },
            { label: 'Terverifikasi', value: terverifikasi },
            { label: 'Menunggu Validasi', value: menuguValidasi },
            { label: 'Siswa Ditempatkan', value: siswaAktif },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari perusahaan atau industri..." className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-56" />
            </div>
            <select className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option>Semua Status →</option>
            </select>
            <div className="ml-auto">
              <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition">
                <Plus className="h-3.5 w-3.5" />Tambah DUDI
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Perusahaan</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">PIC &amp; Kontak</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Bidang Usaha</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Kuota</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Siswa Aktif</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map(d => {
                  const activeCount = placements.filter(p => p.dudi_id === d.id && (p.status === 'aktif' || p.status === 'approved')).length;
                  const isVerified = d.status === 'aktif' || d.status === 'active';
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{d.name}</p>
                            <p className="text-xs text-slate-400">{d.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="text-xs text-slate-700">{d.pic_name}</p>
                        <p className="text-xs text-slate-400">{d.pic_phone}</p>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-600">{d.industry_type}</td>
                      <td className="py-3.5 px-3 text-sm font-semibold text-slate-700">{d.quota}</td>
                      <td className="py-3.5 px-3 text-sm font-semibold text-slate-700">{activeCount}</td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {isVerified ? 'Terverifikasi' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <ActionMenu items={[
                          {
                            label: 'Edit Data',
                            icon: <Pencil className="h-3.5 w-3.5" />,
                            onClick: () => openEdit(d),
                          },
                          {
                            label: 'Riwayat Kunjungan',
                            icon: <MapPin className="h-3.5 w-3.5" />,
                            onClick: () => handleOpenHistory(d),
                          },
                          {
                            label: 'Ubah Status Validasi',
                            icon: <ShieldCheck className="h-3.5 w-3.5" />,
                            onClick: () => toggleStatus(d),
                          },
                          {
                            label: 'Hapus',
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                            onClick: () => alert(`Hapus ${d.name}`),
                            danger: true,
                            dividerBefore: true,
                          },
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

      {/* Tambah DUDI modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-lg">Tambah Mitra DUDI</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['name', 'Nama Perusahaan'], ['industry_type', 'Bidang Industri'], ['address', 'Alamat'], ['pic_name', 'Nama PIC'], ['pic_phone', 'No. HP PIC'], ['quota', 'Kuota']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={key === 'quota' ? 'number' : 'text'} value={(form as any)[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">Batal</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit DUDI modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-lg">Edit Data DUDI</h3>
              <button onClick={() => setEditTarget(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['name', 'Nama Perusahaan'], ['industry_type', 'Bidang Industri'], ['address', 'Alamat'], ['pic_name', 'Nama PIC'], ['pic_phone', 'No. HP PIC'], ['quota', 'Kuota']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={key === 'quota' ? 'number' : 'text'} value={(editForm as any)[key]} onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">Batal</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Riwayat Kunjungan modal - redirect notification */}
      {historyTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-8 text-center">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-blue-600 animate-pulse" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Membuka Riwayat Kunjungan</h3>
              <p className="text-sm text-slate-600 mb-1">{historyTarget.name}</p>
              <p className="text-xs text-slate-400">Mengalihkan ke halaman monitoring...</p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
