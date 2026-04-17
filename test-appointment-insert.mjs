import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
    const testAppointment = {
        id: 'test-app-' + Date.now(),
        doctorId: 'doc-prof-1', // This exists from previous check
        patientId: 'pat-prof-1', // This exists from previous check
        date: new Date().toISOString(),
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        status: 'PENDING',
        serviceType: 'CLINIC_VISIT',
        paymentStatus: 'UNPAID',
        reason: 'General Consultation'
    };

    console.log("Attempting to insert test appointment:", testAppointment);
    const { data, error } = await supabaseAdmin.from('Appointment').insert(testAppointment);

    if (error) {
        console.error("Insert failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Error Details:", error.details);
        console.error("Error Hint:", error.hint);
    } else {
        console.log("Insert successful!", data);
        // Cleanup
        await supabaseAdmin.from('Appointment').delete().eq('id', testAppointment.id);
        console.log("Cleanup: Deleted test appointment.");
    }
}

testInsert();
