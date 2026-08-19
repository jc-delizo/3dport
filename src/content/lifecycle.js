// "From Business Problem → Production" — the delivery-system lifecycle.
// Copy is method, not claims: no metrics, no client names. Artifact previews
// are sanitized, generic PM artifacts (nothing from real projects).
export const lifecycle = {
  title: 'From Business Problem → Production.',
  intro:
    'How I turn ambiguous business problems into shipped, adopted, and continuously improved software.',
  phases: [
    {
      id: 'request',
      name: 'Project Request',
      desc: 'A business problem enters the delivery system.',
      artifacts: ['Request Form', 'Problem Statement', 'Initial Requirements'],
    },
    {
      id: 'scoping',
      name: 'Scoping',
      desc: "I determine what we're actually solving.",
      artifacts: ['Project Scope', 'Stakeholder Map', 'Success Criteria'],
    },
    {
      id: 'planning',
      name: 'Planning',
      desc: 'I turn scope into a realistic delivery plan.',
      artifacts: ['Project Roadmap', 'Milestones', 'RAID Log', 'Resource Plan'],
    },
    {
      id: 'kickoff',
      name: 'Kickoff',
      desc: 'I align the team and stakeholders before execution starts.',
      artifacts: ['Project Charter', 'Roles & Responsibilities', 'Communication Plan', 'Definition of Done'],
    },
    {
      id: 'sprints',
      name: 'Sprints',
      desc: 'I manage incremental delivery through prioritized backlogs, sprint planning, reviews, and continuous feedback.',
      artifacts: ['Product Backlog', 'User Stories', 'Sprint Plan', 'Sprint Review'],
    },
    {
      id: 'testing',
      name: 'Testing',
      desc: 'I validate the solution continuously instead of waiting until UAT to discover problems.',
      artifacts: ['Test Scenarios', 'Internal QA', 'Parallel Testing', 'Pilot Results', 'Defect Tracking'],
    },
    {
      id: 'uat',
      name: 'UAT',
      desc: 'Business users validate the solution against real-world processes.',
      artifacts: ['UAT Plan', 'Test Cases', 'Defect Log', 'UAT Sign-off'],
    },
    {
      id: 'training',
      name: 'Training',
      desc: 'A system is only successful when people can confidently use it.',
      artifacts: ['User Guide', 'Training Materials', 'Admin Guide', 'FAQs', 'Support Procedures'],
    },
    {
      id: 'go-live',
      name: 'Go Live',
      desc: 'I move the solution from project mode into operational use.',
      artifacts: ['Cutover Plan', 'Deployment Checklist', 'Go-Live Approval', 'Rollback Plan', 'Support Readiness'],
    },
    {
      id: 'hypercare',
      name: 'Hypercare',
      desc: 'I stabilize the system before transitioning it into normal operations.',
      artifacts: ['Issue Tracker', 'Incident Monitoring', 'Daily Status', 'Resolution Tracking', 'Handover Checklist'],
    },
  ],
}

// Sanitized example previews for the most load-bearing artifacts. Only these
// artifacts open a modal; the rest render as plain cards.
export const artifactPreviews = {
  'Project Scope': {
    sections: [
      { label: 'Objective', lines: ['Define what the project will — and will not — deliver.'] },
      {
        label: 'In scope',
        lines: ['Business workflows to digitize', 'Integrations and data migration', 'Roles and access levels'],
      },
      { label: 'Out of scope', lines: ['Processes owned by other systems', 'Future-phase enhancements'] },
      {
        label: 'Success criteria',
        lines: ['Agreed workflows live in production', 'Users onboarded and trained', 'Process-owner sign-off'],
      },
    ],
  },
  'Project Roadmap': {
    sections: [
      {
        label: 'Phases',
        lines: ['Discovery & scoping', 'Build in sprints', 'Testing & UAT', 'Training & go-live', 'Hypercare'],
      },
      {
        label: 'Milestones',
        lines: ['Charter approved', 'First working demo', 'UAT sign-off', 'Production cutover'],
      },
      {
        label: 'Principles',
        lines: ['Dates tied to dependencies, not optimism', 'Risks surfaced early and re-planned openly'],
      },
    ],
  },
  'Product Backlog': {
    sections: [
      {
        label: 'Structure',
        lines: ['Epics broken into user stories', 'Each story sized and prioritized', 'Acceptance criteria before development'],
      },
      {
        label: 'Prioritization',
        lines: ['Business value first', 'Dependencies and risk next', 'Quick wins where they unblock adoption'],
      },
    ],
  },
  'UAT Plan': {
    sections: [
      { label: 'Objective', lines: ['Validate business workflows against agreed requirements.'] },
      { label: 'Participants', lines: ['Business owners', 'Process owners', 'Project team'] },
      {
        label: 'Exit criteria',
        lines: ['✓ Critical defects resolved', '✓ Business validation completed', '✓ Stakeholder sign-off'],
      },
    ],
  },
  'Cutover Plan': {
    sections: [
      {
        label: 'Sequence',
        lines: ['Data freeze and final migration', 'Deployment to production', 'Smoke tests and validation', 'Go / no-go checkpoint'],
      },
      {
        label: 'Safety nets',
        lines: ['Rollback plan rehearsed', 'Support team on standby', 'Switchover communicated in advance'],
      },
    ],
  },
  'Issue Tracker': {
    sections: [
      {
        label: 'Discipline',
        lines: ['Every issue logged with severity', 'Daily triage and status', 'Owner and resolution time tracked'],
      },
      {
        label: 'Exit',
        lines: ['Incident rate stabilized', 'Open criticals at zero', 'Handover to operations'],
      },
    ],
  },
}
