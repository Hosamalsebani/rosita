import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminCreate() {
  console.log("Testing auth.admin.createUser...");
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin_test_doctor_' + Date.now() + '@example.com',
    password: 'TestPassword123!',
    user_metadata: { name: 'Test Doctor' },
    email_confirm: true
  });

  if (error) {
    console.error("Admin Create Error:", error.message);
  } else {
    console.log("Admin Create Success User ID:", data.user?.id);
    
    // Now try to insert into public.User
    if (data.user) {
       const { error: insertError } = await supabaseAdmin.from('User').insert({
            id: data.user.id,
            email: data.user.email,
            name: "Test Doctor Signedup",
            role: "DOCTOR"
        });
        if(insertError) {
             console.error("Insert User Error:", insertError);
        } else {
             console.log("Insert Success!");
        }
    }
  }
}

testAdminCreate();
