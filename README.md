# SIMMAS - Sistem Informasi Manajemen Magang Siswa

Aplikasi manajemen praktik kerja lapangan (PKL) berbasis web untuk mengelola data siswa, guru pembimbing, DUDI (Dunia Usaha/Dunia Industri), dan monitoring kegiatan magang.

## 🚀 Fitur Utama

### Admin
- Dashboard monitoring keseluruhan
- Manajemen data siswa, guru, dan DUDI
- Penempatan siswa ke DUDI
- Monitoring aktivitas PKL
- Log sistem
- Pengaturan aplikasi

### Guru Pembimbing
- Dashboard guru
- Monitoring siswa bimbingan
- Verifikasi jurnal siswa
- Kunjungan ke DUDI
- Pengajuan dan persetujuan

### Siswa
- Dashboard siswa
- Absensi harian
- Jurnal kegiatan PKL
- Pengajuan izin/cuti
- Profil dan ubah password

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase

## 🔧 Installation

1. Clone repository
```bash
git clone https://github.com/your-username/SIMMAS---Duplikat.git
cd SIMMAS---Duplikat
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan kredensial Supabase kamu:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run development server
```bash
npm run dev
```

5. Buka browser di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── admin/        # Admin pages
│   │   ├── guru/         # Guru pages
│   │   └── siswa/        # Siswa pages
│   ├── login/            # Login page
│   └── page.tsx          # Homepage
├── components/            # React components
├── lib/                   # Utilities & helpers
│   └── supabase.ts       # Supabase client
└── types/                 # TypeScript types
```

## 🗄️ Database Schema

Aplikasi menggunakan Supabase dengan tabel utama:
- `siswa` - Data siswa
- `guru` - Data guru pembimbing
- `dudi` - Data DUDI
- `penempatan` - Penempatan siswa ke DUDI
- `absensi` - Absensi harian siswa
- `jurnal` - Jurnal kegiatan PKL
- `pengajuan` - Pengajuan izin/cuti
- `kunjungan` - Kunjungan guru ke DUDI

## 🚦 Available Scripts

```bash
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Developer

## 📞 Contact

Untuk pertanyaan atau dukungan, hubungi [email@example.com]