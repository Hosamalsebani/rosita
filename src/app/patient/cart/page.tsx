export default function Page() {
  return (
    <main className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">سلة المشتريات</h1>
        <p className="page-subtitle">إتمام الدفع و مراجعة المشتريات.</p>
      </div>
      
      <div className="glass-panel" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>محتوى صفحة سلة المشتريات قيد الإنشاء...</h2>
          <a href="/" className="btn btn-primary">العودة للرئيسية</a>
        </div>
      </div>
    </main>
  );
}
