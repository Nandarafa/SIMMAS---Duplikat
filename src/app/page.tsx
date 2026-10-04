'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardList,
  Monitor,
  Users,
  GraduationCap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/* ── Intersection-observer hook for scroll animations ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const tableRows = [
  ['Dewi Magang', 'A1', 'PT. Universal Big Data', 'selesai'],
  ['Nasrul Sugriono', 'A2', 'PT. Universal Big Data', 'aktif'],
  ['Fauzi Hidayat', 'A3', 'PT. Suka', 'menunggu'],
  ['Yudhan Thong', 'A4', 'PT. Universal Big Data', 'aktif'],
  ['Beni Oki', 'A4', 'PT. Jaya Diok', 'aktif'],
  ['Daffa Aufa', 'A4', 'PT. Jaya Diok', 'aktif'],
  ['Bawat User', 'A5', 'PT. Universal Big Data', 'aktif'],
  ['SYS DIMAMRI', 'A5', 'PT. Telkom Sidoarjo', 'menunggu'],
  ['Goonzy Arvan', 'A5', 'PT. Universal Big Data', 'menunggu'],
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    selesai: 'bg-emerald-100 text-emerald-700',
    aktif: 'bg-blue-100 text-blue-700',
    menunggu: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold capitalize ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

/* ── Animated counter ── */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(t); }
      else setCount(start);
    }, 30);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const hero = useInView(0.1);
  const fitur = useInView(0.1);
  const akurasi = useInView(0.1);
  const langkah = useInView(0.1);
  const cta = useInView(0.1);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-28">
          {/* Blue diagonal bg */}
          <div className="absolute inset-y-0 right-0 w-[42%] hidden lg:block bg-blue-600 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
          {/* Decorative circles */}
          <div className="absolute -left-24 top-40 h-64 w-64 rounded-full border-[28px] border-slate-100 hidden md:block animate-[spin_30s_linear_infinite]" />
          <div className="absolute right-[8%] top-16 h-40 w-40 rounded-full border-[22px] border-white/20 hidden lg:block animate-[spin_20s_linear_infinite_reverse]" />

          <div
            ref={hero.ref}
            className="relative container mx-auto px-6 max-w-6xl"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div
                className="max-w-xl"
                style={{
                  opacity: hero.inView ? 1 : 0,
                  transform: hero.inView ? 'translateY(0)' : 'translateY(32px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
              >
                <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase mb-5">
                  Sistem Informasi Manajemen Magang Siswa
                </p>
                <h1 className="text-5xl md:text-[68px] font-extrabold text-slate-900 leading-[1.0] tracking-tight">
                  Magang
                  <br />
                  lebih
                  <br />
                  teratur.
                </h1>
                <p className="mt-6 text-slate-500 leading-relaxed max-w-md">
                  Platform manajemen magang siswa SMK yang menghubungkan sekolah, guru pembimbing, dan dunia usaha dalam satu sistem terpadu.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    'Penempatan magang terpusat & transparan',
                    'Monitoring kehadiran & jurnal real-time',
                    'Koordinasi sekolah, guru, dan industri',
                  ].map((item, i) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-slate-600"
                      style={{
                        opacity: hero.inView ? 1 : 0,
                        transform: hero.inView ? 'translateX(0)' : 'translateX(-16px)',
                        transition: `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`,
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-8 flex flex-wrap gap-3"
                  style={{
                    opacity: hero.inView ? 1 : 0,
                    transition: 'opacity 0.6s ease 0.7s',
                  }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-3 rounded-full text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200"
                  >
                    Mulai Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#fitur"
                    className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Lihat Fitur
                  </a>
                </div>
              </div>

              {/* Right: Dashboard preview */}
              <div
                className="relative lg:pl-6"
                style={{
                  opacity: hero.inView ? 1 : 0,
                  transform: hero.inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
                }}
              >
                {/* LIVE badge */}
                <div className="absolute -top-3 right-4 z-10 bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg animate-[pulse_2s_ease-in-out_infinite]">
                  <div className="text-[10px] text-blue-200">LIVE</div>
                  <div className="text-base font-extrabold leading-none mt-0.5">324 Siswa</div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden rotate-[-1deg] hover:rotate-0 transition-transform duration-500 lg:ml-8">
                  {/* Window chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <div className="ml-2 flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-blue-600 flex items-center justify-center">
                        <GraduationCap className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700">SIMMAS</span>
                    </div>
                  </div>
                  <div className="flex min-h-[300px]">
                    {/* Sidebar */}
                    <aside className="w-24 shrink-0 border-r border-slate-100 p-2.5 text-[9px] text-slate-500 space-y-1.5 bg-white">
                      <p className="font-bold text-slate-800 text-[10px] mb-2.5">UTAMA</p>
                      {['Beranda', 'Data Siswa', 'Data Guru', 'Mitra DUDI', 'Penempatan', 'Permohonan', 'Laporan'].map((item, i) => (
                        <p
                          key={item}
                          className={`py-0.5 px-1 rounded text-[9px] ${i === 0 ? 'bg-blue-600 text-white font-semibold' : ''}`}
                        >
                          {item}
                        </p>
                      ))}
                    </aside>
                    {/* Content */}
                    <div className="flex-1 p-3">
                      <p className="text-[10px] font-semibold text-slate-800 mb-2">Dashboard</p>
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        {[['Total Siswa', '324'], ['Total Guru', '45'], ['Mitra DUDI', '112']].map(([label, value]) => (
                          <div key={label} className="rounded-lg border border-slate-100 p-2 text-center">
                            <p className="text-[8px] text-slate-400">{label}</p>
                            <p className="text-xs font-bold text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] font-semibold text-slate-600 mb-1.5">Daftar Permohonan Magang Siswa</p>
                      <table className="w-full text-[7.5px]">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-100">
                            <th className="text-left pb-1 font-medium">Nama Siswa</th>
                            <th className="text-left pb-1 font-medium">Kelas</th>
                            <th className="text-left pb-1 font-medium">Perusahaan Mitra</th>
                            <th className="text-left pb-1 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.map((row, i) => (
                            <tr key={i} className="border-t border-slate-50 text-slate-600">
                              <td className="py-0.5">{row[0]}</td>
                              <td>{row[1]}</td>
                              <td>{row[2]}</td>
                              <td><StatusPill status={row[3]} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FITUR PLATFORM ── */}
        <section id="fitur" className="relative py-20 bg-[#f7f8fc]">
          <div className="absolute right-8 top-8 h-48 w-48 rounded-full border-[22px] border-slate-200/60 hidden lg:block" />
          <div
            ref={fitur.ref}
            className="container mx-auto px-6 max-w-6xl relative"
          >
            <div
              style={{
                opacity: fitur.inView ? 1 : 0,
                transform: fitur.inView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mb-3">Fitur Platform</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-12">
                Solusi untuk
                <br />
                <span className="text-blue-600">setiap peran.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: BookOpen,
                  kicker: 'Untuk Siswa',
                  title: 'Jurnal & Kehadiran',
                  desc: 'Catat jurnal harian dan isi daftar hadir secara digital dari mana saja, kapan saja.',
                  delay: 0,
                },
                {
                  icon: Users,
                  kicker: 'Untuk Guru Pembimbing',
                  title: 'Monitoring Terpadu',
                  desc: 'Pantau aktivitas, setujui jurnal, dan evaluasi performa siswa dalam satu dashboard.',
                  delay: 0.1,
                },
                {
                  icon: Building2,
                  kicker: 'Untuk Admin Sekolah',
                  title: 'Manajemen Penempatan',
                  desc: 'Kelola data DUDI, plotting pembimbing, dan cetak surat pengantar secara otomatis.',
                  delay: 0.2,
                },
              ].map(({ icon: Icon, kicker, title, desc, delay }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  style={{
                    opacity: fitur.inView ? 1 : 0,
                    transform: fitur.inView ? 'translateY(0)' : 'translateY(32px)',
                    transition: `opacity 0.6s ease ${delay + 0.2}s, transform 0.6s ease ${delay + 0.2}s, box-shadow 0.3s, translate 0.3s`,
                  }}
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold mb-1">{kicker}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AKURASI DATA ── */}
        <section id="keamanan" className="py-20 bg-[#f7f8fc]">
          <div
            ref={akurasi.ref}
            className="container mx-auto px-6 max-w-6xl"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left text */}
              <div
                style={{
                  opacity: akurasi.inView ? 1 : 0,
                  transform: akurasi.inView ? 'translateX(0)' : 'translateX(-24px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
              >
                <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mb-3">Lebih dari Catatan Digital</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                  Akurasi data,
                  <br />
                  <span className="text-blue-600">setiap hari.</span>
                </h2>
                <p className="text-slate-500 mb-6 max-w-md">
                  SIMMAS memastikan akurasi data kehadiran dengan fitur pencatatan presisi dan validasi lokasi magang.
                </p>
                <ul className="space-y-2.5">
                  {['Export Laporan Otomatis (PDF/Excel)', 'Notifikasi Real-time untuk Guru', 'Riwayat Penempatan per Angkatan'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right stats card */}
              <div
                className="relative"
                style={{
                  opacity: akurasi.inView ? 1 : 0,
                  transform: akurasi.inView ? 'translateX(0)' : 'translateX(24px)',
                  transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
                }}
              >
                <div className="absolute -inset-3 rounded-[28px] bg-blue-600 rotate-2" />
                <div className="relative bg-white rounded-[24px] p-6 grid grid-cols-2 gap-4 shadow-xl">
                  <p className="col-span-2 text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Ringkasan Mingguan</p>
                  {[
                    { label: 'Jurnal Disetujui', to: 142, suffix: '' },
                    { label: 'Absensi Tercatat', to: 98, suffix: '%' },
                    { label: 'Siswa Aktif', to: 324, suffix: '' },
                    { label: 'Perusahaan Mitra', to: 200, suffix: '+' },
                  ].map(({ label, to, suffix }) => (
                    <div key={label} className="rounded-2xl border border-slate-100 p-5">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400 font-semibold mb-3">{label}</p>
                      <p className="text-3xl font-extrabold text-slate-900">
                        <CountUp to={to} suffix={suffix} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARA KERJA ── */}
        <section id="panduan" className="relative py-20 bg-[#f7f8fc]">
          <div className="absolute -left-16 bottom-10 h-48 w-48 rounded-full border-[24px] border-slate-200/80 hidden md:block" />
          <div
            ref={langkah.ref}
            className="container mx-auto px-6 max-w-6xl relative"
          >
            <div
              style={{
                opacity: langkah.inView ? 1 : 0,
                transform: langkah.inView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mb-3">Cara Kerja</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-12">
                Empat langkah,
                <br />
                <span className="text-blue-600">satu sistem.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-px bg-slate-200" />
              {[
                { n: '01', icon: Building2, title: 'Registrasi DUDI', desc: 'Admin sekolah mendaftarkan daftar industri (DUDI) dan menetapkan kuota penempatan siswa.', delay: 0 },
                { n: '02', icon: Users, title: 'Pengajuan Siswa', desc: 'Siswa memilih atau mengajukan tempat magang melalui dashboard masing-masing.', delay: 0.1 },
                { n: '03', icon: ClipboardList, title: 'Persetujuan & Surat', desc: 'Sekolah mencetak surat pengantar otomatis untuk diserahkan ke pihak industri.', delay: 0.2 },
                { n: '04', icon: Monitor, title: 'Monitoring', desc: 'Siswa mengisi jurnal harian, guru memantau perkembangan secara real-time dari sistem.', delay: 0.3 },
              ].map(({ n, icon: Icon, title, desc, delay }) => (
                <div
                  key={n}
                  className="relative bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  style={{
                    opacity: langkah.inView ? 1 : 0,
                    transform: langkah.inView ? 'translateY(0)' : 'translateY(32px)',
                    transition: `opacity 0.6s ease ${delay + 0.1}s, transform 0.6s ease ${delay + 0.1}s, box-shadow 0.3s, translate 0.3s`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-blue-600">{n}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="relative bg-blue-600 py-24 overflow-hidden"
          ref={cta.ref}
        >
          <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full border-[28px] border-white/10" />
          <div className="absolute -right-10 top-0 h-64 w-64 rounded-full border-[32px] border-white/10" />
          <div
            className="relative text-center px-6 max-w-2xl mx-auto"
            style={{
              opacity: cta.inView ? 1 : 0,
              transform: cta.inView ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-blue-100 uppercase mb-4">Mulai Sekarang</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Siap untuk
              <br />
              digitalisasi
              <br />
              magang?
            </h2>
            <p className="text-blue-100 mb-8">
              Tingkatkan efisiensi pemantauan dan evaluasi siswa magang dengan platform yang dirancang untuk produktivitas maksimal.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 active:scale-95 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-lg"
            >
              Masuk ke Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
