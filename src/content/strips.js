import { slug } from '../lib/slug'

// PM → System → Outcome strips for the Projects Delivered modal, keyed by the
// entry's slug. Content is decomposed from the same sanitized descriptions the
// list shows — no new facts, no invented figures; outcomes stay qualitative
// unless a number already exists elsewhere on the site. The payroll entry has
// no strip on purpose (the project is on hold), so its row stays plain.
const s = (title, strip) => [slug(title), strip]

export const strips = Object.fromEntries([
  // ERP & HR Platforms
  s('Enterprise ERP Transformation Program', {
    problem: 'HR, payroll, accounting, recruitment, helpdesk, and performance ran on fragmented, disconnected processes.',
    actions: ['Program scoping & phasing', 'Requirements per module', 'Vendor coordination', 'UAT & change management', 'Phased go-lives'],
    system: 'Connected ERP platform — HRIS, payroll, accounting, recruitment, helpdesk, performance',
    outcome: 'One connected system of record serving 22 departments and 1,600+ employees.',
  }),
  s('Central Employee Information System', {
    problem: 'No central employee record existed to feed HR and ERP processes.',
    actions: ['Requirements & data structure', 'Migration planning', 'UAT', 'Rollout to HR'],
    system: 'Central HRIS employee-information module',
    outcome: 'A single employee record — profiles, movements, cases, exits — feeding every other ERP module.',
  }),
  s('Performance Management System', {
    problem: 'KRAs, appraisals, and PIP workflows were not managed in one system.',
    actions: ['Workflow design with HR', 'Role-based flows for managers, employees & HR', 'UAT & training', 'Go-live'],
    system: 'ERP performance-management module',
    outcome: 'Appraisals, performance conversations, reports, and PIP workflows running in one place.',
  }),
  s('ERP Accounting Module', {
    problem: 'Financial reporting and bookkeeping had to move into the ERP with audit-ready controls.',
    actions: ['Scope & requirements coordination', 'Finance stakeholder alignment', 'Review & acceptance'],
    system: 'ERP accounting module',
    outcome: 'Financial reports, assets, bills, and journal entries handled in the ERP with audit access.',
  }),
  s('Employment Agreements Module', {
    problem: 'Offers, contracts, and agreement templates needed controlled, repeatable generation.',
    actions: ['Template & access requirements', 'Workflow design', 'UAT', 'Go-live'],
    system: 'ERP employment-agreements module',
    outcome: 'Offer, contract, and template generation with controlled document access.',
  }),
  s('HR & Internal Helpdesk', {
    problem: 'HR and internal requests arrived without structure, visibility, or tracking.',
    actions: ['Ticket workflow design', 'Team-specific visibility rules', 'UAT', 'Rollout'],
    system: 'ERP helpdesk module',
    outcome: 'Structured ticket workflows with reporting, exports, FAQs, and resolution tracking.',
  }),
  s('Performance Evaluation Form Automation', {
    problem: 'The evaluation cycle ran on manual forms.',
    actions: ['Cycle digitization plan', 'Account setup & submissions flow', 'HR monitoring setup'],
    system: 'Digitized evaluation workflow',
    outcome: 'First full evaluation cycle completed digitally with HR monitoring.',
  }),
  s('ERP eLearning Evaluation', {
    problem: 'HR had to know whether standard employee-learning features fit its requirements before committing.',
    actions: ['Requirements comparison', 'Stakeholder review sessions', 'Recommendation'],
    system: 'ERP eLearning module (evaluated)',
    outcome: 'Business fit assessed against HR requirements ahead of implementation.',
  }),

  // Recruitment & Onboarding
  s('Multi-Company Recruitment Platform', {
    problem: 'Hiring across multiple companies had no single flow from manpower request to Day-1 onboarding.',
    actions: ['Approval-routing design', 'Company-level data isolation rules', 'UAT', 'Rollout'],
    system: 'Multi-company recruitment platform',
    outcome: 'Manpower request through Day-1 onboarding in one tracked flow with strict data isolation.',
  }),
  s('Recruitment Automation with Executive Email Approvals', {
    problem: 'Hiring approvals depended on executives working outside the system.',
    actions: ['Email-approval flow design', 'External integrations', 'Candidate-data controls', 'UAT'],
    system: 'Recruitment automation platform',
    outcome: 'Executives approve directly from email; hiring runs end to end with candidate-data controls.',
  }),
  s('ERP Recruitment Module', {
    problem: 'Vacancies, applicants, and offers were tracked outside the ERP.',
    actions: ['Module requirements', 'Reporting design with HR', 'UAT', 'Go-live'],
    system: 'ERP recruitment module',
    outcome: 'Vacancies, applicants, job offers, and contracts with centralized recruitment reporting.',
  }),
  s('Async Interview Platform', {
    problem: 'Interviews required interviewer and candidate to be available at the same time.',
    actions: ['End-to-end testing', 'Interviewer training', 'Turnover', 'Rollout'],
    system: 'Asynchronous interview platform',
    outcome: 'Candidates interview without simultaneous availability.',
  }),

  // Lending & Credit
  s('Loan Origination System', {
    problem: 'Loan requests and approvals needed digitization with strict data protection.',
    actions: ['Role-based access design', 'Encryption, masking & audit requirements', 'UAT', 'Go-live'],
    system: 'Loan origination system',
    outcome: 'Requests, verification, and approvals run digitally with encryption, masking, and audit trails.',
  }),
  s('Universal Finance System', {
    problem: 'Lending operations needed one configurable platform instead of per-product builds.',
    actions: ['Delivery governance', 'Milestone & risk tracking', 'Review checkpoints'],
    system: 'Configurable finance platform',
    outcome: 'Customers, loans, charges, amortization, collateral, letters, permissions, and reporting — one platform.',
  }),
  s('Credit Approval Queuing', {
    problem: 'Credit applications moved through manual submission and review.',
    actions: ['Queue & review workflow design', 'Role-specific dashboards', 'UAT', 'Rollout'],
    system: 'Credit approval queuing system',
    outcome: 'Submission, queuing, review, and approval digitized with role-specific dashboards.',
  }),
  s('Nextbank Companion App — Microloan Operations', {
    problem: 'Microloan operations needed loan, payment, and collection workflows around the core system.',
    actions: ['Delivery governance', 'Milestone & risk tracking', 'Review checkpoints'],
    system: 'Nextbank companion application',
    outcome: 'Payment-file processing, production tagging, large reports, and health checks in operation.',
  }),
  s('Nextbank Companion App — Sister Lending Company', {
    problem: 'A second lending entity needed the same companion capabilities.',
    actions: ['Delivery governance', 'Cross-entity alignment', 'Review checkpoints'],
    system: 'Nextbank companion application (second entity)',
    outcome: "Companion implementation serving the entity's loan and customer processing.",
  }),
  s('Nextbank Core Implementation — Sister Lending Company', {
    problem: "The entity's loan and customer management needed a core lending platform.",
    actions: ['Delivery governance', 'Milestone & risk tracking', 'Vendor coordination'],
    system: 'Nextbank core lending platform',
    outcome: "Core-platform initiative supporting the entity's loan and customer-management operations.",
  }),
  s('MSME Credit Risk Framework', {
    problem: 'MSME lending decisions lacked structured evaluation criteria.',
    actions: ['Framework governance', 'Criteria review', 'Risk-visibility checkpoints'],
    system: 'MSME credit risk framework',
    outcome: 'Structured evaluation criteria and risk visibility for MSME lending decisions.',
  }),

  // Collections & Recovery
  s('Unified Collection Tool', {
    problem: 'Collection work was split across separate applications.',
    actions: ['Consolidation scoping', 'Data migration', 'Parallel testing & UAT', 'Rollout'],
    system: 'Unified collection platform',
    outcome: 'Separate collection applications consolidated into one platform.',
  }),
  s('Collection Queuing System', {
    problem: 'Collection requests, releases, and acknowledgements had no queue or inventory link.',
    actions: ['Queue workflow design', 'ATM-inventory integration', 'UAT', 'Rollout'],
    system: 'Collection queuing system',
    outcome: 'Queued requests, swiping, releases, and acknowledgements integrated with ATM inventory.',
  }),
  s('Collection Automation Platform', {
    problem: 'Five operating areas of a microloan product each collected differently.',
    actions: ['Workflow standardization', 'Area-by-area adoption', 'UAT', 'Rollout'],
    system: 'Collection automation platform',
    outcome: 'One standardized collection workflow adopted across all five operating areas.',
  }),
  s('Field Collection Tool', {
    problem: 'Field collection activities were not recorded in any structured way.',
    actions: ['Recording workflow design', 'Field UAT', 'Rollout'],
    system: 'Field collection tool',
    outcome: 'Field activities, customer interactions, and outcomes recorded in structure.',
  }),
  s('Tele Collection Tool', {
    problem: 'Remote collection follow-ups had no centralized monitoring.',
    actions: ['Follow-up workflow design', 'Monitoring setup', 'UAT', 'Rollout'],
    system: 'Telecollection tool',
    outcome: 'Telecollection follow-ups centrally monitored.',
  }),
  s('Legal & Remedial Case Management', {
    problem: 'Case information, actions, and status lived outside a central system.',
    actions: ['Case workflow design', 'UAT', 'Turnover', 'Rollout'],
    system: 'Legal & remedial case-management system',
    outcome: 'Centralized case information, actions, and monitoring in production.',
  }),

  // Field & Branch Operations
  s('Field Itinerary Management — Uniformed Personnel', {
    problem: 'Itineraries, visits, and calls ran on legacy workflows with no offline support.',
    actions: ['Workflow replacement plan', 'Offline-capability requirements', 'UAT', 'Go-live stabilization'],
    system: 'Field itinerary management platform',
    outcome: 'GPS-tracked field work with offline capability and a stabilized go-live.',
  }),
  s('Field Itinerary Management — Civilian Personnel', {
    problem: 'Scheduled client work by civilian staff needed the same managed itineraries.',
    actions: ['Requirements adaptation', 'UAT', 'Rollout'],
    system: 'Field itinerary management (civilian)',
    outcome: 'Itinerary and field-activity management for civilian staff.',
  }),
  s('ATM Inventory & Movement Tracking', {
    problem: 'Custody and movement of ATM inventory lacked visibility.',
    actions: ['Scope coordination', 'Stakeholder alignment', 'Review & acceptance'],
    system: 'ATM inventory & movement tracking system',
    outcome: 'Custody, availability, and processing visible across the organization.',
  }),
  s('Local Bank & Passbook Inventory System', {
    problem: 'Local-bank records, passbooks, and surrendered ATMs were handled without a system.',
    actions: ['Inventory workflow design', 'UAT', 'Rollout'],
    system: 'Local bank & passbook inventory system',
    outcome: 'Records, passbooks, surrendered ATMs, and client-account status handled in one system.',
  }),
  s('Pouch Receiving System', {
    problem: 'Pouches moving between branches and head office were hard to trace.',
    actions: ['Tracking workflow design', 'UAT', 'Rollout'],
    system: 'Pouch receiving system',
    outcome: 'Inbound and outbound items tracked between branches, departments, and the mailroom.',
  }),
  s('Client Updater', {
    problem: 'Client-information updates had no visible ownership.',
    actions: ['Ownership model design', 'Bug resolution', 'Re-adoption push'],
    system: 'Client updater tool',
    outcome: 'Updates carry visible ownership; the tool was fixed and re-adopted.',
  }),
  s('Online Marketing Representative Automation', {
    problem: 'The online representative workflow existed only as an idea.',
    actions: ['Discovery', 'Process definition', 'Project scoping'],
    system: 'Online representative workflow (early stage)',
    outcome: 'Moved from idea to a defined project.',
  }),

  // Finance Automation
  s('Request-for-Payment Automation', {
    problem: 'Weekly RFPs for card-statement expenses were assembled around incomplete invoices.',
    actions: ['Generation workflow design', 'Accounting validation flow', 'UAT'],
    system: 'RFP automation',
    outcome: 'RFPs generated weekly with Accounting validation.',
  }),
  s('Budget Automation Tool', {
    problem: 'Budget templates, recasting, and branch inputs were assembled manually.',
    actions: ['Delivery governance', 'Milestone tracking', 'Review checkpoints'],
    system: 'Budget automation tool',
    outcome: 'Templates, calculations, recasting, branch updates, and consolidation automated.',
  }),

  // AI & Automation
  s('AI Delivery Platform', {
    problem: 'Stakeholder requests interrupted developers across scattered channels.',
    actions: ['Platform scoping', 'AI-phased build framework', 'Daily checkpoints & triage', 'Team rollout'],
    system: 'AI delivery platform — conversations, ticketing, Linear integration, meeting automation',
    outcome: 'Structured AI-powered intake and automated development workflows running for the team.',
  }),
  s('Smart Improvement Recommendations', {
    problem: 'Repository health had no automated review.',
    actions: ['Pipeline governance', 'Prioritization criteria', 'Review checkpoints'],
    system: 'AI repository-analysis pipeline',
    outcome: 'Prioritized code-quality, security, performance, and architecture recommendations.',
  }),
  s('Zero-Touch Maintenance', {
    problem: 'Selected development issues waited on engineer availability.',
    actions: ['Agent-scope governance', 'GitHub integration oversight', 'Monitoring checkpoints'],
    system: 'AI maintenance agents — GitHub integration, webhooks, label tracking',
    outcome: 'AI agents implementing and monitoring selected issues.',
  }),
  s('Discord AI Chat Assistant', {
    problem: 'Departments needed an assistant that understood their own project threads.',
    actions: ['Persona & scope governance', 'Review checkpoints'],
    system: 'Departmental AI assistant with worker agents',
    outcome: 'Personas, worker agents, and project-thread interpretation in use.',
  }),
  s('Telegram Assistant Bot', {
    problem: 'Gmail and Calendar assistance had to serve multiple users without mixing their data.',
    actions: ['Isolation requirements', 'Security-testing oversight', 'Review checkpoints'],
    system: 'Multi-user Telegram assistant',
    outcome: 'Multi-user assistant with user isolation, security-tested.',
  }),
  s('AI-Powered Development Workflow', {
    problem: 'AI tooling use varied by developer, with no shared practice.',
    actions: ['Tool selection', 'Practice definition', 'Team adoption'],
    system: 'Shared AI development toolkit',
    outcome: 'Shared AI tools and practices adopted across the development team.',
  }),
  s('Spec-Driven Development Practice', {
    problem: 'Coding could start before requirements were pinned down.',
    actions: ['Standard definition', 'Template rollout', 'Adoption tracking'],
    system: 'Specification-first development standard',
    outcome: 'Requirements defined before coding, as standard practice.',
  }),

  // Data & Analytics
  s('Executive Scoreboard Dashboard', {
    problem: 'Executives lacked one consolidated view of delivery and operations.',
    actions: ['Scoreboard requirements', 'Integration planning', 'Executive review cycles'],
    system: 'Consolidated executive scoreboards',
    outcome: 'Consolidated scoreboards, with Linear, Clockify, and operational integrations planned.',
  }),
  s('Department Delivery Dashboard', {
    problem: 'Department-level delivery had no dashboard feeding the executive view.',
    actions: ['Metric definition', 'Dashboard build coordination', 'Review'],
    system: 'Department delivery dashboard',
    outcome: 'Department delivery and performance feeding the executive view.',
  }),
  s('Data Loader Automation', {
    problem: 'Data movement between systems was manual and unscheduled.',
    actions: ['Pipeline governance', 'Schedule & scope review', 'Checkpoints'],
    system: 'Scheduled data-loading pipeline',
    outcome: 'Scheduled extraction, file generation, and loading across Postgres, Snowflake, S3, and Google Chat.',
  }),
  s('Analytics Exchange', {
    problem: 'Analysts depended on others for data access.',
    actions: ['Validation coordination', 'Capability-building sessions'],
    system: 'Snowflake analytics environment',
    outcome: 'Snowflake validated and analyst capability built toward self-serve access.',
  }),
  s('Snowflake Ecosystem Modernization', {
    problem: "The data platform's next step was unmapped.",
    actions: ['Exploration governance', 'Option review'],
    system: 'Snowflake — Cortex, Openflow, cost management, dashboards',
    outcome: 'Modernization options explored across the ecosystem.',
  }),
  s('Snowflake Openflow Exploration', {
    problem: 'Operational systems and Snowflake lacked a defined data-movement path.',
    actions: ['Exploration coordination', 'ERP-connection review'],
    system: 'Snowflake Openflow',
    outcome: 'Data movement connecting operational systems with Snowflake explored.',
  }),
  s('Marketing Representative Intelligence', {
    problem: 'Representative performance monitoring had no combined data foundation.',
    actions: ['Data-source scoping', 'MVP planning'],
    system: 'Representative intelligence platform (scoping)',
    outcome: 'Employee and release data combined; MVP planned.',
  }),
  s('Marketing Representative Productivity Analysis', {
    problem: 'The link between operational data and representative performance was unquantified.',
    actions: ['Data preparation', 'Regression analysis', 'Findings review'],
    system: 'Regression analysis of operational data',
    outcome: 'Operational data linked to representative performance.',
  }),

  // Internal Platforms
  s('Greenlight Document Workflow Platform', {
    problem: 'Department forms and document approvals ran on manual handling.',
    actions: ['Form digitization', 'Business-rule customization per department', 'UAT', 'Rollout'],
    system: 'Greenlight document workflow platform',
    outcome: 'Digitized forms, uploads, document types, and department workflows in production.',
  }),
  s('Project & Workspace Hub', {
    problem: 'Roles, milestones, blockers, and decisions were scattered across documents.',
    actions: ['Structure coordination', 'Linear-reporting alignment', 'Review'],
    system: 'Project & workspace hub',
    outcome: 'Central store of roles, milestones, blockers, decisions, and success measures.',
  }),
  s('Policy Hub', {
    problem: 'Company policies and templates were hard to find, their approvals untracked.',
    actions: ['Workflow coordination', 'Access-control review', 'Acceptance'],
    system: 'Policy hub',
    outcome: 'Policies, templates, submissions, and approvals with structured browsing and access controls.',
  }),
  s('Team Workspaces Platform', {
    problem: 'The workspace environment and its supporting apps needed ongoing delivery.',
    actions: ['Delivery governance', 'Enhancement prioritization', 'Review checkpoints'],
    system: 'Team workspaces platform',
    outcome: 'Workspace and supporting apps delivered, including sign-in OTP and meeting-app enhancements.',
  }),
  s('Bucketlist V2 Modernization', {
    problem: 'The original architecture had reached its limits.',
    actions: ['Redesign governance', 'Migration & testing oversight', 'Turnover'],
    system: 'Bucketlist V2',
    outcome: 'Redesigned architecture with testing, migration, user transition, and turnover.',
  }),
  s('Room & Parking Reservation', {
    problem: 'Meeting rooms and parking were booked without an availability view.',
    actions: ['Reservation workflow design', 'UAT', 'Rollout'],
    system: 'Room & parking reservation system',
    outcome: 'Availability checking and conflict-free reservations.',
  }),
  s('Transaction Queuing — Partner Organization', {
    problem: "A partner organization's transaction queuing needed business-process scoping before build.",
    actions: ['Process scoping', 'Third-party vendor coordination'],
    system: 'Transaction queuing (scoping)',
    outcome: 'Early business-process scoping completed with the vendor.',
  }),
])
