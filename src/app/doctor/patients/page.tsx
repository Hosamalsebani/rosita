'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
import { ClipboardList, Users, User, Search, Eye, FileText, History, Activity, Filter } from 'lucide-react';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function PatientsContent() {
  const { lang } = useLang();
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
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

      // Fetch unique patients from appointments
      const { data: appointments, error } = await supabase
        .from('Appointment')
        .select('patientId, date, patient:patientId(userId, User:userId(name, createdAt))')
        .eq('doctorId', profile.id);

      if (error) throw error;

      const patientMap: Record<string, any> = {};
      const today = new Date().toISOString().split('T')[0];
      let todayVisits = 0;

      appointments?.forEach((appt: any) => {
        const pId = appt.patientId;
        if (appt.date === today) todayVisits++;

        if (!patientMap[pId]) {
          patientMap[pId] = {
            id: pId,
            name: appt.patient?.User?.name || 'مريض',
            age: 30, // Default age or calculate from DOB if available
            lastVisit: appt.date,
            visits: 1,
            createdAt: appt.patient?.User?.createdAt
          };
        } else {
          patientMap[pId].visits++;
          if (new Date(appt.date) > new Date(patientMap[pId].lastVisit)) {
            patientMap[pId].lastVisit = appt.date;
          }
        }
      });

      const patientList = Object.values(patientMap);
      setPatients(patientList);

      // Stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newPatients = patientList.filter((p: any) => new Date(p.createdAt) > oneWeekAgo).length;

      setStats({
        total: patientList.length,
        new: newPatients,
        today: todayVisits
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      key: 'name', header: lang === 'ar' ? 'المريض' : 'Patient',
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="#64748B" />
          </div>
          <span style={{ fontWeight: 600 }}>{row.name}</span>
        </div>
      )
    },
    { key: 'age', header: lang === 'ar' ? 'العمر' : 'Age' },
    { key: 'lastVisit', header: lang === 'ar' ? 'آخر زيارة' : 'Last Visit' },
    { key: 'visits', header: lang === 'ar' ? 'إجمالي الزيارات' : 'Total Visits' },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button title="View Records" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={14} /></button>
          <button title="Visit History" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><History size={14} /></button>
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
            {lang === 'ar' ? 'سجلات المرضى' : 'Patient Records'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'الوصول إلى السجلات الطبية والتاريخ المرضي لمرضاك' : 'Access medical records and patient history for your patients'}
          </p>
        </div>
        <ActionButton icon={<Users size={18} />}>
          {lang === 'ar' ? 'ملمح مريض جديد' : 'New Patient Profile'}
        </ActionButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} /></div>
          <div><div style={{ fontSize: 12, color: '#94A3B8' }}>{lang === 'ar' ? 'إجمالي المرضى' : 'Total Patients'}</div><div style={{ fontSize: 20, fontWeight: 700 }}>{stats.total}</div></div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} /></div>
          <div><div style={{ fontSize: 12, color: '#94A3B8' }}>{lang === 'ar' ? 'مرضى جدد' : 'New Patients'}</div><div style={{ fontSize: 20, fontWeight: 700 }}>{stats.new}</div></div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={20} /></div>
          <div><div style={{ fontSize: 12, color: '#94A3B8' }}>{lang === 'ar' ? 'زيارات اليوم' : 'Visits Today'}</div><div style={{ fontSize: 20, fontWeight: 700 }}>{stats.today}</div></div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={patients}
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
              width: 300,
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                placeholder={lang === 'ar' ? 'بحث عن مريض بـالاسم أو الملف...' : 'Search Patient by name or ID...'}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <PatientsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
