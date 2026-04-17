'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { FileText, Search, Filter, Eye, Download, Printer, Clock } from 'lucide-react';

const adminPrescriptions = [
  { id: 'RX-8801', patient: 'محمد الحاسي', doctor: 'د. سارة الورفلي', pharmacy: 'صيدلية الشفاء', date: '2026-04-12', status: 'completed' as const },
  { id: 'RX-8802', patient: 'ليلى المبروك', doctor: 'د. أحمد الحاسي', pharmacy: 'صيدلية القدس', date: '2026-04-12', status: 'active' as const },
  { id: 'RX-8803', patient: 'خالد النوري', doctor: 'د. فاطمة العلوي', pharmacy: 'لم تصرف بعد', date: '2026-04-12', status: 'pending' as const },
  { id: 'RX-8804', patient: 'فوزي القماطي', doctor: 'د. مريم النجار', pharmacy: 'صيدلية النور', date: '2026-04-11', status: 'completed' as const },
];

function AdminPrescriptionsContent() {
  const { lang } = useLang();

  const columns = [
    { key: 'id', header: lang === 'ar' ? 'رقم الروشتة' : 'RX ID' },
    { key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient' },
    { key: 'doctor', header: lang === 'ar' ? 'الطبيب' : 'Doctor' },
    { key: 'pharmacy', header: lang === 'ar' ? 'الصيدلية' : 'Pharmacy' },
    { 
      key: 'date', header: lang === 'ar' ? 'التاريخ' : 'Date',
      render: (row: typeof adminPrescriptions[0]) => (
        <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={14} /> {row.date}
        </div>
      )
    },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof adminPrescriptions[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={14} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'إجمالي الروشتات' : 'Global Prescriptions'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'مراقبة كافة الروشتات الصادرة والمصروفة عبر المنصة' : 'Monitor all prescriptions issued and dispensed via the platform'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 18px', borderRadius: 12, border: '1px solid #E2E8F0',
            background: '#fff', color: '#475569', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Printer size={18} /> {lang === 'ar' ? 'طباعة تقرير' : 'Print Report'}
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={adminPrescriptions}
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
              width: 300,
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                placeholder={lang === 'ar' ? 'بحث برقم الروشتة أو اسم المريض...' : 'Search by RX ID or Patient...'}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default function AdminPrescriptionsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <AdminPrescriptionsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
