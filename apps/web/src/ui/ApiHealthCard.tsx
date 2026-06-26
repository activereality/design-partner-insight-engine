import { useEffect, useState } from 'react';

type HealthStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

interface ApiHealthResponse {
  status?: string;
  service?: string;
  database?: string;
}

interface HealthState {
  apiStatus: string;
  databaseStatus: string;
  service: string;
  status: HealthStatus;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export function ApiHealthCard() {
  const [health, setHealth] = useState<HealthState>({
    apiStatus: 'Not checked',
    databaseStatus: 'Not checked',
    service: 'signalforge-api',
    status: 'idle'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      setHealth((current) => ({
        ...current,
        status: 'loading'
      }));

      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Health check failed');
        }

        const data = (await response.json()) as ApiHealthResponse;

        if (!isMounted) {
          return;
        }

        setHealth({
          apiStatus: data.status === 'ok' ? 'ok' : 'unavailable',
          databaseStatus: data.database ?? 'not reported',
          service: data.service ?? 'signalforge-api',
          status: 'ready'
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setHealth({
          apiStatus: 'unavailable',
          databaseStatus: 'not reported',
          service: 'signalforge-api',
          status: 'unavailable'
        });
      }
    }

    void loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="status-panel" aria-labelledby="health-title">
      <div>
        <p className="eyebrow">Backend health</p>
        <h2 id="health-title">API connection</h2>
      </div>
      <dl className="status-grid">
        <div>
          <dt>Service</dt>
          <dd>{health.service}</dd>
        </div>
        <div>
          <dt>API</dt>
          <dd>{health.status === 'loading' ? 'checking' : health.apiStatus}</dd>
        </div>
        <div>
          <dt>Database</dt>
          <dd>{health.status === 'loading' ? 'checking' : health.databaseStatus}</dd>
        </div>
      </dl>
      {health.status === 'unavailable' ? (
        <p className="safe-error">Health is unavailable. Start the API and local MongoDB, then refresh.</p>
      ) : null}
    </section>
  );
}
