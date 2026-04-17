import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log("Checking DoctorProfile table columns...");
    const { data: profCols, error: profError } = await supabaseAdmin.from('DoctorProfile').select('*').limit(1);
    if (profError) {
        console.error("Error fetching DoctorProfile table:", profError.message);
    } else if (profCols && profCols.length > 0) {
        console.log("DoctorProfile table keys:", Object.keys(profCols[0]));
        console.log("Sample Data:", JSON.stringify(profCols[0], null, 2));
    } else {
        console.log("DoctorProfile table is empty.");
    }
}

inspectSchema();
