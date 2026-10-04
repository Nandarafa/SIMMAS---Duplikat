'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CalendarDays, LogIn, LogOut, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import SiswaLayout from '@/components/SiswaLayout';
import CameraCapture from '@/components/CameraCapture';
import { useAuth } from '@/context/AuthContext';

export default function AbsensiPage() {
  const router = useRouter();
  const { currentUser, placements, attendances, recordAttendance, checkOutAttendance } = useAuth();

  // ALL STATE HOOKS FIRST
  const [showCameraIn, setShowCameraIn] = useState(false);
  const [showCameraOut, setShowCameraOut] = useState(false);
  const [photoModal, setPhotoModal] = useState<{ src: string; label: string } | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // THEN COMPUTED VALUES
  const today = new Date().toISOString().slice(0, 10);
  const myPlacement = placements.find((p) => p.student_id === currentUser?.id);
  const isApproved = myPlacement && (myPlacement.status === 'aktif' || myPlacement.status === 'approved');
  const myAttendances = attendances.filter((a) => a.student_id === currentUser?.id);
  const todayRecord = myAttendances.find((a) => a.date === today);
  const monthlyAttendances = myAttendances.slice(0, 20);

  // GUARD: Must have approved placement
  if (!isApproved) {
    return (
      <SiswaLayout title="Absensi Harian">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="font-bold text-lg text-amber-900 mb-2">Akses Kegiatan Magang Belum Aktif</h3>
          <p className="text-amber-800 mb-6">Anda belum memiliki tempat magang yang disetujui.</p>
          <button
            onClick={() => router.push('/dashboard/siswa/pengajuan')}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
          >
            Ajukan Tempat Magang →
          </button>
        </div>
      </SiswaLayout>
    );
  }

  // HANDLERS
  const handleClockInCapture = async (photoDataUrl: string) => {
    try {
      const attendanceData = {
        student_id: currentUser?.id ?? '',
        student_name: currentUser?.name ?? '',
        dudi_name: myPlacement?.dudi_name ?? '',
        date: today,
        check_in: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'hadir' as const,
        photo_in: photoDataUrl,
      };
      
      await recordAttendance(attendanceData);
      setShowCameraIn(false);
      setSuccessToast('Absen masuk berhasil dicatat! ✓');
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (error) {
      console.error('Clock in error:', error);
      alert('Gagal absen masuk: ' + error);
    }
  };

  const handleClockOutCapture = async (photoDataUrl: string) => {
    if (!todayRecord) return;
    try {
      const checkOutTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      await checkOutAttendance(todayRecord.id, checkOutTime, photoDataUrl);
      setShowCameraOut(false);
      setSuccessToast('Absen pulang berhasil dicatat! ✓');
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (error) {
      console.error('Clock out error:', error);
      alert('Gagal absen pulang: ' + error);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const statusConfig: Record<string, { bg: string; dot: string; text: string; label: string }> = {
    hadir: { bg: 'bg-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Hadir' },
    izin: { bg: 'bg-blue-100', dot: 'bg-blue-500', text: 'text-blue-700', label: 'Izin' },
    sakit: { bg: 'bg-yellow-100', dot: 'bg-yellow-500', text: 'text-yellow-700', label: 'Sakit' },
    alpa: { bg: 'bg-red-100', dot: 'bg-red-500', text: 'text-red-700', label: 'Alpa' },
  };

  const hasCheckedIn = !!todayRecord;
  const hasCheckedOut = !!todayRecord?.check_out;

  return (
    <SiswaLayout title="Absensi">
      <div className="space-y-5 animate-fadeIn">
        {/* Today status card */}
        <div className={`border rounded-2xl p-5 shadow-sm transition-smooth hover-lift ${
          hasCheckedIn 
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                hasCheckedIn ? 'bg-emerald-500' : 'bg-blue-50'
              }`}>
                {hasCheckedIn ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className={`font-semibold text-sm ${hasCheckedIn ? 'text-emerald-800' : 'text-slate-800'}`}>
                  {hasCheckedIn ? '✓ Kamu sudah absen hari ini' : 'Status Kehadiran Hari Ini'}
                </p>
                <p className={`text-xs mt-0.5 ${hasCheckedIn ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Clock In */}
              <button
                onClick={() => setShowCameraIn(true)}
                disabled={hasCheckedIn}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition ${
                  hasCheckedIn
                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                Clock In
              </button>
              {/* Clock Out */}
              <button
                onClick={() => setShowCameraOut(true)}
                disabled={!hasCheckedIn || hasCheckedOut}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition ${
                  !hasCheckedIn || hasCheckedOut
                    ? 'border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                <LogOut className="h-3.5 w-3.5" />
                Clock Out
              </button>
            </div>
          </div>

          {todayRecord && (
            <div className="mt-4 pt-4 border-t border-emerald-200 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-emerald-600 mb-1">Masuk</p>
                <p className="text-lg font-bold text-emerald-900">{todayRecord.check_in}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 mb-1">Pulang</p>
                <p className="text-lg font-bold text-emerald-900">{todayRecord.check_out ?? '-'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Attendance history table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden card-entrance animate-delay-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800">Riwayat Bulan Ini</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Masuk</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Pulang</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Foto</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAttendances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                      Belum ada data presensi
                    </td>
                  </tr>
                ) : (
                  monthlyAttendances.map((att) => {
                    const cfg = statusConfig[att.status] ?? statusConfig.hadir;
                    return (
                      <tr key={att.id} className="border-b border-slate-100 hover:bg-slate-50 transition-smooth">
                        <td className="px-5 py-3.5 text-slate-700 font-medium">{formatDate(att.date)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{att.check_in || '-'}</td>
                        <td className="px-5 py-3.5 text-slate-600">{att.check_out || '-'}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-2">
                            {att.photo_in && (
                              <button
                                onClick={() => setPhotoModal({ src: att.photo_in!, label: 'Foto Masuk' })}
                                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                              >
                                <ImageIcon className="h-3 w-3" />
                                Masuk
                              </button>
                            )}
                            {att.photo_out && (
                              <button
                                onClick={() => setPhotoModal({ src: att.photo_out!, label: 'Foto Pulang' })}
                                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                              >
                                <ImageIcon className="h-3 w-3" />
                                Pulang
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Camera modals - EXACT SAME PATTERN AS JURNAL */}
      {showCameraIn && (
        <div className="modal-overlay">
          <CameraCapture
            onCapture={handleClockInCapture}
            onClose={() => setShowCameraIn(false)}
            title="Absen Masuk"
            subtitle="Ambil foto selfie untuk absen kehadiran"
          />
        </div>
      )}
      
      {showCameraOut && (
        <div className="modal-overlay">
          <CameraCapture
            onCapture={handleClockOutCapture}
            onClose={() => setShowCameraOut(false)}
            title="Absen Pulang"
            subtitle="Ambil foto selfie untuk absen pulang"
          />
        </div>
      )}

      {/* Photo viewer modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 modal-overlay" onClick={() => setPhotoModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-sm">{photoModal.label}</span>
              <button onClick={() => setPhotoModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3">
              <img src={photoModal.src} alt={photoModal.label} className="w-full rounded-xl object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] toast-enter">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[320px] hover-lift">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 animate-scaleIn">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 checkmark-animate" />
            </div>
            <p className="text-sm font-semibold text-slate-800 flex-1">{successToast}</p>
            <button 
              onClick={() => setSuccessToast(null)}
              className="text-slate-400 hover:text-slate-600 transition shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </SiswaLayout>
  );
}
