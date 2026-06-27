import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  listNoteInsights,
  runMockExtraction,
  type ExtractionRun,
  type InsightItem
} from '../api/extraction';
import {
  getResearchNote,
  noteSourceTypes,
  updateResearchNote,
  type NoteSourceType,
  type ResearchNoteDetail
} from '../api/notes';

interface NoteEditState {
  title: string;
  sourceType: NoteSourceType;
  participantLabel: string;
  rawText: string;
  occurredAt: string;
}

function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

export function NoteDetailPage() {
  const { projectId, noteId } = useParams();
  const [note, setNote] = useState<ResearchNoteDetail | null>(null);
  const [form, setForm] = useState<NoteEditState | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [latestRun, setLatestRun] = useState<ExtractionRun | null>(null);
  const [insightStatus, setInsightStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [extractionStatus, setExtractionStatus] = useState<
    'idle' | 'running' | 'succeeded' | 'error'
  >('idle');

  useEffect(() => {
    if (!noteId) {
      setStatus('error');
      return;
    }

    let ignore = false;

    Promise.all([getResearchNote(noteId), listNoteInsights(noteId)])
      .then(([result, insightResults]) => {
        if (!ignore) {
          setNote(result);
          setForm({
            occurredAt: toDateInputValue(result.occurredAt),
            participantLabel: result.participantLabel,
            rawText: result.rawText,
            sourceType: result.sourceType,
            title: result.title
          });
          setInsights(insightResults);
          setStatus('ready');
          setInsightStatus('ready');
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus('error');
          setInsightStatus('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, [noteId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!noteId || !form) {
      return;
    }

    setSaveStatus('saving');

    try {
      const updated = await updateResearchNote(noteId, {
        ...form,
        occurredAt: new Date(`${form.occurredAt}T12:00:00.000Z`).toISOString()
      });
      setNote(updated);
      setForm({
        occurredAt: toDateInputValue(updated.occurredAt),
        participantLabel: updated.participantLabel,
        rawText: updated.rawText,
        sourceType: updated.sourceType,
        title: updated.title
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }

  async function onRunExtraction() {
    if (!noteId) {
      return;
    }

    setExtractionStatus('running');

    try {
      const result = await runMockExtraction(noteId);
      setLatestRun(result.run);
      setInsights(result.insights);
      setExtractionStatus('succeeded');
      setInsightStatus('ready');
    } catch {
      setExtractionStatus('error');
    }
  }

  const insightsByType = insights.reduce<Record<string, InsightItem[]>>((groups, insight) => {
    groups[insight.type] = [...(groups[insight.type] ?? []), insight];
    return groups;
  }, {});

  return (
    <main className="page-shell detail-grid">
      <section className="content-panel narrow-panel" aria-labelledby="note-detail-title">
        <Link className="text-link" to={projectId ? `/projects/${projectId}` : '/projects'}>
          Back to project
        </Link>

        {status === 'loading' && <p>Loading note.</p>}
        {status === 'error' && (
          <p className="safe-error">Note details could not be loaded. Check the local API connection.</p>
        )}
        {status === 'ready' && note && form && (
          <>
            <p className="eyebrow">Sensitive demo note</p>
            <h2 id="note-detail-title">{note.title}</h2>
            <p className="subtle-note">
              Raw notes are treated as sensitive even in this demo. Keep this page synthetic and local.
            </p>

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
                  rows={10}
                  value={form.rawText}
                />
              </label>

              {saveStatus === 'saved' && <p className="success-note">Saved.</p>}
              {saveStatus === 'error' && (
                <p className="safe-error">Note could not be saved. Review the fields and try again.</p>
              )}

              <button className="button primary" disabled={saveStatus === 'saving'} type="submit">
                {saveStatus === 'saving' ? 'Saving...' : 'Save note'}
              </button>
            </form>
          </>
        )}
      </section>

      <section className="content-panel" aria-labelledby="mock-extraction-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Mock extraction</p>
            <h2 id="mock-extraction-title">Generated insights</h2>
          </div>
          <button
            className="button primary"
            disabled={extractionStatus === 'running' || status !== 'ready'}
            onClick={onRunExtraction}
            type="button"
          >
            {extractionStatus === 'running' ? 'Running...' : 'Run Mock Extraction'}
          </button>
        </div>

        <p className="subtle-note">
          This uses deterministic mock output only. No real AI provider is called, and review/edit/accept arrives in a later slice.
        </p>

        {latestRun && (
          <dl className="metadata-grid">
            <div>
              <dt>Status</dt>
              <dd>{latestRun.status}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{latestRun.provider}</dd>
            </div>
          </dl>
        )}

        {extractionStatus === 'error' && (
          <p className="safe-error">Mock extraction could not run. Check the local API connection.</p>
        )}

        {insightStatus === 'loading' && <p>Loading generated insights.</p>}
        {insightStatus === 'error' && (
          <p className="safe-error">Generated insights could not be loaded.</p>
        )}
        {insightStatus === 'ready' && insights.length === 0 && (
          <p>No generated insights yet. Run mock extraction to create draft insight cards.</p>
        )}
        {insightStatus === 'ready' && insights.length > 0 && (
          <div className="insight-groups">
            {Object.entries(insightsByType).map(([type, items]) => (
              <section className="insight-group" key={type} aria-label={`${type} insights`}>
                <h3>{type}</h3>
                <div className="insight-list">
                  {items.map((insight) => (
                    <article className="insight-card" key={insight.id}>
                      <div className="section-heading compact-heading">
                        <div>
                          <strong>{insight.title}</strong>
                          <small>{insight.reviewStatus}</small>
                        </div>
                        <span className="status-pill">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                      <p>{insight.summary}</p>
                      {insight.urgency && <p className="subtle-note">Urgency: {insight.urgency}</p>}
                      {insight.evidence.length > 0 && (
                        <div className="evidence-list">
                          {insight.evidence.map((item) => (
                            <p key={`${insight.id}-${item.snippet}`}>{item.snippet}</p>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
