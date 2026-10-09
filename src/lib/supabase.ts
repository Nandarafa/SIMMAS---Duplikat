/**
 * ============================================================================
 * supabase.ts - Supabase Client Configuration
 * ============================================================================
 * 
 * FUNGSI:
 * - Initialize Supabase client untuk database dan authentication
 * - Export client instance yang bisa digunakan di seluruh aplikasi
 * - Check apakah Supabase sudah dikonfigurasi dengan benar
 * 
 * CARA MENGGUNAKAN:
 * ```typescript
 * import { supabase, isSupabaseConfigured } from '@/lib/supabase';
 * 
 * if (isSupabaseConfigured) {
 *   const { data } = await supabase.from('placements').select('*');
 * }
 * ```
 * 
 * CARA MENGUBAH:
 * - Ganti URL/Key: Edit file .env.local (JANGAN hardcode di sini!)
 * - Tambah config: Bisa tambah options di createClient()
 *   contoh: createClient(url, key, { auth: { persistSession: true } })
 * 
 * TROUBLESHOOTING:
 * - isSupabaseConfigured = false: Cek .env.local sudah ada dan terisi
 * - Connection error: Cek URL dan Key valid di Supabase Dashboard
 * 
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Key dari environment variables
// Jika tidak ada, gunakan placeholder supaya tidak error
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * supabase - Supabase client instance
 * 
 * Instance ini bisa digunakan untuk:
 * - Query database: supabase.from('table').select()
 * - Authentication: supabase.auth.signIn()
 * - Storage: supabase.storage.from('bucket')
 * - Realtime: supabase.channel('room').subscribe()
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * isSupabaseConfigured - Flag untuk cek apakah Supabase sudah dikonfigurasi
 * 
 * RETURN:
 * - true: Supabase URL dan Key sudah di-set dengan benar di .env.local
 * - false: Masih menggunakan placeholder, perlu setup .env.local
 * 
 * VALIDATION:
 * - URL tidak boleh placeholder default
 * - Key tidak boleh placeholder default
 * - URL minimal 10 karakter (valid URL)
 * - Key minimal 10 karakter (valid JWT token)
 * 
 * USAGE:
 * Gunakan flag ini untuk fallback ke localStorage jika Supabase belum setup
 */
export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.length > 10 &&
  supabaseAnonKey.length > 10;
