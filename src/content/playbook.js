// The Delivery Playbook — JC's delivery operating model, generalized from three
// years of project archives by his records assistant, then normalized to this
// site's fact discipline (projects as the delivery unit; team of eight). Shown
// in a themed modal from the Scaling Software Delivery initiative.
export const playbook = {
  title: 'The Delivery Playbook',
  kicker: 'Agile delivery operating model · drawn from three years of delivery records',
  tagline:
    'How one team ships 20+ projects a year — the lifecycle, the instruments, the governance, and the cadence that hold it together.',
  provenance:
    'Everything here is generalized from real project archives: standardized PM workbooks across 20+ projects, a portfolio masterlist with thousands of daily-scrum entries, signed acceptance certificates, and full meeting records from scoping to go-live. Client and vendor names are withheld.',

  lifecycle: {
    heading: 'The lifecycle',
    sub: 'Every project walks the same road.',
    intro:
      "Each stage produces a named artifact — if the artifact doesn't exist, the stage didn't happen.",
  },
  stages: [
    {
      n: 1,
      title: 'Scoping — as many sessions as it takes',
      body: 'Requirements are captured live with process owners across multiple recorded sessions (typically 2–5 per project), not one kickoff call. AI-generated notes on every session.',
      artifacts: ['Scoping session notes', 'Requirements list', 'Process flows'],
    },
    {
      n: 2,
      title: 'Charter & plan',
      body: 'A project charter fixes mission, functional and organizational scope, stakeholders — and, critically, the scope-management, change-control, and communication strategies before a line of code exists.',
      artifacts: ['Project charter', 'Project plan', 'Timeline'],
    },
    {
      n: 3,
      title: 'Sprints — build in public',
      body: 'Work runs from a product backlog through numbered sprint backlogs, and every sprint ends with a recorded review/demo in front of the actual users, not a status email.',
      artifacts: ['Sprint backlogs', 'Sprint review/demo recordings', 'Risk & issue log'],
    },
    {
      n: 4,
      title: 'Internal, parallel & pilot testing — break it before users see it',
      body: 'Before acceptance is even scheduled, the team runs internal QA, parallel runs against the current process, and pilots with key users. Bugs are burned down in review first — UAT validates, it does not discover.',
      artifacts: ['Test matrix & bug log', 'Parallel-run results', 'Pilot feedback'],
    },
    {
      n: 5,
      title: 'UAT — live, not a checklist by email',
      body: 'Acceptance runs as live walkthrough-and-validation sessions with the process owners who will run the system.',
      artifacts: ['UAT session records', 'Issue consolidation'],
    },
    {
      n: 6,
      title: 'Go-live & training',
      body: 'A go-live kickoff for stakeholders, then end-to-end training plus role-specific sessions for each user group — all recorded so training scales past the room.',
      artifacts: ['Go-live kickoff', 'Training recordings', 'User manuals'],
    },
    {
      n: 7,
      title: 'Maintenance — the project after the project',
      body: 'Every shipped system gets a maintenance masterlist from a shared template, a change-request log, and — for vendor-built systems — a maintenance contract.',
      artifacts: ['Maintenance masterlist', 'Change requests', 'Signed acceptance'],
    },
  ],

  instrument: {
    heading: 'The per-project instrument',
    sub: 'One workbook. Twenty projects. Same spine.',
    intro:
      'Every project opens from the same PM workbook template — so every project starts at 80%, and anyone can read any project.',
    groups: [
      { name: 'Direction', items: ['Project charter — mission, scope, stakeholders', 'Project plan', 'Project timeline'] },
      { name: 'Execution', items: ['Product backlog', 'Sprint backlogs — one tab per sprint', 'Project files index'] },
      { name: 'Control', items: ['Risk / issue log', 'Change request log — requestor, priority, stage, dates'] },
      { name: 'Specification', items: ['Process flow', 'User roles & menu permissions', 'Data source · dropdown values · table columns'] },
      { name: 'Meta', items: ['Table of contents', '“How to use this template?” — the workbook teaches itself'] },
    ],
    pull: 'A template with a “how to use this” tab is not a document. It is an operating system.',
  },

  portfolioLayer: {
    heading: 'The portfolio layer',
    sub: 'One masterlist runs the whole department.',
    intro:
      'Above the projects sits a single portfolio view — and a heartbeat of ceremonies written down, not just held.',
  },
  ceremonies: [
    {
      cadence: 'Daily',
      title: 'Daily scrum — logged',
      body: 'Per developer, per project: sprint goal, what was accomplished, what is blocking. Timestamped start and end.',
      evidence: '~3,000 logged entries and counting.',
    },
    {
      cadence: 'Per sprint',
      title: 'Review & demo',
      body: 'Every sprint closes with a recorded demo to real users — Sprint I, II, III, IV traceable per project.',
      evidence: 'Sprint review recordings across the archive.',
    },
    {
      cadence: 'Recurring',
      title: 'Retrospectives',
      body: 'Went well / went wrong / what we improve — captured per developer, per project, with dates.',
      evidence: 'A standing retrospective register.',
    },
    {
      cadence: 'Always on',
      title: 'Portfolio review',
      body: 'Every project: stage, status, completion %, on/off-track, owner, category — one screen for the entire portfolio, honest remarks included.',
      evidence: '35+ projects tracked on one board.',
    },
  ],

  governance: {
    heading: 'The governance layer',
    sub: 'Every project ends twice.',
    intro:
      'Once at go-live — and once when the paperwork says so. This is the part most agile shops skip.',
    steps: [
      { n: '1 · Request', title: 'Change request', body: 'Logged with requestor, priority, and stage — nothing changes scope verbally.' },
      { n: '2 · Deliver', title: 'Itemized delivery', body: 'Each delivered item written out — what was built, where, and how it behaves.' },
      { n: '3 · Accept', title: 'Signed acceptance', body: 'A Certificate of Completion & Acceptance, dual-signed by delivery PM and process owner.' },
      { n: '4 · Track', title: 'Signoff board', body: 'Per project: request docs, acceptance status, maintenance contract, open CRs — at a glance.' },
    ],
    closing: 'Scope changes are welcome. Undocumented scope changes are not.',
  },

  modelsIntro: {
    heading: 'One playbook, three delivery models',
    sub: 'Build, buy, or outsource — same governance.',
  },
  models: [
    { title: 'Internal', body: 'Built by the in-house team. Full lifecycle, daily scrum, sprint demos, internal signoff.' },
    { title: 'SaaS', body: 'Configured platforms. Same scoping and UAT discipline; delivery becomes showcase-and-validate.' },
    { title: 'Outsourced', body: 'Vendor-built. Adds formal acceptance: itemized change requests and dual-signed certificates per delivery.' },
  ],
  modelsClosing:
    'The portfolio board categorizes every project by model — the ceremonies flex, the governance does not.',

  automation: {
    heading: 'The automation layer',
    sub: 'Then the playbook got an engine.',
    intro: 'With the operating model stable, the repetitive parts were progressively automated.',
    items: [
      {
        tag: 'Meetings',
        title: 'AI notes on every session',
        body: 'Scoping, UAT, training — every recorded meeting carries AI-generated structured notes, so decisions survive the call.',
      },
      {
        tag: 'Intake & delivery',
        title: 'AI-assisted pipeline',
        body: 'A single AI front door for requests, automated ticket structuring, and a human-gated AI implementation pipeline for fixes — the subject of its own case study.',
      },
    ],
    closing: 'Automation did not replace the playbook. It enforced it.',
  },

  results: {
    heading: 'What the playbook delivers',
    sub: 'Discipline is what scales.',
    stats: [
      { value: '20–28', label: 'projects per year' },
      { value: '65', label: 'projects delivered end to end' },
      { value: '5–11', label: 'concurrent projects' },
      { value: '22', label: 'departments served' },
    ],
    closing:
      'Not because the team is enormous — it is eight people — but because every project rides the same rails: scoped in sessions, chartered before build, demoed every sprint, accepted in writing, and maintained on contract.',
  },

  footer:
    'Generalized from three years of real project archives · client, vendor and personnel names withheld.',
}
