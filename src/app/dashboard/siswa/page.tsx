'use client';

import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  CheckCircle,
  BookText,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  Send,
} from 'lucide-react';
import SiswaLayout from '@/components/SiswaLayout';
import { useAuth } from '@/context/AuthContext';

export default function SiswaDashboardPage() {
  const { currentUser, placements, attendances, journals } = useAuth();
  const router = useRouter();
  
  // LOGIC: Cek apakah siswa punya placement
  const myPlacement = placements.find((p) => p.student_id === currentUser?.id);

  // CASE 1: BELUM ADA PLACEMENT - Tampil "Belum Mengajukan Magang"
  if (!myPlacement) {
    return (
      <SiswaLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-3xl p-10 border border-slate-200 max-w-lg text-center">
            <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <Send className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Belum Mengajukan Magang</h2>
            <p className="text-slate-600 mb-8">
              Anda belum mengajukan tempat magang atau pengajuan Anda masih dalam tahap verifikasi oleh Admin.
            </p>
            <button
              onClick={() => router.push('/dashboard/siswa/pengajuan')}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition"
            >
              Ajukan Tempat Magang Sekarang
            </button>
          </div>
        </div>
      </SiswaLayout>
    );
  }

  // CASE 2: ADA PLACEMENT TAPI STATUS PENDING/DITOLAK
  const isApproved = myPlacement.status === 'approved' || myPlacement.status === 'aktif';
  
  if (!isApproved) {
    return (
      <SiswaLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-3xl p-10 border border-slate-200 max-w-lg text-center">
            <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5 animate-pulse">
              <Calendar className="h-10 w-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {myPlacement.status === 'pending' ? 'Menunggu Persetujuan Admin' : 'Pengajuan Ditolak'}
            </h2>
            <p className="text-slate-600 mb-4">
              {myPlacement.status === 'pending' 
                ? 'Pengajuan magang Anda sedang ditinjau oleh admin sekolah. Mohon tunggu konfirmasi.'
                : 'Pengajuan magang Anda ditolak. Silakan ajukan kembali atau hubungi admin.'
              }
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-slate-500 mb-1">Tempat Magang</p>
              <p className="font-bold text-slate-900">{myPlacement.dudi_name}</p>
              <p className="text-sm text-slate-600">{myPlacement.dudi_address}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/siswa/pengajuan')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Lihat Status Pengajuan
            </button>
          </div>
        </div>
      </SiswaLayout>
    );
  }

  // CASE 3: PLACEMENT APPROVED - Tampil FULL DASHBOARD
  const myAttendances = attendances.filter((a) => a.student_id === currentUser?.id);
  const myJournals = journals.filter((j) => j.student_id === currentUser?.id);

  const startDate = new Date(myPlacement.start_date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const endDate = new Date(myPlacement.end_date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const todayStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <SiswaLayout title="Dashboard">
      <div className="space-y-5 animate-fadeIn">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <p className="text-xs font-semibold text-blue-100 mb-2">{todayStr}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Semangat magang, {currentUser?.name || 'Siswa Magang'}!</h1>
            <p className="text-sm text-blue-50 mb-5">
              Anda magang di <span className="font-semibold">{myPlacement.dudi_name}</span>. Jangan lupa isi absensi dan catat kegiatan harian.
            </p>
            <button
              onClick={() => router.push('/dashboard/siswa/absensi')}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
            >
              <CalendarDays className="h-4 w-4" />
              Isi Absensi
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progres Magang</p>
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Hari ke-{diffDays}</h2>
            <p className="text-xs text-slate-500 mb-3">dari {totalDays} hari magang (s/d {endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (diffDays / totalDays) * 100)}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Kehadiran</p>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">{myAttendances.length} hari</h2>
            <p className="text-xs text-slate-500">
              {myAttendances.filter(a => a.status === 'hadir').length} hadir • {myAttendances.filter(a => a.status === 'alpa').length} alfa
            </p>
            <div className="mt-3">
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jurnal Ditulis</p>
              <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <BookText className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">{myJournals.length} laporan</h2>
            <p className="text-xs text-slate-500">
              {myJournals.filter(j => j.status === 'approved').length} tervalidasi
            </p>
            <div className="mt-3">
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Informasi Magang</h3>
                <p className="text-sm text-slate-500">Detail tempat dan pembimbing magang Anda.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Disetujui
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tempat Magang (DUDI)</p>
                  <p className="font-bold text-slate-900">{myPlacement.dudi_name}</p>
                  <p className="text-sm text-slate-500">{myPlacement.dudi_address || 'Taskmadu'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Guru Pembimbing</p>
                  <p className="font-bold text-slate-900">{myPlacement.guru_name || 'Drs. H. Budi Santoso, M.Kom'}</p>
                  <p className="text-sm text-slate-500">NIP 198501012010011001</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Absensi Hari Ini</h3>
                <Calendar className="h-5 w-5 text-blue-200" />
              </div>
              <p className="text-sm text-blue-100 mb-5">Jangan lupa mengisi daftar hadir sebelum dan sesudah jam kerja magang.</p>
              <button
                onClick={() => router.push('/dashboard/siswa/absensi')}
                className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Isi Absensi
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <BookText className="h-5 w-5 text-slate-400" />
                <h3 className="font-bold text-slate-900">Jurnal Kegiatan</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Tulis pengalaman dan aktivitas harian Anda.</p>
              <button
                onClick={() => router.push('/dashboard/siswa/jurnal')}
                className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Tulis Jurnal
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Riwayat Aktivitas Terakhir</h3>
          {myAttendances.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada aktivitas.</p>
          ) : (
            <div className="space-y-3">
              {myAttendances.slice(0, 2).map((att, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Absensi {att.status.toUpperCase()} ({att.check_in || '--:--'} - {att.check_out || '--:--'})</p>
                    <p className="text-sm text-slate-500">{new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiswaLayout>
  );
}
