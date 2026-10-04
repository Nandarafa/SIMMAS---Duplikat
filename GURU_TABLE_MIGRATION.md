# Migrasi Tabel Guru - SIMMAS

## 📋 Overview
Memisahkan data guru dari tabel `users` ke tabel `guru` yang terpisah di Supabase untuk menghindari masalah saat delete data guru.

## 🗄️ Database Schema

### 1. Jalankan SQL di Supabase SQL Editor

```sql
-- ============================================================
-- CREATE TABLE GURU
-- ============================================================
create table if not exists public.guru (
  id            uuid primary key default uuid_generate_v4(),
  email         text        not null unique,
  username      text        not null,
  name          text        not null,
  nip           text        unique,
  phone         text,
  created_at    timestamptz not null default now()
);

-- Index untuk lookup cepat
create index if not exists idx_guru_email on public.guru(email);
create index if not exists idx_guru_nip on public.guru(nip);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.guru enable row level security;

-- Semua user bisa read guru
create policy "public_read_guru" on public.guru
  for select using (true);

-- Hanya admin yang bisa write guru
create policy "admin_manage_guru" on public.guru
  for all using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- ============================================================
-- INSERT 25 GURU DATA
-- ============================================================
insert into public.guru (email, username, name, nip, phone)
values
  ('guru@simmas.sch.id', 'guru', 'Drs. H. Budi Santoso, M.Kom', '198501012010011001', '081345678901'),
  ('ahmad.fauzi@simmas.sch.id', 'ahmad.fauzi', 'Ahmad Fauzi, S.Pd., M.T.', '198602202011011003', '081345678902'),
  ('rina.kusuma@simmas.sch.id', 'rina.kusuma', 'Rina Kusuma Dewi, S.Kom.', '198705252012012001', '081345678903'),
  ('hendra.wijaya@simmas.sch.id', 'hendra.wijaya', 'Ir. Hendra Wijaya, M.Eng.', '198401102009011001', '081345678904'),
  ('sari.wulandari@simmas.sch.id', 'sari.wulandari', 'Sari Wulandari, S.Pd.', '198806152013012002', '081345678905'),
  ('bambang.setiawan@simmas.sch.id', 'bambang.setiawan', 'Bambang Setiawan, S.T., M.T.', '198303182008011002', '081345678906'),
  ('linda.kusuma@simmas.sch.id', 'linda.kusuma', 'Linda Kusuma, S.Kom., M.Kom.', '198904222014012001', '081345678907'),
  ('agus.prasetyo@simmas.sch.id', 'agus.prasetyo', 'Drs. Agus Prasetyo', '198205102007011001', '081345678908'),
  ('dewi.susanti@simmas.sch.id', 'dewi.susanti', 'Dewi Susanti, S.Pd., M.Pd.', '199001052015012001', '081345678909'),
  ('yudi.hermawan@simmas.sch.id', 'yudi.hermawan', 'Yudi Hermawan, S.T.', '198607282011011003', '081345678910'),
  ('maya.anggraini@simmas.sch.id', 'maya.anggraini', 'Maya Anggraini, S.Kom.', '199102122016012001', '081345678911'),
  ('rudi.hartono@simmas.sch.id', 'rudi.hartono', 'Rudi Hartono, S.Pd., M.T.', '198508192010011002', '081345678912'),
  ('fitri.handayani@simmas.sch.id', 'fitri.handayani', 'Fitri Handayani, S.Kom., M.Kom.', '199003252015012002', '081345678913'),
  ('doni.setiawan@simmas.sch.id', 'doni.setiawan', 'Doni Setiawan, S.T., M.Eng.', '198406152009011001', '081345678914'),
  ('nia.rahmawati@simmas.sch.id', 'nia.rahmawati', 'Nia Rahmawati, S.Pd.', '199104182016012001', '081345678915'),
  ('eko.prasetyo@simmas.sch.id', 'eko.prasetyo', 'Eko Prasetyo, S.Kom.', '198709222012011002', '081345678916'),
  ('sinta.lestari@simmas.sch.id', 'sinta.lestari', 'Sinta Lestari, S.Pd., M.Pd.', '199205082017012001', '081345678917'),
  ('fajar.nugroho@simmas.sch.id', 'fajar.nugroho', 'Fajar Nugroho, S.T.', '198608302011011003', '081345678918'),
  ('rani.permata@simmas.sch.id', 'rani.permata', 'Rani Permata Sari, S.Kom., M.Kom.', '199306152018012001', '081345678919'),
  ('wahyu.santoso@simmas.sch.id', 'wahyu.santoso', 'Wahyu Santoso, S.Pd., M.T.', '198510122010011002', '081345678920'),
  ('ayu.lestari@simmas.sch.id', 'ayu.lestari', 'Ayu Lestari, S.Kom.', '199407202019012001', '081345678921'),
  ('indra.gunawan@simmas.sch.id', 'indra.gunawan', 'Indra Gunawan, S.T., M.Eng.', '198411282009011001', '081345678922'),
  ('tuti.alawiyah@simmas.sch.id', 'tuti.alawiyah', 'Tuti Alawiyah, S.Pd.', '199508252020012001', '081345678923'),
  ('rizki.pratama@simmas.sch.id', 'rizki.pratama', 'Rizki Pratama, S.Kom., M.Kom.', '198712152012011003', '081345678924'),
  ('mega.puspita@simmas.sch.id', 'mega.puspita', 'Mega Puspita Dewi, S.Pd., M.Pd.', '199609182021012001', '081345678925')
on conflict (email) do nothing;
```

## ✅ Yang Sudah Dikerjakan

1. ✅ Created table `guru` schema di `supabase/schema.sql`
2. ✅ Added `Guru` interface di `src/types/database.ts`
3. ✅ Added `INITIAL_GURU` data di `src/lib/mockData.ts` (25 guru)
4. ✅ Added `gurus` state di AuthContext
5. ✅ Added CRUD functions signature di AuthContext interface:
   - `addGuru(guru: Omit<Guru, 'id'>): Promise<void>`
   - `updateGuru(id: string, data: Partial<Guru>): Promise<void>`
   - `deleteGuru(id: string): Promise<void>`

## 🔧 Yang Perlu Diimplementasi

### 1. Implementasi CRUD Functions di AuthContext

Tambahkan implementasi di `src/context/AuthContext.tsx`:

```typescript
// Fetch guru from Supabase on mount
useEffect(() => {
  const fetchGuru = async () => {
    if (!isSupabaseConfigured) return;
    
    const { data, error } = await supabase
      .from('guru')
      .select('*')
      .order('name', { ascending: true });
    
    if (data && !error) {
      setGurus(data);
      save('simmas_gurus', data);
    }
  };
  
  fetchGuru();
}, []);

// Add Guru
const addGuru = async (guru: Omit<Guru, 'id'>) => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('guru')
      .insert(guru)
      .select()
      .single();
    
    if (data && !error) {
      const updated = [...gurus, data];
      setGurus(updated);
      save('simmas_gurus', updated);
      return;
    }
  }
  
  // Fallback to local
  const newGuru = { ...guru, id: `g-${Date.now()}` };
  const updated = [...gurus, newGuru];
  setGurus(updated);
  save('simmas_gurus', updated);
};

// Update Guru
const updateGuru = async (id: string, data: Partial<Guru>) => {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('guru')
      .update(data)
      .eq('id', id);
    
    if (!error) {
      const updated = gurus.map(g => g.id === id ? { ...g, ...data } : g);
      setGurus(updated);
      save('simmas_gurus', updated);
      return;
    }
  }
  
  // Fallback to local
  const updated = gurus.map(g => g.id === id ? { ...g, ...data } : g);
  setGurus(updated);
  save('simmas_gurus', updated);
};

// Delete Guru
const deleteGuru = async (id: string) => {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('guru')
      .delete()
      .eq('id', id);
    
    if (!error) {
      const updated = gurus.filter(g => g.id !== id);
      setGurus(updated);
      save('simmas_gurus', updated);
      return;
    }
  }
  
  // Fallback to local
  const updated = gurus.filter(g => g.id !== id);
  setGurus(updated);
  save('simmas_gurus', updated);
};
```

### 2. Update Admin Guru Page

Update `src/app/dashboard/admin/guru/page.tsx` untuk menggunakan `gurus` dari context:

```typescript
const { gurus, addGuru, updateGuru, deleteGuru } = useAuth();

// Ganti `teachers` dengan `gurus`
const filtered = gurus.filter(g =>
  (!search || g.name.toLowerCase().includes(search.toLowerCase()) || g.nip?.includes(search))
);
```

### 3. Update Dropdown Guru di Pengajuan Form

Update semua dropdown yang menampilkan guru untuk menggunakan `gurus` state:

```typescript
const { gurus } = useAuth();

// Di dropdown
{gurus.map(g => (
  <option key={g.id} value={g.id}>{g.name}</option>
))}
```

## 🎯 Benefits

1. ✅ **Data Isolation** - Data guru terpisah dari users
2. ✅ **Delete Fix** - Menghapus guru sekarang benar-benar menghapus dari database
3. ✅ **Better Performance** - Query lebih cepat (tidak perlu filter role)
4. ✅ **Cleaner Schema** - Tabel khusus guru dengan field yang relevan saja
5. ✅ **Easier Maintenance** - Lebih mudah maintain dan extend

## 📝 Testing Steps

1. Jalankan SQL di Supabase SQL Editor
2. Verifikasi 25 data guru masuk ke tabel
3. Test CRUD operations di halaman Admin → Guru:
   - ✅ Read: List 25 guru
   - ✅ Create: Tambah guru baru
   - ✅ Update: Edit data guru
   - ✅ Delete: Hapus guru (seharusnya berhasil sekarang!)

## 🔄 Migration Notes

- Data lama di `users` dengan `role: 'guru'` tidak akan terhapus otomatis
- Perlu cleanup manual jika diperlukan dengan:

```sql
DELETE FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'guru';
```

