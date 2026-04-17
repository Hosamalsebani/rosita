import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTM5MDQsImV4cCI6MjA5MTAyOTkwNH0.HCnah-_pkEnrstYTWUukYUz0I1ujG1x4Nnh_PeK75vk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  console.log("Testing auth.signUp without metadata...");
  const { data, error } = await supabase.auth.signUp({
    email: 'test_signup_empty_' + Date.now() + '@example.com',
    password: 'TestPassword123!',
  });

  if (error) {
    console.error("SignUp Error:", error.message);
  } else {
    console.log("SignUp Success User ID:", data.user?.id);
  }
}

testSignup();
