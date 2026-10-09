/**
 * ============================================================================
 * database.ts - TypeScript Type Definitions
 * ============================================================================
 * 
 * FUNGSI:
 * - Define struktur data untuk seluruh aplikasi
 * - Type safety untuk development
 * - Auto-complete di IDE
 * 
 * CARA MENGGUNAKAN:
 * import type { UserProfile, Placement } from '@/types/database';
 * const user: UserProfile = { id: '1', name: 'John', ... };
 * 
 * CARA MENAMBAH TYPE BARU:
 * 1. Export interface [NamaType] { ... }
 * 2. Tambah ? untuk optional fields
 * 3. Gunakan union type untuk enum: 'pending' | 'approved'
 * 
 * CARA MENGUBAH:
 * - Tambah field baru: tambahkan property di interface
 * - Ubah jadi optional: tambah ? setelah nama field
 * - Tambah enum value: tambah di union type (|)
 * 
 * ============================================================================
 */

// ============================================================================
// USER TYPES
// ============================================================================

/**
 * UserRole - Role/hak akses user dalam sistem
 * - admin: Full access ke semua fitur
 * - guru: Akses bimbingan siswa dan verifikasi jurnal
 * - siswa: Akses pengajuan magang, absensi, jurnal
 */
export type UserRole = 'admin' | 'guru' | 'siswa';

/**
 * Guru - Data guru/pembimbing PKL
 * 
 * FIELDS:
 * - id: Unique identifier
 * - email: Email untuk login
 * - username: Username untuk login (optional)
 * - name: Nama lengkap
 * - nip: Nomor Induk Pegawai (optional)
 * - phone: Nomor telepon (optional)
 * - created_at: Timestamp pembuatan (auto-generated)
 */
export interface Guru {
  id: string;
  email: string;
  username: string;
  name: string;
  nip?: string;
  phone?: string;
  created_at?: string;
}

/**
 * UserProfile - Data profil user (Admin, Guru, Siswa)
 * 
 * FIELDS:
 * - id: Unique identifier
 * - email: Email untuk login
 * - username: Username untuk display (optional)
 * - name: Nama lengkap
 * - role: Role user (admin/guru/siswa)
 * - avatar_url: URL foto profil (optional)
 * - nip_nisn: NIP untuk guru/admin, NISN untuk siswa (optional)
 * - phone: Nomor telepon (optional)
 * - school_class: Kelas siswa, e.g. "XII RPL 1" (optional, hanya siswa)
 * - major: Jurusan, e.g. "RPL", "TKJ" (optional, hanya siswa)
 * - dudi_id: ID DUDI tempat magang (optional, hanya siswa)
 * - guru_id: ID guru pembimbing (optional, hanya siswa)
 * - created_at: Timestamp pembuatan (optional)
 */
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  nip_nisn?: string;
  phone?: string;
  school_class?: string;
  major?: string;
  dudi_id?: string;
  guru_id?: string;
  created_at?: string;
}

// ============================================================================
// DUDI (Dunia Usaha / Dunia Industri) - Tempat Magang
// ============================================================================

/**
 * Dudi - Data perusahaan/instansi tempat magang
 * 
 * FIELDS:
 * - id: Unique identifier
 * - name: Nama perusahaan/instansi
 * - industry_type: Jenis industri (IT, Manufaktur, dll)
 * - address: Alamat lengkap
 * - pic_name: Nama PIC (Person In Charge)
 * - pic_phone: Nomor telepon PIC
 * - quota: Kuota siswa yang bisa diterima
 * - active_students: Jumlah siswa aktif saat ini (optional)
 * - status: Status DUDI (active/aktif/inactive)
 */
export interface Dudi {
  id: string;
  name: string;
  industry_type: string;
  address: string;
  pic_name: string;
  pic_phone: string;
  quota: number;
  active_students?: number;
  status: 'active' | 'aktif' | 'inactive';
}

// ============================================================================
// PLACEMENT - Penempatan Siswa ke DUDI
// ============================================================================

/**
 * Placement - Data penempatan/pengajuan siswa ke DUDI
 * 
 * FIELDS:
 * - id: Unique identifier
 * - student_id: ID siswa
 * - student_name: Nama siswa
 * - student_class: Kelas siswa
 * - student_nisn: NISN siswa (optional)
 * - dudi_id: ID DUDI (optional)
 * - dudi_name: Nama DUDI
 * - dudi_address: Alamat DUDI (optional)
 * - guru_id: ID guru pembimbing (optional)
 * - guru_name: Nama guru pembimbing (optional)
 * - mentor_name: Nama mentor di DUDI (optional)
 * - industry: Jenis industri (optional)
 * - division: Divisi/bagian di DUDI (optional)
 * - start_date: Tanggal mulai magang (format: YYYY-MM-DD)
 * - end_date: Tanggal selesai magang (format: YYYY-MM-DD)
 * - status: Status pengajuan
 *   - pending: Menunggu approval
 *   - approved: Disetujui (belum mulai)
 *   - aktif: Sedang magang
 *   - completed: Selesai magang
 *   - ditolak: Ditolak
 */
export interface Placement {
  id: string;
  student_id: string;
  student_name: string;
  student_class: string;
  student_nisn?: string;
  dudi_id?: string;
  dudi_name: string;
  dudi_address?: string;
  guru_id?: string;
  guru_name?: string;
  mentor_name?: string;
  industry?: string;
  division?: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'aktif' | 'completed' | 'ditolak';
}

// ============================================================================
// ATTENDANCE - Absensi Harian Siswa
// ============================================================================

/**
 * Attendance - Data absensi/kehadiran siswa per hari
 * 
 * FIELDS:
 * - id: Unique identifier
 * - student_id: ID siswa
 * - student_name: Nama siswa
 * - dudi_name: Nama DUDI tempat magang
 * - date: Tanggal absensi (format: YYYY-MM-DD)
 * - check_in: Waktu masuk (format: HH:MM)
 * - check_out: Waktu pulang (format: HH:MM) (optional)
 * - photo_in: URL foto saat masuk (optional)
 * - photo_out: URL foto saat pulang (optional)
 * - status: Status kehadiran
 *   - hadir: Hadir normal
 *   - izin: Izin dengan keterangan
 *   - sakit: Sakit
 *   - alpa: Tidak hadir tanpa keterangan
 * - notes: Catatan tambahan (optional)
 * - location: Lokasi absensi (optional)
 */
export interface Attendance {
  id: string;
  student_id: string;
  student_name: string;
  dudi_name: string;
  date: string;
  check_in: string;
  check_out?: string;
  photo_in?: string;
  photo_out?: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  notes?: string;
  location?: string;
}

// ============================================================================
// JOURNAL - Jurnal Kegiatan Harian Siswa
// ============================================================================

/**
 * Journal - Data jurnal kegiatan harian siswa di DUDI
 * 
 * FIELDS:
 * - id: Unique identifier
 * - student_id: ID siswa
 * - student_name: Nama siswa
 * - dudi_name: Nama DUDI
 * - date: Tanggal kegiatan (format: YYYY-MM-DD)
 * - division: Divisi/bagian tempat bekerja
 * - activity_description: Deskripsi kegiatan yang dilakukan
 * - photo: URL foto dokumentasi kegiatan (optional)
 * - learning_outcomes: Pembelajaran yang didapat (optional)
 * - duration: Durasi kegiatan (optional)
 * - status: Status verifikasi
 *   - pending: Menunggu verifikasi guru
 *   - approved: Disetujui
 *   - revision: Perlu revisi
 * - feedback: Feedback dari guru (optional)
 * - verified_at: Waktu verifikasi (optional)
 */
export interface Journal {
  id: string;
  student_id: string;
  student_name: string;
  dudi_name: string;
  date: string;
  division: string;
  activity_description: string;
  photo?: string;
  learning_outcomes?: string;
  duration?: string;
  status: 'pending' | 'approved' | 'revision';
  feedback?: string;
  verified_at?: string;
}

// ============================================================================
// EVALUATION - Penilaian Siswa
// ============================================================================

/**
 * Evaluation - Data penilaian/evaluasi siswa PKL
 * 
 * FIELDS:
 * - id: Unique identifier
 * - student_id: ID siswa
 * - student_name: Nama siswa
 * - dudi_name: Nama DUDI
 * - discipline_score: Nilai kedisiplinan (0-100)
 * - skill_score: Nilai keterampilan (0-100)
 * - initiative_score: Nilai inisiatif (0-100)
 * - teamwork_score: Nilai kerjasama tim (0-100)
 * - final_grade: Nilai akhir (rata-rata atau weighted)
 * - notes: Catatan evaluasi
 * - evaluator_name: Nama penilai (guru/pembimbing DUDI)
 * - updated_at: Waktu update terakhir
 */
export interface Evaluation {
  id: string;
  student_id: string;
  student_name: string;
  dudi_name: string;
  discipline_score: number;
  skill_score: number;
  initiative_score: number;
  teamwork_score: number;
  final_grade: number;
  notes: string;
  evaluator_name: string;
  updated_at: string;
}

// ============================================================================
// SCHOOL SETTINGS - Konfigurasi Sekolah
// ============================================================================

/**
 * SchoolSettings - Data konfigurasi dan informasi sekolah
 * 
 * FIELDS:
 * - appName: Nama aplikasi
 * - appDescription: Deskripsi aplikasi
 * - contactEmail: Email kontak sekolah
 * - schoolName: Nama sekolah
 * - schoolAddress: Alamat sekolah
 * - schoolPhone: Telepon sekolah
 * - schoolWebsite: Website sekolah
 * - principalName: Nama kepala sekolah
 * - principalNip: NIP kepala sekolah
 * - activeAcademicYear: Tahun ajaran aktif (e.g. "2025/2026")
 * - heroTitle: Judul di landing page (optional)
 * - heroSubtitle: Subjudul di landing page (optional)
 * - feature1-3: Feature highlights di landing page (optional)
 */
export interface SchoolSettings {
  appName: string;
  appDescription: string;
  contactEmail: string;
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolWebsite: string;
  principalName: string;
  principalNip: string;
  activeAcademicYear: string;
  // Halaman Depan
  heroTitle?: string;
  heroSubtitle?: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
}
