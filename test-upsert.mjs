import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testUpsert() {
    console.log("Testing onConflict upsert...");
    const { data, error } = await supabaseAdmin.from('DoctorProfile').upsert({
        userId: '068d8a89-03e2-442c-81bf-f2da096a6a77',
        consultationFee: 85
    }, { onConflict: 'userId' }).select();
    
    if (error) {
        console.error("Upsert test failed:", error.message);
    } else {
        console.log("Upsert successful:", data);
    }
}

testUpsert();
