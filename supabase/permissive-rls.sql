-- ============================================================
-- PERMISSIVE RLS (Allow All)
-- Policy yang mengizinkan semua operasi untuk development
-- ============================================================

-- Hapus policy lama
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

-- Buat policy baru yang allow all (untuk anon key)
CREATE POLICY "allow_all_placements" ON public.placements
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_attendances" ON public.attendances
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_journals" ON public.journals
  FOR ALL USING (true) WITH CHECK (true);

-- Sukses!
SELECT 'RLS policies telah diubah menjadi permissive (allow all)' as status;
