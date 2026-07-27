import { EmblemStage } from "@/components/invitation/emblem-stage";

export default function NotFound() {
  return (
    <main className="sanctum-shell gate-shell">
      <section className="gate-card" aria-labelledby="not-found-title">
        <EmblemStage compact />
        <p className="eyebrow">Private access point</p>
        <h1 id="not-found-title">No invitation was recognized.</h1>
        <p>
          Return to the private mark included with your package and scan it
          again.
        </p>
      </section>
    </main>
  );
}
