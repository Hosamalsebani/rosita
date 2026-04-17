'use client';

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Users, Stethoscope, Pill, FileText,
  ShoppingCart, BarChart3, Bell, Settings, ChevronLeft,
  ChevronRight, LogOut, Calendar, MessageSquare, Star,
  DollarSign, Package, ClipboardList, Search, Menu, X,
  Globe, Moon, Sun, UserCircle, Newspaper
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Language Context                                                   */
/* ------------------------------------------------------------------ */
type Lang = 'ar' | 'en';
interface LangCtx { lang: Lang; toggle: () => void; }
const LangContext = createContext<LangCtx>({ lang: 'ar', toggle: () => {} });
export const useLang = () => useContext(LangContext);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ fontFamily: lang === 'ar' ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Public Sans', sans-serif" }}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Role type & sidebar config                                         */
/* ------------------------------------------------------------------ */
export type Role = 'admin' | 'doctor' | 'pharmacist';

interface NavItem {
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
  href: string;
}

const navConfig: Record<Role, { titleAr: string; titleEn: string; items: NavItem[] }> = {
  admin: {
    titleAr: 'لوحة تحكم الأدمن',
    titleEn: 'Admin Dashboard',
    items: [
      { labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LayoutDashboard size={20} />, href: '/admin' },
      { labelAr: 'إدارة المستخدمين', labelEn: 'Users', icon: <Users size={20} />, href: '/admin/users' },
      { labelAr: 'إدارة الأطباء', labelEn: 'Doctors', icon: <Stethoscope size={20} />, href: '/admin/doctors' },
      { labelAr: 'التخصصات', labelEn: 'Specialties', icon: <Stethoscope size={20} />, href: '/admin/specialties' },
      { labelAr: 'الاستشارات', labelEn: 'Consultations', icon: <MessageSquare size={20} />, href: '/admin/consultations' },
      { labelAr: 'الروشتات', labelEn: 'Prescriptions', icon: <FileText size={20} />, href: '/admin/prescriptions' },
      { labelAr: 'الطلبات والمدفوعات', labelEn: 'Orders & Payments', icon: <ShoppingCart size={20} />, href: '/admin/orders' },
      { labelAr: 'التقارير', labelEn: 'Reports', icon: <BarChart3 size={20} />, href: '/admin/reports' },
      { labelAr: 'المجلة الصحية', labelEn: 'Health Magazine', icon: <Newspaper size={20} />, href: '/admin/magazine' },
      { labelAr: 'الإشعارات', labelEn: 'Notifications', icon: <Bell size={20} />, href: '/admin/notifications' },
      { labelAr: 'الإعدادات', labelEn: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
    ],
  },
  doctor: {
    titleAr: 'لوحة تحكم الطبيب',
    titleEn: 'Doctor Dashboard',
    items: [
      { labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LayoutDashboard size={20} />, href: '/doctor' },
      { labelAr: 'الاستشارات', labelEn: 'Consultations', icon: <MessageSquare size={20} />, href: '/doctor/consultations' },
      { labelAr: 'المواعيد', labelEn: 'Appointments', icon: <Calendar size={20} />, href: '/doctor/appointments' },
      { labelAr: 'الروشتات الإلكترونية', labelEn: 'E-Prescriptions', icon: <FileText size={20} />, href: '/doctor/prescriptions' },
      { labelAr: 'سجلات المرضى', labelEn: 'Patient Records', icon: <ClipboardList size={20} />, href: '/doctor/patients' },
      { labelAr: 'التقييمات', labelEn: 'Reviews', icon: <Star size={20} />, href: '/doctor/reviews' },
      { labelAr: 'الأرباح', labelEn: 'Earnings', icon: <DollarSign size={20} />, href: '/doctor/earnings' },
      { labelAr: 'المجتمع', labelEn: 'Community', icon: <Newspaper size={20} />, href: '/doctor/community' },
      { labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: <UserCircle size={20} />, href: '/doctor/profile' },
    ],
  },
  pharmacist: {
    titleAr: 'لوحة تحكم الصيدلي',
    titleEn: 'Pharmacist Dashboard',
    items: [
      { labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LayoutDashboard size={20} />, href: '/pharmacist' },
      { labelAr: 'الروشتات', labelEn: 'Prescriptions', icon: <FileText size={20} />, href: '/pharmacist/prescriptions' },
      { labelAr: 'الطلبات', labelEn: 'Orders', icon: <ShoppingCart size={20} />, href: '/pharmacist/orders' },
      { labelAr: 'المخزون', labelEn: 'Inventory', icon: <Package size={20} />, href: '/pharmacist/inventory' },
      { labelAr: 'المبيعات والتقارير', labelEn: 'Sales & Reports', icon: <BarChart3 size={20} />, href: '/pharmacist/sales' },
      { labelAr: 'ملف الصيدلية', labelEn: 'Pharmacy Profile', icon: <Settings size={20} />, href: '/pharmacist/profile' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Sidebar Component                                                  */
/* ------------------------------------------------------------------ */
function Sidebar({ role, collapsed, onToggle }: { role: Role; collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { lang } = useLang();
  const config = navConfig[role];

  const roleColors: Record<Role, string> = {
    admin: '#2A7DE1',
    doctor: '#0096FF',
    pharmacist: '#28A745',
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 80 : 280,
        background: 'linear-gradient(180deg, #0A1628 0%, #0F2240 50%, #0A1628 100%)',
        color: '#fff',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 100,
        ...(lang === 'ar' ? { right: 0 } : { left: 0 }),
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 12px' : '24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: 80,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', padding: 2, flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <img src="/logo.png" alt="R" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Cairo', sans-serif" }}>روشتة</div>
            <div style={{ fontSize: 11, opacity: 0.7, fontFamily: "'Cairo', sans-serif" }}>
              {lang === 'ar' ? config.titleAr : config.titleEn}
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {config.items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px 16px' : '12px 16px',
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? `linear-gradient(135deg, ${roleColors[role]}33, ${roleColors[role]}1a)` : 'transparent',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  width: 3, height: 24, borderRadius: 4,
                  background: roleColors[role],
                  ...(lang === 'ar' ? { right: 0 } : { left: 0 }),
                }} />
              )}
              <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
              {!collapsed && <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          margin: '12px',
          padding: '10px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
          transition: 'all 0.2s',
        }}
      >
        {lang === 'ar'
          ? (collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)
          : (collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)}
        {!collapsed && (lang === 'ar' ? 'طي القائمة' : 'Collapse')}
      </button>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Top Bar                                                            */
/* ------------------------------------------------------------------ */
function TopBar({ role }: { role: Role }) {
  const { lang, toggle } = useLang();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header style={{
      height: 72,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#F5F7FA',
        borderRadius: 12,
        padding: '10px 16px',
        width: 360,
        maxWidth: '50%',
      }}>
        <Search size={18} color="#94A3B8" />
        <input
          placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 14,
            color: '#1E293B',
            width: '100%',
            direction: lang === 'ar' ? 'rtl' : 'ltr',
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={toggle}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: '#475569',
          }}
        >
          <Globe size={16} />
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>

        <button 
          onClick={handleLogout}
          title={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: '1px solid #FEE2E2', background: '#fff',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#EF4444'
          }}
        >
          <LogOut size={18} />
        </button>

        {/* Avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px 6px 6px',
          borderRadius: 12,
          background: '#F8FAFC',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2A7DE1, #1E60B8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 600, fontSize: 14,
          }}>
            {role === 'admin' ? 'أ' : role === 'doctor' ? 'د' : 'ص'}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
              {user?.email?.split('@')[0] || (role === 'admin' ? 'المشرف' : 'الطبيب')}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>
              {lang === 'ar' ? 'متصل الآن' : 'Connected'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Layout (Exported)                                        */
/* ------------------------------------------------------------------ */
export default function DashboardLayout({ children, role }: { children: ReactNode; role: Role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { lang } = useLang();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // 24-hour session enforcement (optional, as Supabase JWT does it, but to match user request)
      const lastSignIn = new Date(session.user.last_sign_in_at || 0).getTime();
      const now = new Date().getTime();
      if (now - lastSignIn > 24 * 60 * 60 * 1000) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      setCheckingAuth(false);
    };

    checkUser();
  }, [router]);

  if (checkingAuth) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', background: '#0A1628', color: '#fff' 
      }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #2A7DE1', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#F5F7FA',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Cairo', sans-serif"
    }}>
      {/* Background Watermark Logos (Clinical Sanctuary Branding) */}
      <img 
        src="/logo.png" 
        alt="" 
        style={{
          position: 'fixed',
          bottom: '-150px',
          left: lang === 'ar' ? '-150px' : 'auto',
          right: lang === 'en' ? '-150px' : 'auto',
          width: '700px',
          height: '700px',
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'grayscale(100%) contrast(1.2)'
        }}
      />
      
      {/* Large Center/Side Symbol */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '40vw',
        fontWeight: 900,
        color: 'rgba(42, 125, 225, 0.015)',
        pointerEvents: 'none',
        zIndex: 0,
        fontFamily: "'Inter', sans-serif"
      }}>
        R
      </div>

      <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <div style={{
        flex: 1,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        zIndex: 1, 
        ...(lang === 'ar'
          ? { marginRight: collapsed ? 80 : 280 }
          : { marginLeft: collapsed ? 80 : 280 }),
      }}>
        <TopBar role={role} />
        <main style={{ padding: 32 }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
