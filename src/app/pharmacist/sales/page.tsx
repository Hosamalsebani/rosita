'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { ActionButton } from '@/components/ui/DashboardWidgets';
import { BarChart3, TrendingUp, DollarSign, Download, Calendar, ArrowUpRight, ShoppingBag, PieChart } from 'lucide-react';

function PharmacistSalesContent() {
  const { lang } = useLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'المبيعات والتقارير' : 'Sales & Reports'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'تحليل أداء الصيدلية وحجم المبيعات اليومية' : 'Analyze pharmacy performance and daily sales volume'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ActionButton icon={<Download size={18} />}>
            {lang === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </ActionButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={20} /></div>
            <div style={{ fontSize: 12, color: '#10B981', background: '#F0FDF4', padding: '4px 8px', borderRadius: 8, height: 'fit-content' }}>+15%</div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{lang === 'ar' ? 'إيرادات اليوم' : 'Today\'s Revenue'}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>850.00 DL</div>
        </div>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={20} /></div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{lang === 'ar' ? 'عدد المبيعات' : 'Total Sales'}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>42</div>
        </div>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F5F9FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={20} /></div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{lang === 'ar' ? 'متوسط الطلب' : 'Average Order'}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>20.25 DL</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
          <BarChart3 size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div>{lang === 'ar' ? 'مخطط المبيعات الأسبوعي' : 'Weekly Sales Chart'}</div>
        </div>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
          <PieChart size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div>{lang === 'ar' ? 'الأصناف الأكثر مبيعاً' : 'Best Selling Items'}</div>
        </div>
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <LangProvider>
      <DashboardLayout role="pharmacist">
        <PharmacistSalesContent />
      </DashboardLayout>
    </LangProvider>
  );
}
