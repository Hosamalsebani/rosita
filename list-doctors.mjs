import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function listAllDoctors() {
    const { data: users, error: userError } = await supabaseAdmin
        .from('User')
        .select('id, name, DoctorProfile(id, consultationFee)')
        .eq('role', 'DOCTOR');
    
    if (userError) {
        console.error("Error:", userError.message);
    } else {
        console.log("Doctors found:", JSON.stringify(users, null, 2));
    }
}

listAllDoctors();
