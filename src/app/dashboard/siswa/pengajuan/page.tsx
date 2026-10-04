'use client';

import { useState } from 'react';
import { MapPin, Briefcase, Calendar, CheckCircle2, ArrowRight, Clock, Send, X } from 'lucide-react';
import SiswaLayout from '@/components/SiswaLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PengajuanMagangPage() {
  const { currentUser, placements, addPlacement, users } = useAuth();
  const router = useRouter();
  const myPlacement = placements.find((p) => p.student_id === currentUser?.id);

  // Get list of guru for dropdown
  const guruList = users.filter(u => u.role === 'guru');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dudi_name: '',
    dudi_address: '',
    division: '',
    start_date: '',
    end_date: '',
    guru_id: '',
    guru_name: '',
  });

  // Determine stepper step
  const getStep = () => {
    if (!myPlacement) return 0;
    if (myPlacement.status === 'pending') return 2;
    if (myPlacement.status === 'approved' || myPlacement.status === 'aktif') return 3;
    if (myPlacement.status === 'ditolak') return 1;
    return 1;
  };

  const currentStep = getStep();

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dudi_name || !formData.division || !formData.start_date) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    // Create new placement (tanpa id, biar auto-generate di Supabase)
    const newPlacement = {
      student_id: currentUser?.id || '',
      student_name: currentUser?.name || '',
      student_class: 'XII RPL 1',
      student_nisn: currentUser?.nip_nisn || '',
      dudi_id: `dudi-${Date.now()}`,
      dudi_name: formData.dudi_name,
      dudi_address: formData.dudi_address,
      guru_id: formData.guru_id,
      guru_name: formData.guru_name,
      division: formData.division,
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: 'pending' as const, // STATUS PENDING - tunggu approval admin
    };

    addPlacement(newPlacement);
    setShowForm(false);
    alert('Pengajuan magang berhasil dikirim! Menunggu persetujuan admin.');
  };

  return (
    <SiswaLayout title="Pengajuan Magang">
      <div className="space-y-5">
        {/* Stepper - hanya tampil kalau ada placement */}
        {myPlacement && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between relative">
              {/* Step 1: Ajukan */}
              <div className="flex flex-col items-center z-10">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  {currentStep >= 1 ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-slate-400 font-bold">1</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-2">Ajukan</p>
              </div>

              {/* Line 1-2 */}
              <div className={`absolute top-6 left-[10%] right-[60%] h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />

              {/* Step 2: Ditinjau */}
              <div className="flex flex-col items-center z-10">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  {currentStep >= 2 ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-slate-400 font-bold">2</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-2">Ditinjau Sekolah</p>
              </div>

              {/* Line 2-3 */}
              <div className={`absolute top-6 left-[60%] right-[10%] h-1 ${currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

              {/* Step 3: Disetujui */}
              <div className="flex flex-col items-center z-10">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  {currentStep >= 3 ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-slate-400 font-bold">3</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-2">Disetujui</p>
              </div>

              {/* Status Badge */}
              {currentStep === 3 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  ● Selesai
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content - Conditional Based on Status */}
        {!myPlacement ? (
          // CASE 1: Belum Ada Pengajuan - Tampil tombol ajukan
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Belum Ada Pengajuan</h3>
              <p className="text-sm text-slate-500 mb-6">
                Anda belum mengajukan tempat magang. Silakan isi form pengajuan untuk memulai proses magang Anda.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                <Send className="h-5 w-5" />
                Ajukan Tempat Magang
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          // CASE 2: Ada Pengajuan - Tampil detail
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Detail Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Detail Pengajuan Magang</h3>
              <p className="text-sm text-blue-600 mb-5">Informasi tempat magang yang diajukan.</p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold mb-1">Tempat Magang (DUDI)</p>
                    <p className="font-bold text-slate-900">{myPlacement.dudi_name}</p>
                    <p className="text-sm text-slate-500">{myPlacement.dudi_address || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold mb-1">Posisi yang Diajukan</p>
                    <p className="font-bold text-slate-900">{myPlacement.division || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold mb-1">Tanggal Pengajuan</p>
                    <p className="font-bold text-slate-900">
                      {new Date(myPlacement.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              {currentStep === 3 ? (
                // Status: DISETUJUI
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Pengajuan Magang Aktif</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Selamat! Anda sudah terdaftar dan aktif magang. Silakan isi absensi atau jurnal harian Anda.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push('/dashboard/siswa/absensi')}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Isi Absensi
                    </button>
                    <button
                      onClick={() => router.push('/dashboard/siswa/jurnal')}
                      className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
                    >
                      Tulis Jurnal
                    </button>
                  </div>
                </div>
              ) : currentStep === 2 ? (
                // Status: PENDING (Menunggu Approval Admin)
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Menunggu Persetujuan</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Pengajuan Anda sedang ditinjau oleh admin sekolah. Mohon tunggu hingga pengajuan disetujui.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                    <p className="text-xs font-semibold text-blue-700 mb-1">💡 INFO</p>
                    <p className="text-sm text-blue-900">
                      Proses verifikasi biasanya memakan waktu 1-3 hari kerja. Admin akan menghubungi Anda jika ada informasi tambahan yang diperlukan.
                    </p>
                  </div>
                </div>
              ) : (
                // Status: DITOLAK atau Default
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Pengajuan Ditolak</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Pengajuan magang Anda ditolak oleh admin. Silakan ajukan kembali dengan data yang lebih lengkap.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Ajukan Ulang
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Form Pengajuan */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Form Pengajuan Magang</h3>
                  <p className="text-sm text-slate-500">Isi data tempat magang yang Anda inginkan</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Perusahaan (DUDI) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dudi_name}
                    onChange={(e) => setFormData({ ...formData, dudi_name: e.target.value })}
                    placeholder="Contoh: PT. Universal Big Data"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Alamat Perusahaan
                  </label>
                  <input
                    type="text"
                    value={formData.dudi_address}
                    onChange={(e) => setFormData({ ...formData, dudi_address: e.target.value })}
                    placeholder="Contoh: Jl. Raya Darmo No. 123, Surabaya"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Posisi / Divisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    placeholder="Contoh: Mobile Developer"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Guru Pembimbing <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.guru_id}
                    onChange={(e) => {
                      const selectedGuru = guruList.find(g => g.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        guru_id: e.target.value,
                        guru_name: selectedGuru?.name || ''
                      });
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">-- Pilih Guru Pembimbing --</option>
                    {guruList.map(guru => (
                      <option key={guru.id} value={guru.id}>
                        {guru.name} {guru.nip_nisn ? `(NIP: ${guru.nip_nisn})` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Pilih guru yang akan membimbing Anda selama magang
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ PENTING</p>
                  <p className="text-sm text-amber-900">
                    Pengajuan Anda akan ditinjau oleh admin sekolah. Pastikan semua data yang diisi sudah benar dan lengkap.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                  >
                    Kirim Pengajuan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SiswaLayout>
  );
}
