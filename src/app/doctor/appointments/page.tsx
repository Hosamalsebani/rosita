'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { Calendar as CalendarIcon, Clock, User, Phone, Check, X, ShieldAlert } from 'lucide-react';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function AppointmentsContent() {
  const { lang } = useLang();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('DoctorProfile')
        .select('id')
        .eq('userId', user.id)
        .single();
      
      if (!profile) return;

      const { data, error } = await supabase
        .from('Appointment')
        .select('id, date, startTime, status, reason, patient:patientId(userId, User:userId(name))')
        .eq('doctorId', profile.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((appt: any) => ({
        id: appt.id,
        time: appt.startTime,
        date: appt.date,
        patient: appt.patient?.User?.name || 'مريض',
        type: appt.reason || 'استشارة',
        status: (appt.status?.toLowerCase() === 'confirmed' ? 'active' : appt.status?.toLowerCase()) as any,
      }));

      setAppointments(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      key: 'time', header: lang === 'ar' ? 'الوقت' : 'Time',
      render: (row: any) => (
        <span style={{ fontWeight: 700, color: row.status === 'active' ? '#2563EB' : '#475569' }}>
          {row.time}
        </span>
      )
    },
    {
      key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient',
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={14} />
          </div>
          <span style={{ fontWeight: 600 }}>{row.patient}</span>
        </div>
      )
    },
    { key: 'type', header: lang === 'ar' ? 'نوع الموعد' : 'Appointment Type' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: (row: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {row.status === 'pending' && (
            <>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#ECFDF5', color: '#059669', cursor: 'pointer' }}><Check size={14} /></button>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}><X size={14} /></button>
            </>
          )}
          {row.status === 'active' && (
            <ActionButton variant="primary" icon={<CalendarIcon size={14} />}>
              {lang === 'ar' ? 'بدء الجلسة' : 'Start Session'}
            </ActionButton>
          )}
        </div>
      )
    }
  ];

  if (loading) {
     return <div style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'جدول المواعيد' : 'Appointment Schedule'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إدارة المواعيد المحجوزة في عيادتك' : 'Manage booked appointments in your clinic'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 20px', borderRadius: 12, border: '1px solid #E2E8F0',
            background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer',
            fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <ShieldAlert size={18} /> {lang === 'ar' ? 'تعطيل الحجز' : 'Disable Booking'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <DataTable
          title={lang === 'ar' ? 'مواعيد اليوم' : "Today's Appointments"}
          columns={columns}
          data={appointments}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 20 }}>
              {lang === 'ar' ? 'تنبيهات المواعيد' : 'Schedule Alerts'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 12, background: '#FFFBEB', border: '1px solid #FEF3C7', fontSize: 13, color: '#92400E' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{lang === 'ar' ? 'طلب جديد' : 'New Request'}</div>
                {lang === 'ar' ? 'مريض يطلب استشارة طارئة الساعة 04:00 م' : 'Patient requesting emergency consultation @ 04:00 PM'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorAppointmentsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <AppointmentsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
