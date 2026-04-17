const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://zsdeujkgbmmdknxqtzeg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg'
);

async function migrate() {
  // Test if isOnline column exists
  const { error: testErr } = await supabase
    .from('DoctorProfile')
    .select('isOnline')
    .limit(1);

  if (testErr && testErr.message.includes('column')) {
    console.log('Column isOnline does NOT exist. Please run this SQL in Supabase SQL Editor:');
    console.log('ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "isOnline" BOOLEAN DEFAULT false;');
    console.log('ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMP WITH TIME ZONE DEFAULT NOW();');
  } else {
    console.log('Column isOnline already exists!');
  }

  // Test if workingHours column exists
  const { error: whErr } = await supabase
    .from('DoctorProfile')
    .select('workingHours')
    .limit(1);

  if (whErr && whErr.message.includes('column')) {
    console.log('Column workingHours does NOT exist. Please run:');
    console.log('ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "workingHours" JSONB DEFAULT \'{}\'::jsonb;');
  } else {
    console.log('Column workingHours already exists!');
  }
}

migrate();
