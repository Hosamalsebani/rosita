'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { ClipboardList, Search, Eye, CheckCircle2, Package, Clock, User, Filter } from 'lucide-react';

const prescriptionsData = [
  { id: 'RX-7721', patient: 'أحمد علي', doctor: 'د. سارة الورفلي', date: '2026-04-12', items: 3, status: 'pending' as const },
  { id: 'RX-7722', patient: 'ليلى المبروك', doctor: 'د. أحمد الحاسي', date: '2026-04-12', items: 2, status: 'active' as const },
  { id: 'RX-7723', patient: 'خالد النوري', doctor: 'د. فاطمة العلوي', date: '2026-04-11', items: 5, status: 'completed' as const },
  { id: 'RX-7724', patient: 'محمد الحاسي', doctor: 'د. سالم الورفلي', date: '2026-04-11', items: 1, status: 'completed' as const },
];

function PrescriptionsContent() {
  const { lang } = useLang();

  const columns = [
    { key: 'id', header: lang === 'ar' ? 'رقم الوصفة' : 'Prescription ID' },
    {
      key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient',
      render: (row: typeof prescriptionsData[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <User size={14} color="#64748B" />
          <span style={{ fontWeight: 600 }}>{row.patient}</span>
        </div>
      )
    },
    { key: 'doctor', header: lang === 'ar' ? 'الطبيب المصدر' : 'Issuing Doctor' },
    {
      key: 'date', header: lang === 'ar' ? 'التاريخ' : 'Date',
      render: (row: typeof prescriptionsData[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
          <Clock size={14} /> {row.date}
        </div>
      )
    },
    { 
      key: 'items', header: lang === 'ar' ? 'الأدوية' : 'Medicines',
      render: (row: typeof prescriptionsData[0]) => (
        <span style={{ padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', fontSize: 12, fontWeight: 600 }}>
          {row.items} {lang === 'ar' ? 'أصناف' : 'items'}
        </span>
      )
    },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof prescriptionsData[0]) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: (row: typeof prescriptionsData[0]) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            padding: '6px 14px', borderRadius: 8,
            border: 'none', background: row.status === 'pending' ? '#2A7DE1' : '#F1F5F9',
            color: row.status === 'pending' ? '#fff' : '#475569',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            {row.status === 'pending' ? (lang === 'ar' ? 'تجهيز' : 'Prepare') : (lang === 'ar' ? 'عرض' : 'View')}
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
            {lang === 'ar' ? 'الوصفات الرقمية' : 'Digital Prescriptions'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إدارة وصرف الوصفات الطبية المحولة للصيدلية' : 'Manage and dispense prescriptions sent to the pharmacy'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ActionButton icon={<Search size={18} />}>
            {lang === 'ar' ? 'تحقق من وصفة' : 'Verify Prescription'}
          </ActionButton>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={prescriptionsData}
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
              width: 250,
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                placeholder={lang === 'ar' ? 'اسم المريض أو رقم الوصفة...' : 'Patient name or RX ID...'}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
              />
            </div>
            <button style={{
              padding: '8px 14px', borderRadius: 10,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, color: '#475569', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Filter size={16} />
              {lang === 'ar' ? 'تصفية اليوم' : 'Today\'s Filter'}
            </button>
          </div>
        }
      />
    </div>
  );
}

export default function PrescriptionsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="pharmacist">
        <PrescriptionsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
