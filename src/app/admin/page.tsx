'use client';

import DashboardLayout, { LangProvider } from '@/components/layout/DashboardLayout';
import { KPICard, StatusBadge, DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
import { useLang } from '@/components/layout/DashboardLayout';
import {
  Users, Stethoscope, Pill, FileText, DollarSign,
  MessageSquare, ShoppingCart, TrendingUp, Plus, Download,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const monthlyData = [
  { month: 'يناير', patients: 120, consultations: 85, revenue: 4200 },
  { month: 'فبراير', patients: 150, consultations: 110, revenue: 5100 },
  { month: 'مارس', patients: 180, consultations: 140, revenue: 6300 },
  { month: 'أبريل', patients: 210, consultations: 165, revenue: 7800 },
  { month: 'مايو', patients: 240, consultations: 190, revenue: 8500 },
  { month: 'يونيو', patients: 280, consultations: 220, revenue: 9200 },
];

const specialtyDistribution = [
  { name: 'طب عام', value: 35, color: '#2A7DE1' },
  { name: 'طب أسنان', value: 20, color: '#28A745' },
  { name: 'طب عيون', value: 15, color: '#FFC107' },
  { name: 'طب أطفال', value: 18, color: '#E83E8C' },
  { name: 'جراحة', value: 12, color: '#6F42C1' },
];

const pendingApprovals = [
  { id: 1, name: 'د. محمد الحاسي', type: 'doctor', specialty: 'طب عام', date: '2026-04-10', status: 'pending' as const },
  { id: 2, name: 'صيدلية النور', type: 'pharmacy', specialty: '-', date: '2026-04-09', status: 'pending' as const },
  { id: 3, name: 'د. فاطمة العلوي', type: 'doctor', specialty: 'طب أطفال', date: '2026-04-08', status: 'pending' as const },
  { id: 4, name: 'صيدلية الشفاء', type: 'pharmacy', specialty: '-', date: '2026-04-07', status: 'pending' as const },
];

const recentActivities = [
  { id: 1, action: 'تسجيل مريض جديد', user: 'أحمد علي', time: 'منذ 5 دقائق', type: 'patient' },
  { id: 2, action: 'اكتمال استشارة', user: 'د. سالم', time: 'منذ 12 دقيقة', type: 'consultation' },
  { id: 3, action: 'طلب صيدلية جديد', user: 'صيدلية البركة', time: 'منذ 30 دقيقة', type: 'order' },
  { id: 4, action: 'روشتة جديدة', user: 'د. خالد', time: 'منذ ساعة', type: 'prescription' },
  { id: 5, action: 'موعد جديد', user: 'مريم المختار', time: 'منذ ساعتين', type: 'appointment' },
];

/* ------------------------------------------------------------------ */
/*  Admin Dashboard Content                                            */
/* ------------------------------------------------------------------ */
function AdminContent() {
  const { lang } = useLang();

  const approvalColumns = [
    {
      key: 'name', header: lang === 'ar' ? 'الاسم' : 'Name',
      render: (row: typeof pendingApprovals[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: row.type === 'doctor' ? '#EFF6FF' : '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: row.type === 'doctor' ? '#2563EB' : '#16A34A',
          }}>
            {row.type === 'doctor' ? <Stethoscope size={16} /> : <Pill size={16} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1E293B' }}>{row.name}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              {row.type === 'doctor' ? (lang === 'ar' ? 'طبيب' : 'Doctor') : (lang === 'ar' ? 'صيدلية' : 'Pharmacy')}
            </div>
          </div>
        </div>
      ),
    },
    { key: 'specialty', header: lang === 'ar' ? 'التخصص' : 'Specialty' },
    { key: 'date', header: lang === 'ar' ? 'التاريخ' : 'Date' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: () => <StatusBadge status="pending" />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#ECFDF5',
            color: '#059669', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={16} />
          </button>
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#FEF2F2',
            color: '#DC2626', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <XCircle size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'مرحباً بك، المشرف 👋' : 'Welcome, Admin 👋'}
          </h1>
          <p style={{ fontSize: 15, color: '#64748B' }}>
            {lang === 'ar' ? 'إليك نظرة عامة على أداء المنصة اليوم' : "Here's an overview of the platform performance today"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ActionButton variant="secondary" icon={<Download size={16} />}>
            {lang === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </ActionButton>
          <ActionButton icon={<Plus size={16} />}>
            {lang === 'ar' ? 'إضافة مستخدم' : 'Add User'}
          </ActionButton>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
      }}>
        <KPICard title={lang === 'ar' ? 'إجمالي المرضى' : 'Total Patients'} value="2,847" change={12.5} icon={<Users size={22} />} color="#2A7DE1" subtitle={lang === 'ar' ? '+34 هذا الأسبوع' : '+34 this week'} />
        <KPICard title={lang === 'ar' ? 'الأطباء' : 'Doctors'} value="156" change={8.2} icon={<Stethoscope size={22} />} color="#059669" subtitle={lang === 'ar' ? '12 نشط الآن' : '12 active now'} />
        <KPICard title={lang === 'ar' ? 'الصيدليات' : 'Pharmacies'} value="89" change={3.1} icon={<Pill size={22} />} color="#7C3AED" />
        <KPICard title={lang === 'ar' ? 'الإيرادات' : 'Revenue'} value="45,200 د.ل" change={18.7} icon={<DollarSign size={22} />} color="#F59E0B" subtitle={lang === 'ar' ? 'هذا الشهر' : 'This month'} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Area Chart - Revenue & Patients */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
              {lang === 'ar' ? 'النمو الشهري' : 'Monthly Growth'}
            </h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A7DE1' }} />
                {lang === 'ar' ? 'المرضى' : 'Patients'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                {lang === 'ar' ? 'الاستشارات' : 'Consultations'}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A7DE1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2A7DE1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="patients" stroke="#2A7DE1" strokeWidth={2.5} fill="url(#colorPatients)" />
              <Area type="monotone" dataKey="consultations" stroke="#10B981" strokeWidth={2.5} fill="url(#colorConsultations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Specialty Distribution */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 24 }}>
            {lang === 'ar' ? 'توزيع التخصصات' : 'Specialty Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={specialtyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {specialtyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => <span style={{ fontSize: 12, color: '#64748B' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Approvals & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <DataTable
          title={lang === 'ar' ? 'طلبات التسجيل المعلقة' : 'Pending Registrations'}
          columns={approvalColumns}
          data={pendingApprovals}
          action={
            <span style={{ fontSize: 13, color: '#2A7DE1', fontWeight: 600, cursor: 'pointer' }}>
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
            </span>
          }
        />

        {/* Recent Activity */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 20 }}>
            {lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentActivities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid #F8FAFC',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: activity.type === 'consultation' ? '#EFF6FF' :
                             activity.type === 'order' ? '#F0FDF4' :
                             activity.type === 'prescription' ? '#FFF7ED' : '#F5F3FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {activity.type === 'consultation' ? <MessageSquare size={14} color="#2563EB" /> :
                   activity.type === 'order' ? <ShoppingCart size={14} color="#16A34A" /> :
                   activity.type === 'prescription' ? <FileText size={14} color="#EA580C" /> :
                   <Clock size={14} color="#7C3AED" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{activity.action}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{activity.user}</div>
                </div>
                <span style={{ fontSize: 11, color: '#CBD5E1', flexShrink: 0 }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Export                                                         */
/* ------------------------------------------------------------------ */
export default function AdminDashboardPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <AdminContent />
      </DashboardLayout>
    </LangProvider>
  );
}
