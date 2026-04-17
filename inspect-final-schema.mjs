import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function inspectFinalSchema() {
    const targets = ['User', 'DoctorProfile', 'Appointment', 'TimeSlots', 'Wallet', 'Transactions'];
    console.log("--- Comprehensive Schema Inspection ---");

    for (const table of targets) {
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
        if (error) {
            console.log(`[${table}] Table probably missing: ${error.message}`);
        } else {
            console.log(`[${table}] Exists. Columns: ${Object.keys(data[0] || {}).join(', ')}`);
        }
    }

    // Specially check ServiceType enum if possible by looking at an appointment record
    const { data: appt } = await supabaseAdmin.from('Appointment').select('*').limit(1);
    if (appt && appt[0]) {
        console.log("Sample Appointment JSON:", JSON.stringify(appt[0], null, 2));
    }

    // Try to get a doctor profile to check ID patterns
    const { data: doc } = await supabaseAdmin.from('DoctorProfile').select('*').limit(1);
    if (doc && doc[0]) {
        console.log("Sample DoctorProfile ID Pattern:", doc[0].id);
        console.log("Sample DoctorProfile userId:", doc[0].userId);
    }
}

inspectFinalSchema();
