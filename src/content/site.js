export const site = {
  meta: {
    title: 'JC Delizo | Digital Transformation & Delivery Manager',
    description:
      'Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design.',
    url: 'https://jc-delizo.github.io/3dport/',
    ogImage: 'https://jc-delizo.github.io/3dport/og.png',
  },

  nav: [
    { id: 'initiatives', label: 'Initiatives' },
    { id: 'principles', label: 'Principles' },
    { id: 'experience', label: 'Experience' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'contact', label: 'Contact' },
  ],

  hero: {
    name: 'JC Delizo',
    title: 'Digital Transformation & Delivery Manager',
    claim: 'I help organizations deliver software faster by transforming the way teams work.',
    support:
      'Increased software delivery capacity from 2 systems/year to 20–28 projects/year through Agile, AI-powered workflows, and scalable delivery systems.',
    primaryCta: { label: 'View Initiatives', href: '#initiatives' },
    secondaryCtas: [
      {
        label: 'Download Résumé',
        href: 'https://drive.google.com/file/d/1do0NBgr3It45EtiWg1kayCHj15HvFVq4/view?usp=sharing',
      },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jcdelizo/' },
    ],
  },

  pipeline: ['Business', 'Process', 'System', 'Team', 'Outcome'],

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
        'Led delivery for business functions spanning HR, finance, credit, treasury, legal, and operations.',
        'Owned the delivery process end to end: intake, prioritization, sprint execution, and release.',
        "Built the team's documentation and executive reporting practice across Coda, Linear, and dashboards.",
      ],
    },
    {
      company: 'TaskUs – SuperBam',
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

  capabilities: [
    { icon: 'Workflow', label: 'Agile Transformation' },
    { icon: 'GitBranch', label: 'Technical Delivery Leadership' },
    { icon: 'Sparkles', label: 'AI Workflow Design' },
    { icon: 'Target', label: 'Process Optimization' },
    { icon: 'Database', label: 'Enterprise Systems (ERP / HRIS)' },
    { icon: 'Users', label: 'Cross-Functional Leadership' },
  ],

  tools: [
    { group: 'Delivery', items: ['Jira', 'Linear', 'Coda'] },
    { group: 'Enterprise Systems', items: ['Odoo ERP'] },
    { group: 'Design', items: ['Figma', 'Balsamiq'] },
    { group: 'Development', items: ['Git', 'GitHub', 'Vercel'] },
    { group: 'AI', items: ['Claude', 'Cursor', 'ChatGPT', 'Gemini', 'Codex'] },
  ],

  about:
    "I'm a Digital Transformation Project Manager with an engineering background who specializes in redesigning software delivery systems through Agile, AI-powered workflows, and operational process design — improving throughput without relying solely on additional resources.",

  availability: {
    heading: 'Currently exploring new opportunities',
    body: "I'm currently employed and selectively exploring Digital Transformation Manager and Technical Program / Delivery Manager opportunities where I can help organizations improve software delivery, operational efficiency, and cross-functional execution.",
  },

  contact: {
    email: 'mrjcdelizo@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jcdelizo/',
    resume:
      'https://drive.google.com/file/d/1do0NBgr3It45EtiWg1kayCHj15HvFVq4/view?usp=sharing',
  },

  footer: `© ${new Date().getFullYear()} JC Delizo`,
}
