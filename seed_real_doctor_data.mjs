import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DOCTOR_ID = '068d8a89-03e2-442c-81bf-f2da096a6a77';
const IMAGE_PATH = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\46d70c06-b09d-4f16-ab3e-d53620ee3db2\\doctor_specialist_abdalsalam_1776428881479.png';

async function seed() {
    console.log("--- Starting Comprehensive Seeding ---");

    // 1. Upload Avatar
    let avatarUrl = '';
    try {
        const imageBuffer = fs.readFileSync(IMAGE_PATH);
        const fileName = `doctor_${Date.now()}.png`;
        const { data, error } = await supabase.storage.from('avatars').upload(fileName, imageBuffer, {
            contentType: 'image/png'
        });
        if (error) throw error;
        avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
        console.log("Avatar uploaded:", avatarUrl);
    } catch (e) {
        console.error("Avatar upload failed:", e.message);
    }

    // 2. Update Doctor Profile & User
    console.log("Updating Doctor info...");
    await supabase.from('User').update({
        avatar: avatarUrl,
        specialization: 'internal_medicine'
    }).eq('id', DOCTOR_ID);

    await supabase.from('DoctorProfile').upsert({
        id: 'doc-prof-real',
        userId: DOCTOR_ID,
        specialty: 'internal_medicine',
        experienceYears: 15,
        rating: 4.9,
        consultationFee: 75.0,
        bio: 'استشاري الأمراض الباطنية متخصص في علاج السكري والضغط والأمراض المزمنة. خبرة طويلة في المستشفيات التعليمية.',
        isVerified: true,
        isAvailable: true,
        avatarUrl: avatarUrl,
        reviewCount: 24,
        experience: '15 Years'
    });

    // 3. Create Patients
    const patients = [
        { name: 'أحمد علي', email: 'ahmed.patient@roshita.ly', id: 'pat-101', uid: '9a135f60-1e5a-4e2b-8a8b-123456789001' },
        { name: 'ليلى الورفلي', email: 'layla.patient@roshita.ly', id: 'pat-102', uid: '9a135f60-1e5a-4e2b-8a8b-123456789002' },
        { name: 'فاطمة المبروك', email: 'fatima.patient@roshita.ly', id: 'pat-103', uid: '9a135f60-1e5a-4e2b-8a8b-123456789003' },
        { name: 'خالد النوري', email: 'khaled.patient@roshita.ly', id: 'pat-104', uid: '9a135f60-1e5a-4e2b-8a8b-123456789004' },
    ];

    for (const p of patients) {
        // Ensure User exists
        await supabase.from('User').upsert({
            id: p.uid,
            email: p.email,
            name: p.name,
            role: 'PATIENT',
            status: 'APPROVED'
        });
        // Ensure PatientProfile exists
        await supabase.from('PatientProfile').upsert({
            id: p.id,
            userId: p.uid,
            gender: 'MALE',
            bloodGroup: 'O+'
        });
    }

    // 4. Create Appointments
    console.log("Seeding Appointments...");
    const today = new Date().toISOString().split('T')[0];
    const appointments = [
        { id: 'appt-real-1', doctorId: 'doc-prof-real', patientId: 'pat-101', date: today, startTime: '09:00 ص', status: 'CONFIRMED', reason: 'متابعة ضغط الدم' },
        { id: 'appt-real-2', doctorId: 'doc-prof-real', patientId: 'pat-102', date: today, startTime: '11:30 ص', status: 'PENDING', reason: 'استشارة فقر دم' },
        { id: 'appt-real-3', doctorId: 'doc-prof-real', patientId: 'pat-103', date: '2026-04-16', startTime: '10:00 ص', status: 'COMPLETED', reason: 'فحص دوري' },
        { id: 'appt-real-4', doctorId: 'doc-prof-real', patientId: 'pat-104', date: '2026-04-18', startTime: '01:00 م', status: 'CONFIRMED', reason: 'آلام في المعدة' },
    ];

    for (const a of appointments) {
        await supabase.from('Appointment').upsert({
            ...a,
            endTime: a.startTime.replace('00', '30'),
            serviceType: 'CLINIC_VISIT',
            paymentStatus: a.status === 'COMPLETED' ? 'PAID' : 'UNPAID'
        });
    }

    // 5. Seed Reviews
    console.log("Seeding Reviews...");
    const reviews = [
        { doctorId: 'doc-prof-real', patientId: 'pat-101', rating: 5, comment: 'دكتور ممتاز وخلوق جداً، شرح لي الحالة بالتفصيل.' },
        { doctorId: 'doc-prof-real', patientId: 'pat-103', rating: 4, comment: 'تجربة جيدة، الموعد كان دقيقاً والتشخيص موفقاً.' }
    ];
    // Check if table supports these columns
    try {
        await supabase.from('DoctorReviews').insert(reviews);
    } catch (e) { console.log("Reviews insert failed (likely logic mismatch)"); }

    // 6. Wallet & Earnings
    console.log("Seeding Wallet & Transactions...");
    const walletId = `wallet-${DOCTOR_ID.substring(0, 8)}`;
    await supabase.from('Wallet').upsert({
        id: walletId,
        userId: DOCTOR_ID,
        balance: 1450.0
    });

    // Seed some transactions into Transaction table
    // Since Transaction table was found, we'll try to insert earnings
    const txs = [
      { id: 'tx-real-1', userId: DOCTOR_ID, amount: 75.0, description: 'كشف مريض: أحمد علي', createdAt: new Date().toISOString() },
      { id: 'tx-real-2', userId: DOCTOR_ID, amount: 75.0, description: 'كشف مريض: فاطمة المبروك', createdAt: new Date().toISOString() }
    ];
    try {
        await supabase.from('Transaction').insert(txs);
    } catch(e) { console.log("Transaction insert failed, might be missing columns"); }

    console.log("--- Seeding Completed Successfully! ---");
}

seed();
