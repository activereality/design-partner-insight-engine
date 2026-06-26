import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { listProjects, type Project } from '../api/projects';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let ignore = false;

    listProjects()
      .then((items) => {
        if (!ignore) {
          setProjects(items);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="page-shell">
      <section className="content-panel" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Synthetic discovery workspace</p>
            <h2 id="projects-title">Projects</h2>
          </div>
          <Link className="button primary" to="/projects/new">
            New project
          </Link>
        </div>

        {status === 'loading' && <p>Loading projects.</p>}
        {status === 'error' && (
          <p className="safe-error">Projects could not be loaded. Check the local API connection.</p>
        )}
        {status === 'ready' && projects.length === 0 && (
          <p>No projects yet. Create one using synthetic discovery context only.</p>
        )}
        {status === 'ready' && projects.length > 0 && (
          <div className="item-list">
            {projects.map((project) => (
              <Link className="item-row" key={project.id} to={`/projects/${project.id}`}>
                <span>
                  <strong>{project.name}</strong>
                  <small>{project.targetCustomer}</small>
                </span>
                <span className="status-pill">{project.status}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
