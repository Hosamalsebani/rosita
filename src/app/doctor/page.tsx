'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout, { LangProvider } from '@/components/layout/DashboardLayout';
import { KPICard, StatusBadge, ActionButton } from '@/components/ui/DashboardWidgets';
import { useLang } from '@/components/layout/DashboardLayout';
import {
  Calendar, MessageSquare, Star, Users,
  FileText, Plus, Video, Clock,
  ChevronRight, Eye, Loader2, AlertCircle,
  Stethoscope, UserCheck, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
  phone: string | null;
  avatar: string | null;
  status: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  serviceType: string;
  reason: string | null;
  patient?: { name: string; email: string } | null;
}

const SPECIALIZATION_LABELS: Record<string, string> = {
  general_medicine: 'الطب العام',
  internal_medicine: 'الطب الباطني',
  cardiology: 'القلب والأوعية',
  neurology: 'الأعصاب',
  orthopedics: 'العظام والمفاصل',
  dermatology: 'الأمراض الجلدية',
  ophthalmology: 'العيون',
  ent: 'الأنف والأذن والحنجرة',
  pediatrics: 'طب الأطفال',
  gynecology: 'النساء والولادة',
  urology: 'المسالك البولية',
  psychiatry: 'الطب النفسي',
  surgery: 'الجراحة العامة',
  oncology: 'الأورام',
  radiology: 'الأشعة التشخيصية',
  anesthesiology: 'التخدير والعناية',
  dentistry: 'طب الأسنان',
  emergency_medicine: 'طوارئ وإسعاف',
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  COMPLETED: { label: 'مكتمل', color: '#10B981' },
  CONFIRMED: { label: 'مؤكد', color: '#3B82F6' },
  PENDING: { label: 'معلق', color: '#F59E0B' },
  CANCELLED: { label: 'ملغى', color: '#EF4444' },
};

const DAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

/* ------------------------------------------------------------------ */
/*  Real Doctor Dashboard Content                                       */
/* ------------------------------------------------------------------ */
function DoctorContent() {
  const { lang } = useLang();
  const router = useRouter();

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ today: 0, pending: 0, total: 0 });

  useEffect(() => {
    loadRealData();
  }, []);

  // ── Online Presence Heartbeat ──
  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout | null = null;
    let userId: string | null = null;

    async function setOnline() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;
      await supabase
        .from('DoctorProfile')
        .update({ isOnline: true, lastSeen: new Date().toISOString() })
        .eq('userId', user.id);
    }

    async function setOffline() {
      if (!userId) return;
      await supabase
        .from('DoctorProfile')
        .update({ isOnline: false, lastSeen: new Date().toISOString() })
        .eq('userId', userId);
    }

    setOnline();
    heartbeatInterval = setInterval(() => {
      setOnline();
    }, 60000); // Update every 60 seconds

    // Cleanup on unmount
    const handleBeforeUnload = () => { setOffline(); };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOffline();
    };
  }, []);

  async function loadRealData() {
    setLoading(true);
    try {
      // 1. Get currently logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/login');
        return;
      }

      // 2. Fetch doctor profile from User table
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id, name, email, specialization, phone, avatar, status')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        setError('تعذر تحميل بيانات المستخدم');
        setLoading(false);
        return;
      }
      setDoctor(userData);

      // 2.5 Fetch DoctorProfile to get the doctorId used in Appointments
      const { data: profileData, error: profileError } = await supabase
        .from('DoctorProfile')
        .select('id')
        .eq('userId', user.id)
        .single();
      
      const realDoctorId = profileData?.id;

      // 3. Fetch appointments for this doctor
      const { data: apptData, error: apptError } = await supabase
        .from('Appointment')
        .select('id, doctorId, patientId, date, startTime, endTime, status, serviceType, reason')
        .eq('doctorId', realDoctorId || user.id) // Fallback to user.id if profile not found
        .order('date', { ascending: false })
        .limit(50);

      if (!apptError && apptData) {
        // Fetch patient names in a separate query
        const patientIds = [...new Set(apptData.map(a => a.patientId).filter(Boolean))];
        let patientMap: Record<string, { name: string; email: string }> = {};
        
        if (patientIds.length > 0) {
          const { data: patients } = await supabase
            .from('User')
            .select('id, name, email')
            .in('id', patientIds);
          
          if (patients) {
            patients.forEach(p => { patientMap[p.id] = { name: p.name, email: p.email }; });
          }
        }

        const enriched = apptData.map(a => ({
          ...a,
          patient: patientMap[a.patientId] || null,
        }));

        setAppointments(enriched);

        // Filter today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = enriched.filter(a => a.date?.startsWith(today));
        setTodayAppointments(todayAppts);

        // Stats
        const pending = enriched.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
        setStats({ today: todayAppts.length, pending, total: enriched.length });

        // Build weekly chart data
        const weekMap: Record<string, number> = {};
        DAYS_AR.forEach(d => { weekMap[d] = 0; });
        enriched.forEach(a => {
          if (a.date) {
            const dayIndex = new Date(a.date).getDay(); // 0=Sunday
            const dayName = DAYS_AR[dayIndex] ?? 'الأحد';
            weekMap[dayName] = (weekMap[dayName] || 0) + 1;
          }
        });
        setWeeklyData(DAYS_AR.map(d => ({ day: d, count: weekMap[d] })));
      }

    } catch (err: any) {
      console.error('Error loading doctor data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#2563EB' }} />
        <p style={{ color: '#64748B', fontWeight: 600 }}>جاري تحميل بيانات لوحة التحكم...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 12, color: '#EF4444' }}>
        <AlertCircle size={40} />
        <p style={{ fontWeight: 600 }}>{error}</p>
        <button onClick={loadRealData} style={{ background: '#2563EB', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', cursor: 'pointer', fontWeight: 700 }}>إعادة المحاولة</button>
      </div>
    );
  }

  const doctorName = doctor?.name || 'الطبيب';
  const firstName = doctorName.replace('د. ', '').replace('دكتور ', '').split(' ')[0];
  const specLabel = doctor?.specialization ? (SPECIALIZATION_LABELS[doctor.specialization] || doctor.specialization) : 'طبيب';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: 20
            }}>
              {firstName[0] || 'د'}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>
                مرحباً، د. {firstName} 👨‍⚕️
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 700, background: '#EFF6FF', padding: '3px 10px', borderRadius: 20 }}>
                  <Stethoscope size={12} style={{ display: 'inline', marginLeft: 4 }} />
                  {specLabel}
                </span>
                <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600, background: '#F0FDF4', padding: '3px 8px', borderRadius: 20 }}>
                  ● متصل الآن
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#64748B', marginRight: 64 }}>
            لديك <strong style={{ color: '#0F172A' }}>{stats.today}</strong> موعد اليوم و <strong style={{ color: '#F59E0B' }}>{stats.pending}</strong> استشارة معلقة
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ActionButton variant="secondary" icon={<Calendar size={16} />}>
            إدارة المواعيد
          </ActionButton>
          <ActionButton icon={<Plus size={16} />}>
            روشتة جديدة
          </ActionButton>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <KPICard title="مواعيد اليوم" value={String(stats.today)} icon={<Calendar size={22} />} color="#2A7DE1"
          subtitle={`${todayAppointments.filter(a => a.status === 'COMPLETED').length} مكتملة`} />
        <KPICard title="طلبات معلقة" value={String(stats.pending)} icon={<MessageSquare size={22} />} color="#7C3AED" />
        <KPICard title="إجمالي الزيارات" value={String(stats.total)} icon={<Users size={22} />} color="#059669"
          subtitle="كل الوقت" />
        <KPICard title="حالة الحساب" value="نشط ✓" icon={<UserCheck size={22} />} color="#F59E0B"
          subtitle="موافق عليه" />
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        
        {/* Left: Appointments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Appointment Requests */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>طلبات الاستشارة</h3>
              {stats.pending > 0 && (
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {stats.pending} معلقة
                </span>
              )}
            </div>

            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontWeight: 600 }}>لا توجد استشارات بعد</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>ستظهر هنا طلبات المرضى عند ورودها</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {appointments.slice(0, 6).map(apt => {
                  const statusInfo = STATUS_MAP[apt.status] || { label: apt.status, color: '#94A3B8' };
                  const patientName = apt.patient?.name || 'مريض';
                  const initials = patientName.replace('د. ', '').split(' ').map((w: string) => w[0]).join('').substring(0, 2);
                  return (
                    <div key={apt.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: 14, borderRadius: 12,
                      background: apt.status === 'CONFIRMED' ? '#EFF6FF' : '#FAFBFC',
                      border: apt.status === 'CONFIRMED' ? '1px solid #BFDBFE' : '1px solid #F1F5F9',
                    }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: 'linear-gradient(135deg, #2A7DE1, #1E60B8)',
                        color: '#fff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0,
                      }}>
                        {initials || 'م'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{patientName}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: statusInfo.color, background: `${statusInfo.color}15`, padding: '2px 10px', borderRadius: 20 }}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748B', marginTop: 3 }}>
                          {apt.reason || apt.serviceType || 'استشارة طبية'}
                        </div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} />
                          {apt.startTime} — {new Date(apt.date).toLocaleDateString('ar-LY', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button title="عرض" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#EFF6FF', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Eye size={15} />
                        </button>
                        <button title="فيديو" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#F0FDF4', color: '#16A34A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Video size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weekly Activity Chart */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color="#2563EB" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>نشاط الأسبوع</h3>
            </div>
            {weeklyData.every(d => d.count === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <p>لا توجد بيانات أسبوعية بعد</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#2A7DE1" radius={[8, 8, 0, 0]} name="مواعيد" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* Right: Today's Schedule + Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Doctor Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1E3A5F, #2563EB)',
            borderRadius: 20, padding: 24, color: 'white',
            boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900 }}>
                {firstName[0] || 'د'}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>د. {doctorName}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{specLabel}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'البريد', value: doctor?.email?.split('@')[0] + '...' || '-', icon: '✉️' },
                { label: 'الهاتف', value: doctor?.phone || 'غير محدد', icon: '📞' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>جدول اليوم</h3>
              <span style={{ fontSize: 12, color: '#2A7DE1', fontWeight: 700 }}>
                {new Date().toLocaleDateString('ar-LY', { day: 'numeric', month: 'long' })}
              </span>
            </div>
            {todayAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8' }}>
                <Calendar size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p style={{ fontSize: 13 }}>لا مواعيد اليوم</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {todayAppointments.map((apt, i) => {
                  const statusInfo = STATUS_MAP[apt.status] || { label: apt.status, color: '#94A3B8' };
                  return (
                    <div key={apt.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      background: apt.status === 'CONFIRMED' ? '#EFF6FF' : '#FAFBFC',
                      border: apt.status === 'CONFIRMED' ? '1px solid #BFDBFE' : '1px solid transparent',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', minWidth: 44 }}>
                        {apt.startTime}
                      </div>
                      <div style={{ width: 3, height: 28, borderRadius: 4, background: statusInfo.color }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {apt.patient?.name || 'مريض'}
                        </div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{apt.reason || apt.serviceType}</div>
                      </div>
                      <span style={{ fontSize: 10, color: statusInfo.color, fontWeight: 700 }}>{statusInfo.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>الإجراءات السريعة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'كتابة روشتة جديدة', icon: <FileText size={16} />, color: '#2563EB', bg: '#EFF6FF', href: '/doctor/prescription' },
                { label: 'إدارة المواعيد', icon: <Calendar size={16} />, color: '#7C3AED', bg: '#F5F3FF', href: '/doctor/appointments' },
                { label: 'قائمة المرضى', icon: <Users size={16} />, color: '#059669', bg: '#F0FDF4', href: '/doctor/patients' },
              ].map(action => (
                <button key={action.label}
                  onClick={() => action.href && window.location.assign(action.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10, border: 'none',
                    background: action.bg, color: action.color,
                    cursor: 'pointer', textAlign: 'right', fontWeight: 600, fontSize: 13,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {action.icon}
                  {action.label}
                  <ChevronRight size={14} style={{ marginRight: 'auto' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Export                                                          */
/* ------------------------------------------------------------------ */
export default function DoctorDashboardPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <DoctorContent />
      </DashboardLayout>
    </LangProvider>
  );
}
