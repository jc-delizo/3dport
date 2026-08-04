export const site = {
  meta: {
    title: 'JC Delizo | Digital Transformation Project Manager',
    description:
      'Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design.',
    url: 'https://jc-delizo.github.io/3dport/',
    ogImage: 'https://jc-delizo.github.io/3dport/og.png',
  },

  nav: [
    { id: 'initiatives', label: 'Initiatives' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'principles', label: 'Principles' },
    { id: 'experience', label: 'Experience' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ],

  hero: {
    name: 'JC Delizo',
    title: 'Digital Transformation Project Manager',
    claim: 'I help organizations deliver software faster by transforming the way teams work.',
    support:
      'Increased software delivery capacity from 2 systems/year to 20–28 projects/year through Agile, AI-powered workflows, and scalable delivery systems.',
    primaryCta: { label: 'View Initiatives', href: '#initiatives' },
    secondaryCtas: [
      {
        label: 'Download Résumé',
        href: 'https://drive.google.com/file/d/1qXS39D5IIhlsfCpolatVm3pR00pEsW0F/view?usp=sharing',
      },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jcdelizo/' },
    ],
  },

  // Career arc, shown as the typographic row under the hero CTAs. Replaced the old
  // method pipeline (Business → Process → System → Team → Outcome), which duplicated
  // what the Principles section and the Initiatives already demonstrate.
  pipeline: ['Digital Transformation PM', 'Scrum Master', 'Technical Product Leader'],

  proof: [
    { value: '10×', label: 'Increase in delivery capacity' },
    { value: '20–28', label: 'Projects delivered per year' },
    { value: '15', label: 'Enterprise systems live in production' },
  ],

  initiatives: [
    {
      id: 'scaling-delivery',
      category: 'Delivery Transformation',
      title: 'Scaling Software Delivery',
      problem:
        'The digital transformation team could deliver only about two enterprise systems a year. Planning was inconsistent, workflows were fragmented, and there was no shared visibility into delivery status.',
      approach: [
        'Introduced Scrum with sprint planning, backlog refinement, and delivery metrics.',
        'Standardized intake and prioritization across all requesting business functions.',
        'Introduced AI-assisted workflows to remove repetitive coordination work.',
        'Made delivery status visible to executives through live dashboards.',
        'Evolved the tooling deliberately rather than all at once: traditional project management to Scrum, documentation standardized in Coda, execution tracking migrated to Linear, AI automation layered on last.',
      ],
      outcome:
        'Delivery capacity increased from roughly 2 systems per year to 20–28 projects per year, while delivery schedules stayed predictable.',
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
    {
      id: 'approval-platform',
      category: 'Approval Systems',
      title: 'Multi-Entity Approval Workflow Platform',
      problem:
        'Operational and financial approvals — travel, repairs, project execution, asset management — ran on email and paper across five corporate entities. Routing was inconsistent, no two departments approved the same way, and nothing was auditable.',
      approach: [
        'Specified a multi-tenant data model scoping every user and document to its corporate entity, so cross-entity routing and segment reporting were possible at all.',
        'Designed a dynamic routing engine: instead of fixed templates, a requester composes the approval chain per document, selecting approvers from a global directory and tagging each with an action type.',
        'Enforced strict sequential locking, so a step cannot act until the preceding step completes, with drag-and-drop ordering at composition time.',
        'Balanced that freedom with safeguards: an admin view that can halt, reorder, or inject approvers mid-flight; a return-for-correction path; and an immutable audit trail of every action and change.',
        'Added single sign-on with automatic provisioning of claimable accounts and a first-run onboarding flow.',
      ],
      outcome:
        'Replaced ad-hoc approvals across five corporate entities with a single auditable platform. Currently in user training ahead of rollout.',
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
            role: 'Coordinated',
            desc: 'KRAs, appraisals, performance conversations, reports, and PIP workflows for managers, employees, and HR.',
          },
          {
            title: 'ERP Accounting Module',
            role: 'Coordinated',
            desc: 'Financial reports, assets, bills, journal entries, audit access, and specialized reporting corrections.',
          },
          {
            title: 'Employment Agreements Module',
            role: 'Coordinated',
            desc: 'Offer, contract, and agreement-template generation with controlled document access.',
          },
          {
            title: 'HR & Internal Helpdesk',
            role: 'Coordinated',
            desc: 'Structured ticket workflows with team-specific visibility, reporting, exports, FAQs, and resolution tracking.',
          },
          {
            title: 'Performance Evaluation Form Automation',
            role: 'Coordinated',
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
            role: 'Coordinated',
            desc: 'Manpower requests to completed hiring: executive email approvals, external integrations, and candidate-data controls.',
          },
          {
            title: 'ERP Recruitment Module',
            role: 'Coordinated',
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
            title: 'Universal Finance System',
            role: 'Oversight',
            desc: 'Configurable finance platform — customers, loans, charges, amortization, collateral, letters, permissions, and reporting.',
          },
          {
            title: 'Loan Origination System',
            role: 'Oversight',
            desc: 'Loan requests, verification, approvals, role-based access, encryption, data masking, and audit trails.',
          },
          {
            title: 'Credit Approval Queuing',
            role: 'Coordinated',
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
            role: 'Coordinated',
            desc: 'Standardized collection workflow adopted across five operating areas of a microloan product.',
          },
          {
            title: 'Field Collection Tool',
            role: 'Oversight',
            desc: 'Structured recording of field collection activities, customer interactions, and outcomes.',
          },
          {
            title: 'Tele Collection Tool',
            role: 'Coordinated',
            desc: 'Telecollection follow-ups with centralized monitoring of remote collection work.',
          },
          {
            title: 'Legal & Remedial Case Management',
            role: 'Oversight',
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
            role: 'Coordinated',
            desc: 'Itinerary and field-activity management for scheduled client work by civilian staff.',
          },
          {
            title: 'ATM Inventory & Movement Tracking',
            role: 'Coordinated',
            desc: 'Custody, availability, and processing visibility for ATM inventory across the organization.',
          },
          {
            title: 'Local Bank & Passbook Inventory System',
            role: 'Coordinated',
            desc: 'Local-bank records, passbooks, surrendered ATMs, and client-account status handling.',
          },
          {
            title: 'Pouch Receiving System',
            role: 'Oversight',
            desc: 'Inbound/outbound pouch and item tracking between branches, departments, and the head-office mailroom.',
          },
          {
            title: 'Client Updater',
            role: 'Coordinated',
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
            role: 'Coordinated',
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
            role: 'Coordinated',
            desc: 'Shared AI tools and practices adopted across the development team.',
          },
          {
            title: 'Spec-Driven Development Practice',
            role: 'Coordinated',
            desc: 'Specification-first development standard so requirements are defined before coding.',
          },
        ],
      },
      {
        group: 'Data & Analytics',
        items: [
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
            title: 'Executive Scoreboard Dashboard',
            role: 'Oversight',
            desc: 'Consolidated executive scoreboards with planned Linear, Clockify, and operational data integrations.',
          },
          {
            title: 'Department Delivery Dashboard',
            role: 'Coordinated',
            desc: 'Department-level delivery and performance dashboard feeding the executive view.',
          },
          {
            title: 'Marketing Representative Intelligence',
            role: 'Coordinated',
            desc: 'Employee and release data combined for representative performance monitoring; scoping and MVP planning.',
          },
          {
            title: 'Marketing Representative Productivity Analysis',
            role: 'Oversight',
            desc: 'Regression analysis linking operational data to representative performance.',
          },
        ],
      },
      {
        group: 'Internal Platforms',
        items: [
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
            title: 'Greenlight Document Workflow Platform',
            role: 'Coordinated',
            desc: 'Digitized forms, uploads, document types, and department workflows with customized business rules.',
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
            role: 'Oversight',
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
      points: [
        'Led a cross-functional team of 6 developers, 1 QA, and 1 designer serving 22 departments and 1,600+ employees.',
        'Reported directly to the COO, presenting sprint and portfolio updates to the C-suite and department heads.',
        'Delivered 65 systems end to end over 3 years — intake, prioritization, sprint execution, UAT, change management, and go-live.',
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
        'Protected and monetized content for high-profile creators through copyright claim workflows.',
        'Specialized in potential and Pex claims to identify infringement at scale.',
        'Supported creator transitions onto new platforms.',
      ],
    },
    {
      company: 'EISSS',
      role: 'Project Engineer',
      period: '10/2017 – 01/2021',
      points: [
        'Assessed complex engineering systems across plants and factories.',
        'Produced CAD documentation used to align clients and contractors.',
        'Diagnosed issues and delivered practical engineering solutions.',
      ],
    },
    {
      company: 'SJ E&I Inc.',
      role: 'QA/QC Engineer',
      period: '02/2016 – 09/2017',
      points: [
        'Conducted pre-loop and final loop inspections for DCS systems.',
        'Ensured compliance with safety and quality standards.',
        'Identified issues early to protect project delivery schedules.',
      ],
    },
  ],

  // Verbatim LinkedIn recommendations. Emmanuel's names internal project names
  // (FCT, Bucketlist, IMU, RFP Builder) — his own public words, quoted and attributed,
  // not a fresh disclosure by JC. Trim them if that ever becomes a concern.
  recommendations: [
    {
      quote:
        'I strongly recommend Engr. John Carlo Delizo as a Project Manager. Despite leading multiple projects simultaneously — including FCT (Field Collection Tool), Bucketlist, IMU (Itinerary Manager Uniformed) for field staff tracking, and the AI-powered RFP Builder Automation — he consistently delivers high-quality results through exceptional leadership, strategic planning, and flawless execution. His ability to turn complex ideas into successful solutions makes him an outstanding leader.',
      name: 'Emmanuel Louis Gonzaga',
      context: 'Reported to JC directly',
      date: 'July 2026',
    },
    {
      quote:
        'JC has the initiative to finish the task in timely manner. He is also a team player and grounded.',
      name: 'Lisette Racoma',
      context: 'Lead, I&C at FDC Utilities Inc. — managed JC directly',
      date: 'April 2023',
    },
  ],

  // Sorted newest first: the July 2026 delivery/AI certifications are the most
  // role-relevant, the 2018 PICS national-ranking pair closes the list.
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
      name: 'Delivering Successful IT Systems',
      issuer: 'The Open University',
      date: '2026',
      url: 'https://drive.google.com/file/d/12jz3npwp_0Qj_awXHu4QZTzaG7rq3nqD/view?usp=drive_link',
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
      name: 'Full Stack Web Development',
      issuer: 'Zuitt Coding Bootcamp',
      date: '2023',
      url: 'https://share.zertify.zuitt.co/certificate/fd382383-216f-4982-93fe-3d748352ce5a/',
      note: 'Enthusiastic Learner Award · DPC-0225-0012',
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
      name: 'Certified Instrumentation and Control Engineer',
      issuer: 'Philippine Instrumentation and Control Society',
      date: '2018',
      url: 'https://drive.google.com/file/d/1KQnIfynOvAwnVbk1sjalBO1kvbvwb76j/view?usp=sharing',
      note: 'Ranked 8th of 1,057 examinees',
    },
    {
      name: 'Certified Instrumentation and Control Technician',
      issuer: 'Philippine Instrumentation and Control Society',
      date: '2018',
      url: 'https://drive.google.com/file/d/1xjIMN90watG8_hBkIYzvLZZnYpraH6TR/view?usp=sharing',
      note: 'Ranked 11th of 2,089 examinees',
    },
  ],

  capabilities: [
    { icon: 'Workflow', label: 'Agile Transformation' },
    { icon: 'GitBranch', label: 'Technical Delivery Leadership' },
    { icon: 'Sparkles', label: 'AI Workflow Design' },
    { icon: 'Target', label: 'Process Optimization' },
    { icon: 'Database', label: 'Enterprise Systems (ERP / HRIS)' },
    { icon: 'Users', label: 'Cross-Functional Leadership' },
  ],

  tools: [
    {
      group: 'Delivery',
      items: ['Jira', 'Linear', 'Coda', 'ClickUp', 'Monday', 'Asana', 'Trello', 'Notion', 'Azure DevOps'],
    },
    { group: 'Enterprise Systems', items: ['Odoo ERP', 'Google Workspace'] },
    { group: 'Design', items: ['Figma', 'Balsamiq'] },
    { group: 'Development', items: ['Git', 'GitHub', 'Vercel'] },
    { group: 'AI', items: ['Claude', 'Cursor', 'ChatGPT', 'Gemini', 'Codex'] },
  ],

  about:
    "I'm a Digital Transformation Project Manager with an engineering background and 10+ years across engineering and software delivery. I specialize in redesigning software delivery systems through Agile, AI-powered workflows, and operational process design — improving throughput without relying solely on additional resources.",

  availability: {
    heading: 'Currently exploring new opportunities',
    body: "I'm currently employed and selectively exploring Digital Transformation Manager and Technical Program / Delivery Manager opportunities where I can help organizations improve software delivery, operational efficiency, and cross-functional execution.",
  },

  contact: {
    email: 'mrjcdelizo@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jcdelizo/',
    resume:
      'https://drive.google.com/file/d/1qXS39D5IIhlsfCpolatVm3pR00pEsW0F/view?usp=sharing',
  },

  footer: `© ${new Date().getFullYear()} JC Delizo`,
}
