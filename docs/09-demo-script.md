# Demo Script

## 30-Second Explanation

SignalForge is a Design Partner Insight Engine. It takes messy synthetic founder and design-partner notes, extracts structured product discovery insights, keeps the evidence attached, and helps a team decide what to build now, learn more about, or ignore.

## 3-Minute Demo

1. Open the OnboardIQ synthetic project.
2. Show the messy notes.
3. Run mock extraction.
4. Open the insight review workspace.
5. Show evidence attached to an insight.
6. Accept one insight, edit one, and mark one as needs follow-up.
7. Open the dashboard.
8. Explain the recommended next experiment.

## 5-Minute Technical Walkthrough

1. Explain the full-stack TypeScript target.
2. Show the planned NestJS REST contract.
3. Explain MongoDB/Mongoose document modeling for notes and insight evidence.
4. Explain the AI provider abstraction.
5. Show how the mock provider keeps demos deterministic.
6. Explain validation before saving provider output.
7. Explain where OpenAI, Anthropic, or Gemini adapters would fit later.

## Questions Gitwit Might Ask

- How did you choose the MVP boundary?
- What makes this more useful than a generic AI chat prompt?
- How do you prevent unsupported recommendations?
- Why use MongoDB/Mongoose for this artifact?
- What would you build next if a team wanted to use it?
- How would you evaluate whether the extraction is good?

## Explaining Tradeoffs

The project chooses a narrow workflow over a broad platform. It delays auth, deployment, queues, and external providers so the core product loop can be judged first.

## Why Human-In-The-Loop

Discovery synthesis affects product decisions. AI can structure and suggest, but a human should accept, edit, reject, or mark follow-up before the output becomes trusted.

## Why MongoDB

Discovery notes, evidence snippets, quality flags, and insight metadata are document-shaped and likely to evolve. MongoDB/Mongoose supports flexible iteration while the schema settles.
