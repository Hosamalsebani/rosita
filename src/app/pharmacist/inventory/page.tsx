'use client';

import React, { useState, useRef } from 'react';
import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
import { 
  Package, AlertTriangle, Plus, Search, Edit2, ShoppingCart, 
  TrendingDown, X, Save, Check, Pill, Info, Calendar, DollarSign, 
  Camera, Image as ImageIcon, Trash2, FileText, AlertCircle
} from 'lucide-react';

const initialInventoryData = [
  { id: 1, nameAr: 'أوجمنتين 1 جم', nameEn: 'Augmentin 1g', categoryAr: 'مضاد حيوي', categoryEn: 'Antibiotic', stock: 45, price: '32.50 DL', status: 'in_stock', image: null as string | null, expiry: '2026-12-01', requiresPrescription: true },
  { id: 2, nameAr: 'بندول 500 مجم', nameEn: 'Panadol 500mg', categoryAr: 'مسكن', categoryEn: 'Painkiller', stock: 120, price: '5.00 DL', status: 'in_stock', image: null as string | null, expiry: '2027-05-15', requiresPrescription: false },
  { id: 3, nameAr: 'كونكور 5 مجم', nameEn: 'Concor 5mg', categoryAr: 'ضغط الدم', categoryEn: 'Blood Pressure', stock: 8, price: '18.00 DL', status: 'low_stock', image: null as string | null, expiry: '2026-02-10', requiresPrescription: true },
  { id: 4, nameAr: 'فينتولين بخاخ', nameEn: 'Ventolin Inhaler', categoryAr: 'تنفسي', categoryEn: 'Respiratory', stock: 0, price: '14.50 DL', status: 'out_of_stock', image: null as string | null, expiry: '2025-08-20', requiresPrescription: true },
];

function InventoryContent() {
  const { lang } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [inventory, setInventory] = useState(initialInventoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newMed, setNewMed] = useState({
    nameAr: '',
    nameEn: '',
    categoryAr: 'مضاد حيوي',
    categoryEn: 'Antibiotic',
    stock: '',
    price: '',
    expiry: '',
    dosageForm: 'Tablet',
    image: null as string | null,
    requiresPrescription: false
  });

  // Filtered Data
  const filteredData = inventory.filter(item => 
    item.nameAr.includes(searchQuery) || 
    item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.categoryAr.includes(searchQuery) ||
    item.categoryEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMed({...newMed, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedicine = () => {
    if (!newMed.nameAr || !newMed.nameEn || !newMed.stock || !newMed.price) return;
    
    setIsSaving(true);
    setTimeout(() => {
      const stockVal = parseInt(newMed.stock);
      const medicineData = {
        nameAr: newMed.nameAr,
        nameEn: newMed.nameEn,
        categoryAr: newMed.categoryAr,
        categoryEn: newMed.categoryEn,
        stock: stockVal,
        price: `${newMed.price} DL`,
        status: stockVal === 0 ? 'out_of_stock' : stockVal < 10 ? 'low_stock' : 'in_stock',
        image: newMed.image,
        expiry: newMed.expiry,
        requiresPrescription: newMed.requiresPrescription
      };

      if (isEditMode && editingId) {
        setInventory(prev => prev.map(item => item.id === editingId ? { ...item, ...medicineData } : item));
      } else {
        setInventory(prev => [{ id: Date.now(), ...medicineData }, ...prev]);
      }
      
      setIsSaving(false);
      setIsModalOpen(false);
      setIsEditMode(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset
      setNewMed({
        nameAr: '', nameEn: '', categoryAr: 'مضاد حيوي', categoryEn: 'Antibiotic',
        stock: '', price: '', expiry: '', dosageForm: 'Tablet', image: null, requiresPrescription: false
      });
    }, 800);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setIsEditMode(true);
    setNewMed({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      categoryAr: item.categoryAr,
      categoryEn: item.categoryEn,
      stock: item.stock.toString(),
      price: item.price.replace(' DL', ''),
      expiry: item.expiry || '',
      dosageForm: item.dosageForm || 'Tablet',
      image: item.image,
      requiresPrescription: item.requiresPrescription || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من مسح هذا الدواء؟' : 'Are you sure you want to delete this medicine?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const categories = [
    { ar: 'مضاد حيوي', en: 'Antibiotic' },
    { ar: 'مسكن', en: 'Painkiller' },
    { ar: 'ضغط الدم', en: 'Blood Pressure' },
    { ar: 'تنفسي', en: 'Respiratory' },
    { ar: 'سكري', en: 'Diabetes' },
    { ar: 'مكملات غذائية', en: 'Supplements' },
  ];

  const columns = [
    {
      key: 'name', header: lang === 'ar' ? 'الدواء' : 'Medicine',
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 46, height: 46, borderRadius: 12, background: '#F8FAFC', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#94A3B8', overflow: 'hidden', border: '1px solid #F1F5F9'
          }}>
            {row.image ? <img src={row.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Pill size={20} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontWeight: 600, color: '#1E293B' }}>{lang === 'ar' ? row.nameAr : row.nameEn}</div>
              {row.requiresPrescription && (
                <div title={lang === 'ar' ? 'يصرف بوصفة طبية' : 'Prescription Required'} style={{ background: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Rx</div>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{lang === 'ar' ? row.categoryAr : row.categoryEn}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'expiry', header: lang === 'ar' ? 'الصلاحية' : 'Expiry',
      render: (row: any) => (
        <div style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
          {row.expiry || '-'}
        </div>
      )
    },
    { 
      key: 'stock', header: lang === 'ar' ? 'الكمية' : 'Stock',
      render: (row: any) => (
        <div style={{ fontWeight: 700, color: row.status === 'out_of_stock' ? '#DC2626' : row.status === 'low_stock' ? '#F59E0B' : '#1E293B' }}>
          {row.stock}
        </div>
      )
    },
    { key: 'price', header: lang === 'ar' ? 'السعر' : 'Price' },
    {
        key: 'actions', header: lang === 'ar' ? 'الإجراءات' : 'Actions',
        render: (row: any) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => openEditModal(row)} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#F0F9FF', color: '#0284C7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><Edit2 size={16} /></button>
            <button onClick={() => handleDelete(row.id)} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><Trash2 size={16} /></button>
          </div>
        )
      }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      {/* Toast */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000, background: '#059669', color: '#fff', padding: '12px 24px', borderRadius: 14, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10, animation: 'slideIn 0.3s ease-out' }}>
          <Check size={20} /> {lang === 'ar' ? 'تمت العملية بنجاح' : 'Operation successful'}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>{lang === 'ar' ? 'مخزن الأدوية' : 'Medicine Inventory'}</h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>{lang === 'ar' ? 'إدارة المخزون، الصلاحية، ومتطلبات الوصفات الطبية' : 'Manage inventory, expiry, and prescription requirements'}</p>
        </div>
        <ActionButton icon={<Plus size={18} />} onClick={() => { setIsEditMode(false); setIsModalOpen(true); }}>
          {lang === 'ar' ? 'إضافة دواء جديد' : 'Add New Medicine'}
        </ActionButton>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 14, padding: '10px 18px', width: 340, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Search size={18} color="#94A3B8" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={lang === 'ar' ? 'بحث باسم الدواء...' : 'Search medicine name...'} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: '100%', color: '#1E293B' }} />
          </div>
        }
      />

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s' }}>
          <div style={{ background: '#fff', width: 660, borderRadius: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>{isEditMode ? (lang === 'ar' ? 'تعديل بيانات الدواء' : 'Edit Medicine') : (lang === 'ar' ? 'إضافة دواء جديد' : 'Add New Medicine')}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            </div>

            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxHeight: '72vh', overflowY: 'auto' }}>
               {/* Image */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <div onClick={() => fileInputRef.current?.click()} style={{ width: 140, height: 140, borderRadius: 20, border: '2px dashed #E2E8F0', background: newMed.image ? `url(${newMed.image}) center/cover` : '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                  {!newMed.image && <Camera size={32} color="#94A3B8" />}
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
              </div>

               {/* Fields */}
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Ar)'}</label>
                  <input value={newMed.nameAr} onChange={(e) => setNewMed({...newMed, nameAr: e.target.value})} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (En)'}</label>
                  <input value={newMed.nameEn} onChange={(e) => setNewMed({...newMed, nameEn: e.target.value})} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{lang === 'ar' ? 'الكمية' : 'Stock'}</label>
                  <input type="number" value={newMed.stock} onChange={(e) => setNewMed({...newMed, stock: e.target.value})} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{lang === 'ar' ? 'السعر' : 'Price'}</label>
                  <input type="number" value={newMed.price} onChange={(e) => setNewMed({...newMed, price: e.target.value})} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{lang === 'ar' ? 'الصلاحية' : 'Expiry'}</label>
                  <input type="date" value={newMed.expiry} onChange={(e) => setNewMed({...newMed, expiry: e.target.value})} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 16, border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{lang === 'ar' ? 'متطلب وصفة طبية' : 'Prescription Required'}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{lang === 'ar' ? 'حدد إذا كان الدواء لا يصرف إلا بملفات طبية' : 'Tag if medicine needs doctor approval'}</div>
                  </div>
                </div>
                <button onClick={() => setNewMed({...newMed, requiresPrescription: !newMed.requiresPrescription})} style={{ width: 44, height: 24, borderRadius: 12, background: newMed.requiresPrescription ? '#2563EB' : '#CBD5E1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                  <div style={{ position: 'absolute', top: 3, left: newMed.requiresPrescription ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'all 0.2s' }} />
                </button>
              </div>
            </div>

            <div style={{ padding: '24px 32px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={handleSaveMedicine} disabled={isSaving} style={{ padding: '12px 32px', borderRadius: 12, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                {isSaving ? '...' : <><Save size={18} /> {lang === 'ar' ? 'حفظ البيانات' : 'Save Details'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <LangProvider>
      <DashboardLayout role="pharmacist">
        <InventoryContent />
      </DashboardLayout>
    </LangProvider>
  );
}
