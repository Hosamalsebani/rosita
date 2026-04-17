'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge } from '@/components/ui/DashboardWidgets';
import { ShoppingCart, Search, Eye, Package, Clock, User, Filter, MapPin } from 'lucide-react';

const pharmacistOrders = [
  { id: 'ORD-P-11', user: 'محمد الحاسي', amount: '45.00 DL', date: '2026-04-12', items: 2, status: 'active' as const, type: 'Delivery' },
  { id: 'ORD-P-12', user: 'أحمد علي', amount: '12.50 DL', date: '2026-04-12', items: 1, status: 'pending' as const, type: 'Pickup' },
  { id: 'ORD-P-13', user: 'سارة الفيتوري', amount: '84.00 DL', date: '2026-04-11', items: 4, status: 'completed' as const, type: 'Delivery' },
];

function PharmacistOrdersContent() {
  const { lang } = useLang();

  const columns = [
    { key: 'id', header: lang === 'ar' ? 'رقم الطلب' : 'Order ID' },
    { key: 'user', header: lang === 'ar' ? 'المستخدم' : 'Customer' },
    { 
      key: 'type', header: lang === 'ar' ? 'التسليم' : 'Type',
      render: (row: typeof pharmacistOrders[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
          {row.type === 'Delivery' ? <MapPin size={14} /> : <Package size={14} />}
          {row.type === 'Delivery' ? (lang === 'ar' ? 'توصيل' : 'Delivery') : (lang === 'ar' ? 'استلام' : 'Pickup')}
        </div>
      )
    },
    { key: 'amount', header: lang === 'ar' ? 'المبلغ' : 'Amount' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof pharmacistOrders[0]) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Eye size={14} />
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'طلبات الأدوية' : 'Medicine Orders'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إدارة طلبات التوصيل والاستلام من الصيدلية' : 'Manage delivery and pickup orders for the pharmacy'}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pharmacistOrders}
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
              width: 300,
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                placeholder={lang === 'ar' ? 'بحث برقم الطلب...' : 'Search order number...'}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <LangProvider>
      <DashboardLayout role="pharmacist">
        <PharmacistOrdersContent />
      </DashboardLayout>
    </LangProvider>
  );
}
