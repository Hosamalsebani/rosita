export default function Page() {
  return (
    <main className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">بوابة المريض</h1>
        <p className="page-subtitle">الرئيسية الخاصة بالمريض.</p>
      </div>
      
      <div className="glass-panel" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>محتوى صفحة بوابة المريض قيد الإنشاء...</h2>
          <a href="/" className="btn btn-primary">العودة للرئيسية</a>
        </div>
      </div>
    </main>
  );
}
