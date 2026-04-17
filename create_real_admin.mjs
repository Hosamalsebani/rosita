import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin@roshita.com';
  const password = 'Admin@123456';
  const name = 'Admin User';
  const role = 'ADMIN';

  console.log(`Creating Admin: ${email}...`);

  // 1. Create user in Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name, role },
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log("User already exists in Auth. Attempting to update role in Database...");
      // Try to find the user to get their ID
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const user = existingUser.users.find(u => u.email === email);
      if (user) {
        const { error: updateError } = await supabaseAdmin.from('User').upsert({
          id: user.id,
          email,
          name,
          role
        });
        if (updateError) console.error("Update Error:", updateError);
        else console.log("Admin role updated successfully!");
      }
    } else {
      console.error("Auth Error:", error.message);
    }
    return;
  }

  // 2. Insert into public.User
  if (data.user) {
    const { error: insertError } = await supabaseAdmin.from('User').insert({
      id: data.user.id,
      email: data.user.email,
      name,
      role
    });

    if (insertError) {
      console.error("DB Insert Error:", insertError);
    } else {
      console.log("Admin User Created Successfully in both Auth and Database!");
    }
  }
}

createAdmin();
