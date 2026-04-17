'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
import { Stethoscope, Plus, Edit2, Trash2, Heart, Brain, Eye, Activity, Baby } from 'lucide-react';

const specialtiesData = [
  { id: 1, nameAr: 'طب عام', nameEn: 'General Medicine', doctors: 45, icon: <Activity size={20} />, color: '#2A7DE1' },
  { id: 2, nameAr: 'طب أطفال', nameEn: 'Pediatrics', doctors: 28, icon: <Baby size={20} />, color: '#E83E8C' },
  { id: 3, nameAr: 'طب أسنان', nameEn: 'Dentistry', doctors: 32, icon: <Heart size={20} />, color: '#28A745' },
  { id: 4, nameAr: 'طب عيون', nameEn: 'Ophthalmology', doctors: 15, icon: <Eye size={20} />, color: '#FFC107' },
  { id: 5, nameAr: 'طب نفسي', nameEn: 'Psychiatry', doctors: 12, icon: <Brain size={20} />, color: '#6F42C1' },
];

function SpecialtiesContent() {
  const { lang } = useLang();

  const columns = [
    {
      key: 'name', header: lang === 'ar' ? 'التخصص' : 'Specialty',
      render: (row: typeof specialtiesData[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `${row.color}15`, color: row.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {row.icon}
          </div>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>
            {lang === 'ar' ? row.nameAr : row.nameEn}
          </div>
        </div>
      ),
    },
    { key: 'doctors', header: lang === 'ar' ? 'عدد الأطباء' : 'Doctors Count' },
    {
      key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#F1F5F9',
            color: '#475569', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Edit2 size={14} />
          </button>
          <button style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'none', background: '#FEF2F2',
            color: '#DC2626', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'التخصصات الطبية' : 'Medical Specialties'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'إدارة تصنيفات التخصصات الطبية في المنصة' : 'Manage medical specialty categories on the platform'}
          </p>
        </div>
        <ActionButton icon={<Plus size={18} />}>
          {lang === 'ar' ? 'إضافة تخصص' : 'Add Specialty'}
        </ActionButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {specialtiesData.map(spec => (
          <div key={spec.id} style={{
            background: '#fff', padding: 24, borderRadius: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #F1F5F9',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -10, right: -10,
              width: 80, height: 80, borderRadius: '50%',
              background: `${spec.color}08`,
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `${spec.color}15`, color: spec.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {spec.icon}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ border: 'none', background: 'transparent', color: '#94A3B8', cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
              {lang === 'ar' ? spec.nameAr : spec.nameEn}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 14 }}>
              <Stethoscope size={14} />
              {spec.doctors} {lang === 'ar' ? 'طبيب مسجل' : 'doctors registered'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SpecialtiesPage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <SpecialtiesContent />
      </DashboardLayout>
    </LangProvider>
  );
}
