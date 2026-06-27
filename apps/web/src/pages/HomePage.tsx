import { useState } from 'react';
import { Link } from 'react-router-dom';

import { seedDemo, resetDemo, type DemoSeedResult } from '../api/demo';
import { ApiHealthCard } from '../ui/ApiHealthCard';

export function HomePage() {
  const [demoStatus, setDemoStatus] = useState<'idle' | 'seeding' | 'resetting' | 'success' | 'error'>(
    'idle'
  );
  const [seedResult, setSeedResult] = useState<DemoSeedResult | null>(null);

  async function onSeedDemo() {
    setDemoStatus('seeding');

    try {
      const result = await seedDemo();
      setSeedResult(result);
      setDemoStatus('success');
    } catch {
      setDemoStatus('error');
    }
  }

  async function onResetDemo() {
    setDemoStatus('resetting');

    try {
      await resetDemo();
      setSeedResult(null);
      setDemoStatus('success');
    } catch {
      setDemoStatus('error');
    }
  }

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
          Create a synthetic demo workspace, run safe mock-backed extraction, review the generated
          signal, and inspect a dashboard that keeps humans in control of product decisions.
        </p>
      </section>

      <ApiHealthCard />

      <section className="content-panel" aria-labelledby="demo-tools-title">
        <p className="eyebrow">Local demo tools</p>
        <h2 id="demo-tools-title">Seed OnboardIQ</h2>
        <p>
          Demo tools create a deterministic synthetic OnboardIQ project with notes, mock extraction
          runs, reviewed insights, and dashboard-ready signal. They require local demo tools to be
          enabled on the API.
        </p>
        <div className="review-actions">
          <button className="button primary" disabled={demoStatus === 'seeding'} onClick={onSeedDemo} type="button">
            {demoStatus === 'seeding' ? 'Seeding...' : 'Seed demo'}
          </button>
          <button className="button secondary" disabled={demoStatus === 'resetting'} onClick={onResetDemo} type="button">
            {demoStatus === 'resetting' ? 'Resetting...' : 'Reset demo'}
          </button>
        </div>

        {demoStatus === 'error' && (
          <p className="safe-error">
            Demo tools are disabled locally or the API could not complete the request.
          </p>
        )}
        {demoStatus === 'success' && seedResult && (
          <p className="success-note">
            Demo seeded with {seedResult.noteCount} notes and {seedResult.insightCount} insights.{' '}
            <Link to={seedResult.dashboardPath}>Open the dashboard</Link>.
          </p>
        )}
        {demoStatus === 'success' && !seedResult && (
          <p className="success-note">Demo data reset completed.</p>
        )}
      </section>
    </main>
  );
}
