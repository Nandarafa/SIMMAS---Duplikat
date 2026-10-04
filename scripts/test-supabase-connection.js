/**
 * Test Supabase Connection
 * Run: node scripts/test-supabase-connection.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local manually
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  });
} catch (error) {
  console.error('❌ Failed to read .env.local:', error.message);
}

console.log('🔍 Testing Supabase Connection...\n');

console.log('📋 Configuration:');
console.log('   URL:', supabaseUrl || '❌ NOT SET');
console.log('   Key:', supabaseKey ? '✅ ' + supabaseKey.substring(0, 20) + '...' : '❌ NOT SET');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not configured in .env.local');
  process.exit(1);
}

// Test REST API
async function testConnection() {
  try {
    console.log('🌐 Testing REST API connection...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      console.log('✅ REST API connection successful!');
    } else {
      console.log('⚠️  REST API responded with status:', response.status);
      const text = await response.text();
      console.log('   Response:', text.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }

  // Test if tables exist
  try {
    console.log('\n📊 Checking database tables...');
    
    const tables = ['placements', 'attendances', 'journals'];
    
    for (const table of tables) {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      if (response.ok) {
        console.log(`   ✅ Table '${table}' exists`);
      } else if (response.status === 404) {
        console.log(`   ⚠️  Table '${table}' NOT FOUND - Run schema.sql first!`);
      } else {
        console.log(`   ⚠️  Table '${table}' status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error('❌ Table check failed:', error.message);
  }

  // Test Storage bucket
  try {
    console.log('\n📦 Checking storage bucket...');
    
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/simmas-photos`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      console.log('   ✅ Storage bucket "simmas-photos" exists');
    } else if (response.status === 404) {
      console.log('   ⚠️  Storage bucket NOT FOUND - Create it in Supabase Dashboard!');
    } else {
      console.log('   ⚠️  Storage bucket status:', response.status);
    }
  } catch (error) {
    console.error('❌ Storage check failed:', error.message);
  }

  console.log('\n✅ Connection test completed!');
  console.log('\n📝 Next Steps:');
  console.log('   1. If tables not found: Run supabase/schema.sql in SQL Editor');
  console.log('   2. If bucket not found: Create "simmas-photos" bucket in Storage');
  console.log('   3. Test insert data from the app');
  console.log('');
}

testConnection();
