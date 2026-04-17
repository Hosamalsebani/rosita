import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTM5MDQsImV4cCI6MjA5MTAyOTkwNH0.HCnah-_pkEnrstYTWUukYUz0I1ujG1x4Nnh_PeK75vk';

async function fetchSchema() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            }
        });
        const data = await response.json();
        const userDef = data.definitions?.User;
        console.log("User table definition:", JSON.stringify(userDef, null, 2));
    } catch (e) {
        console.error(e);
    }
}

fetchSchema();
