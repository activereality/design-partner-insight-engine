import { ApiHealthCard } from '../ui/ApiHealthCard';

export function HomePage() {
  return (
    <main className="page-shell">
      <section className="intro-panel" aria-labelledby="home-title">
        <p className="eyebrow">Docs-first portfolio artifact</p>
        <h2 id="home-title">Turn messy design-partner notes into clearer product decisions.</h2>
        <p>
          SignalForge is being built to help early-stage teams structure discovery notes into
          personas, jobs, pain points, risks, pilot criteria, and recommended next experiments.
        </p>
        <p>
          Product workflows are still being built. This shell exists to verify frontend routing,
          layout, and safe backend health visibility before project and note features are added.
        </p>
      </section>

      <ApiHealthCard />
    </main>
  );
}
