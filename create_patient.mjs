import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createPatient() {
  const email = 'patient@roshita.com';
  const password = 'Patient@123';
  const name = 'Roshita Patient';
  const role = 'PATIENT';

  console.log(`Creating Patient Account: ${email}...`);

  // 1. Create user in Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name, role },
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log("User already exists in Auth. Ensuring role in Database...");
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.users.find(u => u.email === email);
      if(user) {
          const { error: upsertError } = await supabaseAdmin.from('User').upsert({
            id: user.id,
            email,
            name,
            role,
            status: 'APPROVED'
          });
          if (upsertError) console.error("Upsert Error:", upsertError);
          else console.log("Patient role verified/updated!");
      }
    } else {
      console.error("Auth Error:", error.message);
    }
    return;
  }

  // 2. Insert/Upsert into public.User
  if (data.user) {
    const { error: insertError } = await supabaseAdmin.from('User').insert({
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      status: 'APPROVED'
    });

    if (insertError) {
      console.error("Database Error:", insertError);
    } else {
      console.log("Patient Account Created Successfully!");
    }
  }
}

createPatient();
