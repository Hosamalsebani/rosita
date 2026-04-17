'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { Users, Search, Filter, UserPlus, MoreVertical, Edit2, Trash2, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';

const usersData = [
  { id: 1, name: 'د. أحمد الحاسي', role: 'doctor', email: 'ahmed@roshita.com', phone: '091-1234567', joined: '2026-01-10', status: 'active' as const },
  { id: 2, name: 'محمد علي', role: 'patient', email: 'mohammed@mail.com', phone: '092-7654321', joined: '2026-03-15', status: 'active' as const },
  { id: 3, name: 'صيدلية الشفاء', role: 'pharmacist', email: 'shifa@pharmacy.ly', phone: '091-0001112', joined: '2026-02-20', status: 'active' as const },
  { id: 4, name: 'د. سارة الورفلي', role: 'doctor', email: 'sara@roshita.com', phone: '094-9998887', joined: '2026-04-05', status: 'pending' as const },
  { id: 5, name: 'خالد النوري', role: 'patient', email: 'khaled@mail.com', phone: '092-1112223', joined: '2026-04-10', status: 'active' as const },
];

function UsersContent() {
  const { lang } = useLang();
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      key: 'name', header: lang === 'ar' ? 'الاسم' : 'Name',
      render: (row: typeof usersData[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #2A7DE1, #1E60B8)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14,
          }}>
            {row.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1E293B' }}>{row.name}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role', header: lang === 'ar' ? 'الدور' : 'Role',
      render: (row: typeof usersData[0]) => {
        const roles: Record<string, { ar: string, en: string, color: string, bg: string }> = {
          DOCTOR: { ar: 'طبيب', en: 'Doctor', color: '#2563EB', bg: '#EFF6FF' },
          PATIENT: { ar: 'مريض', en: 'Patient', color: '#7C3AED', bg: '#F5F3FF' },
          PHARMACIST: { ar: 'صيدلي', en: 'Pharmacist', color: '#16A34A', bg: '#F0FDF4' },
        };
        const r = roles[row.role] || { ar: 'غير معروف', en: 'Unknown', color: '#64748B', bg: '#F1F5F9' };
        return (
          <span style={{
            padding: '4px 10px', borderRadius: 20,
            background: r.bg, color: r.color,
            fontSize: 12, fontWeight: 600,
          }}>
            {lang === 'ar' ? r.ar : r.en}
          </span>
        );
      }
    },
    { key: 'phone', header: lang === 'ar' ? 'الهاتف' : 'Phone' },
    { key: 'joined', header: lang === 'ar' ? 'تاريخ الانضمام' : 'Joined Date' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: typeof usersData[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#F1F5F9',
            color: '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Edit2 size={14} />
          </button>
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#FEF2F2',
            color: '#DC2626', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'عرض وإدارة كافة المستخدمين المسجلين في المنصة' : 'View and manage all registered platform users'}
          </p>
        </div>
        <ActionButton icon={<UserPlus size={18} />}>
          {lang === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}
        </ActionButton>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { labelAr: 'إجمالي المستخدمين', labelEn: 'Total Users', value: '2,847', icon: <Users size={20} />, color: '#2A7DE1' },
          { labelAr: 'أطباء', labelEn: 'Doctors', value: '156', icon: <ShieldCheck size={20} />, color: '#059669' },
          { labelAr: 'صيادلة', labelEn: 'Pharmacists', value: '89', icon: <ShieldCheck size={20} />, color: '#7C3AED' },
          { labelAr: 'مرضى', labelEn: 'Patients', value: '2,602', icon: <Users size={20} />, color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#fff', padding: 20, borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${stat.color}10`, color: stat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{lang === 'ar' ? stat.labelAr : stat.labelEn}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1E293B' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <DataTable
        columns={columns}
        data={usersData}
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F5F7FA', borderRadius: 12, padding: '8px 16px',
              width: 280,
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                placeholder={lang === 'ar' ? 'بحث عن مستخدم...' : 'Search user...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {lang === 'ar' ? 'تصفية' : 'Filter'}
            </button>
          </div>
        }
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <UsersContent />
      </DashboardLayout>
    </LangProvider>
  );
}
