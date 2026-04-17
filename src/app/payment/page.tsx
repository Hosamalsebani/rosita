export default function Page() {
  return (
    <main className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">الدفع والتحصيل</h1>
        <p className="page-subtitle">العمليات المالية والدفع الإلكتروني.</p>
      </div>
      
      <div className="glass-panel" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>محتوى صفحة الدفع والتحصيل قيد الإنشاء...</h2>
          <a href="/" className="btn btn-primary">العودة للرئيسية</a>
        </div>
      </div>
    </main>
  );
}
