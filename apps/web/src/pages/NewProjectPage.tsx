import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { createProject, projectStatuses, type ProjectStatus } from '../api/projects';

interface ProjectFormState {
  name: string;
  description: string;
  targetCustomer: string;
  status: ProjectStatus;
}

export function NewProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProjectFormState>({
    description: '',
    name: '',
    status: 'exploring',
    targetCustomer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(false);

    try {
      const project = await createProject(form);
      navigate(`/projects/${project.id}`);
    } catch {
      setError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="content-panel narrow-panel" aria-labelledby="new-project-title">
        <Link className="text-link" to="/projects">
          Back to projects
        </Link>
        <p className="eyebrow">Project setup</p>
        <h2 id="new-project-title">Create a synthetic discovery project</h2>

        <form className="stacked-form" onSubmit={onSubmit}>
          <label>
            Project name
            <input
              maxLength={120}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              value={form.name}
            />
          </label>

          <label>
            Target customer
            <input
              maxLength={240}
              onChange={(event) => setForm({ ...form, targetCustomer: event.target.value })}
              required
              value={form.targetCustomer}
            />
          </label>

          <label>
            Status
            <select
              onChange={(event) =>
                setForm({ ...form, status: event.target.value as ProjectStatus })
              }
              value={form.status}
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea
              maxLength={1200}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
              rows={6}
              value={form.description}
            />
          </label>

          {error && <p className="safe-error">Project could not be saved. Review the fields and try again.</p>}

          <button className="button primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating...' : 'Create project'}
          </button>
        </form>
      </section>
    </main>
  );
}
