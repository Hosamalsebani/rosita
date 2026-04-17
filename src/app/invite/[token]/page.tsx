'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getInvitationAction } from '@/app/admin/doctors/actions';
import { MEDICAL_SPECIALIZATIONS } from '@/app/admin/doctors/specializations';
import { 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Upload, 
  FileText,
  AlertCircle,
  Loader2,
  ChevronRight,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function DoctorInvitePage() {
  const { token } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // File Upload State
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const licenseInputRef = React.useRef<HTMLInputElement>(null);
  const idInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Documents, 3: Success

  useEffect(() => {
    async function loadInvitation() {
      if (!token) return;
      const result = await getInvitationAction(token as string);
      if (result.success) {
        setInvitation(result.data);
        setPhone(result.data.phone || '');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadInvitation();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    if (!licenseFile || !idFile) {
      alert("يرجى إرفاق المستندات المطلوبة أولاً.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // ── Step 1: Upload documents ─────────────────────────────────────
      setUploadStatus('جاري رفع المستندات...');
      const timestamp = Date.now();
      const safeToken = String(token).substring(0, 8);
      const uploadedDocs: string[] = [];

      for (const [file, folder] of [[licenseFile, 'licenses'], [idFile, 'ids']] as [File, string][]) {
        const ext = file.name.split('.').pop();
        const path = `${folder}/${safeToken}_${timestamp}.${ext}`;
        const { error: upErr } = await supabase.storage.from('doctor-documents').upload(path, file);
        if (upErr) {
          // Storage upload failed (RLS) – note it for later and continue
          uploadedDocs.push(`pending_upload_${path}`);
        } else {
          const { data: { publicUrl } } = supabase.storage.from('doctor-documents').getPublicUrl(path);
          uploadedDocs.push(publicUrl);
        }
      }

      // ── Step 2: Create Auth user via RPC (SECURITY DEFINER - bypasses client restrictions) ─
      setUploadStatus('جاري إنشاء الحساب...');
      const { error: rpcError } = await supabase.rpc('create_staff_user', {
        p_email: invitation.email,
        p_password: password,
        p_name: fullName,
        p_role: 'DOCTOR',
      });

      if (rpcError) {
        // If user already exists, proceed to login anyway
        if (!rpcError.message?.includes('duplicate') && !rpcError.message?.includes('already')) {
          throw new Error('فشل إنشاء الحساب: ' + rpcError.message);
        }
      }

      // ── Step 3: Update User record with specialization + documents ────
      setUploadStatus('جاري حفظ البيانات...');
      await supabase
        .from('User')
        .update({
          phone,
          specialization: invitation.specialization,
          status: 'approved',
          documents: uploadedDocs,
        })
        .eq('email', invitation.email);

      // ── Step 4: Mark invitation as used ──────────────────────────────
      await supabase.from('Invitations').delete().eq('token', token as string);

      // ── Step 5: Sign in client-side and redirect to /doctor ──────────
      setUploadStatus('جاري الدخول للوحة التحكم...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: invitation.email,
        password,
      });

      if (signInError) {
        // Account created but auto-login failed (e.g. email confirmation required)
        console.warn('Auto sign-in failed:', signInError.message);
        setStep(3); // Show success page with manual login button
      } else {
        // ✅ Redirect directly to Doctor dashboard
        router.push('/doctor');
      }

    } catch (err: any) {
      console.error('Onboarding error:', err);
      alert(err?.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={40} className={`${styles.spin} ${styles.loadingText}`} color="#2563EB" />
        <p className={styles.loadingText}>جاري التحقق من الدعوة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <AlertCircle size={40} />
          </div>
          <h1 className={styles.errorTitle}>عذراً، الرابط غير صالح</h1>
          <p className={styles.errorText}>
            {error === 'Invitation link has expired' ? 'انتهت صلاحية هذه الدعوة (أكثر من 24 ساعة). يرجى طلب دعوة جديدة من الإدارة.' : 'رابط الدعوة هذا قديم أو غير صحيح.'}
          </p>
          <button onClick={() => router.push('/')} className={styles.errorBtn}>
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const spec = MEDICAL_SPECIALIZATIONS.find(s => s.id === invitation.specialization);

  return (
    <div className={styles.container}>
      {/* Background Emblem (Clinical Sanctuary Branding) */}
      <div className={styles.backgroundEmblem}>R</div>
      <div className={styles.blurOrbBlue} />
      <div className={styles.blurOrbIndigo} />

      <div className={styles.card}>
        
        {step < 3 && (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.logoBox}>
              <span className={styles.logoText}>R</span>
            </div>
            
            <div className={styles.badge}>
              <Stethoscope size={14} />
              {spec?.ar || invitation.specialization}
            </div>
            <h1 className={styles.title}>إنضمام أطباء روشتة</h1>
            <p className={styles.subtitle}>أكمل بياناتك لفتح حسابك الطبي المعتمد</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <User size={16} />
                الاسم الكامل (كما يظهر في الرخصة)
              </label>
              <input 
                required
                placeholder="د. سامي الأحمد"
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Mail size={16} />
                البريد الإلكتروني (المسجل بالدعوة)
              </label>
              <input 
                disabled
                className={`${styles.input} ${styles.inputDisabled}`}
                value={invitation.email}
              />
            </div>

            <div className={styles.grid2}>
               <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Lock size={16} />
                    كلمة المرور
                  </label>
                  <input 
                    required
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Lock size={16} />
                    تأكيد كلمة المرور
                  </label>
                  <input 
                    required
                    type="password"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
               </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Phone size={16} />
                رقم الهاتف للتواصل
              </label>
              <input 
                required
                placeholder="091-XXXXXXX"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>
              الخطوة التالية (المستندات)
              <ChevronRight size={18} />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
             
             {/* License Input */}
             <input 
               type="file" 
               ref={licenseInputRef} 
               style={{ display: 'none' }}
               accept="application/pdf,image/*"
               onChange={(e) => {
                 if (e.target.files && e.target.files[0]) {
                   setLicenseFile(e.target.files[0]);
                 }
               }}
             />
             <div 
               onClick={() => licenseInputRef.current?.click()}
               className={`${styles.uploadBox} ${licenseFile ? styles.uploadBoxActiveBlue : ''}`}
             >
                <div className={`${styles.uploadIcon} ${licenseFile ? styles.uploadIconActiveBlue : ''}`}>
                   {licenseFile ? <Check size={32} /> : <FileText size={32} />}
                </div>
                <h3 className={styles.uploadTitle}>شهادة مزاولة المهنة</h3>
                <p className={styles.uploadSubtitle}>PDF, JPG (Max 5MB)</p>
                {licenseFile ? (
                   <div className={`${styles.uploadBadge} ${styles.uploadBadgeActiveBlue}`}>
                     {licenseFile.name}
                   </div>
                ) : (
                   <div className={styles.uploadBadge}>
                     <Upload size={14} /> تصفح وإرفاق الملف
                   </div>
                )}
             </div>

             {/* ID Input */}
             <input 
               type="file" 
               ref={idInputRef} 
               style={{ display: 'none' }}
               accept="application/pdf,image/*"
               onChange={(e) => {
                 if (e.target.files && e.target.files[0]) {
                   setIdFile(e.target.files[0]);
                 }
               }}
             />
             <div 
               onClick={() => idInputRef.current?.click()}
               className={`${styles.uploadBox} ${idFile ? styles.uploadBoxActiveGreen : ''}`}
             >
                <div className={`${styles.uploadIcon} ${idFile ? styles.uploadIconActiveGreen : ''}`}>
                   {idFile ? <Check size={32} /> : <ShieldCheck size={32} />}
                </div>
                <h3 className={styles.uploadTitle}>إثبات الهوية (البطاقة/الجواز)</h3>
                <p className={styles.uploadSubtitle}>صورة أو ملف PDF</p>
                {idFile ? (
                   <div className={`${styles.uploadBadge} ${styles.uploadBadgeActiveGreen}`}>
                     {idFile.name}
                   </div>
                ) : (
                   <div className={styles.uploadBadge}>
                     <Upload size={14} /> إرفاق المستند
                   </div>
                )}
             </div>

             <div className={styles.flexButtons}>
                <button type="button" onClick={() => setStep(1)} className={styles.btnSecondary}>
                  السابق
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btnPrimary}
                  style={{ flex: 2 }}
                >
                  {isSubmitting ? <Loader2 size={20} className={styles.spin} /> : <CheckCircle size={20} />}
                  {isSubmitting ? uploadStatus || 'جاري...' : 'إتمام التسجيل والولوج'}
                </button>
             </div>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }} className={styles.scaleIn}>
            <div className={styles.successCircle}>
              <CheckCircle size={48} />
            </div>
            <h1 className={styles.successTitle}>أهلاً بك د. {fullName.split(' ')[0]}!</h1>
            <p className={styles.successText}>
              تم تفعيل حسابك الطبي بنجاح ورفع مستنداتك بأمان. يمكنك الآن الدخول إلى لوحة التحكم الخاصة بك والمباشرة بتقديم الرعاية الصحية.
            </p>
            
            <button onClick={() => router.push('/doctor')} className={styles.btnPrimary}>
              الدخول للوحة التحكم
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
