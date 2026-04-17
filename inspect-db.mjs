import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log("Checking User table columns...");
    const { data: userCols, error: userError } = await supabaseAdmin.from('User').select('*').limit(1);
    if (userError) {
        console.error("Error fetching User table:", userError.message);
    } else {
        console.log("User table keys:", Object.keys(userCols[0] || {}));
    }

    console.log("Checking for Role enum values (via RPC if exists)...");
    // We might not have an RPC, but we can check a user to see their role value.
    if (userCols && userCols[0]) {
        console.log("Sample User Role:", userCols[0].role);
    }
}

inspectSchema();
