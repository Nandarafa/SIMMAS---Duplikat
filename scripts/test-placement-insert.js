/**
 * Test script untuk debug INSERT ke placements table
 * Jalankan dengan: node scripts/test-placement-insert.js
 */

const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing (copy from .env.local)
const supabaseUrl = 'https://trfdyaqyxannsivuhzjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZmR5YXF5eGFubnNpdnVoempzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MzY2OTcsImV4cCI6MjEwNjMxMjY5N30.250yDJLjtO-2cGDsaMXVH4bhXzpV8MV6OZaUPpdhEtc';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables tidak ditemukan!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'ada' : 'tidak ada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('🧪 Testing INSERT ke placements table...\n');

  const testData = {
    student_id: 'u-siswa-1', // Match dengan user siswa demo
    student_name: 'Siswa Demo',
    student_class: 'XII RPL 1',
    student_nisn: '0051234567',
    dudi_name: 'PT. Clay Game Studio',
    dudi_address: 'Jl. Test No. 123',
    division: 'Game Engineer',
    start_date: '2026-10-02',
    end_date: '2026-10-03',
    status: 'pending',
  };

  console.log('📝 Data yang akan diinsert:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('');

  const { data, error } = await supabase
    .from('placements')
    .insert(testData)
    .select()
    .single();

  if (error) {
    console.error('❌ INSERT GAGAL!');
    console.error('Error:', error);
    console.error('\nKemungkinan penyebab:');
    console.error('1. RLS masih enabled (cek badge di Supabase)');
    console.error('2. Ada field required yang tidak terisi');
    console.error('3. Table tidak exist');
    process.exit(1);
  }

  console.log('✅ INSERT BERHASIL!');
  console.log('Data yang berhasil disimpan:');
  console.log(JSON.stringify(data, null, 2));
  console.log('');
  console.log('🎉 Supabase connection berfungsi dengan baik!');
}

testInsert();
