import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAdmin = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg');

async function debugDoctors() {
    const { data: users, error } = await supabaseAdmin
        .from('User')
        .select(`
            id, name, email,
            DoctorProfile (*)
        `)
        .eq('role', 'DOCTOR');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log(JSON.stringify(users, null, 2));
    }
}

debugDoctors();
