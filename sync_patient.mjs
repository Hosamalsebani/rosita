import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function syncPatient() {
  const email = 'patient@roshita.com';
  const password = 'Patient@123';

  console.log(`Syncing Patient: ${email}...`);

  // 1. Get user ID from Auth
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    console.error("User not found even after error. Strange.");
    return;
  }

  // 2. Update Auth Password (just to be safe)
  await supabaseAdmin.auth.admin.updateUserById(user.id, { password });

  // 3. Upsert into public.User to ensure data consistency
  const { error: dbError } = await supabaseAdmin.from('User').upsert({
    id: user.id,
    email: email,
    name: 'Roshita Patient',
    role: 'PATIENT',
    status: 'APPROVED'
  });

  if (dbError) {
    console.error("Database Error:", dbError);
  } else {
    console.log("Patient account synced and password set successfully!");
  }
}

syncPatient();
