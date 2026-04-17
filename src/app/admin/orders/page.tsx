'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge } from '@/components/ui/DashboardWidgets';
import { ShoppingCart, DollarSign, Search, Filter, ArrowUpRight, ArrowDownLeft, Eye, CreditCard } from 'lucide-react';

const ordersData = [
  { id: 'ORD-5501', user: 'محمد علي', amount: '45.00 DL', date: '2026-04-12', type: 'Medicine Order', status: 'completed' as const, method: 'Cache' },
  { id: 'ORD-5502', user: 'د. سارة الورفلي', amount: '150.00 DL', date: '2026-04-12', type: 'Subscription', status: 'completed' as const, method: 'SADAD' },
  { id: 'ORD-5503', user: 'خالد النوري', amount: '25.00 DL', date: '2026-04-12', type: 'Consultation Fee', status: 'pending' as const, method: 'Cache' },
  { id: 'ORD-5504', user: 'صيدلية الشفاء', amount: '300.00 DL', date: '2026-04-11', type: 'Platform Fee', status: 'completed' as const, method: 'Bank Transfer' },
];

function AdminOrdersContent() {
  const { lang } = useLang();

  const columns = [
    { key: 'id', header: lang === 'ar' ? 'رقم العملية' : 'Transaction ID' },
    { key: 'user', header: lang === 'ar' ? 'المستخدم' : 'User' },
    { key: 'type', header: lang === 'ar' ? 'النوع' : 'Type' },
    { 
      key: 'amount', header: lang === 'ar' ? 'المبلغ' : 'Amount',
      render: (row: typeof ordersData[0]) => (
        <span style={{ fontWeight: 700, color: '#0F172A' }}>{row.amount}</span>
      )
    },
    { key: 'method', header: lang === 'ar' ? 'طريقة الدفع' : 'Payment Method' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof ordersData[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Eye size={14} />
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'الطلبات والمدفوعات' : 'Orders & Payments'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إجمالي المعاملات المالية والطلبات عبر المنصة' : 'Total financial transactions and orders across the platform'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>12,840 DL</div>
            <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpRight size={14} /> +12% {lang === 'ar' ? 'هذا الشهر' : 'this month'}
            </div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
        </div>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{lang === 'ar' ? 'طلبات مكتملة' : 'Orders Completed'}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>847</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={24} />
          </div>
        </div>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{lang === 'ar' ? 'عمليات قيد المعالجة' : 'Pending Payments'}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>12</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={ordersData}
        action={
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
            width: 300,
          }}>
            <Search size={16} color="#94A3B8" />
            <input
              placeholder={lang === 'ar' ? 'بحث برقم الطلب أو المستخدم...' : 'Search order ID or User...'}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
            />
          </div>
        }
      />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <AdminOrdersContent />
      </DashboardLayout>
    </LangProvider>
  );
}
