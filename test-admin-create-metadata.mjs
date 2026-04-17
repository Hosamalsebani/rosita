import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminCreate() {
    console.log("Trying with DOCTOR in metadata...");
    const { data: d1, error: e1 } = await supabaseAdmin.auth.admin.createUser({
        email: 'test_doctor1_' + Date.now() + '@example.com',
        password: 'Password123!',
        user_metadata: { role: 'DOCTOR', full_name: 'John Doe', name: 'John Doe' },
        email_confirm: true
    });
    console.log("Attempt 1 error:", e1?.message);

    console.log("Trying with Doctor in metadata...");
    const { data: d2, error: e2 } = await supabaseAdmin.auth.admin.createUser({
        email: 'test_doctor2_' + Date.now() + '@example.com',
        password: 'Password123!',
        user_metadata: { role: 'Doctor', full_name: 'John Doe', name: 'John Doe' },
        email_confirm: true
    });
    console.log("Attempt 2 error:", e2?.message);
}

testAdminCreate();
