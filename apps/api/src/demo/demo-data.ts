import { ProjectStatus } from '../projects/enums/project-status.enum';
import { ResearchNoteSourceType } from '../notes/enums/research-note-source-type.enum';

export const DEMO_KEY = 'onboardiq';
export const DEMO_DASHBOARD_PATH = '/projects/:projectId';

export const demoProject = {
  demoKey: DEMO_KEY,
  description:
    'Synthetic demo project for turning messy customer onboarding notes into clearer setup checklists, ownership, and next experiments.',
  isDemo: true,
  name: 'OnboardIQ',
  status: ProjectStatus.Validating,
  targetCustomer: 'Small B2B service teams with repeatable customer onboarding work'
} as const;

export const demoNotes = [
  {
    occurredAt: '2026-05-05T15:00:00.000Z',
    participantLabel: 'Operations lead at a small agency',
    rawText:
      'Synthetic note: The operations lead said each new client setup starts in a spreadsheet, then turns into repeated follow-up messages across email and chat. They want a shared checklist that clarifies who owns each step, what information is still missing, and what must happen before kickoff. The urgent moment is when two clients onboard in the same week and the team cannot tell which setup tasks are blocked. They would judge a pilot by fewer repeated follow-ups, clearer ownership, and a smoother first-week handoff.',
    sourceType: ResearchNoteSourceType.DesignPartnerCall,
    title: 'Agency operations onboarding call'
  },
  {
    occurredAt: '2026-05-08T15:00:00.000Z',
    participantLabel: 'Customer success manager at a small SaaS company',
    rawText:
      'Synthetic note: The customer success manager tracks onboarding steps in a mix of templates, calendar reminders, and a shared checklist. The team sends the same setup questions more than once because ownership is unclear after sales handoff. They said a buying trigger would be a quarter with several new customers and no confidence that required setup details are complete. A useful pilot would show which accounts are missing information, reduce repeated follow-up messages, and make status visible without another meeting.',
    sourceType: ResearchNoteSourceType.DesignPartnerCall,
    title: 'SaaS customer success onboarding call'
  },
  {
    occurredAt: '2026-05-12T15:00:00.000Z',
    participantLabel: 'Founder of a boutique consulting firm',
    rawText:
      'Synthetic note: The founder likes lightweight checklists and does not want a heavy process tool. They still lose time when onboarding notes live in several docs and no one knows which client task is waiting on the client versus the internal team. The weak signal is that they might keep using spreadsheets if the team only has one new client at a time. They would test a pilot by comparing the first two onboarding weeks against their current checklist and watching whether fewer ownership questions come back to the founder.',
    sourceType: ResearchNoteSourceType.DesignPartnerCall,
    title: 'Consulting founder onboarding call'
  }
] as const;
