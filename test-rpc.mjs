import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTM5MDQsImV4cCI6MjA5MTAyOTkwNH0.HCnah-_pkEnrstYTWUukYUz0I1ujG1x4Nnh_PeK75vk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpc() {
  console.log("Testing create_staff_user RPC...");
  const { data, error } = await supabase.rpc('create_staff_user', {
    p_email: 'test_doctor_' + Date.now() + '@example.com',
    p_password: 'TestPassword123!',
    p_name: 'Test Doctor',
    p_role: 'DOCTOR'
  });

  if (error) {
    console.error("RPC Error Details:", JSON.stringify(error, null, 2));
  } else {
    console.log("RPC Success Response:", data);
  }
}

testRpc();
