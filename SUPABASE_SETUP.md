# SUPABASE INTEGRATION GUIDE - SIMMAS

## 1. Setup Supabase Project

### A. Buat Project Baru
1. Login ke [supabase.com](https://supabase.com)
2. Klik "New Project"
3. Isi:
   - **Name**: SIMMAS-Production
   - **Database Password**: (simpan password ini!)
   - **Region**: Singapore (Southeast Asia)
4. Tunggu project selesai dibuat (~2 menit)

### B. Jalankan Database Schema
1. Buka **SQL Editor** di dashboard Supabase
2. Copy seluruh isi file `supabase/schema.sql`
3. Paste dan klik **Run**
4. Pastikan semua query berhasil (✓ Success)

### C. Setup Storage Bucket
1. Buka **Storage** di dashboard
2. Bucket `simmas-photos` otomatis dibuat dari schema
3. Verifikasi bucket ada dengan status "Public"

### D. Setup Authentication
1. Buka **Authentication** > **Providers**
2. Enable **Email** provider
3. Disable "Confirm email" (untuk development)
4. Klik **Save**

### E. Buat User Demo (Opsional untuk Testing)
```sql
-- Jalankan di SQL Editor
-- Buat 3 user demo: Admin, Guru, Siswa

-- Admin
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@simmas.sch.id',
  crypt('simmas123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","name":"Budi Santoso"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Guru
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'guru@simmas.sch.id',
  crypt('simmas123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"guru","name":"Siti Nurhaliza S.Pd"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Siswa
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'siswa@simmas.sch.id',
  crypt('simmas123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"siswa","name":"Ahmad Rizky Pratama","school_class":"XII RPL 1","nisn":"0123456789"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

---

## 2. Konfigurasi Environment Variables

### A. Dapatkan Credentials
1. Buka **Settings** > **API** di dashboard Supabase
2. Copy nilai berikut:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key (panjang, dimulai dengan `eyJ...`)

### B. Buat File `.env.local`
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...panjang_sekali
```

### C. Restart Development Server
```bash
npm run dev
```

---

## 3. Fitur yang Sudah Terintegrasi

### ✅ Sudah Aktif (Hybrid Mode)
Aplikasi berjalan dalam **hybrid mode**: menggunakan Supabase jika configured, fallback ke localStorage jika tidak.

#### A. Absensi (Clock In/Out)
- **File**: `src/app/dashboard/siswa/absensi/page.tsx`
- **Function**: `recordAttendance()`, `checkOutAttendance()`
- **Supabase Service**: `src/lib/siswa-service.ts`
- **Table**: `public.attendances`
- **Storage**: Foto disimpan sebagai base64 di kolom `photo_in` dan `photo_out`

**Data Flow:**
1. User klik "Clock In" → Camera terbuka
2. Ambil foto → `handleCameraInCapture(photoDataUrl)`
3. Call `recordAttendance()` dengan `photo_in: photoDataUrl`
4. AuthContext cek `isSupabaseConfigured`:
   - Jika YES → Insert ke `public.attendances` via Supabase
   - Jika NO → Simpan ke `localStorage`
5. Update local state untuk real-time UI

#### B. Jurnal Kegiatan
- **File**: `src/app/dashboard/siswa/jurnal/page.tsx`
- **Function**: `addJournal()`, `updateJournal()`, `deleteJournal()`
- **Supabase Service**: `src/lib/siswa-service.ts`
- **Table**: `public.journals`
- **Storage**: Foto activity disimpan sebagai base64 di kolom `photo`

**Data Flow:**
1. User tulis jurnal → Submit
2. Call `addJournal()` dengan data jurnal
3. AuthContext:
   - Supabase: Insert ke `public.journals`
   - LocalStorage: Simpan ke `simmas_journals`
4. Update local state

#### C. Pengajuan Magang
- **File**: `src/app/dashboard/siswa/pengajuan/page.tsx`
- **Function**: `addPlacement()`, `updatePlacementStatus()`
- **Supabase Service**: `src/lib/siswa-service.ts`
- **Table**: `public.placements`

**Data Flow:**
1. User ajukan tempat magang → Submit
2. Call `addPlacement()` dengan data penempatan
3. AuthContext:
   - Supabase: Insert ke `public.placements` dengan status 'pending'
   - LocalStorage: Simpan ke `simmas_placements`
4. Admin approve → `updatePlacementStatus(id, 'approved')`

---

## 4. Cara Menggunakan

### A. Mode Development (dengan localStorage)
```bash
# Tidak perlu .env.local
npm run dev
```
Aplikasi berjalan normal dengan data di browser localStorage.

### B. Mode Production (dengan Supabase)
```bash
# Setup .env.local dengan Supabase credentials
npm run dev
```
Aplikasi otomatis detect Supabase dan sync data.

### C. Cek Mode yang Aktif
Buka browser console:
```javascript
// Lihat log saat aplikasi load
// Akan muncul: "✅ Supabase configured" atau "⚠️ Supabase not configured"
```

---

## 5. Upload Foto ke Supabase Storage (Optional - Future Enhancement)

Saat ini foto disimpan sebagai **base64** langsung di database. Untuk performa lebih baik, bisa upload ke Storage bucket:

### A. Buat Helper Function
```typescript
// src/lib/upload-photo.ts
import { supabase } from './supabase';

export async function uploadPhoto(
  file: File | string, // File object atau base64 string
  folder: 'attendance' | 'journal',
  filename: string
): Promise<string | null> {
  try {
    let fileToUpload: File;
    
    // Convert base64 to File if needed
    if (typeof file === 'string') {
      const res = await fetch(file);
      const blob = await res.blob();
      fileToUpload = new File([blob], filename, { type: 'image/jpeg' });
    } else {
      fileToUpload = file;
    }

    const path = `${folder}/${filename}`;
    const { data, error } = await supabase.storage
      .from('simmas-photos')
      .upload(path, fileToUpload, {
        upsert: true,
        contentType: 'image/jpeg'
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('simmas-photos')
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload photo error:', error);
    return null;
  }
}
```

### B. Update recordAttendance
```typescript
// Ganti di src/lib/siswa-service.ts
export async function createAttendance(att: Omit<Attendance, 'id'>) {
  // Upload foto ke Storage
  let photoInUrl = att.photo_in;
  if (photoInUrl && photoInUrl.startsWith('data:')) {
    const filename = `${att.student_id}_${att.date}_in.jpg`;
    photoInUrl = await uploadPhoto(photoInUrl, 'attendance', filename) || photoInUrl;
  }

  const { data, error } = await supabase
    .from('attendances')
    .insert([{ ...att, photo_in: photoInUrl }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## 6. Testing

### A. Test Clock In
1. Login sebagai siswa (`siswa@simmas.sch.id` / `simmas123`)
2. Pastikan ada placement yang approved
3. Klik "Clock In"
4. Ambil foto dengan camera
5. Check Supabase:
   - Buka **Table Editor** > `attendances`
   - Lihat record baru dengan `photo_in` terisi

### B. Test Clock Out
1. Setelah clock in berhasil
2. Klik "Clock Out"
3. Ambil foto
4. Check Supabase:
   - Record yang sama sekarang ada `photo_out` dan `check_out`

### C. Test Jurnal
1. Menu "Jurnal Kegiatan"
2. Klik "Tulis Jurnal"
3. Isi form → Submit
4. Klik "Tambahkan Foto" pada jurnal
5. Ambil foto dengan camera
6. Check Supabase:
   - **Table Editor** > `journals`
   - Lihat record dengan `photo` terisi

---

## 7. Troubleshooting

### Error: "Failed to fetch"
**Penyebab**: Supabase URL/Key salah atau internet down
**Solusi**: 
- Cek `.env.local` credentials
- Test koneksi: `curl https://your-project.supabase.co`

### Error: "Row Level Security policy violation"
**Penyebab**: RLS policies tidak match dengan user
**Solusi**:
- Cek `auth.uid()` matches dengan `student_id`
- Atau disable RLS untuk testing:
```sql
alter table public.attendances disable row level security;
```

### Foto tidak muncul di tabel
**Penyebab**: Base64 string terlalu panjang (>1MB)
**Solusi**:
- Compress foto sebelum simpan
- Atau upload ke Storage bucket (lihat section 5)

### Data tidak sync antara tab
**Penyebab**: localStorage tidak sync antar tab
**Solusi**:
- Implementasi broadcast channel
- Atau refresh data saat window focus

---

## 8. Migrasi dari localStorage ke Supabase

Jika sudah ada data di localStorage dan ingin migrate ke Supabase:

```typescript
// Run once di browser console
async function migrateToSupabase() {
  const attendances = JSON.parse(localStorage.getItem('simmas_attendances') || '[]');
  
  for (const att of attendances) {
    await supabase.from('attendances').insert([att]);
  }
  
  console.log('Migration complete!');
}

migrateToSupabase();
```

---

## Status Integrasi

| Fitur | Status | Supabase Table |
|-------|--------|----------------|
| ✅ Login | Hybrid | `auth.users` |
| ✅ Absensi Clock In | Hybrid | `attendances` |
| ✅ Absensi Clock Out | Hybrid | `attendances` |
| ✅ Jurnal Create | Hybrid | `journals` |
| ✅ Jurnal Upload Foto | Hybrid | `journals.photo` |
| ✅ Pengajuan Magang | Hybrid | `placements` |
| ✅ Approval Admin | Hybrid | `placements.status` |
| ⚠️ Foto Upload Storage | Future | `storage.objects` |
| ⚠️ Real-time Sync | Future | Supabase Realtime |

**Hybrid**: Jika Supabase configured, data sync ke DB. Jika tidak, fallback ke localStorage.

---

## Next Steps

1. ✅ Setup Supabase project
2. ✅ Jalankan schema SQL
3. ✅ Setup .env.local
4. ✅ Test absensi dengan camera
5. ⏳ Implement foto upload ke Storage (optional)
6. ⏳ Implement real-time subscriptions (optional)
7. ⏳ Deploy to Vercel/production

---

**Dokumentasi dibuat: 30 Sep 2026**
**Versi SIMMAS: 1.0.0**
