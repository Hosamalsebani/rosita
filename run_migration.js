const https = require('https');

const projectRef = 'zsdeujkgbmmdknxqtzeg';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';

const sqlStatements = [
  'ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "isOnline" BOOLEAN DEFAULT false',
  'ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMPTZ DEFAULT NOW()'
];

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: `${projectRef}.supabase.co`,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Length': Buffer.byteLength(body),
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Method 1: Try RPC
  for (const sql of sqlStatements) {
    console.log(`Running: ${sql.substring(0, 60)}...`);
    const result = await runSQL(sql);
    console.log(`Result: ${result.status} - ${result.body.substring(0, 200)}`);
  }

  // Method 2: If RPC fails, try direct pg connection via pg-meta API
  // Fallback - just verify by trying to select the column
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(`https://${projectRef}.supabase.co`, serviceKey);
  
  const { error } = await supabase.from('DoctorProfile').select('isOnline').limit(1);
  if (error) {
    console.log('\n❌ Column isOnline still missing. Please run SQL manually in Supabase SQL Editor:');
    console.log('ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "isOnline" BOOLEAN DEFAULT false;');
    console.log('ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMPTZ DEFAULT NOW();');
  } else {
    console.log('\n✅ Column isOnline exists! Migration successful.');
  }
}

main().catch(console.error);
