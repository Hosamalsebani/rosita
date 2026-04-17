'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { FilePlus, FileText, Search, Printer, Download, Clock, User, CheckCircle2 } from 'lucide-react';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function DoctorPrescriptionsContent() {
  const { lang } = useLang();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  async function loadPrescriptions() {
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
        .from('Prescription')
        .select('id, createdAt, status, patient:patientId(userId, User:userId(name))')
        .eq('doctorId', profile.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((p: any) => ({
        id: p.id,
        patient: p.patient?.User?.name || 'مريض',
        date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : 'غير محدد',
        pharmacy: 'قيد الصرف', // Pharmacy info might be in a separate table or field
        status: (p.status?.toLowerCase() || 'active') as any,
      }));

      setPrescriptions(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'id', header: lang === 'ar' ? 'رقم الروشتة' : 'RX ID' },
    { 
      key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient',
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <User size={14} color="#64748B" />
          <span style={{ fontWeight: 600 }}>{row.patient}</span>
        </div>
      )
    },
    { 
      key: 'date', header: lang === 'ar' ? 'التاريخ' : 'Date',
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
          <Clock size={14} /> {row.date}
        </div>
      )
    },
    { key: 'pharmacy', header: lang === 'ar' ? 'الصيدلية' : 'Pharmacy' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Print"><Printer size={14} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Download"><Download size={14} /></button>
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
            {lang === 'ar' ? 'الروشتات الإلكترونية' : 'E-Prescriptions'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إصدار ومتابعة الروشتات الطبية الإلكترونية لمرضاك' : 'Issue and track electronic prescriptions for your patients'}
          </p>
        </div>
        <ActionButton icon={<FilePlus size={18} />}>
          {lang === 'ar' ? 'روشتة جديدة' : 'New Prescription'}
        </ActionButton>
      </div>

      <DataTable
        columns={columns}
        data={prescriptions}
        action={
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
            width: 300,
          }}>
            <Search size={16} color="#94A3B8" />
            <input
              placeholder={lang === 'ar' ? 'بحث عن مريض أو رقم روشتة...' : 'Search Patient or RX ID...'}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
            />
          </div>
        }
      />
    </div>
  );
}

export default function DoctorPrescriptionsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <DoctorPrescriptionsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
