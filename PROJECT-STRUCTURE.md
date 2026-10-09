# 📁 SIMMAS - Project Structure & Code Documentation

Dokumentasi lengkap struktur project dan penjelasan setiap file/folder.

---

## 📂 Root Directory

```
SIMMAS/
├── .env.example          # Template environment variables (AMAN untuk commit)
├── .env.local            # Environment variables sebenarnya (JANGAN commit!)
├── .git/                 # Git repository data
├── .gitignore            # File/folder yang diabaikan git
├── .next/                # Build output Next.js (auto-generated, SKIP ini)
├── next-env.d.ts         # TypeScript declarations untuk Next.js
├── next.config.mjs       # Konfigurasi Next.js
├── node_modules/         # Dependencies yang terinstall (JANGAN commit!)
├── package.json          # Project metadata dan dependencies
├── package-lock.json     # Lockfile untuk npm (auto-generated)
├── postcss.config.js     # Konfigurasi PostCSS (required by Tailwind)
├── public/               # Static assets (images, fonts, dll)
├── README.md             # Dokumentasi utama project
├── SETUP-ENV.md          # Panduan setup environment variables
├── src/                  # Source code utama ⭐
├── tailwind.config.js    # Konfigurasi Tailwind CSS
├── tsconfig.json         # Konfigurasi TypeScript
└── tsconfig.tsbuildinfo  # TypeScript build cache (auto-generated)
```

---

## 🎯 src/ - Source Code Directory

### **src/app/** - Pages dan Routes (Next.js App Router)

```
src/app/
├── layout.tsx                    # Root layout untuk semua halaman
├── page.tsx                      # Landing page (/)
├── globals.css                   # Global CSS dan Tailwind imports
│
├── login/
│   └── page.tsx                  # Halaman login (/login)
│
└── dashboard/
    ├── page.tsx                  # Dashboard redirect logic
    │
    ├── admin/                    # Dashboard Admin
    │   ├── page.tsx              # Overview admin
    │   ├── siswa/page.tsx        # Manajemen data siswa
    │   ├── guru/page.tsx         # Manajemen data guru
    │   ├── dudi/page.tsx         # Manajemen data DUDI
    │   └── penempatan/page.tsx   # Penempatan siswa ke DUDI
    │
    ├── guru/                     # Dashboard Guru
    │   ├── page.tsx              # Overview guru
    │   ├── siswa/page.tsx        # Siswa bimbingan
    │   └── verifikasi/page.tsx   # Verifikasi jurnal siswa
    │
    └── siswa/                    # Dashboard Siswa
        ├── page.tsx              # Overview siswa (pengajuan magang)
        ├── absensi/page.tsx      # Absensi harian
        └── jurnal/page.tsx       # Jurnal kegiatan harian
```

**CARA KERJA APP ROUTER:**
- Setiap folder dengan `page.tsx` = route baru
- `layout.tsx` = wrapper untuk child pages
- Contoh: `app/dashboard/admin/siswa/page.tsx` → `/dashboard/admin/siswa`

**CARA MENAMBAH PAGE BARU:**
1. Buat folder baru di `src/app/`
2. Tambah file `page.tsx` di dalamnya
3. Export default React component

---

### **src/components/** - Reusable UI Components

```
src/components/
├── AdminLayout.tsx       # Layout khusus untuk admin pages
├── GuruLayout.tsx        # Layout khusus untuk guru pages
├── SiswaLayout.tsx       # Layout khusus untuk siswa pages
├── Toast.tsx             # Notification component
├── ActionMenu.tsx        # Dropdown menu untuk actions (Edit/Delete)
├── BulkActionBar.tsx     # Action bar untuk bulk operations
├── Pagination.tsx        # Pagination component untuk tables
└── [future components]   # Tambah component baru di sini
```

**FUNGSI COMPONENTS:**
- **Layouts**: Wrapper dengan sidebar, navbar untuk setiap role
- **Toast**: Notifikasi success/error di kanan atas
- **ActionMenu**: 3-dot menu untuk actions per row table
- **BulkActionBar**: Bar yang muncul saat select multiple items
- **Pagination**: Previous/Next dan page numbers

**CARA MENAMBAH COMPONENT BARU:**
```typescript
// src/components/NewComponent.tsx
export default function NewComponent({ prop1, prop2 }: Props) {
  return <div>Component content</div>;
}
```

---

### **src/context/** - React Context (Global State)

```
src/context/
└── AuthContext.tsx       # Global state untuk authentication dan data
```

**FUNGSI:**
- Menyimpan user yang sedang login
- Menyimpan data aplikasi (users, placements, attendances, journals)
- Provide functions untuk CRUD operations
- Auto-sync dengan localStorage dan Supabase

**DATA YANG DIKELOLA:**
- `currentUser`: User yang sedang login
- `users`: Semua user (admin, guru, siswa)
- `gurus`: Data guru (dari Supabase)
- `dudis`: Data DUDI/tempat magang
- `placements`: Data penempatan siswa ke DUDI
- `attendances`: Riwayat absensi siswa
- `journals`: Jurnal kegiatan siswa
- `evaluations`: Nilai/evaluasi siswa

**CARA MENGGUNAKAN:**
```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { currentUser, placements, addPlacement } = useAuth();
  // ... use the data and functions
}
```

---

### **src/lib/** - Utility Functions & Services

```
src/lib/
├── supabase.ts           # Supabase client setup
├── siswa-service.ts      # Service layer untuk operasi data siswa
├── mockData.ts           # Initial/seed data untuk testing
└── utils.ts              # Helper functions (cn, formatDate, dll)
```

**PENJELASAN FILES:**

**supabase.ts**
- Initialize Supabase client
- Export `supabase` instance dan `isSupabaseConfigured` flag
- Cek apakah environment variables sudah di-set

**siswa-service.ts**
- CRUD operations untuk placements, attendances, journals
- Upload/delete photos ke Supabase Storage
- Wrapper dengan error handling dan fallback

**mockData.ts**
- Data initial untuk testing (demo accounts, sample data)
- INITIAL_USERS: akun demo (admin, guru, siswa)
- INITIAL_GURU: data guru
- INITIAL_DUDI, PLACEMENTS, ATTENDANCES, JOURNALS: sample data

**utils.ts**
- Helper functions seperti `cn()` untuk merge className
- Format date, currency, dll

---

### **src/types/** - TypeScript Type Definitions

```
src/types/
└── database.ts           # Type definitions untuk semua data models
```

**TYPE DEFINITIONS:**
```typescript
// User accounts
type UserProfile = { id, email, name, role, ... }

// Guru
type Guru = { id, email, name, nip, phone, ... }

// DUDI (Tempat Magang)
type Dudi = { id, name, address, contact_person, ... }

// Placement (Penempatan siswa ke DUDI)
type Placement = { id, student_id, dudi_id, guru_id, status, ... }

// Attendance (Absensi)
type Attendance = { id, student_id, date, check_in, check_out, ... }

// Journal (Jurnal Kegiatan)
type Journal = { id, student_id, date, activity_description, status, ... }

// Evaluation (Nilai Siswa)
type Evaluation = { id, student_id, technical_score, attitude_score, ... }
```

**CARA MENGGUNAKAN:**
```typescript
import type { UserProfile, Placement } from '@/types/database';

function handleUser(user: UserProfile) {
  // TypeScript akan validate type
}
```

---

## ⚙️ Configuration Files

### **tsconfig.json** - TypeScript Configuration
- Strict type checking enabled
- Path alias: `@/*` → `./src/*`
- Target: ES2017
- JSX: preserve (untuk React)

### **next.config.mjs** - Next.js Configuration
- React Strict Mode: enabled
- Tambah image domains, redirects, dll di sini

### **tailwind.config.js** - Tailwind CSS Configuration
- Custom colors (dari CSS variables)
- Custom animations (slideUp, fadeIn, dll)
- Content: scan `src/**/*.{js,ts,jsx,tsx}`

### **postcss.config.js** - PostCSS Configuration
- Tailwind CSS plugin
- Autoprefixer untuk vendor prefixes

### **.gitignore** - Git Ignore Rules
- `.env.local` - Environment variables
- `node_modules/` - Dependencies
- `.next/` - Build output
- IDE files - `.vscode/`, `.idea/`

---

## 🔄 Data Flow

### 1. **Authentication Flow**
```
LoginPage → loginWithCredentials() → AuthContext → setCurrentUser
```

### 2. **Data CRUD Flow**
```
Component → AuthContext function → siswa-service → Supabase
                                                  ↓
                                            localStorage (fallback)
```

### 3. **Page Rendering Flow**
```
URL → App Router → Layout → Page Component → Components
```

---

## 🚀 Development Workflow

### **Menambah Feature Baru:**

1. **Buat page baru** di `src/app/[route]/page.tsx`
2. **Buat component** di `src/components/` jika perlu
3. **Tambah type** di `src/types/database.ts`
4. **Tambah service function** di `src/lib/siswa-service.ts`
5. **Tambah context function** di `src/context/AuthContext.tsx`
6. **Test di browser** dengan `npm run dev`

### **Menambah Table Baru di Supabase:**

1. Buat table di Supabase Dashboard
2. Tambah type definition di `src/types/database.ts`
3. Tambah initial data di `src/lib/mockData.ts`
4. Tambah service functions di `src/lib/siswa-service.ts`
5. Tambah context state dan functions di `src/context/AuthContext.tsx`

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

## 🐛 Common Issues

### "Module not found: Can't resolve '@/...'
**Fix:** Restart TypeScript server atau restart VS Code

### "Supabase client creation failed"
**Fix:** Cek `.env.local` sudah ada dan terisi dengan benar

### Changes not reflecting in browser
**Fix:** Hard refresh (`Ctrl+Shift+R`) atau clear `.next/` folder

### TypeScript errors after git pull
**Fix:** Run `npm install` untuk update dependencies

---

Last Updated: 2026-10-06
