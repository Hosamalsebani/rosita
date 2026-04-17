import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function fixAccounts() {
  const accounts = [
    { email: 'admin@roshita.com', password: 'Admin@123456', role: 'ADMIN', name: 'Admin User' },
    { email: 'doctor@roshita.com', password: 'Doctor@123', role: 'DOCTOR', name: 'Dr. Abdalsalam' }
  ];

  for (const account of accounts) {
    console.log(`Fixing account: ${account.email}...`);
    
    // 1. Check if user exists in Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error("Error listing users:", listError);
      return;
    }

    let user = users.find(u => u.email === account.email);

    if (user) {
      console.log(`User ${account.email} found. Resetting password...`);
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: account.password,
        user_metadata: { role: account.role, name: account.name }
      });
      if (updateError) console.error(`Error updating password for ${account.email}:`, updateError.message);
    } else {
      console.log(`User ${account.email} NOT found. Creating...`);
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        user_metadata: { role: account.role, name: account.name },
        email_confirm: true
      });
      if (createError) {
        console.error(`Error creating ${account.email}:`, createError.message);
        continue;
      }
      user = newUser.user;
    }

    // 2. Sync with public.User table
    if (user) {
      const { error: dbError } = await supabaseAdmin.from('User').upsert({
        id: user.id,
        email: account.email,
        name: account.name,
        role: account.role,
        status: 'APPROVED'
      });
      if (dbError) console.error(`DB Error for ${account.email}:`, dbError.message);
      else console.log(`Account ${account.email} is now ready and synced.`);
    }
  }
}

fixAccounts();
