"use client";

export default function InviteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="sanctum-shell gate-shell">
      <section className="gate-card" aria-labelledby="invite-error-title">
        <p className="eyebrow">Private entry interrupted</p>
        <h1 id="invite-error-title">The access point is unavailable.</h1>
        <p>
          Nothing has been revealed. Re-establish the connection when you are
          ready.
        </p>
        <button
          className="premium-button premium-button--primary"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
