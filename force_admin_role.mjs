import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function ensureAdminRole() {
  const email = 'admin@roshita.com';
  const role = 'ADMIN';

  console.log(`Checking role for ${email}...`);

  // 1. Get user by email from Auth
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  const user = users.users.find(u => u.email === email);

  if (!user) {
    console.error("User not found in Auth. Please run the creation script first.");
    return;
  }

  console.log(`Found Auth User: ${user.id}. Updating Database role...`);

  // 2. Upsert into public.User
  const { error: upsertError } = await supabaseAdmin.from('User').upsert({
    id: user.id,
    email: email,
    name: 'Admin Roshita',
    role: role,
    status: 'APPROVED'
  });

  if (upsertError) {
    console.error("Database Upsert Error:", upsertError);
  } else {
    console.log("Admin role has been successfully set in the database!");
  }
}

ensureAdminRole();
