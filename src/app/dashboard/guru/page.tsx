'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Users, CheckCircle2, ArrowRight, Clock, MapPin, FileCheck } from 'lucide-react';
import GuruLayout from '@/components/GuruLayout';
import { useAuth } from '@/context/AuthContext';

export default function GuruDashboardPage() {
  const router = useRouter();
  const { currentUser, placements, journals, attendances } = useAuth();

  const myStudents = placements.filter(p => p.guru_id === currentUser?.id || p.guru_id === 'u-guru-1');
  const pendingPlacements = placements.filter(p => p.status === 'pending');
  
  // SPECIAL: If logged in as guru@simmas.sch.id, show ALL students
  const isMainGuru = currentUser?.email === 'guru@simmas.sch.id';
  const allStudents = isMainGuru ? placements : myStudents;
  
  // Get student IDs
  const myStudentIds = allStudents.map(p => p.student_id);
  
  // Only count journals from MY students (or ALL if main guru)
  const pendingJournals = journals.filter(j => 
    j.status === 'pending' && myStudentIds.includes(j.student_id)
  );
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttendances = attendances.filter(a => a.date === todayStr && myStudentIds.includes(a.student_id));
  const hadir = todayAttendances.filter(a => a.status === 'hadir').length;

  const today = new Date();
  const dayName = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <GuruLayout title="Dashboard">
      <div className="space-y-5 animate-fadeIn">
        {/* Welcome banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl p-6 text-white overflow-hidden card-entrance">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-[20px] border-white" />
            <div className="absolute right-16 bottom-4 h-24 w-24 rounded-full border-[14px] border-white" />
          </div>
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-blue-100 uppercase mb-2">{dayName}</p>
              <h1 className="text-2xl font-extrabold mb-1">Selamat datang, Guru Pembimbing</h1>
              <p className="text-sm text-blue-100">
                Ada <span className="font-bold text-white">{pendingPlacements.length} pengajuan tempat</span> dan <span className="font-bold text-white">{pendingJournals.length} jurnal</span> yang menunggu evaluasi Anda.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/guru/jurnal')}
              className="shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Lihat Jurnal
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Siswa Bimbingan', value: allStudents.length, sub: 'Siswa aktif magang',
              icon: Users, color: 'text-blue-600', bg: 'bg-blue-50',
            },
            {
              label: 'Jurnal Belum Dinilai', value: pendingJournals.length, sub: 'Perlu evaluasi segera',
              icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50',
            },
            {
              label: 'Kehadiran Hari Ini', value: `${hadir}/${allStudents.length}`, sub: 'Siswa hadir',
              icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50',
            },
          ].map(({ label, value, sub, icon: Icon, color, bg }, i) => (
            <div
              key={label}
              className={`bg-white border border-slate-200 rounded-2xl p-5 hover-lift card-entrance animate-delay-${(i + 1) * 100} transition-smooth`}
            >
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

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Jurnal perlu evaluasi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 card-entrance animate-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Jurnal Perlu Evaluasi
              </h2>
              <button onClick={() => router.push('/dashboard/guru/jurnal')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Lihat semua tugas (0)
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {pendingJournals.length > 0 ? (
              <div className="space-y-2">
                {pendingJournals.slice(0, 4).map(j => (
                  <div key={j.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/guru/jurnal')}>
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {j.student_name?.charAt(0) || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{j.student_name}</p>
                      <p className="text-xs text-slate-500 truncate">{j.activity_description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{j.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-emerald-400" />
                <p className="text-sm font-medium">Semua jurnal bimbingan Anda sudah dievaluasi.</p>
              </div>
            )}
          </div>

          {/* Daftar siswa bimbingan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 card-entrance animate-delay-400">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Daftar Siswa Bimbingan
              </h2>
              <button onClick={() => router.push('/dashboard/guru/siswa')} className="text-xs font-semibold text-blue-600 hover:underline">
                Lihat Semua
              </button>
            </div>
            {myStudents.length > 0 ? (
              <div className="space-y-2">
                {myStudents.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {p.student_name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{p.student_name}</p>
                      <p className="text-xs text-slate-500">{p.dudi_name}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Aktif</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Belum ada siswa yang dibimbing.</p>
                <p className="text-xs mt-1">Siswa yang di-plot ke Anda oleh admin akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Pengajuan Tempat', href: '/dashboard/guru/pengajuan', icon: FileCheck, color: 'text-violet-600', bg: 'bg-violet-50', badge: pendingPlacements.length },
            { label: 'Siswa Bimbingan', href: '/dashboard/guru/siswa', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Jurnal & Absensi', href: '/dashboard/guru/jurnal', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', badge: pendingJournals.length },
            { label: 'Kunjungan Lapangan', href: '/dashboard/guru/kunjungan', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(({ label, href, icon: Icon, color, bg, badge }) => (
            <button key={label} onClick={() => router.push(href)} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover-lift transition-smooth text-center relative">
              {badge !== undefined && badge > 0 && (
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {badge}
                </div>
              )}
              <div className={`h-10 w-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </GuruLayout>
  );
}
