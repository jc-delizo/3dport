// "How I'd run your project" — the playbook reordered around the visitor's
// situation. Same fact discipline as everything else on the site: every play
// restates a stage, ceremony, or governance rule from playbook.js, every risk
// restates a documented case-study moment or governance line, and every
// evidence pointer targets a section that exists. Nothing here introduces a
// claim of its own.
export const scenarios = {
  kicker: 'Pick your situation',
  title: "How I'd run your project.",
  intro:
    'Same playbook, different opening moves. Choose the shape of your problem and see which plays come first, and which risks get flagged before work starts.',
  items: [
    {
      id: 'greenfield',
      label: 'Greenfield build',
      hook: 'Something new, against a real date.',
      plays: [
        {
          title: 'Charter before code',
          body: 'Mission, scope, stakeholders — and the change-control and communication strategies — fixed before a line of code exists.',
        },
        {
          title: 'Design sprint when the date demands it',
          body: 'Domain model, architecture, test plan, premortem and delivery plan in one gated pass — the 30-day approvals platform started exactly this way.',
        },
        {
          title: 'Recorded demo every sprint',
          body: 'Every sprint ends with a demo in front of the actual users, not a status email. Acceptance is demo-led.',
        },
        {
          title: 'Protect the date with change control',
          body: 'New scope becomes a formal phase-two change request with its own plan — the go-live date is not a negotiation channel.',
        },
      ],
      risks: [
        {
          title: 'The compressed design meets reality',
          body: 'A one-day design pass produced field-mapping defects days before a demo. The answer is a named, checklisted debug cycle with end-to-end verification — not hope.',
        },
        {
          title: 'Scope expands before v1 ships',
          body: 'It will. Captured as a phase-two change request, it protects the date; absorbed quietly, it eats it.',
        },
        {
          title: 'Mid-build surprises land anyway',
          body: 'A rebrand arrived while schema work was in flight — absorbed as one explicit epic, not scattered fixes.',
        },
      ],
      evidence: {
        label: 'The receipt: Multi-Entity Approval Workflow Platform',
        note: '30 days from design sprint to five-entity go-live · zero support tickets since',
        href: '#case-studies',
      },
    },
    {
      id: 'legacy',
      label: 'Legacy replacement',
      hook: 'A manual or aging process, replaced without breaking the business.',
      plays: [
        {
          title: 'Scope with the people who run the process',
          body: 'Requirements captured live with process owners across 2–5 recorded sessions — not one kickoff call.',
        },
        {
          title: 'Parallel runs against the current process',
          body: 'The new system runs beside the old one before acceptance is even scheduled. Parallel-run results decide cutover, not optimism.',
        },
        {
          title: 'Pilot before UAT — UAT validates, it does not discover',
          body: 'Internal QA, parallel runs, and pilots with key users burn the bugs down first; acceptance sessions confirm.',
        },
        {
          title: 'Training that scales past the room',
          body: 'End-to-end plus role-specific sessions for each user group, all recorded, with user manuals in the repo.',
        },
      ],
      risks: [
        {
          title: 'The old process keeps running in shadow',
          body: 'If the parallel run is skipped, it runs anyway — unofficially and unmeasured. The playbook makes it an artifact instead.',
        },
        {
          title: 'Acceptance by checklist-over-email',
          body: 'UAT runs as live walkthrough-and-validation sessions with the owners who will run the system.',
        },
        {
          title: 'Verbal scope changes',
          body: 'Nothing changes scope verbally — every change is logged with requestor, priority, and stage.',
        },
      ],
      evidence: {
        label: 'The receipt: Multi-Entity ERP Rollout',
        note: 'Seven modules live in production across corporate entities that ran on fragmented manual processes',
        href: '#initiatives',
      },
    },
    {
      id: 'rescue',
      label: 'Rescue mission',
      hook: 'A project — or a portfolio — that is slipping.',
      plays: [
        {
          title: 'Portfolio truth first',
          body: 'Every project on one screen: stage, status, completion, on/off-track, owner — honest remarks included. You cannot triage what you cannot see.',
        },
        {
          title: 'Daily scrum, logged',
          body: 'Per developer, per project: goal, accomplished, blocking — timestamped. Thousands of entries, not a ritual.',
        },
        {
          title: 'Freeze verbal scope',
          body: 'Every change through the change-request log from day one of the rescue. Scope changes are welcome; undocumented ones are not.',
        },
        {
          title: 'Rank, then starve the fire of company',
          body: 'When eight go-lives shared one date, checkpoints ranked the low-risk projects early — so attention flowed to the ones actually burning.',
        },
      ],
      risks: [
        {
          title: 'Status nobody can see',
          body: 'The first deliverable is the board, not a fix — 35+ projects tracked on one screen is what made the rest possible.',
        },
        {
          title: 'The burning project starves the rest',
          body: 'Triage is portfolio-level: protecting the healthy projects is half the rescue.',
        },
        {
          title: 'Rescue by heroics',
          body: 'Heroics do not scale and do not survive the hero. The playbook rides the same rails as every other project — that is the point.',
        },
      ],
      evidence: {
        label: 'The receipt: Scaling Software Delivery',
        note: 'The operating model that took one team from 2 projects a year to 20–28',
        href: '#initiatives',
      },
    },
  ],
}
