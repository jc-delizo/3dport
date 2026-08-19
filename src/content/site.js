// The résumé ships with the site so it downloads same-origin and updates with each
// deploy. BASE_URL, not a bare "/resume.pdf": the site deploys under /3dport/.
const RESUME_PDF = `${import.meta.env.BASE_URL}resume.pdf`
// The filename the browser saves the download as, independent of the URL.
const RESUME_FILENAME = 'JC Delizo - Resume.pdf'

export const site = {
  meta: {
    title: 'JC Delizo | Digital Transformation Project Manager',
    description:
      'Digital Transformation Project Manager and Software Delivery Manager who scaled delivery from 2 to 20–28 projects a year through Agile and AI workflows.',
    url: 'https://jc-delizo.github.io/3dport/',
    ogImage: 'https://jc-delizo.github.io/3dport/og.png',
  },

  // Entries with `items` render as dropdowns; entries with `id` are direct
  // links. Case Studies stays top-level deliberately — it's the page hiring
  // managers most need to find.
  nav: [
    {
      label: 'Portfolio',
      items: [
        { id: 'approach', label: 'How I Approach Software' },
        { id: 'lifecycle', label: 'Delivery Lifecycle' },
        { id: 'initiatives', label: 'Initiatives' },
        { id: 'case-studies', label: 'Case Studies' },
        { id: 'portfolio', label: 'Projects' },
        { id: 'principles', label: 'Principles' },
      ],
    },
    {
      label: 'Experience',
      items: [
        { id: 'experience', label: 'Work History' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'tools', label: 'Tools' },
        { id: 'certifications', label: 'Certifications' },
      ],
    },
    { id: 'contact', label: 'Contact' },
  ],

  hero: {
    name: 'JC Delizo',
    title: 'Digital Transformation Project Manager',
    claim: 'I help organizations deliver software faster by transforming the way teams work.',
    support:
      'Increased software delivery capacity from 2 to 20–28 projects/year through Agile, AI-powered workflows, and scalable delivery systems.',
    primaryCta: { label: 'View Initiatives', href: '#initiatives' },
    secondaryCtas: [
      { label: 'Download Résumé', href: RESUME_PDF, download: RESUME_FILENAME },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jcdelizo/' },
    ],
  },

  // Career arc, shown as the typographic row under the hero CTAs. Replaced the old
  // method pipeline (Business → Process → System → Team → Outcome), which duplicated
  // what the Principles section and the Initiatives already demonstrate.
  pipeline: ['Digital Transformation PM', 'Technical Program Management', 'Software Delivery Manager'],

  proof: [
    { value: '10×', label: 'Increase in delivery capacity' },
    { value: '20–28', label: 'Projects delivered per year' },
    { value: '65', label: 'Projects delivered end to end in 3 years' },
    { value: '15', label: 'Enterprise systems live in production' },
  ],

  initiatives: [
    {
      id: 'scaling-delivery',
      category: 'Delivery Transformation',
      title: 'Scaling Software Delivery',
      problem:
        'The digital transformation team could deliver only about two projects a year. Planning was inconsistent, workflows were fragmented, and there was no shared visibility into delivery status.',
      approach: [
        'Introduced Scrum with sprint planning, backlog refinement, and delivery metrics.',
        'Standardized intake and prioritization across all requesting business functions.',
        'Established delivery governance — support tiering, an SLA framework, and an executive reporting cadence.',
        'Introduced AI-assisted workflows to remove repetitive coordination work.',
        'Made delivery status visible to executives through live dashboards.',
        'Evolved the tooling deliberately rather than all at once: traditional project management to Scrum, documentation standardized in Coda, execution tracking migrated to Linear, AI automation layered on last.',
      ],
      outcome:
        'Delivery capacity increased from roughly 2 projects per year to 20–28 projects per year, while delivery schedules stayed predictable.',
    },
    {
      id: 'erp-rollout',
      category: 'Enterprise ERP',
      title: 'Multi-Entity ERP Rollout',
      problem:
        'Several corporate entities ran HR, finance, and operations on fragmented and largely manual processes. There was no shared source of truth across payroll, recruitment, employee records, or accounting.',
      approach: [
        'Led a phased Odoo ERP implementation across the core platform and its functional modules.',
        'Sequenced one module per entity at a time so adoption never halted operations.',
        'Ran scoping, requirements gathering, configuration, and user training with each business function.',
        'Kept rollback cheap by keeping each rollout independently reversible.',
      ],
      outcome:
        'Seven Odoo modules live in production — accounting, employee records, recruitment, helpdesk, agreements, performance management, and the shared core — with payroll in active delivery.',
    },
    {
      id: 'ai-intake',
      category: 'AI Workflow',
      title: 'AI-Powered Request Management',
      problem:
        'Developers were interrupted constantly by stakeholders across several communication channels. Requests arrived unstructured, so engineering time went to clarification rather than build.',
      approach: [
        'Designed an AI-assisted intake process that centralized all stakeholder requests.',
        'Automated requirement gathering and structured ticket generation.',
        'Routed requests to the right owner without developer involvement.',
      ],
      outcome:
        'Developer context switching dropped, incoming requirements arrived materially better formed, and the team gained a single source of truth for incoming work.',
    },
    {
      id: 'portfolio',
      category: 'Portfolio Management',
      title: 'Enterprise Transformation Portfolio',
      problem:
        'Business units across HR, finance, treasury, legal, credit, and operations all needed digital solutions while sharing one constrained engineering team.',
      approach: [
        'Managed prioritization across a portfolio of more than two dozen initiatives.',
        'Balanced stakeholder expectations against technical dependencies and real delivery capacity.',
        'Held 5–11 projects in flight at any one time without losing schedule predictability.',
      ],
      outcome:
        'Delivered systems spanning payroll, recruitment, employee records, performance management, finance workflows, treasury queuing, legal case management, inventory tracking, and AI-enabled internal operations.',
    },
  ],

  // Deep dives behind two initiatives. Content is drawn from delivery records and
  // production data compiled 2026-08-15; every figure is sourced, TBD metrics from
  // the source briefs are omitted rather than estimated. All internal codenames,
  // entity names, people, and issue IDs are generalized (guarded by forbidden.js;
  // the name mapping lives outside this public repo).
  caseStudies: [
    {
      id: 'approval-platform-case',
      title: 'Multi-Entity Approval Workflow Platform',
      summary:
        'An approvals platform for five corporate entities that replaced email-and-paper routing with composable, auditable approval chains — designed, built, and shipped to production in 30 days.',
      stats: [
        { value: '30', label: 'Days from design sprint to go-live' },
        { value: '5', label: 'Corporate entities live at cutover' },
        { value: '8', label: 'Document types seeded at launch' },
        { value: '0', label: 'Support tickets since go-live' },
      ],
      timeline: [
        {
          date: 'Jun 1',
          title: 'One-day design sprint',
          detail:
            'Domain modeling, architecture, test plan, premortem, and delivery plan produced through an AI-phased framework — every phase gated on human approval before the next began.',
        },
        {
          date: 'Jun 4–8',
          title: 'Parallel build on four tracks',
          detail:
            'Four workstreams built simultaneously, then merged in a dedicated integration pass that resolved cross-track conflicts and cleared every failing test.',
        },
        {
          date: 'Jun 4–8',
          title: 'Named hardening cycle',
          detail:
            'A checklisted debug cycle fixed request-creation and file-upload defects, each verified end to end in the browser before the demo.',
        },
        {
          date: 'Jun 9',
          title: 'Stakeholder demo',
          detail:
            'Held its original date; portfolio triage tracked the project as the lowest-risk item in an eight-project go-live cluster.',
        },
        {
          date: 'Jun 20',
          title: 'Training and turnover',
          detail: 'User training delivered against an in-repo user manual ahead of cutover.',
        },
        {
          date: 'Jun 30',
          title: 'Go-live across five entities',
          detail:
            'Shipped on the original target date, alongside seven other projects sharing the same deadline.',
        },
        {
          date: 'Jul–Aug',
          title: 'Production hardening',
          detail:
            'Single sign-on provisioning, data seeding, and UX refinements after launch — with zero support tickets recorded since go-live.',
        },
      ],
      story: [
        'The build paired one newly hired developer with an AI-phased delivery framework: interview, domain model, architecture, tests, premortem, and plan each produced as reviewable artifacts, none accepted without human sign-off. My role was the delivery system around it — daily scrum, checkpoint reviews three times a day, and portfolio-level triage across the eight projects sharing the June 30 deadline.',
        'Acceptance was demo-led: a stakeholder demo on June 9, a standing debug milestone, training on June 20, then a big-bang cutover on June 30. Onboarding kept hardening after go-live — sign-on accounts were auto-provisioned as claimable, so five entities could ramp without a registration bottleneck.',
        'The defining product decision was a composable routing engine: requesters build each document’s approval chain from a cross-entity directory instead of picking from fixed templates. That freedom is balanced by sequential step locking, an admin view that can halt or resequence a chain mid-flight, and an immutable audit trail — with 11 architecture decision records documenting the trade-offs.',
      ],
      moments: [
        {
          title: 'The compressed design met reality',
          body:
            'A one-day design pass produced field-mapping defects that broke request creation days before the demo. The response was a named, checklisted debug cycle with end-to-end browser verification — the demo date held.',
        },
        {
          title: 'A rebrand landed mid-build',
          body:
            'Entity branding decisions arrived after build start, renaming the product while schema work was in flight. The change was absorbed as one explicit epic — rebrand, schema, and refactor checklists in a single place instead of scattered fixes.',
        },
        {
          title: 'Scope expanded before v1 shipped',
          body:
            'A new chain of financial document types was requested while the first release was still in development. It was captured as a formal phase-two change request with its own implementation plan — protecting the go-live date instead of absorbing the scope.',
        },
        {
          title: 'Eight projects, one team, one date',
          body:
            'The June 30 cluster put eight go-lives on one small team. Portfolio checkpoints ranked this project low-risk by June 5, letting attention flow to the projects actually burning.',
        },
      ],
      sources:
        'Figures from delivery records and repository history; support-ticket count measured August 7, 2026. Internal names generalized for confidentiality.',
    },
    {
      id: 'ai-delivery-platform-case',
      title: 'AI Delivery Platform',
      summary:
        'The internal AI platform behind the delivery numbers on this page — conversational intake, an AI project-management layer, meeting automation, and human-gated automated implementation — built by the team it serves, in the gaps between client projects.',
      stats: [
        { value: '949', label: 'Tickets processed through AI intake' },
        { value: '61', label: 'Users onboarded' },
        { value: '22', label: 'Automated implementation runs' },
        { value: '3', label: 'Days from first commit to first production ticket' },
      ],
      timeline: [
        {
          date: 'Feb',
          title: 'MVP in one sprint',
          detail:
            'A conversational intake chat shipped first; the first real production ticket arrived three days after the first commit.',
        },
        {
          date: 'Feb–Mar',
          title: 'Intake and ticketing core',
          detail:
            'Conversational requirement gathering, automatic ticket classification and drafting, and two-way sync with the delivery tracker.',
        },
        {
          date: 'Apr',
          title: 'The stall',
          detail:
            'Three commits all month: the team’s capacity went to an eight-project go-live cluster. The platform ran untouched on its early core — evidence the foundation was stable.',
        },
        {
          date: 'May',
          title: 'The push',
          detail:
            '365 commits — 64% of all platform activity: model switching, ticket replies, the first automated implementation run, and structured logging as the base for self-monitoring.',
        },
        {
          date: 'Jun',
          title: 'AI project-manager layer',
          detail:
            'A portfolio context engine that drafts the team’s thrice-daily checkpoints, rebuilt for bounded concurrency after a documented bottleneck investigation.',
        },
        {
          date: 'Jul',
          title: 'Automation matured',
          detail:
            'A two-stage plan-and-implement pipeline with three human approval gates, an async deploy queue, and meeting transcription rebuilt after a production failure.',
        },
        {
          date: 'Aug',
          title: 'Steady state',
          detail:
            'A nightly health review parses structured logs and files its own tickets — the platform is now a user of its own front door.',
        },
      ],
      story: [
        'There was no dedicated platform team: the system was built by the delivery team, for the delivery team, between more than twenty business projects — and the commit history shows exactly that. When client go-lives consumed the team in April, the platform ran untouched; when capacity returned in May, 64% of all its code landed in a single month.',
        'There was no big-bang rollout either. Features deploy continuously behind per-worker flags, the users are the operators — dogfooding replaces formal UAT — and an in-app announcement system carries each release to its 61 users. The only dangerous path, AI-written code changes, is guarded by three human approval gates.',
        'The architectural principle throughout: the AI drafts, a human approves, and the system of record is never written without an audit trail. Reads never hit the external tracker live — a webhook-fed local replica cut API usage from an exhausted 2,500-requests-per-hour budget to roughly 72 — and deploys are verified against the target database rather than trusted exit codes.',
      ],
      moments: [
        {
          title: 'Rate limits nearly killed the core integration',
          body:
            'Early sync burned the delivery tracker’s entire 2,500-request-per-hour budget. The fix inverted the architecture — a webhook-fed local replica with a ten-minute reconcile sweep — dropping steady-state usage to about 72 requests an hour.',
        },
        {
          title: 'The flagship froze days after launch',
          body:
            'The AI project-manager layer shipped with a global lock: one long-running conversation froze every other one. A same-day investigation rebuilt it around bounded concurrency with per-conversation exclusivity.',
        },
        {
          title: 'A meeting bot lost a real meeting',
          body:
            'The first transcription architecture silently produced almost nothing from a live session — the kind of failure users discover before you do. It was rebuilt speech-first rather than patched.',
        },
        {
          title: 'A deploy reported success while the feature was absent',
          body:
            'The deploy tooling never installed new modules, so “deployed” could be a lie. The pipeline now verifies installed state in the target database instead of trusting exit codes.',
        },
      ],
      chart: {
        title: 'Platform commits per month, 2026',
        note:
          'The April stall and the May push — the shape of a platform built in the gaps between client projects.',
        unit: 'commits',
        points: [
          { label: 'Feb', value: 35 },
          { label: 'Mar', value: 74 },
          { label: 'Apr', value: 3 },
          { label: 'May', value: 365 },
          { label: 'Jun', value: 52 },
          { label: 'Jul', value: 41 },
          { label: 'Aug', value: 1 },
        ],
      },
      sources:
        'Figures from repository history and production data measured August 15, 2026. Internal names generalized for confidentiality.',
    },
  ],

  // Full delivery portfolio, grouped by domain. Titles are deliberately generalized:
  // the confidentiality guard (forbidden.js) bans internal entity and project names.
  // The internal-name mapping lives OUTSIDE this public repo.
  portfolio: {
    intro:
      'The systems and initiatives behind the numbers above — titles generalized where client confidentiality requires.',
    groups: [
      {
        group: 'ERP & HR Platforms',
        items: [
          {
            title: 'Enterprise ERP Transformation Program',
            role: 'Led',
            desc: 'Org-wide rollout replacing fragmented HR, payroll, accounting, recruitment, helpdesk, and performance processes with connected ERP workflows.',
          },
          {
            title: 'Payroll Implementation — 1,600 Employees',
            role: 'Led',
            desc: 'Payroll rules, leave, statutory contributions, migration, parallel runs, UAT, cutover, and post-launch support.',
          },
          {
            title: 'Central Employee Information System',
            role: 'Led',
            desc: 'Employee profiles, movements, disciplinary cases, exits, and HR reporting feeding every other ERP module.',
          },
          {
            title: 'Performance Management System',
            role: 'Led',
            desc: 'KRAs, appraisals, performance conversations, reports, and PIP workflows for managers, employees, and HR.',
          },
          {
            title: 'ERP Accounting Module',
            role: 'Coordinated',
            desc: 'Financial reports, assets, bills, journal entries, audit access, and specialized reporting corrections.',
          },
          {
            title: 'Employment Agreements Module',
            role: 'Led',
            desc: 'Offer, contract, and agreement-template generation with controlled document access.',
          },
          {
            title: 'HR & Internal Helpdesk',
            role: 'Led',
            desc: 'Structured ticket workflows with team-specific visibility, reporting, exports, FAQs, and resolution tracking.',
          },
          {
            title: 'Performance Evaluation Form Automation',
            role: 'Led',
            desc: 'Digitized evaluation cycle — account setup, submissions, performance conversations, and HR monitoring of the first full cycle.',
          },
          {
            title: 'ERP eLearning Evaluation',
            role: 'Coordinated',
            desc: 'Business evaluation of standard employee-learning features against HR requirements ahead of implementation.',
          },
        ],
      },
      {
        group: 'Recruitment & Onboarding',
        items: [
          {
            title: 'Multi-Company Recruitment Platform',
            role: 'Led',
            desc: 'Manpower requests through Day-1 onboarding, with approval routing, applicant tracking, and strict company-level data isolation.',
          },
          {
            title: 'Recruitment Automation with Executive Email Approvals',
            role: 'Led',
            desc: 'Manpower requests to completed hiring: executive email approvals, external integrations, and candidate-data controls.',
          },
          {
            title: 'ERP Recruitment Module',
            role: 'Led',
            desc: 'Vacancies, applicants, job offers, contracts, and centralized recruitment reporting for HR.',
          },
          {
            title: 'Async Interview Platform',
            role: 'Led',
            desc: 'Candidate interviews without simultaneous availability — end-to-end testing, training, turnover, and rollout.',
          },
        ],
      },
      {
        group: 'Lending & Credit',
        items: [
          {
            title: 'Loan Origination System',
            role: 'Led',
            desc: 'Loan requests, verification, approvals, role-based access, encryption, data masking, and audit trails.',
          },
          {
            title: 'Universal Finance System',
            role: 'Oversight',
            desc: 'Configurable finance platform — customers, loans, charges, amortization, collateral, letters, permissions, and reporting.',
          },
          {
            title: 'Credit Approval Queuing',
            role: 'Led',
            desc: 'Digitized submission, queuing, review, and approval of credit applications with role-specific dashboards.',
          },
          {
            title: 'Nextbank Companion App — Microloan Operations',
            role: 'Oversight',
            desc: 'Loan, payment, and collection workflows: payment-file processing, production tagging, large reports, and health checks.',
          },
          {
            title: 'Nextbank Companion App — Sister Lending Company',
            role: 'Oversight',
            desc: "Companion implementation serving a second lending entity's loan and customer-processing operations.",
          },
          {
            title: 'Nextbank Core Implementation — Sister Lending Company',
            role: 'Oversight',
            desc: "Core lending-platform initiative supporting the entity's loan and customer-management operations.",
          },
          {
            title: 'MSME Credit Risk Framework',
            role: 'Oversight',
            desc: 'Structured evaluation criteria and risk visibility for MSME lending decisions.',
          },
        ],
      },
      {
        group: 'Collections & Recovery',
        items: [
          {
            title: 'Unified Collection Tool',
            role: 'Led',
            desc: 'Consolidated separate collection applications into one platform — development, migration, UAT, parallel testing, rollout.',
          },
          {
            title: 'Collection Queuing System',
            role: 'Led',
            desc: 'Queue for collection requests, swiping, releases, and acknowledgements, integrated with the ATM inventory system.',
          },
          {
            title: 'Collection Automation Platform',
            role: 'Led',
            desc: 'Standardized collection workflow adopted across five operating areas of a microloan product.',
          },
          {
            title: 'Field Collection Tool',
            role: 'Led',
            desc: 'Structured recording of field collection activities, customer interactions, and outcomes.',
          },
          {
            title: 'Tele Collection Tool',
            role: 'Led',
            desc: 'Telecollection follow-ups with centralized monitoring of remote collection work.',
          },
          {
            title: 'Legal & Remedial Case Management',
            role: 'Led',
            desc: 'Centralized case information, actions, and monitoring, pushed through UAT, turnover, and rollout.',
          },
        ],
      },
      {
        group: 'Field & Branch Operations',
        items: [
          {
            title: 'Field Itinerary Management — Uniformed Personnel',
            role: 'Led',
            desc: 'Itineraries, visits, calls, and GPS tracking replacing legacy workflows; offline capability and a stabilized go-live.',
          },
          {
            title: 'Field Itinerary Management — Civilian Personnel',
            role: 'Led',
            desc: 'Itinerary and field-activity management for scheduled client work by civilian staff.',
          },
          {
            title: 'ATM Inventory & Movement Tracking',
            role: 'Coordinated',
            desc: 'Custody, availability, and processing visibility for ATM inventory across the organization.',
          },
          {
            title: 'Local Bank & Passbook Inventory System',
            role: 'Led',
            desc: 'Local-bank records, passbooks, surrendered ATMs, and client-account status handling.',
          },
          {
            title: 'Pouch Receiving System',
            role: 'Led',
            desc: 'Inbound/outbound pouch and item tracking between branches, departments, and the head-office mailroom.',
          },
          {
            title: 'Client Updater',
            role: 'Led',
            desc: 'Client-information updates with visible ownership of update responsibilities; bug resolution and re-adoption.',
          },
          {
            title: 'Online Marketing Representative Automation',
            role: 'Led',
            desc: 'Early-stage automation of the online representative workflow, being moved from idea to defined project.',
          },
        ],
      },
      {
        group: 'Finance Automation',
        items: [
          {
            title: 'Request-for-Payment Automation',
            role: 'Led',
            desc: 'Weekly RFP generation with Accounting validation, covering card-statement expenses with incomplete invoices.',
          },
          {
            title: 'Budget Automation Tool',
            role: 'Oversight',
            desc: 'Automated budget templates, calculations, recasting, branch updates, and consolidated inputs.',
          },
        ],
      },
      {
        group: 'AI & Automation',
        items: [
          {
            title: 'AI Delivery Platform',
            role: 'Led',
            desc: 'AI conversations, ticketing, Linear integration, meeting automation, and automated development workflows for the team.',
          },
          {
            title: 'Smart Improvement Recommendations',
            role: 'Oversight',
            desc: 'AI pipeline analyzing repositories for prioritized code-quality, security, performance, and architecture recommendations.',
          },
          {
            title: 'Zero-Touch Maintenance',
            role: 'Oversight',
            desc: 'AI agents implementing and monitoring selected development issues via GitHub integration, webhooks, and label tracking.',
          },
          {
            title: 'Discord AI Chat Assistant',
            role: 'Oversight',
            desc: 'Departmental AI assistant with personas, worker agents, and project-thread interpretation.',
          },
          {
            title: 'Telegram Assistant Bot',
            role: 'Oversight',
            desc: 'Multi-user Gmail and Calendar assistant with user isolation and security testing.',
          },
          {
            title: 'AI-Powered Development Workflow',
            role: 'Led',
            desc: 'Shared AI tools and practices adopted across the development team.',
          },
          {
            title: 'Spec-Driven Development Practice',
            role: 'Led',
            desc: 'Specification-first development standard so requirements are defined before coding.',
          },
        ],
      },
      {
        group: 'Data & Analytics',
        items: [
          {
            title: 'Executive Scoreboard Dashboard',
            role: 'Led',
            desc: 'Consolidated executive scoreboards with planned Linear, Clockify, and operational data integrations.',
          },
          {
            title: 'Department Delivery Dashboard',
            role: 'Led',
            desc: 'Department-level delivery and performance dashboard feeding the executive view.',
          },
          {
            title: 'Data Loader Automation',
            role: 'Oversight',
            desc: 'Scheduled extraction, file generation, and loading across Postgres, Snowflake, S3, and Google Chat.',
          },
          {
            title: 'Analytics Exchange',
            role: 'Coordinated',
            desc: 'Snowflake validation and analyst capability-building toward self-serve data access.',
          },
          {
            title: 'Snowflake Ecosystem Modernization',
            role: 'Oversight',
            desc: 'Exploration of Cortex, Openflow, cost management, and dashboards to modernize the data platform.',
          },
          {
            title: 'Snowflake Openflow Exploration',
            role: 'Coordinated',
            desc: 'Data-movement exploration connecting operational systems such as the ERP with Snowflake.',
          },
          {
            title: 'Marketing Representative Intelligence',
            role: 'Led',
            desc: 'Employee and release data combined for representative performance monitoring; scoping and MVP planning.',
          },
          {
            title: 'Marketing Representative Productivity Analysis',
            role: 'Led',
            desc: 'Regression analysis linking operational data to representative performance.',
          },
        ],
      },
      {
        group: 'Internal Platforms',
        items: [
          {
            title: 'Greenlight Document Workflow Platform',
            role: 'Led',
            desc: 'Digitized forms, uploads, document types, and department workflows with customized business rules.',
          },
          {
            title: 'Project & Workspace Hub',
            role: 'Coordinated',
            desc: 'Central store of roles, milestones, blockers, decisions, and success measures, aligned with Linear reporting.',
          },
          {
            title: 'Policy Hub',
            role: 'Coordinated',
            desc: 'Company policies, templates, submissions, and approval workflows with structured browsing and access controls.',
          },
          {
            title: 'Team Workspaces Platform',
            role: 'Oversight',
            desc: 'Workspace environment and supporting apps, including sign-in OTP delivery and meeting-app enhancements.',
          },
          {
            title: 'Bucketlist V2 Modernization',
            role: 'Oversight',
            desc: 'Redesigned V2 architecture with testing, migration, user transition, and turnover.',
          },
          {
            title: 'Room & Parking Reservation',
            role: 'Led',
            desc: 'Availability checking and conflict-free reservations for meeting rooms and parking.',
          },
          {
            title: 'Transaction Queuing — Partner Organization',
            role: 'Coordinated',
            desc: "Early business-process scoping for a partner organization's transaction queuing, with the third-party vendor.",
          },
        ],
      },
    ],
  },

  // The PM × Engineer slider. The default sits at the balanced center on
  // purpose: the message is "a PM who operates comfortably close to the
  // engineering side", never "PM or engineer".
  approach: {
    title: 'How I approach software',
    intro:
      'I operate comfortably on both sides of the table — translating business outcomes into delivery decisions, and technical complexity into business outcomes.',
    pm: {
      label: 'Project Manager',
      caption: 'I think in outcomes, constraints, dependencies, and delivery.',
      flow: ['Scope', 'Timeline', 'Risks', 'Stakeholders', 'Dependencies', 'Delivery'],
      points: [
        'Define what success looks like',
        'Align stakeholders and priorities',
        'Manage scope, risks, and dependencies',
        'Keep teams focused on the highest-value work',
        'Make delivery visible and predictable',
      ],
    },
    eng: {
      label: 'Software Engineer',
      caption: 'I understand how the software underneath the project is actually built.',
      flow: ['Architecture', 'APIs', 'Database', 'Components', 'Git', 'Deployment'],
      points: [
        'Understand system architecture',
        'Translate requirements into technical solutions',
        'Understand APIs, databases, and application structure',
        'Work comfortably with developers',
        'Understand Git and software-development workflows',
        'Understand deployment and technical dependencies',
      ],
    },
    bridge: {
      label: 'Where delivery meets engineering',
      caption:
        'Good technical delivery happens when business context and engineering reality are understood together.',
      flow: [
        'Business outcome',
        'Product / requirements',
        'Project delivery',
        'Technical solution',
        'Engineering',
        'Deployment',
        'Measurable outcome',
      ],
    },
    final: {
      lead: 'Not just managing software.\nUnderstanding how to deliver it.',
      sub: "That's the difference between coordinating a technical team and leading technical delivery.",
    },
  },

  principles: [
    'Build systems, not heroics.',
    'Measure outcomes, not activity.',
    'Simplify before scaling.',
    'Use AI to remove repetitive work.',
  ],

  experience: [
    {
      company: 'Oak Drive Ventures Inc.',
      role: 'Digital Transformation Project Manager',
      period: '07/2023 – Present',
      facts: ['22 departments', '1,600+ employees', '65 projects', '5–11 concurrent'],
      points: [
        'Led a cross-functional team of 6 developers, 1 QA, and 1 designer serving 22 departments and 1,600+ employees.',
        'Reported directly to the COO, presenting sprint and portfolio updates to the C-suite and department heads.',
        'Delivered 65 projects end to end over 3 years — intake, prioritization, sprint execution, UAT, change management, and go-live.',
        'Led the transition from traditional project execution to Agile delivery (Scrum), running sprint planning, backlog refinement, and retrospectives.',
        'Reduced developer context switching by centralizing stakeholder intake through an AI-powered ticketing system.',
        'Created executive dashboards in Coda, Gamma, Linear, and a custom app for real-time roadmap, velocity, and sprint visibility.',
        'Improved stakeholder communication through transparent project tracking, sprint updates, and an AI-powered support channel.',
        'Designed wireframes and user flows in Figma, translating business requirements into user-centered technical solutions.',
        'Optimized delivery processes through risk identification, bottleneck analysis, and automation of intake, ticket routing, and backlog administration.',
        'Managed delivery of enterprise applications — HRIS platforms, ERP modules, and collection automation tools — coordinating 3 external vendors (Heliconia, Jeonsoft, Pinfront).',
        'Balanced 5–11 concurrent projects with predictable schedules, documenting each across Coda, Figma, and Gamma.',
      ],
    },
    {
      company: 'TaskUs – SuperBam · Remote',
      role: 'Content Moderator',
      period: '02/2021 – 06/2023',
      points: [
        'Protected and monetized content for high-profile creators through YouTube copyright claim workflows, separating original client content from re-uploaded and pirated copies at daily-ingestion scale.',
        'Specialized in potential and Pex claims to identify and monetize infringement across both trending and long-tail videos.',
        'Coordinated with supervising departments to prioritize takedowns of popular videos being re-uploaded by other channels.',
        'Provided email and technical support for the Skillz gaming platform, resolving user-reported app and game issues.',
      ],
    },
    {
      company: 'EISSS',
      role: 'Project Engineer',
      period: '10/2017 – 01/2021',
      points: [
        'Managed instrumentation and control projects end to end — proposals, design, procurement, installation, and commissioning — for industrial clients including Petron Bataan Refinery, San Miguel (Monterey Foods), Peter Paul Philippines, and South Luzon Power Generation.',
        'Served as single point of contact for clients and suppliers worldwide, assessing plant engineering problems and converting them into 2D and 3D CAD system drawings that aligned clients and contractors.',
        'Prepared full project proposals — scope, material listings, budgets, and drawings — and planned the best-fit solution for each client problem.',
        'Supervised on-site execution: permit-to-work and safety documentation, worker safety monitoring, instrument calibration, and as-built documentation on every completed project.',
        'Performed plant-wide asset verification and system-drawing updates at the Kalayaan Pumped Storage Power Plant.',
        'Built and delivered product presentations, client trainings, and engineering lessons for new sales representatives.',
      ],
    },
    {
      company: 'SJ E&I Inc.',
      role: 'QA/QC Engineer',
      period: '02/2016 – 09/2017',
      points: [
        'Handled instrumentation QA/QC during construction of Unit III at the Team Energy Pagbilao Power Plant.',
        'Raised requests for inspection for cable loop checking and final instrument calibration, and witnessed pre-loop and final loop checks in the DCS.',
        'Documented thousands of pulled, terminated, and loop-tested cables and installed instruments in a plant-wide cable and instrument matrix maintained in Google Sheets.',
      ],
    },
    {
      company: 'Puyat Steel Corporation',
      role: 'PLC/Instrument Technician',
      period: '04/2015 – 01/2016',
      points: [
        'Maintained and repaired PLC-monitored instruments and electrical equipment across the plant, troubleshooting machines during downtime to restore operation.',
        'Performed preventive maintenance of electrical panels, controls, and motor drives; fabricated and hardwired control panels.',
        'Tested new and rewound AC/DC motors and supported maintenance of the main switchboard, generators, air compressors, and plant lighting systems.',
      ],
    },
  ],

  // Real recommendations only. Emmanuel's is paraphrased for length and tone
  // at JC's request (the verbatim original lives on LinkedIn); Ronak's and
  // Lisette's are verbatim; Harrison's was relayed by JC and grammar-fixed.
  recommendations: [
    {
      quote:
        'Working under JC across several projects running at the same time — from field operations tools to an AI-powered automation initiative — was a genuinely good experience. He plans ahead, communicates clearly, and delivers consistently even with a full portfolio in flight. He has a way of turning complex ideas into working solutions.',
      name: 'Emmanuel Louis Gonzaga',
      context: 'Reported to JC directly',
      date: 'December 2024',
    },
    {
      quote:
        'Engr. John Carlo was a great client to work with. He was clear and organized when explaining the requirements, had a good understanding of the overall workflow, and was always easy to communicate with. I also really appreciated his professional and friendly approach throughout the project. It was a smooth and positive experience working with him.',
      name: 'Ronak Viramgama',
      context: 'Python · Odoo Developer — JC was the client',
      date: 'August 2026',
    },
    // Harrison's words relayed by JC 2026-08-15, grammar lightly fixed with
    // meaning preserved — do not embellish further. Dated June 2023: JC's last
    // month at TaskUs, marking the end of the working relationship.
    {
      quote:
        'JC is a good teammate — always dependable and easy to approach. He brings a good working vibe and finishes assigned tasks quickly and accurately.',
      name: 'Harrison Wallace',
      context: 'COO at TaskUs – SuperBam',
      date: 'June 2023',
    },
    {
      quote:
        'JC has the initiative to finish the task in timely manner. He is also a team player and grounded.',
      name: 'Lisette Racoma',
      context: 'Lead, I&C at FDC Utilities Inc. — managed JC directly',
      date: 'April 2023',
    },
  ],

  // The first six are the featured set the collapsed view shows — governance/delivery,
  // AI fluency, the national engineering ranking, and the technical foundation. The
  // rest render behind the See more toggle, newest first, PICS technician closing.
  // Open University display names are approved renames; the official certificate titles
  // are recorded in docs/superpowers/specs/2026-07-31-certifications-expansion-design.md §4.
  certifications: [
    {
      name: 'Project Governance & PMO',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/1J2akTjCZQOMzXbIBFINFLDscFVmZIoOF/view?usp=drive_link',
    },
    {
      name: 'Delivering Successful IT Systems',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/12jz3npwp_0Qj_awXHu4QZTzaG7rq3nqD/view?usp=drive_link',
    },
    {
      name: 'AI Fluency: Framework & Foundations',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/jcisomdtuk9f',
      note: 'jcisomdtuk9f',
    },
    {
      name: 'AI Fluency for Builders',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/k2o4dxyjy3yk',
      note: 'k2o4dxyjy3yk',
    },
    {
      name: 'Certified Instrumentation and Control Engineer',
      issuer: 'Philippine Instrumentation and Control Society',
      date: '2018',
      url: 'https://drive.google.com/file/d/1KQnIfynOvAwnVbk1sjalBO1kvbvwb76j/view?usp=sharing',
      note: 'Ranked 8th of 1,057 examinees',
    },
    {
      name: 'Full Stack Web Development',
      issuer: 'Zuitt Coding Bootcamp',
      date: '2023',
      url: 'https://share.zertify.zuitt.co/certificate/fd382383-216f-4982-93fe-3d748352ce5a/',
      note: 'Enthusiastic Learner Award · DPC-0225-0012',
    },
    {
      name: 'Software Development for Enterprise Systems',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/1NsGfL4E1kTo1Lx2oji-0JdXFN7GQmVJe/view?usp=drive_link',
    },
    {
      name: 'Software Development Approaches',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/1z-3ELbbT9YqJi4wspIyjQBV5sfaMYK3G/view?usp=drive_link',
    },
    {
      name: 'Project Management Essentials',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/1JZ3CQTmsobFWVko5PEmTM7lppoVhjKf8/view?usp=drive_link',
    },
    {
      name: 'Change Management for Hybrid Work',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/1qhRonGRJcJ4YDEn8CtqRx0nWGp1vu6zO/view?usp=drive_link',
    },
    {
      name: 'Managing Virtual Project Teams',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/14ZvcFwPcQPfk5fE69a3Xm2K4GUCfXnA-/view?usp=drive_link',
    },
    // No shareable credential exists for this course; it renders unlinked (spec §2).
    {
      name: 'Agile Project Management',
      issuer: 'Alison',
      date: '2026',
    },
    {
      name: 'AI Capabilities and Limitations',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/fx8zb2jpzmb3',
      note: 'fx8zb2jpzmb3',
    },
    {
      name: 'Model Context Protocol: Advanced Topics',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/x3yhyuej563n',
      note: 'x3yhyuej563n',
    },
    {
      name: 'Claude on Google Cloud',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/3np2qtp8rujt',
      note: '3np2qtp8rujt',
    },
    {
      name: 'Teaching AI Fluency',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/qh73wcpgrf37',
      note: 'qh73wcpgrf37',
    },
    {
      name: 'Object-Oriented Programming with JavaScript',
      issuer: 'Zuitt Coding Bootcamp',
      date: '2023',
      url: 'https://share.zertify.zuitt.co/certificate/4257e147-6505-4714-afd3-4031e2c29855/',
      note: 'DPC-0273-0011',
    },
    {
      name: 'MySQL for MongoDB Developers',
      issuer: 'Zuitt Coding Bootcamp',
      date: '2023',
      url: 'https://share.zertify.zuitt.co/certificate/49b3be22-9145-4117-849e-50b42ef543d8',
      note: 'DPC-0277-0011',
    },
    {
      name: 'Certified Instrumentation and Control Technician',
      issuer: 'Philippine Instrumentation and Control Society',
      date: '2018',
      url: 'https://drive.google.com/file/d/1xjIMN90watG8_hBkIYzvLZZnYpraH6TR/view?usp=sharing',
      note: 'Ranked 11th of 2,089 examinees',
    },
  ],

  // All twelve map to the resume's Skills line — don't add one that doesn't.
  // Each capability carries a one-line proof, sourced from the experience
  // bullets and proof stats above — evidence, not self-assessment.
  capabilities: [
    {
      icon: 'Workflow',
      label: 'Agile Transformation',
      proof: 'Led the shift to Scrum; delivery capacity grew from 2 to 20–28 projects/year.',
    },
    {
      icon: 'GitBranch',
      label: 'Technical Delivery Leadership',
      proof: 'Led 6 developers, 1 QA, and 1 designer across 65 projects delivered end to end.',
    },
    {
      icon: 'Sparkles',
      label: 'AI Workflow Design',
      proof: 'Designed the AI-powered intake, ticketing, and delivery workflows the team runs on.',
    },
    {
      icon: 'Target',
      label: 'Process Optimization',
      proof: 'Automated intake, ticket routing, and backlog administration to cut context switching.',
    },
    {
      icon: 'Database',
      label: 'Enterprise Systems (ERP / HRIS)',
      proof: 'Connected ERP workflows serving 22 departments and 1,600+ employees.',
    },
    {
      icon: 'Users',
      label: 'Cross-Functional Leadership',
      proof: 'Balanced 5–11 concurrent projects across departments with predictable schedules.',
    },
    {
      icon: 'Layers',
      label: 'Portfolio & Program Governance',
      proof: 'Real-time roadmap, velocity, and sprint visibility across the whole portfolio.',
    },
    {
      icon: 'Briefcase',
      label: 'Vendor Management',
      proof: 'Coordinated three external vendors across enterprise application delivery.',
    },
    {
      icon: 'Handshake',
      label: 'Stakeholder Management',
      proof: 'Centralized stakeholder intake through an AI-powered ticketing system.',
    },
    {
      icon: 'LineChart',
      label: 'Executive Reporting',
      proof: 'Reported directly to the COO; sprint and portfolio updates to the C-suite.',
    },
    {
      icon: 'RefreshCw',
      label: 'Change Management',
      proof: 'UAT, training, cutover, and post-launch support on every rollout.',
    },
    {
      icon: 'ShieldAlert',
      label: 'Risk & Dependency Management',
      proof: 'Risk identification and bottleneck analysis built into delivery planning.',
    },
  ],

  tools: [
    {
      group: 'Delivery',
      items: ['Jira', 'Linear', 'Coda', 'ClickUp', 'Monday', 'Asana', 'Trello', 'Notion', 'Azure DevOps'],
    },
    {
      group: 'Enterprise Systems',
      items: ['Odoo ERP', 'Google Workspace', 'Microsoft 365', 'SharePoint'],
    },
    { group: 'CRM & Automation', items: ['HubSpot', 'GoHighLevel', 'Power Automate'] },
    { group: 'Design', items: ['Figma', 'Balsamiq', 'Canva', 'Adobe Creative Cloud', 'CapCut'] },
    {
      group: 'Engineering & Cloud',
      items: [
        'Git',
        'GitHub',
        'Vercel',
        'React',
        'Vite',
        'Node.js',
        'Laravel',
        'MongoDB',
        'MySQL',
        'Snowflake',
        'AWS',
        'DigitalOcean',
        'Contabo',
        'PostHog',
      ],
    },
    {
      group: 'AI',
      items: [
        'Claude',
        'Cursor',
        'ChatGPT',
        'Gemini',
        'Codex',
        'OpenCode',
        'Grok',
        'ElevenLabs',
        'Higgsfield',
        'Gamma',
      ],
    },
  ],

  // Three-beat story approved by JC 2026-08-15: pivot years left implied, no
  // location on the site (both deliberate — don't "complete" them).
  about: {
    story: [
      {
        title: 'The engineer',
        body:
          'I started in industrial control systems — a licensed Instrumentation & Control Engineer, ranked 8th of 1,057 nationally, spending five years inspecting and commissioning control systems in plants and factories. That is where I learned that systems fail at their interfaces, and that a checklist beats a hero.',
      },
      {
        title: 'The pivot',
        body:
          'In 2023 I retrained as a full-stack developer — a deliberate reinvention, not a detour. I wanted to build the systems, not just inspect them. That same year I joined Oak Drive Ventures to lead digital transformation.',
      },
      {
        title: 'The delivery leader',
        body:
          'Today I run software delivery for a team of six developers, one QA, and one designer serving 22 departments and 1,600+ employees, reporting to the COO. My job is the delivery system itself: Agile cadence, AI-powered workflows, and process design that took the team from 2 projects a year to 20–28.',
      },
    ],
    facts: [
      'Licensed I&C Engineer — ranked 8th of 1,057',
      '10+ years engineering & software delivery',
      '65 projects shipped end to end since 2023',
      'Reports to the COO · 22 departments served',
    ],
  },

  // Deliberately NOT a job-search announcement: JC is employed and the site is
  // public. Availability stays implied; the section is an open door.
  availability: {
    heading: "Let's talk",
    body: 'The fastest way to reach me is email. Whether you want to compare notes on delivery systems, dig into how one of the case studies was run, or explore working together — my inbox is open.',
  },

  contact: {
    email: 'mrjcdelizo@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jcdelizo/',
    resume: RESUME_PDF,
    resumeFilename: RESUME_FILENAME,
  },

  footer: `© ${new Date().getFullYear()} JC Delizo`,
}
