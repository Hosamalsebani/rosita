import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsers() {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    console.log("Total users in auth:", users?.users.length || error);
    
    // Look for our test users
    const testUsers = users?.users.filter(u => u.email.startsWith('admin_test_doctor') || u.email.startsWith('test_signup_empty'));
    console.log("Found test users:", testUsers?.length);
    
    // Check what happens if we create a user WITHOUT any metadata AND using service role
    const testEmail = 'super_clean_test_' + Date.now() + '@example.com';
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: 'Password123!',
        email_confirm: true
    });
    
    console.log("Create without metadata result:", createError ? createError.message : "Success " + created.user.id);
}

checkUsers();
