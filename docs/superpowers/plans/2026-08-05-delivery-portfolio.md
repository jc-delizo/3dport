# Delivery Portfolio Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Delivery Portfolio" section — 57 anonymized project entries in 9 domain groups — between Initiatives and Principles, per the approved spec `docs/superpowers/specs/2026-08-05-delivery-portfolio-design.md`.

**Architecture:** Pure-render section following the site's established pattern: all content lives in `src/content/site.js` (new `portfolio` key: `{ intro, groups }`), a new stateless `Portfolio.jsx` component renders it, and Vitest content tests pin the data shape. The existing confidentiality guard in `site.test.js` flattens every string in the `site` object, so new content is automatically scanned for forbidden terms.

**Tech Stack:** React 18, Vite, Tailwind (existing utility classes only), Vitest + Testing Library.

## Global Constraints

- **This repo is public.** No internal entity or project codenames anywhere — content, tests, comments, commit messages. The spec's §7 tables are the only source for titles/descriptions; the internal-name mapping lives outside this repo (`../portfolio-source-mapping.md` relative to repo root) and must never be copied in.
- The confidentiality guard test (`src/content/site.test.js` → `findForbidden`) must stay green after every task.
- `role` is exactly one of `Led | Coordinated | Oversight`. Approved split: Led 10 · Coordinated 26 · Oversight 21.
- Group order and counts (spec §7): 9, 4, 7, 6, 7, 2, 7, 8, 7 — total 57.
- No new color tokens, no new dependencies, no component state.
- Test commands: `npm test` (full run), `npx vitest run <file>` (single file).
- All commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Portfolio content in `site.js` + data-shape tests

**Files:**
- Modify: `src/content/site.js` (nav array ~line 10; new `portfolio` key after the `initiatives` array, before `principles`)
- Test: `src/content/site.test.js` (append a new `describe` block)

**Interfaces:**
- Produces: `site.portfolio = { intro: string, groups: [{ group: string, items: [{ title, role, desc }] }] }` and a `site.nav` entry `{ id: 'portfolio', label: 'Portfolio' }` directly after `initiatives`. Task 2's component and tests consume exactly these names.

- [ ] **Step 1: Write the failing tests**

Append to `src/content/site.test.js` (bottom of file):

```js
describe('portfolio data', () => {
  const groups = site.portfolio.groups
  const items = groups.flatMap((g) => g.items)

  it('has 9 groups totalling 57 entries, in the approved order', () => {
    expect(groups).toHaveLength(9)
    expect(items).toHaveLength(57)
    expect(groups.map((g) => g.items.length)).toEqual([9, 4, 7, 6, 7, 2, 7, 8, 7])
  })

  it('uses only the three role chips, in the approved split', () => {
    const count = (role) => items.filter((i) => i.role === role).length
    expect(count('Led')).toBe(10)
    expect(count('Coordinated')).toBe(26)
    expect(count('Oversight')).toBe(21)
    expect(items.every((i) => ['Led', 'Coordinated', 'Oversight'].includes(i.role))).toBe(true)
  })

  it('keeps every entry complete, with a one-line single-sentence description', () => {
    items.forEach(({ title, role, desc }) => {
      expect(title).toBeTruthy()
      expect(role).toBeTruthy()
      expect(desc).toMatch(/\.$/)
      expect(desc).not.toMatch(/\n/)
    })
  })

  it('has unique titles across all groups', () => {
    expect(new Set(items.map((i) => i.title)).size).toBe(items.length)
  })

  it('adds the Portfolio nav entry directly after Initiatives', () => {
    const ids = site.nav.map((n) => n.id)
    expect(site.nav).toHaveLength(7)
    expect(ids.indexOf('portfolio')).toBe(ids.indexOf('initiatives') + 1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/content/site.test.js`
Expected: FAIL — `portfolio data` block errors with `Cannot read properties of undefined (reading 'groups')`; existing tests still pass.

- [ ] **Step 3: Add the content**

In `src/content/site.js`, change the nav array's first entries from:

```js
  nav: [
    { id: 'initiatives', label: 'Initiatives' },
```

to:

```js
  nav: [
    { id: 'initiatives', label: 'Initiatives' },
    { id: 'portfolio', label: 'Portfolio' },
```

Then insert the following key immediately after the closing `],` of the `initiatives` array (before `principles`):

```js
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
```

- [ ] **Step 4: Run the content tests, including the confidentiality guard**

Run: `npx vitest run src/content/site.test.js`
Expected: PASS — all existing describes (especially `confidentiality › leaks none of the forbidden terms`, which now scans the new content because `allStrings` walks the whole `site` object) plus the new `portfolio data` block.

- [ ] **Step 5: Commit**

```bash
git add src/content/site.js src/content/site.test.js
git commit -m "feat: delivery portfolio content — 57 anonymized entries in 9 groups

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `Portfolio` component

**Files:**
- Create: `src/components/Portfolio.jsx`
- Test: `src/components/Portfolio.test.jsx`

**Interfaces:**
- Consumes: `site.portfolio.intro` (string), `site.portfolio.groups` (`[{ group, items: [{ title, role, desc }] }]`) from Task 1; `Container`, `SectionHeading` (props `id`, `label`, `title`, `children`), `Reveal` (props `delay`, `children`) from `src/components/ui/`.
- Produces: named export `Portfolio` (no props) for Task 3's `App.jsx`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/Portfolio.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Portfolio } from './Portfolio'
import { site } from '../content/site'

describe('Portfolio', () => {
  it('renders the section heading and intro', () => {
    render(<Portfolio />)
    expect(screen.getByRole('heading', { name: 'Delivery Portfolio.' })).toBeInTheDocument()
    expect(screen.getByText(site.portfolio.intro)).toBeInTheDocument()
  })

  it('renders every group label with its entry count', () => {
    render(<Portfolio />)
    site.portfolio.groups.forEach(({ group, items }) => {
      expect(screen.getByText(`${group} · ${items.length}`)).toBeInTheDocument()
    })
  })

  it('renders every entry as a heading with its description', () => {
    render(<Portfolio />)
    site.portfolio.groups.forEach(({ items }) => {
      items.forEach(({ title, desc }) => {
        expect(screen.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
        expect(screen.getByText(desc)).toBeInTheDocument()
      })
    })
  })

  it('renders exactly one role chip per entry', () => {
    render(<Portfolio />)
    const total = site.portfolio.groups.reduce((n, g) => n + g.items.length, 0)
    expect(screen.getAllByText(/^(Led|Coordinated|Oversight)$/)).toHaveLength(total)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/Portfolio.test.jsx`
Expected: FAIL — cannot resolve `./Portfolio`.

- [ ] **Step 3: Implement the component**

Create `src/components/Portfolio.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Portfolio() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="portfolio" label="Full portfolio" title="Delivery Portfolio.">
          {site.portfolio.intro}
        </SectionHeading>

        <div className="space-y-12">
          {site.portfolio.groups.map(({ group, items }, i) => (
            <Reveal key={group} delay={Math.min(i, 3) * 60}>
              <p className="text-label uppercase tracking-widest text-accent">
                {group} · {items.length}
              </p>
              <div className="mt-4 grid gap-x-10 gap-y-6 border-t border-hairline pt-6 md:grid-cols-2">
                {items.map(({ title, role, desc }) => (
                  <article key={title}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-body font-medium">{title}</h3>
                      <span className="shrink-0 text-label uppercase tracking-widest text-muted">
                        {role}
                      </span>
                    </div>
                    <p className="mt-1 text-label text-muted">{desc}</p>
                  </article>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/Portfolio.test.jsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Portfolio.jsx src/components/Portfolio.test.jsx
git commit -m "feat: Portfolio section component — grouped two-column index with role chips

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Wire into the page, full verification, decision log

**Files:**
- Modify: `src/App.jsx` (import list and section order)
- Modify: `src/components/decision-log.md` (append one entry)

**Interfaces:**
- Consumes: `Portfolio` from Task 2. The Nav link needs no code change: `Nav` renders `site.nav`, which Task 1 already extended, and `Nav.test.jsx` iterates `site.nav`, so it asserts the new link automatically.

- [ ] **Step 1: Mount the section between Initiatives and Principles**

In `src/App.jsx`, add the import after the `Initiatives` import:

```jsx
import { Portfolio } from './components/Portfolio'
```

and change the section order from:

```jsx
        <Initiatives />
        <Principles />
```

to:

```jsx
        <Initiatives />
        <Portfolio />
        <Principles />
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS across all files — notably `Nav.test.jsx` (now asserts the Portfolio link via `site.nav`), `App.test.jsx` (one h1, landmarks, exactly two `a.bg-accent` — role chips use text styling only, so the count is unchanged), and the confidentiality guard.

- [ ] **Step 3: Verify the production build**

Run: `npm run build`
Expected: Vite build succeeds with no warnings about the new module.

- [ ] **Step 4: Append the decision-log entry**

Append to `src/components/decision-log.md`:

```markdown
## 2026-08-05 — Delivery Portfolio section

Added the full-breadth project index (57 anonymized entries, 9 domain groups) between
Initiatives and Principles, per docs/superpowers/specs/2026-08-05-delivery-portfolio-design.md.
Key choices: anonymize every internal name (guard-enforced), one-line descriptions with
no interactivity, role chips restricted to Led/Coordinated/Oversight, and no hard project
count in the intro so the resume-backed "65 systems" Experience bullet stays authoritative.
```

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/decision-log.md
git commit -m "feat: mount Delivery Portfolio section between Initiatives and Principles

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Out of scope

Deployment (`npm run deploy`) is a separate, user-approved step — the section should be reviewed in `npm run dev` first.
