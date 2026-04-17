'use client';

import DashboardLayout, { LangProvider, useLang } from '@/components/layout/DashboardLayout';
import { Star, MessageSquare, User, Clock, ThumbsUp } from 'lucide-react';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function ReviewsContent() {
  const { lang } = useLang();
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('DoctorProfile')
        .select('id, rating, reviewCount')
        .eq('userId', user.id)
        .single();
      
      if (!profile) return;
      setAvgRating(profile.rating || 0);

      const { data, error } = await supabase
        .from('DoctorReviews')
        .select('id, rating, comment, createdAt, patientId, User:patientId(name)')
        .eq('doctorId', profile.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((r: any) => ({
        id: r.id,
        patient: r.User?.name || 'مريض',
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toISOString().split('T')[0]
      }));

      setReviews(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {lang === 'ar' ? 'تقييمات المرضى' : 'Patient Reviews'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            {lang === 'ar' ? 'ما يقوله مرضاك عن خدماتك الطبية' : 'What your patients are saying about your medical services'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '8px 16px', borderRadius: 12, border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontWeight: 700 }}>
            <Star size={18} fill="#F59E0B" /> {avgRating.toFixed(1)}
          </div>
          <div style={{ width: 1, height: 20, background: '#E2E8F0' }} />
          <div style={{ fontSize: 13, color: '#64748B' }}>{reviews.length} {lang === 'ar' ? 'تقييماً' : 'reviews'}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>لا توجد تقييمات بعد.</div>
          ) : (
            reviews.map(review => (
              <div key={review.id} style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} color="#64748B" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{review.patient}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? '#F59E0B' : '#E2E8F0'} stroke={i < review.rating ? '#F59E0B' : '#E2E8F0'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {review.date}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>
                  {review.comment}
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ border: 'none', background: '#F8FAFC', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <ThumbsUp size={14} /> {lang === 'ar' ? 'مفيد' : 'Helpful'}
                  </button>
                  <button style={{ border: 'none', background: 'transparent', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>
                    {lang === 'ar' ? 'الرد على التقييم' : 'Reply to review'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <LangProvider>
      <DashboardLayout role="doctor">
        <ReviewsContent />
      </DashboardLayout>
    </LangProvider>
  );
}
