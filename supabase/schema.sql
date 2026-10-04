-- ============================================================
-- SIMMAS - Supabase Database Schema
-- Jalankan file ini di SQL Editor pada Supabase dashboard
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: guru (Guru Pembimbing)
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
-- TABLE: placements
-- ============================================================
create table if not exists public.placements (
  id            uuid primary key default uuid_generate_v4(),
  student_id    text        not null,
  student_name  text        not null,
  student_class text        not null default '',
  student_nisn  text,
  dudi_id       text,
  dudi_name     text        not null,
  dudi_address  text,
  guru_id       text,
  guru_name     text,
  mentor_name   text,
  industry      text,
  division      text,
  start_date    text        not null,
  end_date      text        not null,
  status        text        not null default 'pending'
                check (status in ('pending','approved','aktif','completed','ditolak')),
  created_at    timestamptz not null default now()
);

-- Index untuk lookup cepat per student
create index if not exists idx_placements_student_id on public.placements(student_id);

-- ============================================================
-- TABLE: attendances
-- ============================================================
create table if not exists public.attendances (
  id            uuid primary key default uuid_generate_v4(),
  student_id    text        not null,
  student_name  text        not null,
  dudi_name     text        not null default '',
  date          text        not null,   -- format YYYY-MM-DD
  check_in      text        not null,
  check_out     text,
  photo_in      text,                    -- URL or base64 of clock in photo
  photo_out     text,                    -- URL or base64 of clock out photo
  status        text        not null default 'hadir'
                check (status in ('hadir','izin','sakit','alpa')),
  notes         text,
  location      text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_attendances_student_id on public.attendances(student_id);
create index if not exists idx_attendances_date       on public.attendances(date);

-- ============================================================
-- TABLE: journals
-- ============================================================
create table if not exists public.journals (
  id                   uuid primary key default uuid_generate_v4(),
  student_id           text        not null,
  student_name         text        not null,
  dudi_name            text        not null default '',
  date                 text        not null,   -- format YYYY-MM-DD
  division             text        not null default '',
  activity_description text        not null,
  photo                text,                    -- URL or base64 of activity photo
  learning_outcomes    text,
  duration             text,
  status               text        not null default 'pending'
                       check (status in ('pending','approved','revision')),
  feedback             text,
  verified_at          text,
  created_at           timestamptz not null default now()
);

create index if not exists idx_journals_student_id on public.journals(student_id);
create index if not exists idx_journals_date       on public.journals(date);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- MATIKAN RLS untuk semua tabel (development mode)
alter table public.guru        disable row level security;
alter table public.placements  disable row level security;
alter table public.attendances disable row level security;
alter table public.journals    disable row level security;

-- Drop semua policies (tidak perlu jika RLS disabled)
-- Guru table policies: semua user bisa read, hanya admin yang bisa write
-- create policy "public_read_guru" on public.guru
--   for select using (true);

-- create policy "admin_manage_guru" on public.guru
--   for all using (
--     exists (
--       select 1 from auth.users
--       where auth.users.id = auth.uid()
--       and (auth.users.raw_user_meta_data->>'role' = 'admin')
--     )
--   );

-- Policy: siswa hanya bisa baca/tulis data dirinya sendiri
-- (menggunakan auth.uid()::text sebagai student_id)

-- Placements
create policy "siswa_select_own_placements" on public.placements
  for select using (student_id = auth.uid()::text);

create policy "siswa_insert_own_placements" on public.placements
  for insert with check (student_id = auth.uid()::text);

create policy "siswa_update_own_placements" on public.placements
  for update using (student_id = auth.uid()::text);

-- Guru & admin bisa lihat semua
create policy "staff_select_placements" on public.placements
  for select using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role' in ('admin','guru'))
    )
  );

-- Attendances
create policy "siswa_select_own_attendances" on public.attendances
  for select using (student_id = auth.uid()::text);

create policy "siswa_insert_own_attendances" on public.attendances
  for insert with check (student_id = auth.uid()::text);

create policy "siswa_update_own_attendances" on public.attendances
  for update using (student_id = auth.uid()::text);

create policy "staff_select_attendances" on public.attendances
  for select using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role' in ('admin','guru'))
    )
  );

-- Journals
create policy "siswa_select_own_journals" on public.journals
  for select using (student_id = auth.uid()::text);

create policy "siswa_insert_own_journals" on public.journals
  for insert with check (student_id = auth.uid()::text);

create policy "siswa_update_own_journals" on public.journals
  for update using (student_id = auth.uid()::text);

create policy "siswa_delete_own_journals" on public.journals
  for delete using (student_id = auth.uid()::text);

create policy "staff_all_journals" on public.journals
  for all using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role' in ('admin','guru'))
    )
  );

-- ============================================================
-- SEED DATA (opsional, untuk development/testing)
-- Hapus atau komentari blok ini saat production
-- ============================================================

-- Insert 25 Guru Pembimbing (biarkan Supabase generate UUID otomatis)
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

-- Contoh placement untuk testing (ganti student_id sesuai Supabase auth UID)
/*
insert into public.placements (student_id, student_name, student_class, dudi_name, dudi_address, division, start_date, end_date, status)
values
  ('u-siswa-1', 'Ahmad Rizky Pratama', 'XII RPL 1',
   'PT Universal Big Data', 'Jl. Ketintang No. 156, Surabaya',
   'Mobile Dev', '2026-08-01', '2026-12-31', 'pending');
*/

-- ============================================================
-- STORAGE BUCKET: simmas-photos
-- Untuk menyimpan foto absensi (clock in/out) dan jurnal
-- ============================================================

-- Buat bucket (jalankan di SQL Editor atau via Dashboard > Storage)
insert into storage.buckets (id, name, public)
values ('simmas-photos', 'simmas-photos', true)
on conflict (id) do nothing;

-- Policy: siswa bisa upload foto sendiri (skip jika sudah ada)
do $$ 
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'objects' 
    and policyname = 'siswa_upload_photos'
  ) then
    create policy "siswa_upload_photos" on storage.objects
      for insert with check (
        bucket_id = 'simmas-photos' and
        (storage.foldername(name))[1] in ('attendance', 'journal')
      );
  end if;
end $$;

-- Policy: siswa bisa baca foto sendiri (skip jika sudah ada)
do $$ 
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'objects' 
    and policyname = 'siswa_read_photos'
  ) then
    create policy "siswa_read_photos" on storage.objects
      for select using (bucket_id = 'simmas-photos');
  end if;
end $$;

-- Policy: siswa bisa hapus foto sendiri (skip jika sudah ada)
do $$ 
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'objects' 
    and policyname = 'siswa_delete_photos'
  ) then
    create policy "siswa_delete_photos" on storage.objects
      for delete using (bucket_id = 'simmas-photos');
  end if;
end $$;

-- Policy: staff (admin/guru) bisa akses semua foto (skip jika sudah ada)
do $$ 
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'objects' 
    and policyname = 'staff_all_photos'
  ) then
    create policy "staff_all_photos" on storage.objects
      for all using (
        bucket_id = 'simmas-photos' and
        exists (
          select 1 from auth.users
          where auth.users.id = auth.uid()
          and (auth.users.raw_user_meta_data->>'role' in ('admin','guru'))
        )
      );
  end if;
end $$;
