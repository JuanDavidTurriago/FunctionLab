export default function PageLayout({ title, description, children }) {
  return (
    <section className="page-card">
      <header className="page-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}
