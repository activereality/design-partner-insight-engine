import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { createProjectNote, listProjectNotes, noteSourceTypes, type NoteSourceType, type ResearchNote } from '../api/notes';
import { getProject, type Project } from '../api/projects';

interface NoteFormState {
  title: string;
  sourceType: NoteSourceType;
  participantLabel: string;
  rawText: string;
  occurredAt: string;
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [form, setForm] = useState<NoteFormState>({
    occurredAt: todayInputValue(),
    participantLabel: '',
    rawText: '',
    sourceType: 'design_partner_call',
    title: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setStatus('error');
      return;
    }

    let ignore = false;

    Promise.all([getProject(projectId), listProjectNotes(projectId)])
      .then(([projectResult, noteResults]) => {
        if (!ignore) {
          setProject(projectResult);
          setNotes(noteResults);
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
  }, [projectId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const note = await createProjectNote(projectId, {
        ...form,
        occurredAt: new Date(`${form.occurredAt}T12:00:00.000Z`).toISOString()
      });
      setNotes([note, ...notes]);
      setForm({
        occurredAt: todayInputValue(),
        participantLabel: '',
        rawText: '',
        sourceType: 'design_partner_call',
        title: ''
      });
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell detail-grid">
      <section className="content-panel" aria-labelledby="project-detail-title">
        <Link className="text-link" to="/projects">
          Back to projects
        </Link>

        {status === 'loading' && <p>Loading project.</p>}
        {status === 'error' && (
          <p className="safe-error">Project details could not be loaded. Check the local API connection.</p>
        )}
        {status === 'ready' && project && (
          <>
            <p className="eyebrow">Project</p>
            <h2 id="project-detail-title">{project.name}</h2>
            <dl className="metadata-grid">
              <div>
                <dt>Target customer</dt>
                <dd>{project.targetCustomer}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
            </dl>
            <p>{project.description}</p>
            <p className="subtle-note">
              AI extraction, evidence review, recommendations, and dashboard summaries arrive in later slices.
            </p>
          </>
        )}
      </section>

      <section className="content-panel" aria-labelledby="notes-title">
        <h2 id="notes-title">Research notes</h2>
        {notes.length === 0 ? (
          <p>No notes yet. Add only generic synthetic/demo note content.</p>
        ) : (
          <div className="item-list">
            {notes.map((note) => (
              <Link className="item-row" key={note.id} to={`/projects/${note.projectId}/notes/${note.id}`}>
                <span>
                  <strong>{note.title}</strong>
                  <small>{note.participantLabel}</small>
                </span>
                <span className="status-pill">{note.sourceType}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="content-panel" aria-labelledby="add-note-title">
        <h2 id="add-note-title">Add synthetic note</h2>
        <form className="stacked-form" onSubmit={onSubmit}>
          <label>
            Title
            <input
              maxLength={160}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
              value={form.title}
            />
          </label>

          <label>
            Source type
            <select
              onChange={(event) =>
                setForm({ ...form, sourceType: event.target.value as NoteSourceType })
              }
              value={form.sourceType}
            >
              {noteSourceTypes.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {sourceType}
                </option>
              ))}
            </select>
          </label>

          <label>
            Participant label
            <input
              maxLength={160}
              onChange={(event) => setForm({ ...form, participantLabel: event.target.value })}
              required
              value={form.participantLabel}
            />
          </label>

          <label>
            Occurred at
            <input
              onChange={(event) => setForm({ ...form, occurredAt: event.target.value })}
              required
              type="date"
              value={form.occurredAt}
            />
          </label>

          <label>
            Raw note text
            <textarea
              maxLength={10000}
              onChange={(event) => setForm({ ...form, rawText: event.target.value })}
              required
              rows={8}
              value={form.rawText}
            />
          </label>

          {submitError && <p className="safe-error">Note could not be saved. Review the fields and try again.</p>}

          <button className="button primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Adding...' : 'Add note'}
          </button>
        </form>
      </section>
    </main>
  );
}
