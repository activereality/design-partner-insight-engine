# Frontend Plan

## Planned Routes

- `/` dashboard or project list
- `/projects/:projectId`
- `/projects/:projectId/notes`
- `/projects/:projectId/extraction`
- `/projects/:projectId/insights`
- `/projects/:projectId/dashboard`

## Planned Pages

- Project list
- Project overview
- Note intake
- Extraction run status
- Insight review workspace
- Dashboard summary
- Demo reset confirmation

## Planned Components

- ProjectCard
- NoteEditor
- NoteList
- ExtractionRunPanel
- InsightTypeTabs
- InsightReviewCard
- EvidenceSnippetList
- ReviewStatusControl
- DecisionRecommendationBadge
- DashboardMetric
- DemoDataNotice

## UI Principles

- Workflows should be obvious without explanatory marketing copy.
- Prioritize review speed and evidence visibility.
- Use concise labels and clear status states.
- Keep visual polish product-minded and restrained.
- Avoid over-polishing before the workflow works.

## Dashboard Layout

The dashboard should show:

- project status
- counts by insight type
- strongest pain points
- urgency signals
- open questions
- recommended experiments
- build now / learn more / ignore summary

## Insight Review Workflow

The reviewer should be able to scan each insight, read supporting evidence, edit the summary, set review status, assign a decision recommendation, and move to the next item quickly.

## Empty, Loading, And Error States

- Empty states should suggest the next product action.
- Loading states should be calm and specific.
- Error states should explain what failed and whether the user can retry.

## Synthetic Data Notice

The UI should clearly mark seeded data as synthetic/demo data. It should not imply real customer data is present.

## Product-Minded Visual Hierarchy

Show decision-making content first. Decorative elements should not distract from notes, evidence, review status, and recommendations.
