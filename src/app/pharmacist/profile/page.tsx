'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { ActionButton } from '@/components/ui/DashboardWidgets';
import { Settings, MapPin, Phone, Mail, Camera, Save, Shield, Bell, Globe, LayoutDashboard, Clock } from 'lucide-react';

function PharmacistProfileContent() {
  const { lang } = useLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'ملف الصيدلية' : 'Pharmacy Profile'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إدارة معلومات الصيدلية، الموقع، ومواعيد العمل' : 'Manage pharmacy information, location, and working hours'}
          </p>
        </div>
        <ActionButton icon={<Save size={18} />}>
          {lang === 'ar' ? 'حفظ التغييرات' : 'Save Profile'}
        </ActionButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
              {lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{lang === 'ar' ? 'اسم الصيدلية' : 'Pharmacy Name'}</label>
                <input defaultValue="صيدلية الشفاء المركزية" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E2E8F0', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{lang === 'ar' ? 'رقم الترخيص' : 'License Number'}</label>
                  <input defaultValue="PH-LY-99821" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}</label>
                  <input defaultValue="08:00 AM - 12:00 PM" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{lang === 'ar' ? 'الموقع والعنوان' : 'Location & Address'}</label>
                <div style={{ display: 'flex', gap: 10 }}>
                   <input defaultValue={lang === 'ar' ? 'طرابلس، شارع الجرابة' : 'Tripoli, Jaraba Street'} style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid #E2E8F0', outline: 'none' }} />
                   <button style={{ padding: '10px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#2563EB' }}><MapPin size={20} /></button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
              {lang === 'ar' ? 'إعدادات التواصل' : 'Contact Settings'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{lang === 'ar' ? 'رقم الهاتف العام' : 'Public Phone'}</label>
                  <input defaultValue="+218 21 000 1112" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
                  <input defaultValue="+218 91 000 1112" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 16px', borderRadius: 20, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={40} color="#28A745" />
              <button style={{ position: 'absolute', bottom: -10, right: -10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                <Camera size={14} />
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>{lang === 'ar' ? 'شعار الصيدلية' : 'Pharmacy Logo'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px', borderRadius: 12, background: '#F8FAFC', fontSize: 13, color: '#475569' }}>
                <Shield size={16} color="#16A34A" /> {lang === 'ar' ? 'حساب موثق' : 'Verified Account'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <LangProvider>
      <DashboardLayout role="pharmacist">
        <PharmacistProfileContent />
      </DashboardLayout>
    </LangProvider>
  );
}
