import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
    console.log("Checking Appointment table data to infer types...");
    const { data, error } = await supabaseAdmin.from('Appointment').select('*').limit(1);
    if (error) {
        console.error("Error fetching Appointment table:", error.message);
    } else {
        if (data && data.length > 0) {
            console.log("Existing Appointment record keys and sample values:");
            for (const key in data[0]) {
                console.log(`${key}: ${typeof data[0][key]} - ${data[0][key]}`);
            }
        } else {
            console.log("No appointments found. Checking columns via RPC if possible or just assuming...");
            // Let's try to insert a dummy (then delete) to see what fails or check if we can get columns.
            console.log("Table seems empty. We'll try to insert a test record with a string date.");
        }
    }
}

checkSchema();
