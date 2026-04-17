'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { ActionButton } from '@/components/ui/DashboardWidgets';
import { BarChart3, LineChart, PieChart, Download, Calendar, Filter, ArrowUpRight, TrendingUp, Users, Activity } from 'lucide-react';

function AdminReportsContent() {
  const { lang } = useLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'التقارير والتحليلات' : 'Reports & Analytics'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'تحليل أداء المنصة ونمو المستخدمين والعمليات' : 'Analyze platform performance, user growth, and operations'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 18px', borderRadius: 12, border: '1px solid #E2E8F0',
            background: '#fff', color: '#475569', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Calendar size={18} /> {lang === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days'}
          </button>
          <ActionButton icon={<Download size={18} />}>
            {lang === 'ar' ? 'تصدير PDF' : 'Export PDF'}
          </ActionButton>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { labelAr: 'معدل النمو', labelEn: 'Growth Rate', value: '24.8%', icon: <TrendingUp size={20} />, color: '#10B981' },
          { labelAr: 'مستخدم جديد', labelEn: 'New Users', value: '+142', icon: <Users size={20} />, color: '#2563EB' },
          { labelAr: 'نشاط المنصة', labelEn: 'Platform Activity', value: '98.2%', icon: <Activity size={20} />, color: '#7C3AED' },
          { labelAr: 'تحصيل الرسوم', labelEn: 'Fee Collection', value: '4.2k DL', icon: <BarChart3 size={20} />, color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{lang === 'ar' ? stat.labelAr : stat.labelEn}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94A3B8' }}>
          <LineChart size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
          <div style={{ fontWeight: 600 }}>{lang === 'ar' ? 'مخطط نمو المستخدمين (سيتم الربط مع Recharts)' : 'User Growth Chart (Recharts integration needed)'}</div>
        </div>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94A3B8' }}>
          <PieChart size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
          <div style={{ fontWeight: 600, textAlign: 'center' }}>{lang === 'ar' ? 'توزيع التخصصات' : 'Specialty Distribution'}</div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <AdminReportsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
