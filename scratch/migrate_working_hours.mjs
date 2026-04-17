import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    console.log("Adding workingHours column to DoctorProfile...");
    
    // Attempt via RPC if it exists
    const { error } = await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "workingHours" JSONB DEFAULT \'{}\';' 
    });

    if (error) {
        console.error("Migration failed (RPC likely doesn't exist):", error.message);
        console.log("Please run this SQL manually in the Supabase SQL Editor:");
        console.log('ALTER TABLE "DoctorProfile" ADD COLUMN IF NOT EXISTS "workingHours" JSONB DEFAULT \'{}\';');
    } else {
        console.log("Migration successful!");
    }
}

runMigration();
