'use client';

import { useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * Field component - Reusable form field for settings
 */
function Field({ 
  label, 
  field, 
  type = 'text',
  form,
  setForm
}: { 
  label: string; 
  field: string; 
  type?: string;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          rows={2} 
          value={String(form[field] || '')} 
          onChange={e => setForm((prev: any) => ({ ...prev, [field]: e.target.value }))} 
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" 
        />
      ) : (
        <input 
          type={type} 
          value={String(form[field] || '')} 
          onChange={e => setForm((prev: any) => ({ ...prev, [field]: e.target.value }))} 
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" 
        />
      )}
    </div>
  );
}

export default function AdminPengaturanPage() {
  const { settings, updateSettings } = useAuth();
  const [tab, setTab] = useState<'identitas' | 'halaman' | 'data'>('identitas');
  const [form, setForm] = useState({
    ...settings,
    // Halaman Depan fields
    heroTitle: settings.heroTitle || 'Magang lebih teratur.',
    heroSubtitle: settings.heroSubtitle || 'Platform manajemen magang siswa SMK yang menghubungkan sekolah, guru pembimbing, dan dunia usaha dalam satu sistem terpadu.',
    feature1: settings.feature1 || 'Penempatan magang terpusat & transparan',
    feature2: settings.feature2 || 'Monitoring kehadiran & jurnal real-time',
    feature3: settings.feature3 || 'Koordinasi sekolah, guru, dan industri',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <AdminLayout title="Pengaturan Sistem">
      <div className="space-y-5 max-w-2xl">
        <div><h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Settings className="h-5 w-5 text-blue-600" />Pengaturan Sistem</h1></div>

        {saved && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-emerald-700 font-semibold">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Pengaturan berhasil disimpan
          </div>
        )}

        {/* Tab bar */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex border-b border-slate-200">
            {([['identitas', 'Identitas Aplikasi'], ['halaman', 'Halaman Depan'], ['data', 'Data Sekolah']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {tab === 'identitas' && (
              <>
                <Field label="Nama Aplikasi" field="appName" form={form} setForm={setForm} />
                <Field label="Keterangan Aplikasi / Deskripsi" field="appDescription" type="textarea" form={form} setForm={setForm} />
                <Field label="Email Kontak" field="contactEmail" type="email" form={form} setForm={setForm} />
              </>
            )}
            {tab === 'halaman' && (
              <>
                <Field label="Judul Hero (Heading Utama)" field="heroTitle" form={form} setForm={setForm} />
                <Field label="Subjudul Hero (Deskripsi Singkat)" field="heroSubtitle" type="textarea" form={form} setForm={setForm} />
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Fitur Unggulan (3 Poin)</p>
                  <div className="space-y-3">
                    <Field label="Fitur 1" field="feature1" form={form} setForm={setForm} />
                    <Field label="Fitur 2" field="feature2" form={form} setForm={setForm} />
                    <Field label="Fitur 3" field="feature3" form={form} setForm={setForm} />
                  </div>
                </div>
              </>
            )}
            {tab === 'data' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nama Sekolah" field="schoolName" form={form} setForm={setForm} />
                  <Field label="Website Sekolah" field="schoolWebsite" form={form} setForm={setForm} />
                </div>
                <div>
                  <Field label="Nama Kepala Sekolah" field="principalName" form={form} setForm={setForm} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="NIP Kepala Sekolah" field="principalNip" form={form} setForm={setForm} />
                  <Field label="Tahun Ajaran Aktif" field="activeAcademicYear" form={form} setForm={setForm} />
                </div>
                <div>
                  <Field label="Alamat Lengkap" field="schoolAddress" type="textarea" form={form} setForm={setForm} />
                </div>
                <div>
                  <Field label="Nomor Telepon" field="schoolPhone" form={form} setForm={setForm} />
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition active:scale-95">
          <CheckCircle2 className="h-4 w-4" />
          Simpan Pengaturan
        </button>
      </div>
    </AdminLayout>
  );
}
