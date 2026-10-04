'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import GuruLayout from '@/components/GuruLayout';

export default function GuruUbahPasswordPage() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.current || !form.newPass || !form.confirm) { setError('Semua field harus diisi'); return; }
    if (form.newPass !== form.confirm) { setError('Konfirmasi password tidak cocok'); return; }
    if (form.newPass.length < 6) { setError('Password baru minimal 6 karakter'); return; }
    setError(''); setSuccess(true);
    setForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <GuruLayout title="Ubah Kata Sandi">
      <div className="max-w-md">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-blue-600" />
          Ubah Kata Sandi
        </h1>
        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Password berhasil diubah!
          </div>
        )}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          {(['current', 'newPass', 'confirm'] as const).map((key, i) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {key === 'current' ? 'Password Saat Ini' : key === 'newPass' ? 'Password Baru' : 'Konfirmasi Password Baru'}
              </label>
              <div className="relative">
                <input
                  type={show[key] ? 'text' : 'password'}
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={key === 'current' ? '••••••••' : key === 'newPass' ? 'Min. 6 karakter' : 'Ulangi password baru'}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShow(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition mt-2">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </GuruLayout>
  );
}
