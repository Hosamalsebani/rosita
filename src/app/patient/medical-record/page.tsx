export default function Page() {
  return (
    <main className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">الملف الطبي الموحد</h1>
        <p className="page-subtitle">جميع التفاصيل الطبية والتاريخ المرضي.</p>
      </div>
      
      <div className="glass-panel" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>محتوى صفحة الملف الطبي الموحد قيد الإنشاء...</h2>
          <a href="/" className="btn btn-primary">العودة للرئيسية</a>
        </div>
      </div>
    </main>
  );
}
