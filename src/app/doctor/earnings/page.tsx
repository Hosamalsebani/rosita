'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/DashboardWidgets';
import { DollarSign, ArrowUpRight, ArrowDownRight, Calendar, Download, Wallet, TrendingUp, CreditCard } from 'lucide-react';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function EarningsContent() {
  const { lang } = useLang();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [balance, setBalance] = useState('0.00');
  const [totalMonth, setTotalMonth] = useState('0.00');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  async function loadEarnings() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Wallet
      const { data: wallet, error: walletError } = await supabase
        .from('Wallet')
        .select('balance')
        .eq('userId', user.id)
        .single();
      
      if (walletError && walletError.code !== 'PGRST116') {
        console.warn('Wallet fetch warning:', walletError.message);
      }
      setBalance(wallet?.balance?.toFixed(2) || '0.00');

      // 2. Fetch Transactions
      const { data: txs, error } = await supabase
        .from('Transaction')
        .select('id, createdAt, amount, description')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      // If schema allows, we get transactions. If it fails (e.g., missing userId column), we fall back gracefully.
      if (error) {
        console.warn('Transaction fetch missing/error (needs migration):', error.message);
      }

      const safeTxs = txs || [];
      const formatted = safeTxs.map((t: any) => ({
        id: t.id,
        date: new Date(t.createdAt).toISOString().split('T')[0],
        patient: t.description?.split(':')[1]?.trim() || 'نظام',
        service: t.description?.split(':')[0]?.trim() || 'معاملة',
        amount: `${Math.abs(t.amount).toFixed(2)} DL`,
        status: 'completed'
      }));

      setEarnings(formatted);

      // 3. Stats
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthTxs = safeTxs.filter((t: any) => t.createdAt >= firstDay && t.amount > 0);
      const totalM = monthTxs.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      setTotalMonth(totalM.toFixed(2));

      setCompletedSessions(safeTxs.filter((t: any) => t.amount > 0).length);

    } catch (e: any) {
      console.error("Dashboard Load Catch Error:", e?.message || e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
     return <div style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'الأرباح والمدفوعات' : 'Earnings & Payments'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'تتبع إيراداتك من الاستشارات والخدمات الطبية' : 'Track your revenue from consultations and medical services'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 18px', borderRadius: 12, border: '1px solid #E2E8F0',
            background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Download size={18} /> {lang === 'ar' ? 'تحميل التقرير' : 'Download Report'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={20} /></div>
            <div style={{ fontSize: 12, color: '#10B981', background: '#F0FDF4', padding: '4px 8px', borderRadius: 8, height: 'fit-content', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpRight size={12} /> +8%
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{lang === 'ar' ? 'الرصيد القابل للسحب' : 'Available Balance'}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1E293B' }}>{balance} DL</div>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={20} /></div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{lang === 'ar' ? 'إجمالي أرباح الشهر' : 'Total Earnings (Month)'}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1E293B' }}>{totalMonth} DL</div>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={20} /></div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{lang === 'ar' ? 'العمليات المكتملة' : 'Completed Sessions'}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1E293B' }}>{completedSessions}</div>
        </div>
      </div>

      <DataTable
        title={lang === 'ar' ? 'آخر العمليات المالية' : 'Recent Transactions'}
        columns={[
          { key: 'id', header: lang === 'ar' ? 'رقم المعاملة' : 'TX ID' },
          { key: 'date', header: lang === 'ar' ? 'التاريخ' : 'Date' },
          { key: 'patient', header: lang === 'ar' ? 'المريض' : 'Patient' },
          { key: 'service', header: lang === 'ar' ? 'الخدمة' : 'Service' },
          { key: 'amount', header: lang === 'ar' ? 'المبلغ' : 'Amount' },
          { 
            key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
            render: () => (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                {lang === 'ar' ? 'منفذة' : 'Completed'}
              </span>
            )
          },
        ]}
        data={earnings}
      />
    </div>
  );
}

export default function EarningsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <EarningsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
