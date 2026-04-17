import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTM5MDQsImV4cCI6MjA5MTAyOTkwNH0.HCnah-_pkEnrstYTWUukYUz0I1ujG1x4Nnh_PeK75vk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  console.log("Testing auth.signUp...");
  const { data, error } = await supabase.auth.signUp({
    email: 'test_signup_' + Date.now() + '@example.com',
    password: 'TestPassword123!',
    options: {
      data: {
        role: 'DOCTOR' // Trying to pass metadata
      }
    }
  });

  if (error) {
    console.error("SignUp Error:", error.message);
  } else {
    console.log("SignUp Success User ID:", data.user?.id);
    if(data.user) {
        // Then insert into public.User
        const { error: insertError } = await supabase.from('User').insert({
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

testSignup();
