'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { MessageSquare, Video, Clock, Eye, Send, FilePlus, User } from 'lucide-react';

const doctorConsultations = [
  { id: 'C-2041', patient: 'أحمد علي', age: 34, reason: 'صداع مزمن', time: '10:30 ص', status: 'active' as const, type: 'video' },
  { id: 'C-2042', patient: 'فاطمة المبروك', age: 28, reason: 'متابعة حمل', time: '11:00 ص', status: 'pending' as const, type: 'chat' },
  { id: 'C-2043', patient: 'خالد النوري', age: 45, reason: 'آلام في الظهر', time: '11:30 ص', status: 'pending' as const, type: 'video' },
];

function DoctorConsultationsContent() {
  const { lang } = useLang();

  const columns = [
    {
      key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient',
      render: (row: typeof doctorConsultations[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#F1F5F9', color: '#475569',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1E293B' }}>{row.patient}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{row.age} {lang === 'ar' ? 'سنة' : 'years'}</div>
          </div>
        </div>
      )
    },
    { key: 'reason', header: lang === 'ar' ? 'سبب الاستشارة' : 'Reason' },
    {
      key: 'type', header: lang === 'ar' ? 'النوع' : 'Type',
      render: (row: typeof doctorConsultations[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {row.type === 'video' ? <Video size={14} color="#2563EB" /> : <MessageSquare size={14} color="#7C3AED" />}
          <span style={{ fontSize: 13 }}>{row.type === 'video' ? (lang === 'ar' ? 'فيديو' : 'Video') : (lang === 'ar' ? 'دردشة' : 'Chat')}</span>
        </div>
      )
    },
    {
      key: 'time', header: lang === 'ar' ? 'الوقت' : 'Time',
      render: (row: typeof doctorConsultations[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
          <Clock size={14} /> {row.time}
        </div>
      )
    },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof doctorConsultations[0]) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: (row: typeof doctorConsultations[0]) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionButton variant={row.status === 'active' ? 'primary' : 'secondary'} 
            icon={row.type === 'video' ? <Video size={14} /> : <MessageSquare size={14} />}>
            {row.status === 'active' ? (lang === 'ar' ? 'دخول' : 'Enter') : (lang === 'ar' ? 'قبول' : 'Accept')}
          </ActionButton>
          <button style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1px solid #E2E8F0', background: '#fff',
            color: '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} title="View Records">
            <Eye size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'طلبات الاستشارة' : 'Consultation Requests'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إدارة محادثاتك وجلسات الفيديو مع المرضى' : 'Manage your chats and video sessions with patients'}
          </p>
        </div>
        <ActionButton variant="secondary" icon={<FilePlus size={18} />}>
          {lang === 'ar' ? 'سجل طبي جديد' : 'New Medical Record'}
        </ActionButton>
      </div>

      <DataTable
        columns={columns}
        data={doctorConsultations}
      />
    </div>
  );
}

export default function DoctorConsultationsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <DoctorConsultationsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
