import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DOCTOR_ID = '068d8a89-03e2-442c-81bf-f2da096a6a77';

async function seedTransactions() {
    console.log("Seeding Transactions...");
    // Try to insert with different common column names if first fails
    const txs = [
      { id: 'tx-1', userId: DOCTOR_ID, amount: 75.0, description: 'كشف مريض: أحمد علي', type: 'EARNING' },
      { id: 'tx-2', userId: DOCTOR_ID, amount: 45.0, description: 'كشف مريض: ليلى الورفلي', type: 'EARNING' }
    ];

    const { error: err1 } = await supabase.from('Transaction').upsert(txs);
    if (!err1) {
        console.log("Transactions seeded successfully!");
        return;
    }
    
    console.log("First attempt failed, trying alternative schema...", err1.message);
    
    // Alternative: Maybe doctorId?
    const txs2 = [
      { id: 'tx-1-alt', doctorId: 'doc-prof-real', amount: 75.0, description: 'كشف مريض: أحمد علي' },
      { id: 'tx-2-alt', doctorId: 'doc-prof-real', amount: 45.0, description: 'كشف مريض: ليلى الورفلي' }
    ];
    const { error: err2 } = await supabase.from('Transaction').insert(txs2);
    if (!err2) {
        console.log("Transactions seeded with doctorId!");
        return;
    }
    console.log("Second attempt failed:", err2.message);
}

seedTransactions();
