-- ============================================================
-- DISABLE RLS untuk Development
-- Gunakan ini jika aplikasi pakai localStorage auth, bukan Supabase Auth
-- ============================================================

-- Matikan RLS pada semua tabel
ALTER TABLE public.placements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals DISABLE ROW LEVEL SECURITY;

-- Hapus semua policy yang ada (opsional, untuk cleanup)
DROP POLICY IF EXISTS "siswa_select_own_placements" ON public.placements;
DROP POLICY IF EXISTS "siswa_insert_own_placements" ON public.placements;
DROP POLICY IF EXISTS "siswa_update_own_placements" ON public.placements;
DROP POLICY IF EXISTS "staff_select_placements" ON public.placements;

DROP POLICY IF EXISTS "siswa_select_own_attendances" ON public.attendances;
DROP POLICY IF EXISTS "siswa_insert_own_attendances" ON public.attendances;
DROP POLICY IF EXISTS "siswa_update_own_attendances" ON public.attendances;
DROP POLICY IF EXISTS "staff_select_attendances" ON public.attendances;

DROP POLICY IF EXISTS "siswa_select_own_journals" ON public.journals;
DROP POLICY IF EXISTS "siswa_insert_own_journals" ON public.journals;
DROP POLICY IF EXISTS "siswa_update_own_journals" ON public.journals;
DROP POLICY IF EXISTS "siswa_delete_own_journals" ON public.journals;
DROP POLICY IF EXISTS "staff_all_journals" ON public.journals;

-- Sukses!
SELECT 'RLS telah dimatikan pada semua tabel' as status;
