import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testBooking() {
    console.log("=== Test Booking Flow ===");

    // 1: Try inserting CLINIC_VISIT (from the test file)
    console.log("\n1) Testing CLINIC_VISIT...");
    const { error: e1 } = await supabaseAdmin.from('Appointment').insert({
        id: 'test-booking-001',
        doctorId: 'doc-prof-1',
        patientId: 'pat-prof-1',
        date: '2026-05-01',
        startTime: '10:00',
        endTime: '10:30',
        status: 'PENDING',
        serviceType: 'CLINIC_VISIT',
        paymentStatus: 'UNPAID',
        reason: 'Test'
    });
    if (e1) console.log("CLINIC_VISIT failed:", e1.message);
    else console.log("CLINIC_VISIT: OK");

    // 2: Try ONLINE_CHAT
    console.log("\n2) Testing ONLINE_CHAT...");
    const { error: e2 } = await supabaseAdmin.from('Appointment').insert({
        id: 'test-booking-002',
        doctorId: 'doc-prof-1',
        patientId: 'pat-prof-1',
        date: '2026-05-01',
        startTime: '11:00',
        endTime: '11:30',
        status: 'PENDING',
        serviceType: 'ONLINE_CHAT',
        paymentStatus: 'UNPAID',
        reason: 'Test Chat'
    });
    if (e2) console.log("ONLINE_CHAT failed:", e2.message);
    else console.log("ONLINE_CHAT: OK");

    // 3: Try VOICE_CALL
    console.log("\n3) Testing VOICE_CALL...");
    const { error: e3 } = await supabaseAdmin.from('Appointment').insert({
        id: 'test-booking-003',
        doctorId: 'doc-prof-1',
        patientId: 'pat-prof-1',
        date: '2026-05-01',
        startTime: '12:00',
        endTime: '12:30',
        status: 'PENDING',
        serviceType: 'VOICE_CALL',
        paymentStatus: 'UNPAID',
        reason: 'Test Voice'
    });
    if (e3) console.log("VOICE_CALL failed:", e3.message);
    else console.log("VOICE_CALL: OK");

    // Cleanup test records
    await supabaseAdmin.from('Appointment').delete().like('id', 'test-booking-%');
    console.log("\nTest records cleaned up.");

    // 4: Check DoctorProfile for a real doctor user ID
    console.log("\n4) Check how DoctorProfile links to User...");
    const { data: profiles } = await supabaseAdmin.from('DoctorProfile').select('id, userId').limit(5);
    console.log("DoctorProfile rows:", profiles);
}

testBooking();
