/**
 * ============================================================================
 * siswa-service.ts - Service Layer untuk Operasi Data Siswa
 * ============================================================================
 * 
 * FUNGSI UTAMA:
 * - Mengelola semua operasi CRUD untuk data siswa (placements, attendances, journals)
 * - Terintegrasi dengan Supabase database (jika configured)
 * - Fallback ke localStorage jika Supabase tidak tersedia
 * 
 * CARA KERJA:
 * 1. Setiap fungsi cek apakah Supabase terkonfigurasi
 * 2. Jika ya: simpan/ambil data dari Supabase database
 * 3. Jika tidak: return null dan biarkan AuthContext handle dengan localStorage
 * 
 * CARA MENGUBAH:
 * - Tambah fungsi CRUD baru: copy pattern fungsi yang ada (fetch/create/update/delete)
 * - Ubah table name: ganti 'placements'/'attendances'/'journals' sesuai kebutuhan
 * - Tambah validasi: tambahkan di dalam fungsi sebelum call Supabase
 * 
 * ============================================================================
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { Placement, Attendance, Journal } from '@/types/database';

/* ------------------------------------------------------------------ */
/* Helper: throw-safe Supabase query                                   */
/* ------------------------------------------------------------------ */

/**
 * sbQuery - Wrapper untuk query Supabase yang aman dari error
 * 
 * FUNGSI:
 * - Mengeksekusi query Supabase dengan error handling
 * - Return null jika Supabase tidak configured atau terjadi error
 * - Log semua error untuk debugging
 * 
 * CARA MENGUBAH:
 * - Tambah retry logic: tambahkan loop untuk retry otomatis
 * - Custom error handling: tambah kondisi khusus untuk error tertentu
 * - Timeout handling: tambahkan Promise.race dengan timeout
 */
async function sbQuery<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>
): Promise<T | null> {
  // Cek apakah Supabase sudah dikonfigurasi
  if (!isSupabaseConfigured) {
    console.warn('[sbQuery] Supabase not configured');
    return null;
  }
  
  try {
    // Eksekusi query yang diberikan
    const { data, error } = await fn();
    
    // Jika ada error dari Supabase, log dan return null
    if (error) {
      console.error('[sbQuery] Supabase error:', error);
      return null;
    }
    
    // Return data jika berhasil
    return data;
  } catch (e) {
    // Catch error network atau exception lainnya
    console.error('[sbQuery] Network/exception error:', e);
    return null;
  }
}

/* ================================================================== */
/* PLACEMENTS - Pengelolaan Data Penempatan Magang                      */
/* ================================================================== */

/**
 * fetchMyPlacements - Ambil semua placement milik student_id dari Supabase
 * 
 * FUNGSI:
 * - Fetch data penempatan magang siswa dari database
 * - Diurutkan berdasarkan tanggal pembuatan (terbaru dulu)
 * 
 * PARAMETER:
 * @param studentId - ID siswa yang ingin diambil data placement-nya
 * 
 * RETURN:
 * - Array of Placement jika berhasil
 * - null jika gagal atau Supabase tidak configured
 * 
 * CARA MENGUBAH:
 * - Ubah sorting: ganti 'created_at' dengan field lain, atau ubah ascending: true
 * - Filter tambahan: tambahkan .eq() atau .filter() setelah .eq('student_id')
 * - Limit hasil: tambahkan .limit(10) untuk batasi jumlah data
 */
export async function fetchMyPlacements(studentId: string): Promise<Placement[] | null> {
  return sbQuery<Placement[]>(() =>
    supabase
      .from('placements')              // Nama table di Supabase
      .select('*')                      // Ambil semua kolom
      .eq('student_id', studentId)      // Filter by student_id
      .order('created_at', { ascending: false })  // Urutkan dari terbaru
  );
}

/**
 * createPlacement - Buat placement baru di Supabase
 * 
 * FUNGSI:
 * - Insert data penempatan magang baru ke database
 * - Auto-generate ID oleh Supabase
 * 
 * PARAMETER:
 * @param placement - Data placement (tanpa ID, ID auto-generated)
 * 
 * RETURN:
 * - Placement object dengan ID jika berhasil
 * - null jika gagal
 * 
 * CARA MENGUBAH:
 * - Tambah validasi: cek required fields sebelum insert
 * - Auto-fill field: tambahkan field default (created_at, dll) sebelum insert
 * - Trigger notifikasi: panggil fungsi notif setelah berhasil insert
 */
export async function createPlacement(
  placement: Omit<Placement, 'id'>
): Promise<Placement | null> {
  console.log('[createPlacement] Attempting to insert:', placement);
  
  const result = await sbQuery<Placement>(() =>
    supabase
      .from('placements')
      .insert(placement)      // Insert data
      .select()               // Return inserted data
      .single()               // Expect single result
  );
  
  if (result) {
    console.log('[createPlacement] Insert successful:', result);
  } else {
    console.error('[createPlacement] Insert failed');
  }
  
  return result;
}

/**
 * updatePlacementStatus - Update status placement di Supabase
 * 
 * FUNGSI:
 * - Update status penempatan (pending, approved, aktif, completed)
 * - Digunakan untuk workflow approval dan status tracking
 * 
 * PARAMETER:
 * @param id - ID placement yang akan diupdate
 * @param status - Status baru ('pending' | 'approved' | 'aktif' | 'completed')
 * 
 * RETURN:
 * - true jika berhasil update
 * - false jika gagal
 * 
 * CARA MENGUBAH:
 * - Tambah validation: cek apakah status transition valid (pending -> approved OK, completed -> pending NOT OK)
 * - Auto-update timestamp: tambahkan updated_at field
 * - Send notification: trigger notif ke guru/siswa saat status berubah
 */
export async function updatePlacementStatus(
  id: string,
  status: Placement['status']
): Promise<boolean> {
  const result = await sbQuery(() =>
    supabase
      .from('placements')
      .update({ status })      // Update hanya field status
      .eq('id', id)            // WHERE id = ?
      .select()
      .single()
  );
  
  return result !== null;
}

/**
 * updatePlacement - Update data placement di Supabase
 * 
 * FUNGSI:
 * - Update field placement (bisa beberapa field sekaligus)
 * - Lebih flexible daripada updatePlacementStatus
 * 
 * PARAMETER:
 * @param id - ID placement yang akan diupdate
 * @param data - Object berisi field-field yang ingin diupdate
 * 
 * RETURN:
 * - true jika berhasil
 * - false jika gagal
 * 
 * CARA MENGUBAH:
 * - Restrict fields: tambah whitelist field yang boleh diupdate
 * - Add audit trail: log siapa yang update dan kapan
 * - Validate permissions: cek apakah user boleh update placement ini
 */
export async function updatePlacement(
  id: string,
  data: Partial<Placement>
): Promise<boolean> {
  const result = await sbQuery(() =>
    supabase
      .from('placements')
      .update(data)            // Update multiple fields
      .eq('id', id)
      .select()
      .single()
  );
  
  return result !== null;
}

/* ================================================================== */
/* ATTENDANCES                                                          */
/* ================================================================== */

/** Ambil absensi bulan ini milik studentId */
export async function fetchMonthlyAttendances(
  studentId: string,
  yearMonth: string // format "YYYY-MM"
): Promise<Attendance[] | null> {
  return sbQuery<Attendance[]>(() =>
    supabase
      .from('attendances')
      .select('*')
      .eq('student_id', studentId)
      .gte('date', `${yearMonth}-01`)
      .lte('date', `${yearMonth}-31`)
      .order('date', { ascending: false })
  );
}

/** Ambil semua absensi milik studentId */
export async function fetchAllAttendances(studentId: string): Promise<Attendance[] | null> {
  return sbQuery<Attendance[]>(() =>
    supabase
      .from('attendances')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
  );
}

/** Buat record absensi baru (clock in) */
export async function createAttendance(
  attendance: Omit<Attendance, 'id'>
): Promise<Attendance | null> {
  console.log('[createAttendance] Called with:', attendance);
  const result = await sbQuery<Attendance>(() =>
    supabase.from('attendances').insert(attendance).select().single()
  );
  console.log('[createAttendance] Result:', result);
  return result;
}

/** Update check_out waktu pulang */
export async function updateCheckOut(
  id: string,
  checkOut: string,
  photoOut?: string
): Promise<boolean> {
  const updateData: Record<string, any> = { check_out: checkOut };
  if (photoOut) {
    updateData.photo_out = photoOut;
  }
  
  const result = await sbQuery(() =>
    supabase
      .from('attendances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
  );
  return result !== null;
}

/* ================================================================== */
/* JOURNALS                                                             */
/* ================================================================== */

/** Ambil semua jurnal milik studentId */
export async function fetchMyJournals(studentId: string): Promise<Journal[] | null> {
  return sbQuery<Journal[]>(() =>
    supabase
      .from('journals')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
  );
}

/** Buat jurnal baru */
export async function createJournal(
  journal: Omit<Journal, 'id' | 'status'>
): Promise<Journal | null> {
  return sbQuery<Journal>(() =>
    supabase
      .from('journals')
      .insert({ ...journal, status: 'pending' })
      .select()
      .single()
  );
}

/** Update jurnal (untuk edit atau tambah foto) */
export async function updateJournal(
  id: string,
  data: Partial<Pick<Journal, 'activity_description' | 'division' | 'duration' | 'photo'>>
): Promise<boolean> {
  console.log('[updateJournal] Updating journal:', id, data);
  const result = await sbQuery(() =>
    supabase.from('journals').update(data).eq('id', id).select().single()
  );
  if (result) {
    console.log('[updateJournal] Update successful');
  } else {
    console.error('[updateJournal] Update failed');
  }
  return result !== null;
}

/** Hapus jurnal */
export async function deleteJournal(id: string): Promise<boolean> {
  const result = await sbQuery(() =>
    supabase.from('journals').delete().eq('id', id).select().single()
  );
  return result !== null;
}

/** Verifikasi jurnal oleh guru */
export async function verifyJournalDb(
  id: string,
  status: 'approved' | 'revision',
  feedback?: string
): Promise<boolean> {
  const result = await sbQuery(() =>
    supabase
      .from('journals')
      .update({
        status,
        feedback: feedback ?? null,
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
  );
  return result !== null;
}

/* ================================================================== */
/* PHOTO STORAGE                                                        */
/* ================================================================== */

/**
 * Upload photo to Supabase Storage
 * @param base64Data - Base64 encoded image data (with data:image/... prefix)
 * @param folder - Storage folder (e.g., 'attendance', 'journal')
 * @param filename - Filename for the uploaded photo
 * @returns Public URL of uploaded photo or null on failure
 */
export async function uploadPhoto(
  base64Data: string,
  folder: 'attendance' | 'journal',
  filename: string
): Promise<string | null> {
  if (!isSupabaseConfigured) {
    // Fallback: return base64 directly for localStorage
    return base64Data;
  }

  try {
    // Extract base64 content and mime type
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      console.warn('[photo] Invalid base64 format');
      return base64Data; // Return as-is
    }

    const mimeType = matches[1];
    const base64Content = matches[2];
    
    // Convert base64 to binary
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });

    // Upload to Supabase Storage
    const path = `${folder}/${filename}`;
    const { data, error } = await supabase.storage
      .from('simmas-photos')
      .upload(path, blob, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.warn('[photo] Upload error:', error);
      return base64Data; // Fallback to base64
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('simmas-photos')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  } catch (e) {
    console.warn('[photo] Upload failed:', e);
    return base64Data; // Fallback to base64
  }
}

/**
 * Delete photo from Supabase Storage
 * @param photoUrl - URL or path of the photo to delete
 * @returns true if deleted successfully
 */
export async function deletePhoto(photoUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured || photoUrl.startsWith('data:')) {
    // Skip if not Supabase or is base64
    return true;
  }

  try {
    // Extract path from URL
    const url = new URL(photoUrl);
    const pathMatch = url.pathname.match(/\/simmas-photos\/(.+)$/);
    if (!pathMatch) {
      console.warn('[photo] Cannot extract path from URL');
      return false;
    }

    const path = pathMatch[1];
    const { error } = await supabase.storage
      .from('simmas-photos')
      .remove([path]);

    if (error) {
      console.warn('[photo] Delete error:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.warn('[photo] Delete failed:', e);
    return false;
  }
}

/**
 * Generate unique filename for photo
 * @param prefix - Prefix for filename (e.g., 'att', 'jrn')
 * @param studentId - Student ID
 * @param extension - File extension (e.g., 'jpg', 'png')
 * @returns Unique filename
 */
export function generatePhotoFilename(
  prefix: string,
  studentId: string,
  extension = 'jpg'
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${studentId}_${timestamp}_${random}.${extension}`;
}
