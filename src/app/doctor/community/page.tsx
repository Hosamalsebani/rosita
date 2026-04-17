'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
import { supabase } from '@/lib/supabase';
import {
  FileText, Plus, Edit2, Trash2, Eye, Calendar, Tag, User,
  MessageCircle, Heart, Share2, Search, X, Save, Image as ImageIcon
} from 'lucide-react';

interface Post {
  id: number;
  authorName: string;
  authorRole: string;
  content: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  status: 'published' | 'draft';
}

const categories = ['توعية عامة', 'تغذية', 'صحة القلب', 'أدوية', 'صحة الأطفال', 'صحة نفسية'];

function CommunityContent() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [doctorRole, setDoctorRole] = useState('');

  // Form state
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('User')
        .select('name, specialization')
        .eq('id', user.id)
        .single();
      
      setDoctorName(profile?.name || 'دكتور روشتة');
      setDoctorRole(profile?.specialization || 'طبيب متخصص');
      fetchPosts(profile?.name || '');
    }
  };

  const fetchPosts = async (name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_posts')
        .select('*')
        .eq('authorName', name)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormContent('');
    setFormCategory(categories[0]);
    setFormImageUrl('');
    setFormStatus('published');
    setEditingPost(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFormContent(post.content);
    setFormCategory(post.category);
    setFormImageUrl(post.imageUrl);
    setFormStatus(post.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      authorName: doctorName,
      authorRole: doctorRole,
      content: formContent,
      category: formCategory,
      imageUrl: formImageUrl || null,
      status: formStatus,
    };

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('health_posts')
          .update(postData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('health_posts')
          .insert([{
            ...postData,
            likes: 0,
            comments: 0,
            shares: 0,
            createdAt: new Date().toISOString()
          }]);
        if (error) throw error;
      }
      fetchPosts(doctorName);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase.from('health_posts').delete().eq('id', id);
        if (error) throw error;
        setPosts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const filteredPosts = posts.filter(p =>
    p.content.includes(searchTerm) ||
    p.category.includes(searchTerm)
  );

  const categoryColor = (cat: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'تغذية': { bg: '#F0FDF4', color: '#16A34A' },
      'توعية عامة': { bg: '#EFF6FF', color: '#2563EB' },
      'صحة القلب': { bg: '#FEF2F2', color: '#DC2626' },
      'أدوية': { bg: '#FFF7ED', color: '#EA580C' },
      'صحة الأطفال': { bg: '#FAF5FF', color: '#9333EA' },
      'صحة نفسية': { bg: '#F0FDFA', color: '#0D9488' },
    };
    return map[cat] || { bg: '#F1F5F9', color: '#64748B' };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B' }}>
            {lang === 'ar' ? '📰 مجتمع روشتة التوعوي' : '📰 Roshita Health Community'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
            {lang === 'ar' ? 'شارك خبراتك ونصائحك الطبية مع مجتمعنا' : 'Share your medical expertise and tips with our community'}
          </p>
        </div>
        <ActionButton icon={<Plus size={18} />} onClick={openAddModal}>{lang === 'ar' ? 'إضافة نصيحة' : 'Add Tip'}</ActionButton>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      ) : (
        <DataTable
          columns={[
            {
              key: 'author', header: lang === 'ar' ? 'الناشر' : 'Author',
              render: (row: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14,
                  }}>
                    {row.authorName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{row.authorName}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{row.authorRole}</div>
                  </div>
                </div>
              ),
            },
            {
              key: 'content', header: lang === 'ar' ? 'المحتوى' : 'Content',
              render: (row: any) => (
                <div style={{ maxWidth: 350, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 13, color: '#475569' }}>
                  {row.content}
                </div>
              ),
            },
            {
              key: 'category', header: lang === 'ar' ? 'التصنيف' : 'Category',
              render: (row: any) => {
                const c = categoryColor(row.category);
                return (
                  <span style={{ padding: '4px 10px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 12, fontWeight: 600 }}>
                    {row.category}
                  </span>
                );
              },
            },
            {
              key: 'engagement', header: lang === 'ar' ? 'التفاعل' : 'Engagement',
              render: (row: any) => (
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748B' }}>
                  <span title="Likes">❤️ {row.likes}</span>
                  <span title="Comments">💬 {row.comments}</span>
                </div>
              ),
            },
            {
              key: 'actions', header: '',
              render: (row: any) => (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEditModal(row)} style={{ padding: 6, borderRadius: 8, border: 'none', background: '#EFF6FF', cursor: 'pointer' }}>
                    <Edit2 size={14} color="#2563EB" />
                  </button>
                  <button onClick={() => handleDelete(row.id)} style={{ padding: 6, borderRadius: 8, border: 'none', background: '#FEF2F2', cursor: 'pointer' }}>
                    <Trash2 size={14} color="#DC2626" />
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredPosts}
          action={
            <div style={{ position: 'relative', width: 240 }}>
              <Search size={16} style={{ position: 'absolute', top: 10, right: 12, color: '#94A3B8' }} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث في منشوراتك...' : 'Search your posts...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 36px 8px 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none' }}
              />
            </div>
          }
        />
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 32, width: 560, maxHeight: '90vh',
            overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B' }}>
                {editingPost ? (lang === 'ar' ? 'تعديل المنشور' : 'Edit Post') : (lang === 'ar' ? '✍️ إضافة منشور توعوي' : '✍️ Add Health Tip')}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                style={{ padding: 6, borderRadius: 8, border: 'none', background: '#F1F5F9', cursor: 'pointer' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                    {lang === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                    {lang === 'ar' ? 'الحالة' : 'Status'}
                  </label>
                  <select value={formStatus} onChange={e => setFormStatus(e.target.value as 'published' | 'draft')}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}>
                    <option value="published">{lang === 'ar' ? 'منشور' : 'Published'}</option>
                    <option value="draft">{lang === 'ar' ? 'مسودة' : 'Draft'}</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  {lang === 'ar' ? 'محتوى النصيحة' : 'Tip Content'}
                </label>
                <textarea required rows={6} value={formContent} onChange={e => setFormContent(e.target.value)}
                  style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                  placeholder={lang === 'ar' ? 'اكتب نصيحتك الطبية هنا لتعم الفائدة...' : 'Write your medical tip here...'} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  <ImageIcon size={14} style={{ display: 'inline', marginLeft: 4, marginRight: 4 }} />
                  {lang === 'ar' ? 'إرفاق صورة توضيحية (اختياري)' : 'Attach Illustration (Optional)'}
                </label>
                <input type="text" value={formImageUrl} onChange={e => setFormImageUrl(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}
                  placeholder={lang === 'ar' ? 'رابط الصورة...' : 'Image URL...'} />
              </div>

              <ActionButton
                icon={<Save size={16} />}
                onClick={() => {}}
                variant="primary"
              >{editingPost ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'نشر الآن' : 'Publish Now')}</ActionButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <CommunityContent />
      </DashboardLayout>
    </LangProvider>
  );
}
