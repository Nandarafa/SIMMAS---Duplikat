'use client';

import { useRef, useState } from 'react';
import { MapPin, Plus, Calendar, Building2, X, Image, PenLine } from 'lucide-react';
import GuruLayout from '@/components/GuruLayout';
import { useAuth } from '@/context/AuthContext';

interface Kunjungan {
  id: string;
  dudi_name: string;
  catatan: string;
  tanggal: string;
  foto?: string; // base64 or blob URL
}

const INITIAL_KUNJUNGAN: Kunjungan[] = [
  { id: 'k-1', dudi_name: 'PT. Universal Big Data', catatan: 'Monitoring rutin perkembangan siswa di industri. Kondisi baik dan lancar.', tanggal: '2026-09-16' },
  { id: 'k-2', dudi_name: 'PT. Universal Big Data', catatan: 'Bagus', tanggal: '2026-08-14' },
];

export default function GuruKunjunganPage() {
  const { currentUser, placements } = useAuth();
  const [kunjunganList, setKunjunganList] = useState<Kunjungan[]>(INITIAL_KUNJUNGAN);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dudi_name: '', dudi_custom: '', catatan: '', tanggal: new Date().toISOString().slice(0, 10) });
  const [useCustomDudi, setUseCustomDudi] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myStudents = placements.filter(p => p.guru_id === currentUser?.id || p.guru_id === 'u-guru-1');
  const dudiList = [...new Set(myStudents.map(p => p.dudi_name))];

  const filtered = kunjunganList.filter(k => !search || k.dudi_name.toLowerCase().includes(search.toLowerCase()));
  const monthStr = new Date().toISOString().slice(0, 7);
  const bulanIni = kunjunganList.filter(k => k.tanggal.startsWith(monthStr)).length;
  const dudiDikunjungi = new Set(kunjunganList.map(k => k.dudi_name)).size;

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoPreview(url);
  };

  const handleRemoveFoto = () => {
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setForm({ dudi_name: '', dudi_custom: '', catatan: '', tanggal: new Date().toISOString().slice(0, 10) });
    setUseCustomDudi(false);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    const dudiName = useCustomDudi ? form.dudi_custom.trim() : form.dudi_name;
    if (!dudiName) return;
    const newK: Kunjungan = {
      id: 'k-' + Date.now(),
      dudi_name: dudiName,
      catatan: form.catatan,
      tanggal: form.tanggal,
      foto: fotoPreview ?? undefined,
    };
    setKunjunganList(prev => [newK, ...prev]);
    resetForm();
    setShowForm(false);
  };

  return (
    <GuruLayout title="Kunjungan">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Kunjungan Lapangan
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Kunjungan', value: kunjunganList.length, icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Seluruh kunjungan tercatat' },
            { label: 'Bulan Ini', value: bulanIni, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Kunjungan paling terbaru' },
            { label: 'DUDI Dikunjungi', value: dudiDikunjungi, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Mitra industri unik' },
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

        {/* List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari DUDI atau catatan..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-500">{filtered.length} Kunjungan</span>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Kunjungan
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada kunjungan tercatat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(k => (
                <div key={k.id} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200">
                  {/* Foto thumbnail or icon */}
                  {k.foto ? (
                    <button
                      onClick={() => setPhotoModal(k.foto!)}
                      className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:ring-2 hover:ring-blue-500 transition"
                    >
                      <img src={k.foto} alt="foto kunjungan" className="h-full w-full object-cover" />
                    </button>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{k.dudi_name}</p>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{k.catatan || 'Tidak ada catatan.'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(k.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
              <h3 className="font-bold text-lg text-slate-800">Tambah Kunjungan</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              {/* DUDI / Perusahaan */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  DUDI / Perusahaan
                </label>
                {!useCustomDudi ? (
                  <div className="flex gap-2">
                    <select
                      value={form.dudi_name}
                      onChange={e => setForm(prev => ({ ...prev, dudi_name: e.target.value }))}
                      className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      <option value="">Pilih DUDI...</option>
                      {dudiList.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {/* Switch to custom input */}
                    <button
                      type="button"
                      onClick={() => setUseCustomDudi(true)}
                      className="shrink-0 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition text-xs font-semibold flex items-center gap-1"
                      title="Input nama DUDI sendiri"
                    >
                      <PenLine className="h-3.5 w-3.5" />
                      Input Sendiri
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.dudi_custom}
                      onChange={e => setForm(prev => ({ ...prev, dudi_custom: e.target.value }))}
                      placeholder="Nama perusahaan / DUDI..."
                      className="flex-1 px-3 py-2.5 text-sm border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      autoFocus
                    />
                    {/* Switch back to dropdown */}
                    <button
                      type="button"
                      onClick={() => { setUseCustomDudi(false); setForm(prev => ({ ...prev, dudi_custom: '' })); }}
                      className="shrink-0 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition text-xs font-semibold"
                    >
                      Pilih List
                    </button>
                  </div>
                )}
              </div>

              {/* Tanggal Kunjungan */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Kunjungan</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={e => setForm(prev => ({ ...prev, tanggal: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              {/* Catatan Kunjungan */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Catatan Kunjungan</label>
                <textarea
                  value={form.catatan}
                  onChange={e => setForm(prev => ({ ...prev, catatan: e.target.value }))}
                  placeholder="Tuliskan hasil observasi dan kondisi siswa..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              {/* Foto Kunjungan (opsional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Foto Kunjungan
                  <span className="ml-1.5 text-[10px] font-normal text-slate-400 normal-case">(opsional)</span>
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />

                {fotoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200">
                    <img src={fotoPreview} alt="Preview foto" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="absolute top-2 right-2 h-7 w-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl py-6 text-slate-400 hover:text-blue-500 transition-all duration-150"
                  >
                    <Image className="h-6 w-6" />
                    <span className="text-xs font-medium">Klik untuk pilih foto dari folder</span>
                    <span className="text-[10px] text-slate-300">JPG, PNG, WEBP</span>
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4 shrink-0">
              <button
                onClick={() => { resetForm(); setShowForm(false); }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
              >
                Simpan Kunjungan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo viewer modal */}
      {photoModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPhotoModal(null)}
        >
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPhotoModal(null)}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-900 transition z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={photoModal} alt="Foto kunjungan" className="w-full rounded-2xl" />
          </div>
        </div>
      )}
    </GuruLayout>
  );
}
