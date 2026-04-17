'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { ActionButton } from '@/components/ui/DashboardWidgets';
import { Bell, Check, Trash2, Mail, MessageSquare, ShieldAlert, UserPlus, Info, CheckCircle2 } from 'lucide-react';

const notificationsData = [
  { id: 1, titleAr: 'طلب تسجيل طبيب جديد', titleEn: 'New Doctor Registration', descAr: 'د. سارة الورفلي تقدمت بطلب انضمام للمنصة', descEn: 'Dr. Sara Al-Werfalli applied to join the platform', timeAr: 'منذ 5 دقائق', timeEn: '5m ago', type: 'user', priority: 'high' },
  { id: 2, titleAr: 'فشل عملية دفع', titleEn: 'Payment Failed', descAr: 'فشلت عملية الدفع رقم #ORD-5503 للمستخدم خالد النوري', descEn: 'Payment #ORD-5503 failed for user Khaled Al-Nouri', timeAr: 'منذ ساعة', timeEn: '1h ago', type: 'payment', priority: 'high' },
  { id: 3, titleAr: 'تحذير مخزون منخفض', titleEn: 'Low Stock Alert', descAr: 'صيدلية الشفاء أبلغت عن نقص في دواء أوجمنتين', descEn: 'Pharmacy Shifa reported low stock for Augmentin', timeAr: 'منذ ساعتين', timeEn: '2h ago', type: 'system', priority: 'medium' },
  { id: 4, titleAr: 'اكتمال تحديث النظام', titleEn: 'System Update Complete', descAr: 'تم تحديث قواعد بيانات المنصة بنجاح', descEn: 'Platform databases updated successfully', timeAr: 'منذ 5 ساعات', timeEn: '5h ago', type: 'system', priority: 'low' },
];

function AdminNotificationsContent() {
  const { lang } = useLang();

  const getIcon = (type: string) => {
    switch(type) {
      case 'user': return <UserPlus size={18} />;
      case 'payment': return <ShieldAlert size={18} />;
      case 'system': return <Info size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'مركز التنبيهات' : 'Notification Center'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'متابعة كافة النشاطات والتنبيهات الهامة في النظام' : 'Monitor all important system activities and alerts'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 18px', borderRadius: 12, border: '1px solid #E2E8F0',
            background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Check size={18} /> {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notificationsData.map(notif => (
          <div key={notif.id} style={{
            background: '#fff', padding: 20, borderRadius: 16,
            border: '1px solid #F1F5F9', borderRight: `4px solid ${getPriorityColor(notif.priority)}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${getPriorityColor(notif.priority)}10`, color: getPriorityColor(notif.priority),
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {getIcon(notif.type)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>
                  {lang === 'ar' ? notif.titleAr : notif.titleEn}
                </div>
                <div style={{ fontSize: 13, color: '#64748B' }}>
                  {lang === 'ar' ? notif.descAr : notif.descEn}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                {lang === 'ar' ? notif.timeAr : notif.timeEn}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ border: 'none', background: 'transparent', color: '#10B981', cursor: 'pointer' }}><CheckCircle2 size={18} /></button>
                <button style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <AdminNotificationsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
