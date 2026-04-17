'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { ActionButton } from '@/components/ui/DashboardWidgets';
import { 
  User, Mail, Phone, MapPin, Camera, Edit2, Shield, Bell, 
  Save, Stethoscope, Star, Globe, LogOut, Check, ChevronRight,
  Eye, EyeOff, Lock, Clock, Info, Calendar
} from 'lucide-react';

function DoctorProfileContent() {
  const { lang, toggle } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form States
  const [profileData, setProfileData] = useState({
    nameAr: '',
    nameEn: '',
    email: '',
    phone: '',
    specialtyAr: '',
    specialtyEn: '',
    addressAr: '',
    addressEn: '',
    bioAr: '',
    bioEn: '',
    rating: 0,
    patients: 0,
    consultationFee: 0,
    workingHours: {
      Saturday: { enabled: true, start: '09:00', end: '17:00' },
      Sunday: { enabled: true, start: '09:00', end: '17:00' },
      Monday: { enabled: true, start: '09:00', end: '17:00' },
      Tuesday: { enabled: true, start: '09:00', end: '17:00' },
      Wednesday: { enabled: true, start: '09:00', end: '17:00' },
      Thursday: { enabled: true, start: '09:00', end: '17:00' },
      Friday: { enabled: false, start: '09:00', end: '17:00' }
    }
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'schedule' | 'account' | 'notifications' | 'language'>('personal');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('User')
        .select('name, email, phone, avatar, specialization')
        .eq('id', user.id)
        .single();

      const { data: profData, error: profError } = await supabase
        .from('DoctorProfile')
        .select('*')
        .eq('userId', user.id)
        .maybeSingle();

      const { data: appointments } = await supabase
        .from('Appointment')
        .select('patientId', { count: 'exact' })
        .eq('doctorId', profData?.id || `doc-prof-${user.id.substring(0,8)}`);
      
      const uniquePatients = new Set(appointments?.map(a => a.patientId)).size;

      setProfileData({
        nameAr: userData?.name || '',
        nameEn: userData?.name || '', 
        email: userData?.email || '',
        phone: userData?.phone || '',
        specialtyAr: profData?.specialty || '',
        specialtyEn: profData?.specialty || '',
        addressAr: profData?.address || 'غير محدد',
        addressEn: profData?.address || 'Tripoli',
        bioAr: profData?.bio || '',
        bioEn: profData?.bio || '',
        rating: profData?.rating || 0,
        patients: uniquePatients,
        consultationFee: profData?.consultationFee || 0,
        workingHours: profData?.workingHours || {
          Saturday: { enabled: true, start: '09:00', end: '17:00' },
          Sunday: { enabled: true, start: '09:00', end: '17:00' },
          Monday: { enabled: true, start: '09:00', end: '17:00' },
          Tuesday: { enabled: true, start: '09:00', end: '17:00' },
          Wednesday: { enabled: true, start: '09:00', end: '17:00' },
          Thursday: { enabled: true, start: '09:00', end: '17:00' },
          Friday: { enabled: false, start: '09:00', end: '17:00' }
        }
      });
      setImagePreview(userData?.avatar || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true,
    consultations: true,
    reviews: false,
    system: true
  });

  // Handlers
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update User table
      await supabase.from('User').update({
        name: profileData.nameAr,
        phone: profileData.phone
      }).eq('id', user.id);

      // Upsert DoctorProfile table
      await supabase.from('DoctorProfile').upsert({
        id: `doc-prof-${user.id.substring(0,8)}`,
        userId: user.id,
        bio: profileData.bioAr,
        specialty: profileData.specialtyAr,
        address: profileData.addressAr,
        consultationFee: profileData.consultationFee,
        workingHours: profileData.workingHours,
        avatarUrl: imagePreview
      }, { onConflict: 'userId' });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileName = `${user.id}/${Date.now()}.png`;
        const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, {
          upsert: true
        });
        
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        
        setImagePreview(publicUrl);
        
        const { error: userErr } = await supabase.from('User').update({ avatar: publicUrl }).eq('id', user.id);
        const { error: profErr } = await supabase.from('DoctorProfile').update({ avatarUrl: publicUrl }).eq('userId', user.id);

        if (userErr || profErr) throw new Error('Database update failed');

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err: any) {
        console.error('Image upload error:', err);
        alert(lang === 'ar' ? `فشل رفع الصورة: ${err.message}` : `Image upload failed: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Sub-components
  const InputGroup = ({ label, value, onChange, type = 'text', textarea = false }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{label}</label>
      {textarea ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none', minHeight: 120, fontSize: 14, fontFamily: 'inherit' }} 
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none', fontSize: 14 }} 
        />
      )}
    </div>
  );

  const ToggleSwitch = ({ label, active, onToggle }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{label}</span>
      <button 
        onClick={onToggle}
        style={{ 
          width: 48, height: 24, borderRadius: 12, 
          background: active ? '#2563EB' : '#E2E8F0',
          position: 'relative', border: 'none', cursor: 'pointer',
          transition: 'background 0.2s'
        }}
      >
        <div style={{ 
          position: 'absolute', top: 3, 
          left: active ? 27 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s'
        }} />
      </button>
    </div>
  );

  if (loading) {
     return <div style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      {/* Toast Notification */}
      {showSuccess && (
        <div style={{ 
          position: 'fixed', top: 24, right: 24, zIndex: 1000,
          background: '#059669', color: '#fff', padding: '12px 24px',
          borderRadius: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Check size={18} />
          {lang === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully'}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'تحكم في تفاصيل حسابك المهني وإعدادات الوصول' : 'Control your professional account details and access settings'}
          </p>
        </div>
        <ActionButton 
          icon={isSaving ? null : <Save size={18} />} 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ البيانات' : 'Save Changes')}
        </ActionButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Circular Stats Card */}
          <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 20px' }}>
              <div 
                onClick={triggerImageUpload}
                style={{ 
                  width: '100%', height: '100%', borderRadius: '50%', 
                  background: imagePreview ? `url(${imagePreview}) center/cover` : 'linear-gradient(135deg, #2A7DE1, #1E60B8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden'
                }}
              >
                {!imagePreview && <User size={60} color="#fff" />}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
              <button 
                onClick={triggerImageUpload}
                style={{ 
                  position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, 
                  borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', color: '#64748B', transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                <Camera size={16} />
              </button>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
              {lang === 'ar' ? profileData.nameAr : profileData.nameEn}
            </h2>
            <div style={{ color: '#64748B', fontSize: 13, marginBottom: 16 }}>{profileData.email}</div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{profileData.rating.toFixed(1)}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{lang === 'ar' ? 'تقييم' : 'Rating'}</div>
              </div>
              <div style={{ width: 1, background: '#F1F5F9' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{profileData.patients}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{lang === 'ar' ? 'مريض' : 'Patients'}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'personal', labelAr: 'المعلومات الشخصية', labelEn: 'Personal Info', icon: <User size={18} /> },
              { id: 'schedule', labelAr: 'المواعيد والأسعار', labelEn: 'Schedule & Pricing', icon: <Calendar size={18} /> },
              { id: 'account', labelAr: 'إعدادات الحساب', labelEn: 'Account Settings', icon: <Shield size={18} /> },
              { id: 'notifications', labelAr: 'التنبيهات والاشعارات', labelEn: 'Alerts & Notifications', icon: <Bell size={18} /> },
              { id: 'language', labelAr: 'اللغة والعرض', labelEn: 'Language & Display', icon: <Globe size={18} /> },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id as any)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
                  borderRadius: 12, border: 'none', cursor: 'pointer', 
                  background: activeTab === item.id ? '#EFF6FF' : 'transparent', 
                  color: activeTab === item.id ? '#2563EB' : '#64748B', 
                  fontWeight: activeTab === item.id ? 600 : 500, 
                  textAlign: lang === 'ar' ? 'right' : 'left', fontSize: 14,
                  transition: 'all 0.2s ease'
                }}
              >
                {item.icon}
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          {activeTab === 'personal' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'الملف الطبي' : 'Medical Profile'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <InputGroup 
                    label={lang === 'ar' ? 'الاسم بالكامل (عربي)' : 'Full Name (Arabic)'} 
                    value={profileData.nameAr}
                    onChange={(v: string) => setProfileData({...profileData, nameAr: v})}
                  />
                  <InputGroup 
                    label={lang === 'ar' ? 'الاسم بالكامل (إنجليزي)' : 'Full Name (English)'} 
                    value={profileData.nameEn}
                    onChange={(v: string) => setProfileData({...profileData, nameEn: v})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <InputGroup 
                    label={lang === 'ar' ? 'التصنيف المهني' : 'Specialization'} 
                    value={lang === 'ar' ? profileData.specialtyAr : profileData.specialtyEn}
                    onChange={(v: string) => lang === 'ar' ? setProfileData({...profileData, specialtyAr: v}) : setProfileData({...profileData, specialtyEn: v})}
                  />
                  <InputGroup 
                    label={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} 
                    value={profileData.phone}
                    onChange={(v: string) => setProfileData({...profileData, phone: v})}
                  />
                </div>

                <InputGroup 
                  label={lang === 'ar' ? 'العنوان المهني' : 'Professional Address'} 
                  value={lang === 'ar' ? profileData.addressAr : profileData.addressEn}
                  onChange={(v: string) => lang === 'ar' ? setProfileData({...profileData, addressAr: v}) : setProfileData({...profileData, addressEn: v})}
                />

                <InputGroup 
                  label={lang === 'ar' ? 'النبذة المهنية' : 'Professional Bio'} 
                  value={lang === 'ar' ? profileData.bioAr : profileData.bioEn}
                  textarea
                  onChange={(v: string) => lang === 'ar' ? setProfileData({...profileData, bioAr: v}) : setProfileData({...profileData, bioEn: v})}
                />
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'المواعيد والأسعار' : 'Schedule & Pricing'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Pricing Section */}
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>
                    {lang === 'ar' ? 'سعر الاستشارة' : 'Consultation Fee'}
                  </h4>
                  <div style={{ maxWidth: 300 }}>
                    <InputGroup 
                      label={lang === 'ar' ? 'السعر (د.ل)' : 'Fee (LYD)'} 
                      type="number"
                      value={profileData.consultationFee.toString()}
                      onChange={(v: string) => setProfileData({...profileData, consultationFee: parseFloat(v) || 0})}
                    />
                  </div>
                </div>

                {/* Working Hours Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                      {lang === 'ar' ? 'أيام وساعات العمل' : 'Working Days & Hours'}
                    </h4>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                      const dayAr = {
                        'Saturday': 'السبت', 'Sunday': 'الأحد', 'Monday': 'الإثنين', 
                        'Tuesday': 'الثلاثاء', 'Wednesday': 'الأربعاء', 'Thursday': 'الخميس', 'Friday': 'الجمعة'
                      }[day];
                      const schedule = (profileData.workingHours as any)[day];

                      return (
                        <div key={day} style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '16px', background: schedule.enabled ? '#fff' : '#F8FAFC',
                          border: `1px solid ${schedule.enabled ? '#E2E8F0' : '#F1F5F9'}`,
                          borderRadius: 12, opacity: schedule.enabled ? 1 : 0.7
                        }}>
                          <div style={{ width: 120 }}>
                            <ToggleSwitch 
                              label={lang === 'ar' ? (dayAr || day) : day} 
                              active={schedule.enabled}
                              onToggle={() => {
                                const newHours = { ...profileData.workingHours };
                                (newHours as any)[day].enabled = !schedule.enabled;
                                setProfileData({ ...profileData, workingHours: newHours });
                              }}
                            />
                          </div>
                          
                          {schedule.enabled && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <input 
                                type="time"
                                value={schedule.start}
                                onChange={(e) => {
                                  const newHours = { ...profileData.workingHours };
                                  (newHours as any)[day].start = e.target.value;
                                  setProfileData({ ...profileData, workingHours: newHours });
                                }}
                                style={{ 
                                  padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0',
                                  fontFamily: 'inherit', fontSize: 14, color: '#1E293B', outline: 'none'
                                }}
                              />
                              <span style={{ color: '#64748B', fontSize: 14 }}>{lang === 'ar' ? 'إلى' : 'to'}</span>
                              <input 
                                type="time"
                                value={schedule.end}
                                onChange={(e) => {
                                  const newHours = { ...profileData.workingHours };
                                  (newHours as any)[day].end = e.target.value;
                                  setProfileData({ ...profileData, workingHours: newHours });
                                }}
                                style={{ 
                                  padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0',
                                  fontFamily: 'inherit', fontSize: 14, color: '#1E293B', outline: 'none'
                                }}
                              />
                            </div>
                          )}
                          {!schedule.enabled && (
                            <span style={{ color: '#94A3B8', fontSize: 14 }}>
                              {lang === 'ar' ? 'مغلق' : 'Closed'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={20} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'الأمان وكلمة المرور' : 'Security & Password'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
                <InputGroup 
                  label={lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'} 
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(v: string) => setSecurityData({...securityData, currentPassword: v})}
                />
                <InputGroup 
                  label={lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'} 
                  type="password"
                  value={securityData.newPassword}
                  onChange={(v: string) => setSecurityData({...securityData, newPassword: v})}
                />
                <InputGroup 
                  label={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} 
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(v: string) => setSecurityData({...securityData, confirmPassword: v})}
                />
                
                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, display: 'flex', gap: 12, marginTop: 12 }}>
                  <Info size={20} color="#64748B" />
                  <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                    {lang === 'ar' 
                      ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك أرقام ورموز خاصة.' 
                      : 'Password must be at least 8 characters long, including numbers and special symbols.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={20} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ToggleSwitch 
                  label={lang === 'ar' ? 'تنبيهات المواعيد الجديدة' : 'New Appointment Alerts'} 
                  active={notificationSettings.appointments}
                  onToggle={() => setNotificationSettings({...notificationSettings, appointments: !notificationSettings.appointments})}
                />
                <ToggleSwitch 
                  label={lang === 'ar' ? 'طلبات الاستشارة الفورية' : 'Instant Consultation Requests'} 
                  active={notificationSettings.consultations}
                  onToggle={() => setNotificationSettings({...notificationSettings, consultations: !notificationSettings.consultations})}
                />
                <ToggleSwitch 
                  label={lang === 'ar' ? 'تقييمات المرضى الجدد' : 'New Patient Reviews'} 
                  active={notificationSettings.reviews}
                  onToggle={() => setNotificationSettings({...notificationSettings, reviews: !notificationSettings.reviews})}
                />
                <ToggleSwitch 
                  label={lang === 'ar' ? 'تحديثات النظام العامة' : 'General System Updates'} 
                  active={notificationSettings.system}
                  onToggle={() => setNotificationSettings({...notificationSettings, system: !notificationSettings.system})}
                />
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={20} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'اللغة والعرض' : 'Language & Display'}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#444', display: 'block', marginBottom: 16 }}>
                    {lang === 'ar' ? 'اختر لغة الواجهة المحبذة' : 'Choose preferred language'}
                  </label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={() => lang !== 'ar' && toggle()}
                      style={{ 
                        flex: 1, padding: '20px', borderRadius: 16, border: '2px solid',
                        borderColor: lang === 'ar' ? '#2563EB' : '#F1F5F9',
                        background: lang === 'ar' ? '#EFF6FF' : '#fff',
                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🇱🇾</div>
                      <div style={{ fontWeight: 700, color: lang === 'ar' ? '#1E293B' : '#64748B' }}>العربية</div>
                    </button>
                    <button 
                      onClick={() => lang !== 'en' && toggle()}
                      style={{ 
                        flex: 1, padding: '20px', borderRadius: 16, border: '2px solid',
                        borderColor: lang === 'en' ? '#2563EB' : '#F1F5F9',
                        background: lang === 'en' ? '#EFF6FF' : '#fff',
                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🇺🇸</div>
                      <div style={{ fontWeight: 700, color: lang === 'en' ? '#1E293B' : '#64748B' }}>English</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

export default function DoctorProfilePage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <DoctorProfileContent />
      </DashboardLayout>
    </LangProvider>
  );
}
