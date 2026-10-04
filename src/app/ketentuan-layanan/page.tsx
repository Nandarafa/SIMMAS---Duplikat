import Link from 'next/link';
import { GraduationCap, ArrowLeft, FileCheck, Users, Shield, AlertTriangle, Scale, Clock } from 'lucide-react';

export default function KetentuanLayananPage() {
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
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <FileCheck className="h-3.5 w-3.5" />
            Ketentuan Layanan
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Ketentuan Layanan SIMMAS
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Dengan menggunakan SIMMAS, Anda menyetujui syarat dan ketentuan berikut. Mohon baca dengan seksama sebelum menggunakan layanan kami.
          </p>
          <p className="text-sm text-slate-400 mt-3">Terakhir diperbarui: 30 September 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">1. Penerimaan Ketentuan</h2>
                <p className="text-slate-600 leading-relaxed">
                  Dengan mengakses dan menggunakan platform SIMMAS, Anda setuju untuk terikat dengan ketentuan layanan ini.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p>• SIMMAS adalah platform manajemen magang siswa yang dikelola oleh SMK untuk tujuan pendidikan dan administratif.</p>
              <p>• Layanan ini disediakan untuk siswa, guru pembimbing, administrator sekolah, dan mitra industri (DUDI).</p>
              <p>• Anda harus berusia minimal 15 tahun atau memiliki izin dari orang tua/wali untuk menggunakan layanan ini.</p>
              <p>• Penggunaan platform harus sesuai dengan peraturan sekolah dan undang-undang yang berlaku di Indonesia.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">2. Hak dan Kewajiban Pengguna</h2>
                <p className="text-slate-600 leading-relaxed">
                  Setiap pengguna memiliki hak dan kewajiban yang harus dipatuhi selama menggunakan SIMMAS.
                </p>
              </div>
            </div>
            <div className="space-y-4 pl-16">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Hak Pengguna:</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 mt-1">✓</span>
                    Mengakses fitur sesuai dengan peran (siswa, guru, admin)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 mt-1">✓</span>
                    Mendapatkan dukungan teknis terkait penggunaan platform
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 mt-1">✓</span>
                    Mengakses dan memperbarui data pribadi mereka
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 mt-1">✓</span>
                    Melaporkan masalah atau bug kepada administrator
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Kewajiban Pengguna:</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    Menjaga kerahasiaan akun dan password
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    Bertanggung jawab atas semua aktivitas yang dilakukan melalui akun mereka
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    Memberikan informasi yang akurat dan terkini
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    Tidak menyalahgunakan platform untuk tujuan yang melanggar hukum
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    Tidak mencoba mengakses data atau akun pengguna lain tanpa izin
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">3. Penggunaan yang Dilarang</h2>
                <p className="text-slate-600 leading-relaxed">
                  Pengguna dilarang melakukan aktivitas berikut di platform SIMMAS.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Mengunggah konten yang tidak pantas, ofensif, atau melanggar hukum</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Melakukan hacking, phishing, atau percobaan akses tidak sah ke sistem</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Menyebarkan virus, malware, atau kode berbahaya lainnya</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Memanipulasi atau memalsukan data absensi, jurnal, atau evaluasi</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Menggunakan bot atau otomasi untuk memanipulasi sistem</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Membagikan akun atau kredensial login kepada orang lain</span>
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">4. Sanksi dan Penangguhan Akun</h2>
                <p className="text-slate-600 leading-relaxed">
                  Pelanggaran terhadap ketentuan layanan dapat mengakibatkan sanksi hingga penangguhan akun.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p><strong className="text-slate-900">Peringatan:</strong> Untuk pelanggaran ringan, pengguna akan menerima peringatan tertulis.</p>
              <p><strong className="text-slate-900">Pembatasan Akses:</strong> Akses ke fitur tertentu dapat dibatasi sementara.</p>
              <p><strong className="text-slate-900">Penangguhan Akun:</strong> Akun dapat ditangguhkan untuk pelanggaran serius atau berulang.</p>
              <p><strong className="text-slate-900">Penghapusan Permanen:</strong> Dalam kasus ekstrem, akun dapat dihapus secara permanen tanpa pemberitahuan sebelumnya.</p>
              <p className="pt-3 italic">Administrator sekolah memiliki kebijakan penuh dalam penentuan sanksi.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">5. Batasan Tanggung Jawab</h2>
                <p className="text-slate-600 leading-relaxed">
                  SIMMAS disediakan "sebagaimana adanya" tanpa jaminan tersurat atau tersirat.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p>• Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan atau ketidakmampuan menggunakan platform.</p>
              <p>• Kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan, aman, atau bebas dari kesalahan.</p>
              <p>• Pengguna bertanggung jawab atas keamanan perangkat mereka sendiri saat mengakses platform.</p>
              <p>• Kami tidak bertanggung jawab atas kerugian data yang disebabkan oleh kelalaian pengguna.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">6. Perubahan Ketentuan Layanan</h2>
                <p className="text-slate-600 leading-relaxed">
                  Kami berhak mengubah ketentuan layanan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p>• Perubahan akan diumumkan melalui platform atau email resmi sekolah.</p>
              <p>• Penggunaan layanan setelah perubahan berlaku menunjukkan penerimaan Anda terhadap ketentuan yang diperbarui.</p>
              <p>• Jika Anda tidak setuju dengan perubahan, Anda dapat berhenti menggunakan layanan.</p>
              <p>• Tanggal "Terakhir diperbarui" di bagian atas dokumen ini menunjukkan waktu revisi terakhir.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">7. Hukum yang Berlaku</h2>
                <p className="text-slate-600 leading-relaxed">
                  Ketentuan layanan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16 text-slate-600">
              <p>• Setiap perselisihan yang timbul akan diselesaikan melalui musyawarah terlebih dahulu.</p>
              <p>• Jika tidak tercapai kesepakatan, perselisihan akan diselesaikan melalui jalur hukum yang berlaku di Indonesia.</p>
              <p>• Yurisdiksi pengadilan yang berwenang adalah Pengadilan Negeri Surabaya.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Pertanyaan & Dukungan</h2>
            <p className="text-emerald-50 leading-relaxed mb-4">
              Jika Anda memiliki pertanyaan tentang ketentuan layanan ini atau memerlukan bantuan, silakan hubungi tim dukungan kami:
            </p>
            <div className="space-y-2 text-emerald-50">
              <p>📧 Email: <a href="mailto:support@simmas.sch.id" className="font-semibold text-white hover:underline">support@simmas.sch.id</a></p>
              <p>📞 Telepon: (031) 8292038</p>
              <p>📍 Alamat: Jl. SMEA No.4, Wonokromo, Surabaya</p>
              <p className="pt-3">⏰ Jam Operasional: Senin - Jumat, 08:00 - 16:00 WIB</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>Dengan menggunakan SIMMAS, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui ketentuan layanan ini.</strong> Jika Anda tidak menyetujui ketentuan ini, mohon hentikan penggunaan platform.
            </p>
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
