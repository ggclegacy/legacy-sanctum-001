export default function InviteLoading() {
  return (
    <main className="sanctum-shell gate-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <section className="gate-card gate-card--loading" aria-live="polite">
        <div className="status-line">
          <span className="status-dot status-dot--pulse" />
          Detecting private invitation
        </div>
        <div className="loading-seal" aria-hidden="true" />
        <p className="eyebrow">Legacy Sanctum</p>
        <h1>Establishing secure entry.</h1>
      </section>
    </main>
  );
}
