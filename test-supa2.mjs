import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTM5MDQsImV4cCI6MjA5MTAyOTkwNH0.HCnah-_pkEnrstYTWUukYUz0I1ujG1x4Nnh_PeK75vk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('HealthPost').select('*').limit(1);
  console.log("HealthPost:", error || "Exists");
  const { data: d2, error: e2 } = await supabase.from('Post').select('*').limit(1);
  console.log("Post:", e2 || "Exists");
}

check();
