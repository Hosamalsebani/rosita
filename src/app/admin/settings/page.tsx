'use client';

import React, { useState } from 'react';
import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { ActionButton } from '@/components/ui/DashboardWidgets';
import { 
  Settings, Shield, Database, Save, Lock, Smartphone, Check, 
  Server, RefreshCw, Palette, Activity, Info, Plus
} from 'lucide-react';

function AdminSettingsContent() {
  const { lang } = useLang();
  
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const navItems = [
    { labelAr: 'الإعدادات العامة', labelEn: 'General Settings', icon: <Settings size={18} /> },
    { labelAr: 'الأمان والخصوصية', labelEn: 'Security & Privacy', icon: <Shield size={18} /> },
    { labelAr: 'إدارة البيانات', labelEn: 'Data Management', icon: <Database size={18} /> },
    { labelAr: 'تنسيق النظام', labelEn: 'Platform Branding', icon: <Palette size={18} /> },
    { labelAr: 'تطبيقات الموبايل', labelEn: 'Mobile Apps', icon: <Smartphone size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{ 
          position: 'fixed', top: 24, right: 24, zIndex: 1000,
          background: '#059669', color: '#fff', padding: '12px 24px',
          borderRadius: 14, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Check size={20} />
          {lang === 'ar' ? 'تم حفظ كافة الإعدادات بنجاح' : 'All settings saved successfully'}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'إعدادات النظام' : 'System Settings'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'تخصيص كامل للمنصة، الأمان، والبيانات الحيوية' : 'Comprehensive platform, security, and data configuration'}
          </p>
        </div>
        <ActionButton icon={isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />} onClick={handleSave} disabled={isSaving}>
          {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
        </ActionButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {navItems.map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                borderRadius: 14, border: 'none', cursor: 'pointer',
                background: activeTab === i ? '#EFF6FF' : 'transparent',
                color: activeTab === i ? '#2563EB' : '#64748B',
                fontWeight: activeTab === i ? 700 : 500, 
                textAlign: lang === 'ar' ? 'right' : 'left',
                fontSize: 14, transition: 'all 0.2s',
                boxShadow: activeTab === i ? '0 1px 2px rgba(37,99,235,0.05)' : 'none'
              }}
            >
              <div style={{ 
                color: activeTab === i ? '#2563EB' : '#94A3B8',
                display: 'flex', alignItems: 'center'
              }}>
                {item.icon}
              </div>
              {lang === 'ar' ? item.labelAr : item.labelEn}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ 
          background: '#fff', padding: 40, borderRadius: 28, 
          border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
          minHeight: 500
        }}>
          
          {/* Tab 0: General Settings */}
          {activeTab === 0 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><Settings size={22} /></div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{lang === 'ar' ? 'المعلومات الأساسية للمنصة' : 'Basic Platform Information'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{lang === 'ar' ? 'اسم المنصة' : 'Platform Name'}</label>
                    <input defaultValue="Roshita - روشتة" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none', fontSize: 14 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{lang === 'ar' ? 'بريد الدعم الفني' : 'Support Email'}</label>
                    <input defaultValue="support@roshita.ly" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none', fontSize: 14 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{lang === 'ar' ? 'وصف المنصة' : 'Platform Description'}</label>
                  <textarea 
                    defaultValue={lang === 'ar' ? 'المنصة الصحية الأولى في ليبيا لربط المرضى بالأطباء والصيادلة.' : 'The leading healthcare platform in Libya connecting patients with doctors and pharmacists.'} 
                    style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none', minHeight: 120, fontSize: 14, fontFamily: 'inherit', lineHeight: 1.6 }} 
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px', borderRadius: 20, background: maintenanceMode ? '#FFF7ED' : '#F8FAFC', border: maintenanceMode ? '1px solid #FFE4E6' : '1px solid #F1F5F9', transition: 'all 0.3s' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                    <Server size={22} color={maintenanceMode ? '#D97706' : '#64748B'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'تفعيل وضع الصيانة' : 'Maintenance Mode'}</div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>{lang === 'ar' ? 'سيتم منع جميع المستخدمين من الوصول للمنصة مؤقتاً لإجراء تحديثات' : 'All users will be temporarily blocked from accessing the platform for updates'}</div>
                  </div>
                  <button onClick={() => setMaintenanceMode(!maintenanceMode)} style={{ width: 52, height: 28, borderRadius: 14, background: maintenanceMode ? '#D97706' : '#CBD5E1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div style={{ position: 'absolute', top: 4, left: maintenanceMode ? 28 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Security & Privacy */}
          {activeTab === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}><Shield size={22} /></div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{lang === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { titleAr: 'التحقق الثنائي (2FA)', titleEn: 'Two-Factor Authentication', descAr: 'إلزام جميع المدراء باستخدام التحقق الثنائي عند تسجيل الدخول', descEn: 'Require 2FA for all administrator accounts', icon: <Lock size={18} />, active: true },
                  { titleAr: 'سياسة كلمة المرور القوية', titleEn: 'Strong Password Policy', descAr: 'إلزام المستخدمين بكلمات مرور تحتوي على رموز وأرقام', descEn: 'Force users to include symbols and numbers in passwords', icon: <Lock size={18} />, active: true },
                  { titleAr: 'تشفير بيانات المريض', titleEn: 'Patient Data Encryption', descAr: 'تشفير جميع السجلات الطبية المخزنة في قاعدة البيانات', descEn: 'Encrypt all stored medical records in the database', icon: <Shield size={18} />, active: true },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, border: '1px solid #F1F5F9', background: '#fff' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? item.titleAr : item.titleEn}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>{lang === 'ar' ? item.descAr : item.descEn}</div>
                    </div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: '#2563EB', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, right: 3 }} />
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{lang === 'ar' ? 'مدة الجلسة التلقائية (دقائق)' : 'Session Timeout (Minutes)'}</label>
                  <input type="number" defaultValue="30" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none', width: 120 }} />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Data Management */}
          {activeTab === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}><Database size={22} /></div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{lang === 'ar' ? 'إدارة البيانات والنسخ الاحتياطي' : 'Data Management & Backups'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ padding: 24, borderRadius: 20, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1E293B' }}>{lang === 'ar' ? 'النسخ الاحتياطي التلقائي' : 'Automatic Backups'}</div>
                    <StatusBadge status="active" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>{lang === 'ar' ? 'تكرار النسخ' : 'Frequency'}</label>
                      <select style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff' }}>
                        <option>{lang === 'ar' ? 'يومياً' : 'Daily'}</option>
                        <option>{lang === 'ar' ? 'كل 6 ساعات' : 'Every 6 Hours'}</option>
                        <option>{lang === 'ar' ? 'أسبوعياً' : 'Weekly'}</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>{lang === 'ar' ? 'الاحتفاظ بالنسخ' : 'Retention Period'}</label>
                      <select style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff' }}>
                        <option>30 {lang === 'ar' ? 'يوم' : 'Days'}</option>
                        <option>90 {lang === 'ar' ? 'يوم' : 'Days'}</option>
                        <option>365 {lang === 'ar' ? 'يوم' : 'Days'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <button style={{ padding: '12px 24px', borderRadius: 12, background: '#1E293B', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Database size={16} /> {lang === 'ar' ? 'عمل نسخة احتياطية الآن' : 'Backup Now'}
                  </button>
                  <button style={{ padding: '12px 24px', borderRadius: 12, background: '#fff', color: '#1E293B', border: '1px solid #E2E8F0', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Activity size={16} /> {lang === 'ar' ? 'سجل العمليات (Logs)' : 'Audit Logs'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Platform Branding */}
          {activeTab === 3 && (activeTab === 3) && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Palette size={22} /></div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{lang === 'ar' ? 'تنسيق وهوية المنصة' : 'Platform Branding & Identity'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 700, color: '#444', marginBottom: 12, display: 'block' }}>{lang === 'ar' ? 'الألوان الأساسية' : 'Primary Colors'}</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {['#2563EB', '#059669', '#7C3AED', '#DB2777', '#1E293B'].map(color => (
                        <div key={color} style={{ width: 44, height: 44, borderRadius: 12, background: color, cursor: 'pointer', border: color === '#2563EB' ? '3px solid #E2E8F0' : 'none', position: 'relative' }}>
                            {color === '#2563EB' && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}><Check size={20} color="#fff" /></div>}
                        </div>
                    ))}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={20} color="#94A3B8" /></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{lang === 'ar' ? 'الخط المفضل' : 'Preferred Font'}</label>
                      <select style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
                        <option>Inter (Modern Sans)</option>
                        <option>Roboto (Classic)</option>
                        <option>Outfit (Premium)</option>
                        <option>Almarai (Arabic Standard)</option>
                      </select>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{lang === 'ar' ? 'شعار المنصة الكبير' : 'Main Branding Logo'}</label>
                      <button style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff', textAlign: 'center', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        {lang === 'ar' ? 'رفع شعار جديد' : 'Upload New Logo'}
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Mobile Apps */}
          {activeTab === 4 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><Smartphone size={22} /></div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{lang === 'ar' ? 'إعدادات تطبيقات الموبايل' : 'Mobile App Configuration'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px', borderRadius: 20, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>App Store (iOS) URL</label>
                         <input defaultValue="https://apps.apple.com/roshita" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>Play Store (Android) URL</label>
                         <input defaultValue="https://play.google.com/roshita" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }} />
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{lang === 'ar' ? 'أصغر إصدار مدعوم' : 'Minimum Support Version'}</label>
                         <input defaultValue="2.1.0" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{lang === 'ar' ? 'تفعيل التحديث الإجباري' : 'Force Update enabled'}</label>
                         <div style={{ height: 44, display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: 'pointer' }} />
                         </div>
                      </div>
                   </div>
                </div>

                <div style={{ padding: 20, borderRadius: 16, border: '1px solid #FEF3C7', background: '#FFFBEB', display: 'flex', gap: 12 }}>
                    <div style={{ color: '#D97706' }}><Info size={20} /></div>
                    <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
                        {lang === 'ar' ? 'تغيير إصدار التطبيق سيؤدي لإرسال تنبيه فوري لجميع المستخدمين الذين يحملون إصداراً أقدم للتحديث.' : 'Changing the app version will send an immediate notification to all users on older versions to update.'}
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function StatusBadge({ status }: { status: 'active' | 'pending' }) {
    return (
        <span style={{ 
            padding: '4px 12px', borderRadius: 20, background: '#F0FDF4', 
            color: '#16A34A', fontSize: 12, fontWeight: 700, display: 'flex', 
            alignItems: 'center', gap: 6 
        }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
            {status === 'active' ? 'Active' : 'Pending'}
        </span>
    );
}

export default function SettingsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <AdminSettingsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
