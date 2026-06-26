# Demo Data And Seed Plan

## Synthetic Data Rules

- Seed data must be fully synthetic.
- Use invented people, companies, and notes.
- Keep all demo notes generic, fictional, and non-sensitive.
- Avoid private company information.
- Avoid real customer notes.
- Avoid interview or recruiter content.
- Avoid secrets, API keys, tokens, and credentials.
- Do not include real people, real companies, real employers, private recruiter messages, Gitwit/Mechro details, copied customer notes, or private notes.

## Demo Project Concept

Project: OnboardIQ.

Concept: helping small B2B service teams turn messy customer onboarding notes into clear setup checklists.

## Synthetic Design Partner Personas

### Operations Lead

Runs onboarding for a small B2B service company and needs fewer dropped setup details.

### Founder-Led Sales Owner

Closes customers directly and wants handoff notes to become repeatable onboarding steps.

### Customer Success Generalist

Handles support and onboarding together and needs clearer priority across setup tasks.

## Messy Sample Notes

### Note 1

"Jordan said every new customer starts in a different place. Some send a long email, some send a spreadsheet, and some just mention requirements during sales calls. The team loses time figuring out what is still missing. Jordan wants a checklist that updates as they learn more."

### Note 2

"Priya said the painful part is not setup itself, it is chasing customers for the same missing details. They currently copy old onboarding docs and hope the new customer fits the same pattern. She would pay attention if the tool could show what is blocked and what question to ask next."

### Note 3

"Marcus said his team does not need another project board. They need a way to turn call notes into a first draft onboarding plan. He worries AI will make confident guesses, so he wants every suggestion tied back to the note that caused it."

## Expected Extracted Signals

- Persona: operations lead responsible for onboarding consistency.
- User job: turn scattered customer setup details into a checklist.
- Pain point: repeated follow-up for missing information.
- Workaround: copying old onboarding docs.
- Urgency signal: time lost before each customer can start.
- Buying trigger: visibility into blocked setup items.
- Risk: AI suggestions may be trusted without evidence.
- Pilot success criteria: fewer missing setup details and faster first checklist creation.
- Recommended experiment: generate a checklist draft from pasted onboarding notes.

## Demo Reset Behavior

The future reset action should remove existing local demo records and recreate the OnboardIQ project, notes, extraction run, and draft insights in a predictable state.

Demo reset must not require secrets, API keys, external provider calls, or network access. It should work with the mock AI provider and safe committed fixtures.

Mock AI output should be safe to commit. Real AI-generated outputs should not be committed unless they were generated only from synthetic notes and reviewed for accidental sensitive content.

## What Must Never Appear In Seed Data

- Real customer names or notes.
- Real people or real companies.
- Real employers.
- Private Gitwit or Mechro information.
- Interview, recruiter, candidate, or private employer information.
- Copied customer notes.
- Secrets, API keys, tokens, or credentials.
- Industrial, troubleshooting, or unrelated operational domain examples.
