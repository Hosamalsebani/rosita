import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTM5MDQsImV4cCI6MjA5MTAyOTkwNH0.HCnah-_pkEnrstYTWUukYUz0I1ujG1x4Nnh_PeK75vk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: users, error: userError } = await supabase.from('User').select('*').eq('role', 'DOCTOR').order('createdAt', { ascending: false }).limit(1);
  if (userError) console.error("User Error:", userError);
  else console.log("Latest Doctor:", users);
}

check();
