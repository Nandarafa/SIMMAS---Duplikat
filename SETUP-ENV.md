# 🔐 Setup Environment Variables

Panduan lengkap untuk setup environment variables SIMMAS.

## 📋 Quick Start

1. **Copy template file**
   ```bash
   # Windows (PowerShell)
   copy .env.example .env.local
   
   # Mac/Linux
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** dan isi dengan nilai sebenarnya

3. **Restart development server**
   ```bash
   npm run dev
   ```

---

## 🔑 Supabase Configuration (REQUIRED)

### Cara Mendapatkan API Keys:

1. Login ke [https://supabase.com](https://supabase.com)
2. Pilih project **SIMMAS** (atau buat baru jika belum ada)
3. Buka **Settings** → **API**
4. Copy 2 nilai ini:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys (anon/public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Format di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Database Setup (Supabase)

Setelah setup environment variables, buat tables di Supabase:

### 1. Placements Table
```sql
create table placements (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  student_name text not null,
  student_nisn text,
  student_class text,
  dudi_id text not null,
  dudi_name text not null,
  dudi_address text,
  guru_id text,
  guru_name text,
  position text,
  start_date date not null,
  end_date date not null,
  status text default 'pending',
  created_at timestamp default now()
);
```

### 2. Attendances Table
```sql
create table attendances (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  student_name text not null,
  dudi_name text not null,
  date date not null,
  check_in time,
  check_out time,
  photo_in text,
  photo_out text,
  status text not null,
  notes text,
  created_at timestamp default now()
);
```

### 3. Journals Table
```sql
create table journals (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  student_name text not null,
  dudi_name text not null,
  date date not null,
  activity_description text not null,
  division text,
  duration integer,
  photo text,
  status text default 'pending',
  feedback text,
  verified_at timestamp,
  created_at timestamp default now()
);
```

### 4. Guru Table
```sql
create table guru (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  username text unique,
  name text not null,
  nip text,
  phone text,
  created_at timestamp default now()
);
```

### 5. Storage Bucket (untuk foto)
1. Buka **Storage** di Supabase Dashboard
2. Create bucket baru: `simmas-photos`
3. Set public access: **ON**
4. Folder structure:
   - `/attendance/` - foto absensi
   - `/journal/` - foto jurnal

---

## ⚙️ Optional: Additional Services

### Google Maps API (untuk map lokasi DUDI)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Email Service (untuk notifikasi)
```env
EMAIL_SERVICE_API_KEY=your_api_key_here
EMAIL_FROM=noreply@simmas.sch.id
```

### SMS Gateway (untuk notifikasi SMS)
```env
SMS_GATEWAY_API_KEY=your_api_key_here
```

---

## 🚨 Security Notes

### ⚠️ JANGAN:
- ❌ Commit `.env.local` ke Git
- ❌ Share API keys di public (GitHub, Discord, dll)
- ❌ Screenshot yang berisi API keys
- ❌ Hardcode API keys di source code

### ✅ LAKUKAN:
- ✅ Gunakan `.env.local` untuk local development
- ✅ Gunakan environment variables di hosting platform (Vercel, Netlify)
- ✅ Regenerate keys jika ter-expose secara tidak sengaja
- ✅ Gunakan keys berbeda untuk dev dan production

---

## 🔧 Troubleshooting

### Error: "Supabase client creation failed"
**Solusi:**
1. Cek `.env.local` sudah ada dan terisi dengan benar
2. Restart development server: `Ctrl+C` lalu `npm run dev`
3. Clear Next.js cache: hapus folder `.next/`

### Error: "Invalid API key"
**Solusi:**
1. Pastikan copy-paste key dengan benar (tidak ada spasi/enter)
2. Cek key masih valid di Supabase Dashboard
3. Regenerate key jika perlu

### Data tidak tersimpan ke Supabase
**Solusi:**
1. Cek koneksi internet
2. Cek Supabase Dashboard → API logs untuk error
3. Pastikan tables sudah dibuat dengan benar
4. Cek RLS (Row Level Security) di-disable atau sudah dikonfigurasi

---

## 📞 Need Help?

Jika masih ada masalah:
1. Baca dokumentasi Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Check console browser (F12) untuk error messages
3. Check terminal untuk error logs
