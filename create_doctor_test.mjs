import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createDoctor() {
  const email = 'doctor@roshita.com';
  const password = 'Doctor@123';
  const name = 'د. عبد السلام';
  const role = 'DOCTOR';

  console.log(`Creating/Updating Doctor: ${email}...`);

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  let user = users.users.find(u => u.email === email);

  if (!user) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true
    });
    if (error) {
      console.error("Auth Error:", error.message);
      return;
    }
    user = data.user;
  } else {
      // Reset password just in case
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
  }

  // Ensure role in Database
  const { error: upsertError } = await supabaseAdmin.from('User').upsert({
    id: user.id,
    email,
    name,
    role,
    status: 'APPROVED'
  });

  if (upsertError) console.error("Database Error:", upsertError);
  else console.log(`Doctor ${email} is ready! Password: ${password}`);
}

createDoctor();
