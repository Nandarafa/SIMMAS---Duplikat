/**
 * siswa-service.ts
 * Semua operasi CRUD untuk data siswa (placements, attendances, journals)
 * Menggunakan Supabase jika terkonfigurasi, fallback ke in-memory via callback.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { Placement, Attendance, Journal } from '@/types/database';

/* ------------------------------------------------------------------ */
/* Helper: throw-safe Supabase query                                   */
/* ------------------------------------------------------------------ */
async function sbQuery<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>
): Promise<T | null> {
  if (!isSupabaseConfigured) {
    console.warn('[sbQuery] Supabase not configured');
    return null;
  }
  try {
    const { data, error } = await fn();
    if (error) {
      console.error('[sbQuery] Supabase error:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.error('[sbQuery] Network/exception error:', e);
    return null;
  }
}

/* ================================================================== */
/* PLACEMENTS                                                           */
/* ================================================================== */

/** Ambil semua placement milik student_id dari Supabase */
export async function fetchMyPlacements(studentId: string): Promise<Placement[] | null> {
  return sbQuery<Placement[]>(() =>
    supabase
      .from('placements')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
  );
}

/** Buat placement baru di Supabase */
export async function createPlacement(
  placement: Omit<Placement, 'id'>
): Promise<Placement | null> {
  console.log('[createPlacement] Attempting to insert:', placement);
  const result = await sbQuery<Placement>(() =>
    supabase.from('placements').insert(placement).select().single()
  );
  if (result) {
    console.log('[createPlacement] Insert successful:', result);
  } else {
    console.error('[createPlacement] Insert failed');
  }
  return result;
}

/** Update status placement di Supabase */
export async function updatePlacementStatus(
  id: string,
  status: Placement['status']
): Promise<boolean> {
  const result = await sbQuery(() =>
    supabase.from('placements').update({ status }).eq('id', id).select().single()
  );
  return result !== null;
}

/** Update placement data di Supabase */
export async function updatePlacement(
  id: string,
  data: Partial<Placement>
): Promise<boolean> {
  const result = await sbQuery(() =>
    supabase.from('placements').update(data).eq('id', id).select().single()
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
