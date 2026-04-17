'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HeartPulse, 
  Activity, 
  Video, 
  FileText, 
  Pill, 
  CalendarCheck, 
  ShieldCheck, 
  Users, 
  ArrowLeft,
  Stethoscope,
  Lock,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const services = [
    {
      icon: <Video size={32} />,
      title: 'استشارات عن بُعد',
      desc: 'تواصل مع نخبة من الأطباء عبر مكالمات فيديو وصوتية آمنة وبجودة عالية.',
      color: '#3b82f6'
    },
    {
      icon: <FileText size={32} />,
      title: 'روشتات إلكترونية ذكية',
      desc: 'وصفات طبية دقيقة تُرسل مباشرة إلى أقرب صيدلية لصرفها بكل سهولة واستلامها بالمنزل.',
      color: '#10b981'
    },
    {
      icon: <CalendarCheck size={32} />,
      title: 'حجز المواعيد',
      desc: 'استعرض جداول الأطباء المتوفرين واحجز موعدك في العيادة بموثوقية وتأكيد فوري.',
      color: '#8b5cf6'
    },
    {
      icon: <Users size={32} />,
      title: 'سجل طبي موحد',
      desc: 'احتفظ بتاريخك المرضي والتحاليل والوصفات في مكان واحد آمن ومشفر برقمك القومي.',
      color: '#f59e0b'
    }
  ];

  return (
    <div dir="rtl" className="landing-wrapper">
      
      {/* ─── Hero Section ─── */}
      <header className="hero-section">
        
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="logo-container">
            <div className="logo-box">
              <img src="/logo.png" alt="Roshita" />
            </div>
            <span className="brand-name">روشتة</span>
          </div>
          <div className="nav-links">
            <a href="#services">خدماتنا</a>
            <a href="#about">من نحن</a>
            <a href="#contact">الأسئلة الشائعة</a>
          </div>
          <button className="cta-button">حمل التطبيق الآن</button>
        </nav>

        {/* Hero Content */}
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <div className="badge">
              <Activity size={16} /> المنصة الطبية الرائدة في الرعاية الذكية
            </div>
            <h1>مستقبل الرعاية الصحية <span>أصبح بين يديك</span></h1>
            <p>
              ارتقاء غير مسبوق في إدارة صحتك. تطبيق "روشتة" يربطك بأفضل الأطباء والصيدليات في شبكة واحدة متكاملة، لضمان حصولك أنت وعائلتك على رعاية فورية بمعايير عالمية.
            </p>
            <div className="hero-actions">
              <button className="primary-btn">
                ابدأ رحلتك الصحية <ArrowLeft size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="visual-card">
              <img src="/clinical-sanctuary-bg.png" alt="Clinical Sanctuary" className="hero-img" />
              <div className="floating-card stat-card">
                <HeartPulse size={24} color="#ef4444" />
                <div>
                  <strong>+2,500</strong>
                  <span>طبيب معتمد</span>
                </div>
              </div>
              <div className="floating-card review-card">
                <ShieldCheck size={24} color="#10b981" />
                <div>
                  <strong>أمان وخصوصية</strong>
                  <span>بيانات مشفرة 100%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="scroll-indicator">
          <ChevronDown size={24} />
        </div>
      </header>

      {/* ─── Services Section ─── */}
      <section id="services" className="services-section">
        <div className="section-title">
          <h2>كل ماتحتاجه لراحتك الطبية</h2>
          <p>خدمات متكاملة صُممت خصيصاً لتسهيل العملية العلاجية والدوائية لك ولمن تحب.</p>
        </div>

        <div className="services-grid">
          {services.map((srv, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={idx} 
              className="service-card"
            >
              <div className="service-icon" style={{ backgroundColor: `${srv.color}15`, color: srv.color }}>
                {srv.icon}
              </div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>جاهز للانضمام إلى الثورة الصحية؟</h2>
          <p>سجل الآن وانضم إلى آلاف المستخدمين الذين يثقون في منصة روشتة يومياً.</p>
          <button className="cta-download">اكتشف التطبيق</button>
        </div>
      </section>

      {/* ─── Footer with Minimal Control Panel Logins ─── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="brand-info">
            <div className="logo-container" style={{ marginBottom: '16px' }}>
               <div className="logo-box" style={{ width: 40, height: 40, borderRadius: 10 }}>
                 <img src="/logo.png" alt="Roshita" />
               </div>
               <span className="brand-name" style={{ fontSize: 20 }}>روشتة</span>
            </div>
            <p>نحن نؤمن بأن الرعاية الصحية حق للجميع، ونسعى لتقديمها بأفضل صورة عبر تقنيات الذكاء الاصطناعي السحابية المستدامة.</p>
          </div>
          
          {/* Subtle Control Panels Links */}
          <div className="portals-mini">
            <h4>بوابات الدخول للمزودين</h4>
            <div className="portal-links">
              <Link href="/admin" className="portal-link">
                <Lock size={14} /> بوابة المشرف
              </Link>
              <Link href="/doctor" className="portal-link">
                <Stethoscope size={14} /> بوابة الطبيب
              </Link>
              <Link href="/pharmacist" className="portal-link">
                <Pill size={14} /> بوابة الصيدلي
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} مؤسسة روشتة للرعاية الطبية الذكية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      <style jsx global>{`
        body { 
          margin: 0; 
          padding: 0; 
          background: #fafafa;
          font-family: 'Cairo', sans-serif;
          overflow-x: hidden;
        }

        .landing-wrapper {
          width: 100%;
        }

        /* ── Hero ── */
        .hero-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #0A1628 0%, #0c1c36 50%, #0A1628 100%);
          position: relative;
          color: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Nav */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 60px;
          z-index: 10;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-box {
          width: 48px; height: 48px;
          background: #fff;
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 4px 12px rgba(42,125,225,0.3);
        }

        .logo-box img {
          width: 100%; height: 100%; object-fit: contain;
        }

        .brand-name {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-links a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #fff;
        }

        .cta-button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 10px 24px;
          border-radius: 30px;
          font-family: 'Cairo', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-button:hover {
          background: #fff;
          color: #0A1628;
        }

        /* Hero Content */
        .hero-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 60px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 60px;
          z-index: 1;
        }

        .hero-text {
          flex: 1.1;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .hero-text h1 {
          font-size: 56px;
          font-weight: 900;
          line-height: 1.3;
          margin: 0 0 24px 0;
        }

        .hero-text h1 span {
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text p {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          margin: 0 0 40px 0;
          max-width: 500px;
        }

        .primary-btn {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 16px 36px;
          border-radius: 16px;
          font-family: 'Cairo', sans-serif;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          background: #1d4ed8;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
        }

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .visual-card {
          position: relative;
          width: 100%;
          max-width: 500px;
          aspect-ratio: 4/5;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .floating-card {
          position: absolute;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 16px 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: #0f172a;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.5);
          animation: float 6s ease-in-out infinite;
        }

        .stat-card {
          top: 40px; right: -30px;
        }

        .review-card {
          bottom: 60px; left: -30px;
          animation-delay: 2s;
        }

        .floating-card strong {
          display: block;
          font-size: 18px;
          font-weight: 800;
        }

        .floating-card span {
          display: block;
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s infinite;
          color: rgba(255,255,255,0.5);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }

        /* ── Services ── */
        .services-section {
          padding: 100px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title h2 {
          font-size: 36px;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 16px 0;
        }

        .section-title p {
          font-size: 18px;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .service-card {
          background: #fff;
          padding: 32px 24px;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }

        .service-icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          display: flex; alignItems: center; justify-content: center;
          margin-bottom: 24px;
        }

        .service-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .service-card p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* ── CTA Banner ── */
        .cta-banner {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          padding: 80px 40px;
          text-align: center;
          color: #fff;
        }

        .cta-content h2 {
          font-size: 36px; font-weight: 900; margin: 0 0 16px 0;
        }

        .cta-content p {
          font-size: 18px; color: rgba(255,255,255,0.8); margin: 0 auto 32px; max-width: 500px;
        }

        .cta-download {
          background: #fff;
          color: #1d4ed8;
          border: none;
          padding: 16px 40px;
          border-radius: 30px;
          font-size: 18px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .cta-download:hover { transform: scale(1.05); }

        /* ── Footer ── */
        .footer {
          background: #0f172a;
          color: #fff;
          padding: 60px 60px 30px;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 40px;
          margin-bottom: 30px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .brand-info {
          max-width: 400px;
        }

        .brand-info p {
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          font-size: 14px;
        }

        .portals-mini h4 {
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          margin: 0 0 16px 0;
        }

        .portal-links {
          display: flex;
          gap: 16px;
        }

        .portal-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s;
          background: rgba(255,255,255,0.05);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .portal-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .footer-bottom {
          text-align: center;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }

        /* ── Mobile ── */
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-text h1 { font-size: 42px; }
        }

        @media (max-width: 768px) {
          .navbar { padding: 20px; }
          .nav-links { display: none; }
          .hero-content { flex-direction: column; padding: 0 20px; text-align: center; margin-top: 40px; }
          .hero-text p { margin: 0 auto 32px; }
          .primary-btn { margin: 0 auto; }
          .stat-card { right: auto; left: 10px; top: -20px; }
          .review-card { left: auto; right: 10px; bottom: -20px; }
          .services-section { padding: 60px 20px; }
          .services-grid { grid-template-columns: 1fr; }
          .footer-top { flex-direction: column; gap: 40px; }
        }
      `}</style>
    </div>
  );
}
