import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getProjectDashboard,
  type DashboardInsightSummary,
  type ProjectDashboard
} from '../api/dashboard';
import {
  createProjectNote,
  listProjectNotes,
  noteSourceTypes,
  type NoteSourceType,
  type ResearchNote
} from '../api/notes';

interface NoteFormState {
  title: string;
  sourceType: NoteSourceType;
  participantLabel: string;
  rawText: string;
  occurredAt: string;
}

interface DashboardSectionProps {
  title: string;
  items: DashboardInsightSummary[];
  emptyText: string;
  projectId: string;
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatLabel(value: string): string {
  return value.replaceAll('_', ' ');
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const [dashboard, setDashboard] = useState<ProjectDashboard | null>(null);
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

    Promise.all([getProjectDashboard(projectId), listProjectNotes(projectId)])
      .then(([dashboardResult, noteResults]) => {
        if (!ignore) {
          setDashboard(dashboardResult);
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
      setDashboard((current) =>
        current
          ? {
              ...current,
              noteCount: current.noteCount + 1
            }
          : current
      );
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

  const project = dashboard?.project;

  return (
    <main className="page-shell dashboard-grid">
      <section className="content-panel" aria-labelledby="project-detail-title">
        <Link className="text-link" to="/projects">
          Back to projects
        </Link>

        {status === 'loading' && <p>Loading project dashboard.</p>}
        {status === 'error' && (
          <p className="safe-error">Project dashboard could not be loaded. Check the local API connection.</p>
        )}
        {status === 'ready' && dashboard && project && (
          <>
            <p className="eyebrow">Reviewed signal dashboard</p>
            <h2 id="project-detail-title">{project.name}</h2>
            <dl className="metadata-grid">
              <div>
                <dt>Target customer</dt>
                <dd>{project.targetCustomer}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{formatLabel(project.status)}</dd>
              </div>
            </dl>
            <p>{project.description}</p>
            <p className="subtle-note">
              Dashboard recommendations are based on accepted and edited insights. Unreviewed AI output is counted
              separately, and rejected insights are excluded from primary signal.
            </p>
          </>
        )}
      </section>

      {status === 'ready' && dashboard && projectId && (
        <>
          <section className="content-panel dashboard-summary" aria-labelledby="dashboard-summary-title">
            <h2 id="dashboard-summary-title">Decision signal</h2>
            <div className="metric-grid">
              <Metric label="Notes" value={dashboard.noteCount} />
              <Metric label="Reviewed signal" value={dashboard.primarySignalCount} />
              <Metric label="Needs follow-up" value={dashboard.unresolvedSignalCount} />
              <Metric label="Unreviewed AI" value={dashboard.unreviewedSignalCount} />
            </div>

            {dashboard.noteCount === 0 && (
              <p className="empty-state">No notes yet. Add synthetic discovery notes to begin extraction.</p>
            )}
            {dashboard.noteCount > 0 && dashboard.insightCount === 0 && (
              <p className="empty-state">
                Notes exist, but no extraction has been run yet. Open a note and run extraction to create draft signal.
              </p>
            )}
            {dashboard.insightCount > 0 && dashboard.primarySignalCount === 0 && (
              <p className="empty-state">
                Extracted insights exist, but none have been accepted or edited yet. Review insight cards before using
                this dashboard for product decisions.
              </p>
            )}

            <div className="status-counts" aria-label="Insight review status counts">
              {Object.entries(dashboard.countsByReviewStatus).map(([statusKey, count]) => (
                <span className="status-pill" key={statusKey}>
                  {formatLabel(statusKey)}: {count}
                </span>
              ))}
            </div>
          </section>

          <section className="content-panel" aria-labelledby="decision-recommendations-title">
            <h2 id="decision-recommendations-title">Decision recommendations</h2>
            <div className="decision-grid">
              <DashboardSection
                emptyText="No accepted or edited build-now recommendations yet."
                items={dashboard.decisionRecommendations.buildNow}
                projectId={projectId}
                title="Build now"
              />
              <DashboardSection
                emptyText="No accepted or edited learn-more recommendations yet."
                items={dashboard.decisionRecommendations.learnMore}
                projectId={projectId}
                title="Learn more"
              />
              <DashboardSection
                emptyText="No accepted or edited ignore-for-now recommendations yet."
                items={dashboard.decisionRecommendations.ignoreForNow}
                projectId={projectId}
                title="Ignore for now"
              />
            </div>
          </section>

          <section className="content-panel" aria-labelledby="discovery-signal-title">
            <h2 id="discovery-signal-title">Reviewed discovery signal</h2>
            <div className="dashboard-sections">
              <DashboardSection
                emptyText="No reviewed pain points yet."
                items={dashboard.strongestPainPoints}
                projectId={projectId}
                title="Strongest pain points"
              />
              <DashboardSection
                emptyText="No reviewed personas yet."
                items={dashboard.topPersonas}
                projectId={projectId}
                title="Top personas"
              />
              <DashboardSection
                emptyText="No reviewed user jobs yet."
                items={dashboard.topUserJobs}
                projectId={projectId}
                title="Top user jobs"
              />
              <DashboardSection
                emptyText="No reviewed feature hypotheses yet."
                items={dashboard.featureHypotheses}
                projectId={projectId}
                title="Feature hypotheses"
              />
              <DashboardSection
                emptyText="No reviewed pilot criteria yet."
                items={dashboard.pilotSuccessCriteria}
                projectId={projectId}
                title="Pilot success criteria"
              />
              <DashboardSection
                emptyText="No reviewed experiments yet."
                items={dashboard.recommendedExperiments}
                projectId={projectId}
                title="Recommended experiments"
              />
              <DashboardSection
                emptyText="No reviewed risks yet."
                items={dashboard.risks}
                projectId={projectId}
                title="Risks"
              />
              <DashboardSection
                emptyText="No reviewed open questions yet."
                items={dashboard.openQuestions}
                projectId={projectId}
                title="Open questions"
              />
              <DashboardSection
                emptyText="No insights are marked as needing follow-up."
                items={dashboard.needsFollowUp}
                projectId={projectId}
                title="Needs follow-up"
              />
            </div>
          </section>
        </>
      )}

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
                <span className="status-pill">{formatLabel(note.sourceType)}</span>
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
                  {formatLabel(sourceType)}
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DashboardSection({ title, items, emptyText, projectId }: DashboardSectionProps) {
  return (
    <section className="dashboard-section" aria-label={title}>
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="subtle-note">{emptyText}</p>
      ) : (
        <div className="insight-list">
          {items.map((item) => (
            <article className="dashboard-insight" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
                <small>
                  {formatLabel(item.reviewStatus)} signal, confidence {percent(item.confidence)}
                </small>
              </div>
              <Link className="text-link compact-link" to={`/projects/${projectId}/notes/${item.noteId}`}>
                Open note
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
