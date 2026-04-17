'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { MessageSquare, Search, Filter, Eye, Clock, Video, FileText } from 'lucide-react';

const consultationsData = [
  { id: 'C-1001', patient: 'محمد علي', doctor: 'د. أحمد الحاسي', date: '2026-04-12', time: '10:30 ص', type: 'video', status: 'active' as const },
  { id: 'C-1002', patient: 'سارة الفيتوري', doctor: 'د. فاطمة العلوي', date: '2026-04-12', time: '11:00 ص', type: 'chat', status: 'pending' as const },
  { id: 'C-1003', patient: 'خالد النوري', doctor: 'د. سالم الورفلي', date: '2026-04-12', time: '11:30 ص', type: 'video', status: 'pending' as const },
  { id: 'C-1004', patient: 'ليلى المبروك', doctor: 'د. أحمد الحاسي', date: '2026-04-11', time: '09:00 ص', type: 'video', status: 'completed' as const },
];

function ConsultationsContent() {
  const { lang } = useLang();

  const columns = [
    { key: 'id', header: lang === 'ar' ? 'رقم الاستشارة' : 'Consultation ID' },
    { key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient' },
    { key: 'doctor', header: lang === 'ar' ? 'الطبيب' : 'Doctor' },
    {
      key: 'type', header: lang === 'ar' ? 'النوع' : 'Type',
      render: (row: typeof consultationsData[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {row.type === 'video' ? <Video size={14} color="#2563EB" /> : <MessageSquare size={14} color="#7C3AED" />}
          <span style={{ fontSize: 13 }}>{row.type === 'video' ? (lang === 'ar' ? 'فيديو' : 'Video') : (lang === 'ar' ? 'دردشة' : 'Chat')}</span>
        </div>
      ),
    },
    {
      key: 'time', header: lang === 'ar' ? 'الموعد' : 'Schedule',
      render: (row: typeof consultationsData[0]) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{row.date}</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>{row.time}</div>
        </div>
      ),
    },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof consultationsData[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid #E2E8F0', background: '#fff',
            color: '#475569', cursor: 'pointer', fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <Eye size={14} /> {lang === 'ar' ? 'عرض' : 'View'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'الاستشارات الطبية' : 'Medical Consultations'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'متابعة كافة الاستشارات الجارية والسابقة على المنصة' : 'Monitor all ongoing and past platform consultations'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 20px', borderRadius: 12, border: '1px solid #E2E8F0',
            background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer',
            fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Filter size={18} /> {lang === 'ar' ? 'تصفية المتأخرة' : 'Filter Delayed'}
          </button>
        </div>
      </div>

      <DataTable
        title={lang === 'ar' ? 'سجل الاستشارات' : 'Consultation Logs'}
        columns={columns}
        data={consultationsData}
        action={
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
            width: 300,
          }}>
            <Search size={16} color="#94A3B8" />
            <input
              placeholder={lang === 'ar' ? 'بحث برقم الاستشارة أو اسم المريض...' : 'Search by ID or Patient...'}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
            />
          </div>
        }
      />
    </div>
  );
}

export default function ConsultationsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <ConsultationsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
