import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
    console.log("Listing all tables in public schema...");
    // This is a trick to get table names via a query that might fail but show info, 
    // or we can try to guess common names.
    // Better: use the RPC if it exists or just try common ones.
    
    const commonTables = ['User', 'Appointment', 'DoctorProfile', 'PatientProfile', 'MedicalRecords', 'DoctorReviews', 'Pharmacy', 'PharmacyOrder'];
    
    for (const table of commonTables) {
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(0);
        if (error) {
            console.log(`Table '${table}': Not found or no access (${error.message})`);
        } else {
            console.log(`Table '${table}': Exists`);
            // If it exists, let's see what columns it has if it has data
            const { data: sample } = await supabaseAdmin.from(table).select('*').limit(1);
            if (sample && sample[0]) {
                console.log(` - Columns: ${Object.keys(sample[0]).join(', ')}`);
            }
        }
    }
}

listTables();
