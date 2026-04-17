'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout, { LangProvider } from '@/components/layout/DashboardLayout';
import { KPICard, StatusBadge, DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
import { useLang } from '@/components/layout/DashboardLayout';
import {
  Package, ShoppingCart, TrendingUp, FileText, DollarSign,
  AlertTriangle, Check, X, Eye, Printer, Clock,
  Search, Filter, RefreshCw, List, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const dailySalesData = [
  { day: 'السبت', sales: 1200 },
  { day: 'الأحد', sales: 1500 },
  { day: 'الاثنين', sales: 1800 },
  { day: 'الثلاثاء', sales: 1350 },
  { day: 'الأربعاء', sales: 2100 },
  { day: 'الخميس', sales: 1900 },
  { day: 'الجمعة', sales: 800 },
];

const orderStatusData = [
  { name: 'جديدة', value: 8, color: '#7C3AED' },
  { name: 'قيد التحضير', value: 5, color: '#2A7DE1' },
  { name: 'جاهزة', value: 12, color: '#059669' },
  { name: 'تم التسليم', value: 34, color: '#94A3B8' },
];

const incomingPrescriptions = [
  { id: 'RX-2026-0451', doctor: 'د. أحمد الحاسي', patient: 'محمد علي', date: '2026-04-12', items: 3, status: 'new' as const, total: '85 د.ل' },
  { id: 'RX-2026-0450', doctor: 'د. فاطمة العلوي', patient: 'سارة المبروك', date: '2026-04-12', items: 5, status: 'preparing' as const, total: '142 د.ل' },
  { id: 'RX-2026-0449', doctor: 'د. سالم النوري', patient: 'خالد الفيتوري', date: '2026-04-12', items: 2, status: 'completed' as const, total: '56 د.ل' },
  { id: 'RX-2026-0448', doctor: 'د. خالد التومي', patient: 'ليلى الورفلي', date: '2026-04-11', items: 4, status: 'delivered' as const, total: '198 د.ل' },
];

const lowStockItems = [
  { name: 'أموكسيسيلين 500mg', stock: 12, min: 50, category: 'مضادات حيوية' },
  { name: 'ايبوبروفين 400mg', stock: 8, min: 30, category: 'مسكنات' },
  { name: 'أوميبرازول 20mg', stock: 5, min: 25, category: 'معدة' },
  { name: 'لوسارتان 50mg', stock: 15, min: 40, category: 'ضغط الدم' },
];

/* ------------------------------------------------------------------ */
/*  Pharmacist Dashboard Content                                       */
/* ------------------------------------------------------------------ */
function PharmacistContent() {
  const { lang } = useLang();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const prescriptionColumns = [
    {
      key: 'id', header: lang === 'ar' ? 'رقم الروشتة' : 'Rx ID',
      render: (row: typeof incomingPrescriptions[0]) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563EB', fontSize: 13 }}>
          {row.id}
        </span>
      ),
    },
    {
      key: 'doctor', header: lang === 'ar' ? 'الطبيب' : 'Doctor',
      render: (row: typeof incomingPrescriptions[0]) => (
        <span style={{ fontWeight: 500, color: '#1E293B' }}>{row.doctor}</span>
      ),
    },
    { key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient' },
    {
      key: 'items', header: lang === 'ar' ? 'الأدوية' : 'Items',
      render: (row: typeof incomingPrescriptions[0]) => (
        <span style={{
          padding: '4px 10px', borderRadius: 20,
          background: '#F1F5F9', fontSize: 12, fontWeight: 600, color: '#475569',
        }}>
          {row.items} {lang === 'ar' ? 'أدوية' : 'items'}
        </span>
      ),
    },
    { key: 'total', header: lang === 'ar' ? 'الإجمالي' : 'Total' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof incomingPrescriptions[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: (row: typeof incomingPrescriptions[0]) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => router.push(`/pharmacist/prescriptions?id=${row.id}`)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: '#EFF6FF',
              color: '#2563EB', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="View">
            <Eye size={14} />
          </button>
          {row.status === 'new' && (
            <button style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: '#ECFDF5',
              color: '#059669', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Accept">
              <Check size={14} />
            </button>
          )}
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#F1F5F9',
            color: '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title="Print">
            <Printer size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'مرحباً، صيدلية الشفاء 💊' : 'Welcome, Al-Shifa Pharmacy 💊'}
          </h1>
          <p style={{ fontSize: 15, color: '#64748B' }}>
            {lang === 'ar' ? 'لديك 8 روشتات جديدة بانتظار المعالجة' : 'You have 8 new prescriptions waiting to be processed'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ActionButton 
            variant="secondary" 
            icon={isRefreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
            onClick={handleRefresh}
          >
            {isRefreshing ? (lang === 'ar' ? 'جاري التحديث...' : 'Refreshing...') : (lang === 'ar' ? 'تحديث' : 'Refresh')}
          </ActionButton>
          <ActionButton icon={<List size={16} />} onClick={() => router.push('/pharmacist/inventory')}>
            {lang === 'ar' ? 'إدارة المخزون' : 'Manage Inventory'}
          </ActionButton>
        </div>
      </div>

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20,
      }}>
        <KPICard 
          title={lang === 'ar' ? 'روشتات جديدة' : 'New Prescriptions'} 
          value="8" 
          icon={<FileText size={22} />} 
          color="#7C3AED" 
          subtitle={lang === 'ar' ? 'تحتاج معالجة' : 'Need processing'} 
          onClick={() => router.push('/pharmacist/prescriptions')}
        />
        <KPICard 
          title={lang === 'ar' ? 'طلبات جاهزة' : 'Ready Orders'} 
          value="12" 
          icon={<ShoppingCart size={22} />} 
          color="#059669" 
          onClick={() => router.push('/pharmacist/orders')}
        />
        <KPICard 
          title={lang === 'ar' ? 'المبيعات اليوم' : "Today's Sales"} 
          value="2,340 د.ل" 
          change={12.4} 
          icon={<DollarSign size={22} />} 
          color="#2A7DE1" 
          onClick={() => router.push('/pharmacist/sales')}
        />
        <KPICard 
          title={lang === 'ar' ? 'تنبيهات المخزون' : 'Stock Alerts'} 
          value="4" 
          icon={<AlertTriangle size={22} />} 
          color="#EF4444" 
          subtitle={lang === 'ar' ? 'أدوية منخفضة' : 'Low items'} 
          onClick={() => router.push('/pharmacist/inventory')}
        />
      </div>

      {/* Prescriptions Table */}
      <DataTable
        title={lang === 'ar' ? 'الروشتات الواردة' : 'Incoming Prescriptions'}
        columns={prescriptionColumns}
        data={incomingPrescriptions}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '8px 14px', borderRadius: 10,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, color: '#475569', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Filter size={14} />
              {lang === 'ar' ? 'تصفية' : 'Filter'}
            </button>
          </div>
        }
      />

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Sales Chart */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
              {lang === 'ar' ? 'المبيعات اليومية' : 'Daily Sales'}
            </h3>
            <span style={{ fontSize: 13, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={14} /> +12.4%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailySalesData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="sales" fill="#28A745" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Alerts */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
              {lang === 'ar' ? 'تنبيهات المخزون' : 'Stock Alerts'}
            </h3>
            <span style={{
              padding: '4px 12px', borderRadius: 20,
              background: '#FEF2F2', color: '#DC2626',
              fontSize: 12, fontWeight: 600,
            }}>
              {lowStockItems.length} {lang === 'ar' ? 'أدوية' : 'items'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lowStockItems.map((item, i) => {
              const percentage = Math.round((item.stock / item.min) * 100);
              return (
                <div key={i} style={{
                  padding: 14,
                  borderRadius: 12,
                  background: '#FFFBEB',
                  border: '1px solid #FEF3C7',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1E293B' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.category}</div>
                    </div>
                    <div style={{ textAlign: 'end' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: percentage < 30 ? '#DC2626' : '#D97706' }}>
                        {item.stock}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>/ {item.min}</div>
                    </div>
                  </div>
                  <div style={{
                    height: 6, borderRadius: 4,
                    background: '#FDE68A',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      borderRadius: 4,
                      background: percentage < 30 ? '#DC2626' : '#F59E0B',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Status Pie */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        maxWidth: 500,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
          {lang === 'ar' ? 'حالة الطلبات' : 'Order Status'}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
          {orderStatusData.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              {item.name} ({item.value})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Export                                                         */
/* ------------------------------------------------------------------ */
export default function PharmacistDashboardPage() {
  return (
    <LangProvider>
      <DashboardLayout role="pharmacist">
        <PharmacistContent />
      </DashboardLayout>
    </LangProvider>
  );
}
