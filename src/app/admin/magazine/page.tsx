'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { DataTable, ActionButton } from '@/components/ui/DashboardWidgets';
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

const initialPosts: Post[] = [
  {
    id: 1,
    authorName: 'د. فاطمة الزهراء',
    authorRole: 'أخصائية تغذية',
    content: '🥗 نصيحة اليوم: شرب كوبين من الماء قبل وجبة الإفطار يساعد على تنشيط الجهاز الهضمي وتحسين عملية الأيض بنسبة تصل إلى 30%. حافظوا على صحتكم!',
    category: 'تغذية',
    imageUrl: '',
    likes: 142,
    comments: 23,
    shares: 15,
    createdAt: '2026-04-12',
    status: 'published',
  },
  {
    id: 2,
    authorName: 'منظمة روشيتا الصحية',
    authorRole: 'حساب رسمي',
    content: '⚠️ تنبيه صحي هام: مع ارتفاع درجات الحرارة، نذكركم بأهمية شرب 3 لترات ماء يومياً على الأقل وتجنب التعرض المباشر للشمس بين 11 صباحاً و4 مساءً',
    category: 'توعية عامة',
    imageUrl: '',
    likes: 387,
    comments: 45,
    shares: 120,
    createdAt: '2026-04-12',
    status: 'published',
  },
  {
    id: 3,
    authorName: 'د. خالد الورفلي',
    authorRole: 'أخصائي أمراض القلب',
    content: '🫀 هل تعلم؟ المشي 30 دقيقة يومياً يقلل خطر الإصابة بأمراض القلب بنسبة 35%. لا تحتاج إلى صالة رياضية، فقط ابدأ بالمشي!',
    category: 'صحة القلب',
    imageUrl: '',
    likes: 256,
    comments: 34,
    shares: 67,
    createdAt: '2026-04-11',
    status: 'published',
  },
  {
    id: 4,
    authorName: 'صيدلية روشيتا المركزية',
    authorRole: 'صيدلية معتمدة',
    content: '💊 معلومة دوائية: لا تتناول المضاد الحيوي بدون وصفة طبيب! الاستخدام العشوائي للمضادات الحيوية يسبب مقاومة البكتيريا',
    category: 'أدوية',
    imageUrl: '',
    likes: 198,
    comments: 12,
    shares: 89,
    createdAt: '2026-04-11',
    status: 'published',
  },
  {
    id: 5,
    authorName: 'د. مريم بن علي',
    authorRole: 'طبيبة أطفال',
    content: '👶 نصائح للأمهات: قدمي لطفلك الفواكه والخضروات بألوان مختلفة، تأكدي من حصوله على التطعيمات في مواعيدها، النوم المبكر ضروري لنمو الطفل',
    category: 'صحة الأطفال',
    imageUrl: '',
    likes: 312,
    comments: 56,
    shares: 145,
    createdAt: '2026-04-10',
    status: 'published',
  },
];

const categories = ['توعية عامة', 'تغذية', 'صحة القلب', 'أدوية', 'صحة الأطفال', 'صحة نفسية'];

function MagazineContent() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form state
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  const resetForm = () => {
    setFormAuthorName('');
    setFormAuthorRole('');
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
    setFormAuthorName(post.authorName);
    setFormAuthorRole(post.authorRole);
    setFormContent(post.content);
    setFormCategory(post.category);
    setFormImageUrl(post.imageUrl);
    setFormStatus(post.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      authorName: formAuthorName,
      authorRole: formAuthorRole,
      content: formContent,
      category: formCategory,
      imageUrl: formImageUrl,
      status: formStatus,
    };

    if (editingPost) {
      // For mock purposes, we just update local state if it's an edit
      // A real app would call PUT /api/posts/[id]
      setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...postData } : p));
    } else {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
        const newPost = await res.json();
        setPosts(prev => [newPost, ...prev]);
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const filteredPosts = posts.filter(p =>
    p.content.includes(searchTerm) ||
    p.authorName.includes(searchTerm) ||
    p.category.includes(searchTerm)
  );

  const totalLikes = posts.reduce((a, p) => a + p.likes, 0);
  const totalComments = posts.reduce((a, p) => a + p.comments, 0);
  const totalShares = posts.reduce((a, p) => a + p.shares, 0);

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
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B' }}>
            {lang === 'ar' ? '📰 إدارة المجلة الصحية' : '📰 Health Magazine Management'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
            {lang === 'ar' ? 'إضافة وإدارة المناشير التوعوية الصحية' : 'Add and manage health awareness posts'}
          </p>
        </div>
        <ActionButton icon={<Plus size={18} />} onClick={openAddModal}>{lang === 'ar' ? 'إضافة منشور' : 'Add Post'}</ActionButton>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: lang === 'ar' ? 'إجمالي المنشورات' : 'Total Posts', value: posts.length, icon: <FileText size={20} />, color: '#2563EB', bg: '#EFF6FF' },
          { label: lang === 'ar' ? 'إجمالي الإعجابات' : 'Total Likes', value: totalLikes, icon: <Heart size={20} />, color: '#DC2626', bg: '#FEF2F2' },
          { label: lang === 'ar' ? 'إجمالي التعليقات' : 'Total Comments', value: totalComments, icon: <MessageCircle size={20} />, color: '#16A34A', bg: '#F0FDF4' },
          { label: lang === 'ar' ? 'إجمالي المشاركات' : 'Total Shares', value: totalShares, icon: <Share2 size={20} />, color: '#9333EA', bg: '#FAF5FF' },
        ].map((kpi, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ padding: 8, borderRadius: 10, background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
              <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1E293B' }}>{kpi.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', top: 12, right: lang === 'ar' ? 12 : undefined, left: lang === 'ar' ? undefined : 12, color: '#94A3B8' }} />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'البحث في المنشورات...' : 'Search posts...'}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 40px', borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}
        />
      </div>

      {/* Posts Table */}
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
                  {row.authorName.charAt(row.authorName.indexOf(' ') > 0 ? row.authorName.indexOf(' ') + 1 : 0)}
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
              <div style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 13, color: '#475569' }}>
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
                <span title="Shares">🔄 {row.shares}</span>
              </div>
            ),
          },
          {
            key: 'status', header: lang === 'ar' ? 'الحالة' : 'Status',
            render: (row: any) => (
              <span style={{
                padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: row.status === 'published' ? '#F0FDF4' : '#FFF7ED',
                color: row.status === 'published' ? '#16A34A' : '#EA580C',
              }}>
                {row.status === 'published' ? (lang === 'ar' ? 'منشور' : 'Published') : (lang === 'ar' ? 'مسودة' : 'Draft')}
              </span>
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
      />

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
                {editingPost ? (lang === 'ar' ? 'تعديل المنشور' : 'Edit Post') : (lang === 'ar' ? '✍️ إضافة منشور جديد' : '✍️ Add New Post')}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                style={{ padding: 6, borderRadius: 8, border: 'none', background: '#F1F5F9', cursor: 'pointer' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Author Name */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                    <User size={14} style={{ display: 'inline', marginLeft: 4, marginRight: 4 }} />
                    {lang === 'ar' ? 'اسم الناشر' : 'Author Name'}
                  </label>
                  <input required value={formAuthorName} onChange={e => setFormAuthorName(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}
                    placeholder={lang === 'ar' ? 'مثال: د. أحمد محمد' : 'e.g. Dr. Ahmed'} />
                </div>
                {/* Author Role */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                    <Tag size={14} style={{ display: 'inline', marginLeft: 4, marginRight: 4 }} />
                    {lang === 'ar' ? 'صفة الناشر' : 'Author Role'}
                  </label>
                  <input required value={formAuthorRole} onChange={e => setFormAuthorRole(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}
                    placeholder={lang === 'ar' ? 'مثال: أخصائي أمراض القلب' : 'e.g. Cardiologist'} />
                </div>
              </div>

              {/* Category & Status */}
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

              {/* Content */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  {lang === 'ar' ? 'محتوى المنشور' : 'Post Content'}
                </label>
                <textarea required rows={6} value={formContent} onChange={e => setFormContent(e.target.value)}
                  style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                  placeholder={lang === 'ar' ? 'اكتب المحتوى التوعوي هنا...' : 'Write the awareness content here...'} />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  <ImageIcon size={14} style={{ display: 'inline', marginLeft: 4, marginRight: 4 }} />
                  {lang === 'ar' ? 'إرفاق صورة أو فيديو للمنشور' : 'Attach Image/Video'}
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="file" accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14 }}
                  />
                  {formImageUrl && (
                    <button type="button" onClick={() => setFormImageUrl('')} style={{ padding: '0 15px', borderRadius: 10, background: '#FEF2F2', color: '#DC2626', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {formImageUrl && (
                  <div style={{ marginTop: 10 }}>
                    <img src={formImageUrl.startsWith('http') ? formImageUrl : formImageUrl} alt="Preview" style={{ maxHeight: 150, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  </div>
                )}
              </div>

              {/* Preview */}
              {formContent && (
                <div style={{ marginBottom: 20, padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px dashed #CBD5E1' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
                    {lang === 'ar' ? '👁️ معاينة' : '👁️ Preview'}
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12,
                    }}>
                      {formAuthorName ? formAuthorName.charAt(0) : '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{formAuthorName || '...'}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{formAuthorRole || '...'}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{formContent}</p>
                </div>
              )}

              {/* Submit */}
              <ActionButton
                icon={<Save size={16} />}
                onClick={() => {}}
                variant="primary"
              >{editingPost ? (lang === 'ar' ? 'تحديث المنشور' : 'Update Post') : (lang === 'ar' ? 'نشر المنشور' : 'Publish Post')}</ActionButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MagazinePage() {
  return (
    <LangProvider>
      <DashboardLayout role="admin">
        <MagazineContent />
      </DashboardLayout>
    </LangProvider>
  );
}
