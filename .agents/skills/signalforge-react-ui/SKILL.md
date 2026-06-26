---
name: signalforge-react-ui
description: Guidance for future SignalForge React UI work.
---

# SignalForge React UI

## When To Use

Use this skill when future work touches the React frontend, UI architecture, interaction design, dashboards, review flows, or demo polish.

## Expected Structure

Use React + TypeScript with clear separation between pages, reusable components, API client code, query hooks, and domain types. Keep UI state local unless it needs to be shared.

## Likely Screens

- dashboard or project list
- note intake/review
- extraction run status
- insight review workspace
- recommendation summary
- demo reset or sample scenario entry point

## Data Fetching Direction

Use TanStack Query later for server state, caching, mutations, and loading/error handling. Keep API calls typed and grouped by domain.

## Review Workflow Principles

Make extracted insights easy to scan, compare, accept, reject, and trace back to evidence. Favor clear grouping by persona, pain, job, urgency, risk, and recommendation.

## Dashboard Principles

Dashboards should be focused and work-oriented: concise status, obvious next action, useful counts, and no decorative clutter. This is a portfolio demo, but it should feel like a real product tool.
