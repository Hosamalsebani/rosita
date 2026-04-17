'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import {
  Users, UserPlus, Search, Edit2, Trash2, Mail, Phone,
  Stethoscope, Calendar, Clock, Star, Activity, MoreVertical,
  CheckCircle, XCircle, Shield, Briefcase, Plus, Filter,
  ShieldCheck, Lock, Copy, Check, X, Download, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { 
  fetchDoctorsServer, 
  createDoctorServer, 
  inviteDoctorAction,
  banDoctorAction,
  unbanDoctorAction,
  deleteDoctorAction 
} from './actions';
import { MEDICAL_SPECIALIZATIONS } from './specializations';

type Doctor = {
  id: string; // Changed to string as Supabase uses UUID/String for ID mostly
  name: string;
  specialty: string;
  phone: string;
  medicalId: string;
  password?: string;
  joined: string;
  status: string;
  documents?: string[];
}

const initialDoctors: Doctor[] = [
  { id: '1', name: 'د. محمود القاضي', specialty: 'طب أعصاب', phone: '091-8887766', medicalId: 'DOC-9921', joined: '2026-01-20', status: 'active' },
  { id: '2', name: 'د. فاطمة الزهراء', specialty: 'طب أطفال', phone: '092-1112233', medicalId: 'DOC-4452', joined: '2026-03-12', status: 'active' },
  { id: '3', name: 'د. خالد الورفلي', specialty: 'جراحة عامة', phone: '094-5554433', medicalId: 'DOC-7781', joined: '2026-04-01', status: 'pending' },
];

function DoctorsContent() {
  const { lang } = useLang();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentials, setShowCredentials] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Doctor Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ inviteLink: string, whatsappLink: string, email: string } | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const result = await fetchDoctorsServer();

      if (!result.success || !result.data) {
        throw new Error(result.error);
      }

      const usersData = result.data;

      // Extract emails which are used across as medicalIds typically in the old system, but we adapt
      const mappedDoctors: Doctor[] = usersData.map((u: any) => ({
        id: u.id,
        name: u.name || 'غير محدد',
        specialty: u.specialization || 'طبيب عام',
        phone: u.phone || 'غير مسجل',
        medicalId: u.email,
        joined: new Date(u.createdAt).toISOString().split('T')[0],
        status: u.status,
        documents: u.documents || []
      }));

      setDoctors(mappedDoctors);
    } catch (e: any) {
      console.error("Error fetching doctors:", e);
      alert(lang === 'ar' ? `خطأ أثناء جلب البيانات: ${e.message}` : `Error fetching data: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helpers
  const generatePassword = () => `Ros#${Math.floor(1000 + Math.random() * 9000)}!`;

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await inviteDoctorAction({
        email: newEmail.trim().toLowerCase(),
        phone: newPhone.trim(),
        specialization: newSpecialty
      });

      if (!result.success || !result.data) {
        alert(lang === 'ar' ? `خطأ: ${result.error}` : `Error: ${result.error}`);
        return;
      }

      // Success
      setInviteResult(result.data);
      
      // Cleanup Form
      setNewName('');
      setNewEmail('');
      setNewSpecialty('');
      setNewPhone('');
      setShowAddModal(false);
      
      // Refresh list (optional, but good)
      fetchDoctors();
    } catch (err) {
      console.error("Failed to send invitation", err);
      alert(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name', header: lang === 'ar' ? 'الطبيب' : 'Doctor',
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: row.status === 'active' ? 'linear-gradient(135deg, #2563EB, #1E40AF)' : '#F1F5F9',
            color: row.status === 'active' ? '#fff' : '#94A3B8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14,
          }}>
            {row.name.charAt(2) || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1E293B' }}>{row.name}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{row.specialty}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'medicalId', header: lang === 'ar' ? 'البريد الإلكتروني للولوج' : 'Login Email',
      render: (row: any) => (
        <code style={{ background: '#F8FAFC', padding: '4px 8px', borderRadius: 6, color: '#2563EB', fontWeight: 600 }}>
          {row.medicalId}
        </code>
      )
    },
    { key: 'phone', header: lang === 'ar' ? 'الهاتف' : 'Phone' },
    { key: 'joined', header: lang === 'ar' ? 'تاريخ التعيين' : 'Joined Date' },
    {
      key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
      render: (row: any) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: (row: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {/* View Documents Button */}
          {row.documents && row.documents.length > 0 && (
            <button 
              onClick={() => {
                // Open first document as a shortcut or show list? For now just open first
                const docUrl = row.documents[0];
                if (docUrl) window.open(docUrl, '_blank');
              }}
              title={lang === 'ar' ? 'عرض المستندات' : 'View Documents'}
              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#F0F9FF', color: '#0369A1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FileText size={14} />
            </button>
          )}

          <button style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Edit2 size={14} />
          </button>

          {/* Ban/Unban Button */}
          <button 
            onClick={async () => {
              if (!confirm(lang === 'ar' ? 'هل أنت متأكد من تغيير حالة هذا الطبيب؟' : 'Are you sure you want to change this doctor\'s status?')) return;
              const action = row.status === 'SUSPENDED' ? unbanDoctorAction : banDoctorAction;
              const res = await action(row.id);
              if (res.success) fetchDoctors();
              else alert(res.error);
            }}
            title={row.status === 'SUSPENDED' ? (lang === 'ar' ? 'إلغاء الحظر' : 'Unban') : (lang === 'ar' ? 'حظر الطبيب' : 'Ban Doctor')}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: row.status === 'SUSPENDED' ? '#ECFDF5' : '#FFF7ED', color: row.status === 'SUSPENDED' ? '#059669' : '#D97706', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {row.status === 'SUSPENDED' ? <ShieldCheck size={14} /> : <Shield size={14} />}
          </button>

          {/* Delete Button */}
          <button 
            onClick={async () => {
              if (!confirm(lang === 'ar' ? 'تحذير: سيتم مسح كافة بيانات الطبيب نهائياً. هل أنت متأكد؟' : 'Warning: All doctor data will be permanently deleted. Are you sure?')) return;
              const res = await deleteDoctorAction(row.id);
              if (res.success) fetchDoctors();
              else alert(res.error);
            }}
            title={lang === 'ar' ? 'مسح البيانات' : 'Delete Data'}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'إدارة الأطباء' : 'Doctor Management'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إضافة أطباء جدد وصرف بيانات الدخول السرية لهم' : 'Add new doctors and issue secret login credentials'}
          </p>
        </div>
        <ActionButton icon={<UserPlus size={18} />} onClick={() => setShowAddModal(true)}>
          {lang === 'ar' ? 'إضافة طبيب جديد' : 'Invite New Doctor'}
        </ActionButton>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { labelAr: 'إجمالي الأطباء', labelEn: 'Total Doctors', value: doctors.length.toString(), icon: <Stethoscope size={20} />, color: '#2563EB' },
          { labelAr: 'الأطباء النشطين', labelEn: 'Active Now', value: doctors.filter(d => d.status === 'active').length.toString(), icon: <ShieldCheck size={20} />, color: '#059669' },
          { labelAr: 'بانتظار التفعيل', labelEn: 'Pending Activation', value: doctors.filter(d => d.status === 'pending').length.toString(), icon: <Lock size={20} />, color: '#D97706' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{lang === 'ar' ? stat.labelAr : stat.labelEn}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <DataTable
        columns={columns}
        data={doctors.filter(d => d.name.includes(searchTerm))}
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F1F5F9', borderRadius: 12, padding: '10px 16px', width: 320 }}>
              <Search size={18} color="#94A3B8" />
              <input 
                placeholder={lang === 'ar' ? 'بحث عن طبيب...' : 'Search doctor...'} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: '100%' }} 
              />
            </div>
          </div>
        }
      />

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: 500, borderRadius: 28, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'modalFadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{lang === 'ar' ? 'إضافة طبيب للمنصة' : 'Add Doctor to Platform'}</h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{lang === 'ar' ? 'الاسم الكامل للطبيب' : 'Full Name'}</label>
                <input required value={newName} onChange={(e) => setNewName(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{lang === 'ar' ? 'البريد الإلكتروني للولوج' : 'Login Email'}</label>
                <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{lang === 'ar' ? 'التخصص' : 'Specialty'}</label>
                  <select required value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
                    <option value="">{lang === 'ar' ? 'اختر التخصص' : 'Select'}</option>
                    {MEDICAL_SPECIALIZATIONS.map(spec => (
                      <option key={spec.id} value={spec.id}>
                        {lang === 'ar' ? spec.ar : spec.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                  <input required value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="09X-XXXXXXX" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }} />
                </div>
              </div>
              <div style={{ marginTop: 8, padding: 16, borderRadius: 12, background: '#F0F9FF', border: '1px solid #BAE6FD', display: 'flex', gap: 12 }}>
                <Mail size={20} color="#0369A1" />
                <p style={{ fontSize: 12, color: '#0369A1', lineHeight: 1.5 }}>
                  {lang === 'ar' 
                    ? 'سيتم إنشاء رابط دعوة فريد وإرساله للطبيب لإكمال تسجيله بنفسه.' 
                    : 'A unique invitation link will be created and sent to the doctor to complete registration.'}
                </p>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  marginTop: 12, padding: '14px', borderRadius: 14, 
                  background: isSubmitting ? '#94A3B8' : '#2563EB', 
                  color: '#fff', border: 'none', fontWeight: 700, 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    {lang === 'ar' ? 'جاري الإضافة...' : 'Adding...'}
                  </>
                ) : (
                  lang === 'ar' ? 'إضافة الطبيب وإصدار البيانات' : 'Add Doctor & Issue Credentials'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invitation Success Modal */}
      {inviteResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <div style={{ background: '#fff', width: 440, borderRadius: 32, padding: 40, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'credentialsPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
             <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={40} />
             </div>
             <h3 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', marginBottom: 8 }}>
               {lang === 'ar' ? 'تم إنشاء الدعوة بنجاح!' : 'Invitation Created!'}
             </h3>
             <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>
               {lang === 'ar' ? 'يمكنك الآن إرسال الرابط للطبيب عبر الوسائل التالية:' : 'You can now send the link to the doctor via:'}
             </p>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <a 
                  href={inviteResult.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 700 }}
                >
                   <Phone size={18} />
                   {lang === 'ar' ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
                </a>
                
                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'left' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'رابط الدعوة المباشر' : 'Direct Invite Link'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input readOnly value={inviteResult.inviteLink} style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 13, color: '#1E293B', fontWeight: 600, outline: 'none' }} />
                    <button 
                      onClick={() => navigator.clipboard.writeText(inviteResult.inviteLink)}
                      style={{ border: 'none', background: '#fff', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#64748B', display: 'flex' }}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
             </div>

             <button onClick={() => setInviteResult(null)} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#1E293B', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                {lang === 'ar' ? 'إغلاق' : 'Close'}
             </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes credentialsPop { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <DoctorsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
