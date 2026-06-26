import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

  useEffect(() => {
    if (!noteId) {
      setStatus('error');
      return;
    }

    let ignore = false;

    getResearchNote(noteId)
      .then((result) => {
        if (!ignore) {
          setNote(result);
          setForm({
            occurredAt: toDateInputValue(result.occurredAt),
            participantLabel: result.participantLabel,
            rawText: result.rawText,
            sourceType: result.sourceType,
            title: result.title
          });
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

  return (
    <main className="page-shell">
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
    </main>
  );
}
