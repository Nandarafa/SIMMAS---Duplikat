-- ============================================================
-- HAPUS SEMUA DATA dari Tables
-- Jalankan ini untuk reset database ke kondisi kosong
-- ============================================================

-- Hapus semua data dari journals
DELETE FROM public.journals;

-- Hapus semua data dari attendances
DELETE FROM public.attendances;

-- Hapus semua data dari placements
DELETE FROM public.placements;

-- Sukses!
SELECT 
  (SELECT COUNT(*) FROM public.placements) as total_placements,
  (SELECT COUNT(*) FROM public.attendances) as total_attendances,
  (SELECT COUNT(*) FROM public.journals) as total_journals;
