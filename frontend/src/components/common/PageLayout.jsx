export default function PageLayout({ title, description, children }) {
  return (
    <section className="page-card">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">Laboratorio numerico</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="page-badge">
          <span />
          Modulo activo
        </div>
      </header>
      {children}
    </section>
  );
}
