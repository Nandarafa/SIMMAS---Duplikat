import Link from 'next/link';
import { GraduationCap, ArrowLeft, Shield, Eye, Database, Lock, FileText, AlertCircle } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">SIMMAS</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Shield className="h-3.5 w-3.5" />
            Kebijakan Privasi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Kebijakan Privasi SIMMAS
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Kami berkomitmen melindungi privasi dan data pribadi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
          </p>
          <p className="text-sm text-slate-400 mt-3">Terakhir diperbarui: 30 September 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">1. Informasi yang Kami Kumpulkan</h2>
                <p className="text-slate-600 leading-relaxed">
                  SIMMAS mengumpulkan informasi yang diperlukan untuk mengelola program magang siswa SMK secara efektif.
                </p>
              </div>
            </div>
            <div className="space-y-4 pl-16">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Data Siswa</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Nama lengkap, NISN, kelas, dan jurusan
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Email dan nomor telepon untuk komunikasi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Data kehadiran (absensi) dan jurnal kegiatan harian
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Foto untuk keperluan dokumentasi absensi
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Data Guru & Admin</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Nama, NIP, email, dan nomor telepon
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Data aktivitas dan log sistem untuk audit
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Data DUDI (Dunia Usaha/Industri)</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Nama perusahaan, alamat, dan kontak
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Informasi pembimbing lapangan
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">2. Bagaimana Kami Menggunakan Informasi</h2>
                <p className="text-slate-600 leading-relaxed">
                  Data yang dikumpulkan digunakan untuk tujuan operasional dan administratif program magang.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Mengelola penempatan siswa di tempat magang (DUDI)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Monitoring kehadiran dan jurnal kegiatan harian siswa</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Komunikasi antara sekolah, guru pembimbing, dan industri</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Evaluasi dan penilaian kinerja siswa selama magang</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Laporan dan analisis untuk perbaikan program magang</span>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">3. Keamanan Data</h2>
                <p className="text-slate-600 leading-relaxed">
                  Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data Anda.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p>• Enkripsi data saat transmisi dan penyimpanan</p>
              <p>• Kontrol akses berbasis peran (Role-Based Access Control)</p>
              <p>• Audit log untuk melacak aktivitas sistem</p>
              <p>• Backup data berkala untuk mencegah kehilangan data</p>
              <p>• Server hosting dengan standar keamanan tinggi</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">4. Hak Pengguna</h2>
                <p className="text-slate-600 leading-relaxed">
                  Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus data pribadi Anda.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p><strong className="text-slate-900">Hak Akses:</strong> Anda dapat meminta salinan data pribadi Anda yang kami simpan.</p>
              <p><strong className="text-slate-900">Hak Koreksi:</strong> Anda dapat memperbarui atau memperbaiki data yang tidak akurat.</p>
              <p><strong className="text-slate-900">Hak Penghapusan:</strong> Anda dapat meminta penghapusan data setelah program magang selesai (dengan ketentuan yang berlaku).</p>
              <p><strong className="text-slate-900">Hak Portabilitas:</strong> Anda dapat meminta data Anda dalam format yang dapat dibaca mesin.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">5. Pembagian Informasi</h2>
                <p className="text-slate-600 leading-relaxed">
                  Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p>Data hanya dibagikan kepada:</p>
              <p>• <strong className="text-slate-900">Guru pembimbing</strong> untuk monitoring dan evaluasi</p>
              <p>• <strong className="text-slate-900">DUDI terkait</strong> untuk koordinasi penempatan magang</p>
              <p>• <strong className="text-slate-900">Administrator sekolah</strong> untuk keperluan manajemen</p>
              <p className="pt-3 italic">Semua pihak terikat dengan kewajiban menjaga kerahasiaan data.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Hubungi Kami</h2>
            <p className="text-blue-50 leading-relaxed mb-4">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda terkait data pribadi, silakan hubungi:
            </p>
            <div className="space-y-2 text-blue-50">
              <p>📧 Email: <a href="mailto:smkn8mlg@sch.id" className="font-semibold text-white hover:underline">smkn8mlg@sch.id</a></p>
              <p>📞 Telepon: (0341) 479148</p>
              <p>📍 Alamat: Jl. Teluk Pacitan, Arjosari, Kec. Blimbing, Kota Malang, Jawa Timur 65126</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center text-sm text-slate-500">
          <p>© 2026 SIMMAS. Sistem Informasi Manajemen Magang Siswa.</p>
        </div>
      </footer>
    </div>
  );
}
