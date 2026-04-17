import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log("--- Inspecting Tables ---");
    const tables = ['User', 'Appointment', 'DoctorProfile', 'TimeSlots', 'Transactions', 'Wallet'];
    
    for (const table of tables) {
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
        if (error) {
            console.log(`Table '${table}': ERROR (${error.message})`);
        } else {
            console.log(`Table '${table}': EXISTS`);
            if (data && data[0]) {
                console.log(` - Sample keys: ${Object.keys(data[0]).join(', ')}`);
                if (table === 'Appointment') {
                   // Try to see what 'serviceType' value is
                   console.log(` - Sample Sample Appointment:`, data[0]);
                }
            } else {
                console.log(` - Table is EMPTY`);
            }
        }
    }

    console.log("\n--- Checking for ServiceType Enum ---");
    // We can't directly check enums easily without Postgres SQL access, 
    // but we can look for errors or existing records.
    try {
        const { data: appts, error: apptError } = await supabaseAdmin.from('Appointment').select('serviceType').limit(10);
        if (apptError) {
             console.log("Error querying Appointment.serviceType:", apptError.message);
        } else {
             const types = [...new Set(appts.map(a => a.serviceType))];
             console.log("Existing ServiceTypes:", types);
        }
    } catch (e) {
        console.log("Caught error checking ServiceType:", e.message);
    }
}

inspectSchema();
