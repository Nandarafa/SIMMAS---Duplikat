'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, GraduationCap, CheckCircle2, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const demoAccounts = [
  { email: 'admin@simmas.sch.id', password: 'admin123', role: 'ADMIN' },
  { email: 'guru@simmas.sch.id', password: 'guru123', role: 'GURU' },
  { email: 'siswa@simmas.sch.id', password: 'siswa123', role: 'SISWA' },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Email dan password harus diisi'); return; }
    setLoading(true);
    setError('');
    const ok = await loginWithCredentials(email, password);
    if (!ok) {
      setLoading(false);
      setError('Email atau password salah');
      return;
    }
    // Show redirect screen before navigating
    setLoading(false);
    setRedirecting(true);
    setTimeout(() => router.push('/dashboard'), 1600);
  };

  // ── Redirect / loading screen ──
  if (redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb]">
        <div className="relative mb-8">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-[28px] bg-blue-100 animate-ping opacity-40" />
          <div className="relative h-20 w-20 rounded-[24px] bg-white shadow-xl flex items-center justify-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-blue-600 mb-3">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-semibold">Autentikasi Berhasil</span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Mengalihkan ke Dashboard...</h2>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
          Mohon tunggu sebentar, sedang menyiapkan data dashooard Anda.
        </p>

        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5 text-sm text-slate-500 shadow-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
          Memuat halaman...
        </div>
      </div>
    );
  }

  const fillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── LEFT PANEL ── */}
      <section className="relative hidden lg:flex flex-col justify-between bg-blue-600 text-white p-10 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-10 h-72 w-72 rounded-full border-[36px] border-white/10 animate-[spin_30s_linear_infinite]" />
        <div className="absolute right-24 bottom-32 h-56 w-56 rounded-full border-[28px] border-white/10 animate-[spin_20s_linear_infinite_reverse]" />
        <div className="absolute left-8 bottom-8 h-32 w-32 rounded-full border-[18px] border-white/10" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">SIMMAS</span>
        </div>

        {/* Hero text */}
        <div className="relative max-w-md">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-blue-100 uppercase mb-5">
            Sistem Informasi Manajemen Magang Siswa
          </p>
          <h1 className="text-5xl font-extrabold leading-tight mb-5">
            Magang
            <br />
            lebih
            <br />
            teratur.
          </h1>
          <p className="text-blue-100 leading-relaxed mb-8">
            Platform manajemen magang siswa SMK yang menghubungkan sekolah, guru pembimbing, dan dunia usaha dalam satu sistem terpadu.
          </p>
          <ul className="space-y-2.5 text-sm text-blue-50">
            {['Penempatan magang terpusat & transparan', 'Monitoring kehadiran & jurnal real-time', 'Koordinasi sekolah, guru, dan industri'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-6 pt-8 border-t border-white/15">
          {[['50+', 'SMK Aktif'], ['10k+', 'Siswa Terdaftar'], ['200+', 'Mitra DUDI']].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-extrabold">{val}</p>
              <p className="text-xs text-blue-100">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RIGHT PANEL ── */}
      <section className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">SIMMAS</span>
          </div>

          <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mb-2">Portal Masuk</p>
          <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-1.5">
            Masuk ke
            <br />
            akun Anda.
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Gunakan email sekolah dan password yang diberikan oleh admin sekolah Anda.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
                Email Sekolah
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">Password</label>
                <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-wider">
                  LUPA?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-full disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-600/25 mt-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-10">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase mb-3">Akun Demo</p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-150 group"
                >
                  <span className="text-slate-700 group-hover:text-blue-700">{acc.email}</span>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-blue-500">{acc.role}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Klik akun demo untuk mengisi email dan password secara otomatis.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
