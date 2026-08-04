# Delivery Portfolio Section — Design

**Date:** 2026-08-05
**Status:** Approved design, pending implementation plan

## 1. Purpose

The site's hero and Experience section claim scale ("10× delivery capacity", "65 systems over 3 years") but show only five narrative Initiatives. This section substantiates the scale claim: a dense, grouped index of the full body of systems and initiatives the owner has led, coordinated, or overseen — anonymized to respect client confidentiality.

## 2. Decisions locked during brainstorming

1. **Anonymize everything.** No internal entity or project codenames appear anywhere in this repo (this spec included). The confidentiality guard (`src/content/forbidden.js`) already enforces this for `site.js` content; this spec is written to the same standard. The mapping from internal names to the published titles lives in a private file outside this repository: `../../portfolio-source-mapping.md` relative to the repo root (the owner's private workspace repo).
2. **Compact index of all projects**, not a curated subset — the five narrative Initiatives remain the depth proof; this section is the breadth proof.
3. **Main-page section**, placed between Initiatives and Principles. No routing, no separate page.
4. **One-line descriptions, always visible.** No accordions, no filters, no state. Typography carries the hierarchy.

## 3. Placement and structure

- New component `src/components/Portfolio.jsx`, rendered in `App.jsx` between `Initiatives` and `Principles`.
- Nav gains a seventh entry `{ id: 'portfolio', label: 'Portfolio' }` after Initiatives.
- Section heading follows the house pattern: label `Full portfolio`, title `Delivery Portfolio.`
- One intro sentence below the heading: *"The systems and initiatives behind the numbers above — titles generalized where client confidentiality requires."* This tells a reader the generic names are deliberate, not evasive. The intro deliberately carries **no project count**; the group headers carry counts.

## 4. Data model

New `portfolio` key in `src/content/site.js`:

```js
portfolio: [
  {
    group: 'ERP & HR Platforms',
    items: [
      {
        title: 'Payroll Implementation — 1,600 Employees',
        role: 'Led',
        desc: 'Payroll rules, leave, statutory contributions, migration, parallel runs, UAT, cutover, and post-launch support.',
      },
      // ...
    ],
  },
  // ...
]
```

- `role` is exactly one of three values: `Led`, `Coordinated`, `Oversight`.
- Role mapping rule, applied mechanically from the owner's own source wording: *led / managed* → **Led**; *coordinated / supported / participated* → **Coordinated**; *portfolio oversight / pushed the assigned team / follow-through* → **Oversight**.
- `desc` is a single sentence (one line at desktop column width), distilled from the source description's strongest concrete detail.

## 5. Naming rules

1. Entity and product names on the forbidden list never appear. Entities become descriptors: "multi-company", "sister lending company", "partner organization", "microloan operations".
2. Internal codenames with no public meaning become descriptive titles (e.g. the AI delivery platform, the Snowflake modernization effort).
3. Names already public via the quoted LinkedIn recommendation (Field Collection Tool, Bucketlist) and third-party vendor/product names (Odoo, Nextbank, Snowflake, Linear, Clockify, Postgres, S3, Google Chat, Discord, Telegram, GitHub) may appear.
4. Acronym-named systems are published under their decoded full names (confirmed with the owner 2026-08-04): Local Bank & Passbook Inventory System, Nextbank Companion App, Performance Evaluation Form Automation, Online Marketing Representative Automation, Marketing Representative Intelligence.

## 6. Curation

From the ~61-item source list, **57 entries** are published. Dropped, with reasons:

- Two internal operational workstreams (IT incident handling; team administration) — not portfolio deliverables.
- One subsidiary initiative with no documented scope, led by another person.
- The application-intake process — its story is already told by the "AI-Powered Request Management" Initiative card.

Two companion-app implementations for different lending entities stay separate entries (both real deliveries).

## 7. Published content (final)

### ERP & HR Platforms (9)

| Title | Role | Description |
|---|---|---|
| Enterprise ERP Transformation Program | Led | Org-wide rollout replacing fragmented HR, payroll, accounting, recruitment, helpdesk, and performance processes with connected ERP workflows. |
| Payroll Implementation — 1,600 Employees | Led | Payroll rules, leave, statutory contributions, migration, parallel runs, UAT, cutover, and post-launch support. |
| Central Employee Information System | Led | Employee profiles, movements, disciplinary cases, exits, and HR reporting feeding every other ERP module. |
| Performance Management System | Coordinated | KRAs, appraisals, performance conversations, reports, and PIP workflows for managers, employees, and HR. |
| ERP Accounting Module | Coordinated | Financial reports, assets, bills, journal entries, audit access, and specialized reporting corrections. |
| Employment Agreements Module | Coordinated | Offer, contract, and agreement-template generation with controlled document access. |
| HR & Internal Helpdesk | Coordinated | Structured ticket workflows with team-specific visibility, reporting, exports, FAQs, and resolution tracking. |
| Performance Evaluation Form Automation | Coordinated | Digitized evaluation cycle — account setup, submissions, performance conversations, and HR monitoring of the first full cycle. |
| ERP eLearning Evaluation | Coordinated | Business evaluation of standard employee-learning features against HR requirements ahead of implementation. |

### Recruitment & Onboarding (4)

| Title | Role | Description |
|---|---|---|
| Multi-Company Recruitment Platform | Led | Manpower requests through Day-1 onboarding, with approval routing, applicant tracking, and strict company-level data isolation. |
| Recruitment Automation with Executive Email Approvals | Coordinated | Manpower requests to completed hiring: executive email approvals, external integrations, and candidate-data controls. |
| ERP Recruitment Module | Coordinated | Vacancies, applicants, job offers, contracts, and centralized recruitment reporting for HR. |
| Async Interview Platform | Led | Candidate interviews without simultaneous availability — end-to-end testing, training, turnover, and rollout. |

### Lending & Credit (7)

| Title | Role | Description |
|---|---|---|
| Universal Finance System | Oversight | Configurable finance platform — customers, loans, charges, amortization, collateral, letters, permissions, and reporting. |
| Loan Origination System | Oversight | Loan requests, verification, approvals, role-based access, encryption, data masking, and audit trails. |
| Credit Approval Queuing | Coordinated | Digitized submission, queuing, review, and approval of credit applications with role-specific dashboards. |
| Nextbank Companion App — Microloan Operations | Oversight | Loan, payment, and collection workflows: payment-file processing, production tagging, large reports, and health checks. |
| Nextbank Companion App — Sister Lending Company | Oversight | Companion implementation serving a second lending entity's loan and customer-processing operations. |
| Nextbank Core Implementation — Sister Lending Company | Oversight | Core lending-platform initiative supporting the entity's loan and customer-management operations. |
| MSME Credit Risk Framework | Oversight | Structured evaluation criteria and risk visibility for MSME lending decisions. |

### Collections & Recovery (6)

| Title | Role | Description |
|---|---|---|
| Unified Collection Tool | Led | Consolidated separate collection applications into one platform — development, migration, UAT, parallel testing, rollout. |
| Collection Queuing System | Led | Queue for collection requests, swiping, releases, and acknowledgements, integrated with the ATM inventory system. |
| Collection Automation Platform | Coordinated | Standardized collection workflow adopted across five operating areas of a microloan product. |
| Field Collection Tool | Oversight | Structured recording of field collection activities, customer interactions, and outcomes. |
| Tele Collection Tool | Coordinated | Telecollection follow-ups with centralized monitoring of remote collection work. |
| Legal & Remedial Case Management | Oversight | Centralized case information, actions, and monitoring, pushed through UAT, turnover, and rollout. |

### Field & Branch Operations (7)

| Title | Role | Description |
|---|---|---|
| Field Itinerary Management — Uniformed Personnel | Led | Itineraries, visits, calls, and GPS tracking replacing legacy workflows; offline capability and a stabilized go-live. |
| Field Itinerary Management — Civilian Personnel | Coordinated | Itinerary and field-activity management for scheduled client work by civilian staff. |
| ATM Inventory & Movement Tracking | Coordinated | Custody, availability, and processing visibility for ATM inventory across the organization. |
| Local Bank & Passbook Inventory System | Coordinated | Local-bank records, passbooks, surrendered ATMs, and client-account status handling. |
| Pouch Receiving System | Oversight | Inbound/outbound pouch and item tracking between branches, departments, and the head-office mailroom. |
| Client Updater | Coordinated | Client-information updates with visible ownership of update responsibilities; bug resolution and re-adoption. |
| Online Marketing Representative Automation | Led | Early-stage automation of the online representative workflow, being moved from idea to defined project. |

### Finance Automation (2)

| Title | Role | Description |
|---|---|---|
| Request-for-Payment Automation | Coordinated | Weekly RFP generation with Accounting validation, covering card-statement expenses with incomplete invoices. |
| Budget Automation Tool | Oversight | Automated budget templates, calculations, recasting, branch updates, and consolidated inputs. |

### AI & Automation (7)

| Title | Role | Description |
|---|---|---|
| AI Delivery Platform | Led | AI conversations, ticketing, Linear integration, meeting automation, and automated development workflows for the team. |
| Smart Improvement Recommendations | Oversight | AI pipeline analyzing repositories for prioritized code-quality, security, performance, and architecture recommendations. |
| Zero-Touch Maintenance | Oversight | AI agents implementing and monitoring selected development issues via GitHub integration, webhooks, and label tracking. |
| Discord AI Chat Assistant | Oversight | Departmental AI assistant with personas, worker agents, and project-thread interpretation. |
| Telegram Assistant Bot | Oversight | Multi-user Gmail and Calendar assistant with user isolation and security testing. |
| AI-Powered Development Workflow | Coordinated | Shared AI tools and practices adopted across the development team. |
| Spec-Driven Development Practice | Coordinated | Specification-first development standard so requirements are defined before coding. |

### Data & Analytics (8)

| Title | Role | Description |
|---|---|---|
| Data Loader Automation | Oversight | Scheduled extraction, file generation, and loading across Postgres, Snowflake, S3, and Google Chat. |
| Analytics Exchange | Coordinated | Snowflake validation and analyst capability-building toward self-serve data access. |
| Snowflake Ecosystem Modernization | Oversight | Exploration of Cortex, Openflow, cost management, and dashboards to modernize the data platform. |
| Snowflake Openflow Exploration | Coordinated | Data-movement exploration connecting operational systems such as the ERP with Snowflake. |
| Executive Scoreboard Dashboard | Oversight | Consolidated executive scoreboards with planned Linear, Clockify, and operational data integrations. |
| Department Delivery Dashboard | Coordinated | Department-level delivery and performance dashboard feeding the executive view. |
| Marketing Representative Intelligence | Coordinated | Employee and release data combined for representative performance monitoring; scoping and MVP planning. |
| Marketing Representative Productivity Analysis | Oversight | Regression analysis linking operational data to representative performance. |

### Internal Platforms (7)

| Title | Role | Description |
|---|---|---|
| Project & Workspace Hub | Coordinated | Central store of roles, milestones, blockers, decisions, and success measures, aligned with Linear reporting. |
| Policy Hub | Coordinated | Company policies, templates, submissions, and approval workflows with structured browsing and access controls. |
| Greenlight Document Workflow Platform | Coordinated | Digitized forms, uploads, document types, and department workflows with customized business rules. |
| Team Workspaces Platform | Oversight | Workspace environment and supporting apps, including sign-in OTP delivery and meeting-app enhancements. |
| Bucketlist V2 Modernization | Oversight | Redesigned V2 architecture with testing, migration, user transition, and turnover. |
| Room & Parking Reservation | Oversight | Availability checking and conflict-free reservations for meeting rooms and parking. |
| Transaction Queuing — Partner Organization | Coordinated | Early business-process scoping for a partner organization's transaction queuing, with the third-party vendor. |

**Totals:** 57 entries. Led 10 · Coordinated 26 · Oversight 21.

## 8. Rendering

- Group block: small-caps label (house `text-label uppercase tracking-widest` style) with entry count, e.g. `ERP & HR Platforms · 9`.
- Entries: CSS grid, `md:grid-cols-2`, single column on mobile. Tight vertical rhythm matching the Certifications rows.
- Entry: title (semibold, body size) with role chip right-aligned on the same line; one-line muted description beneath.
- Role chip: existing muted/accent token styling — visually quiet, same weight as Certifications' issuer text. No new color tokens.
- No interactivity, no state. Pure render from `site.portfolio`.

## 9. Tests

- **Confidentiality guard:** verify the existing `site.test.js` guard walks the new nested `portfolio` structure (it must serialize all strings in `site`); extend if it only covers specific keys.
- **`Portfolio.test.jsx`:** renders every group heading with its count; every item renders title, role chip, and description; role values are restricted to `Led | Coordinated | Oversight`.
- **Content shape test in `site.test.js`:** every entry has non-empty `title`, `role`, `desc`; `desc` is a single sentence (no newlines; ends with one period).

## 10. Consistency notes

- The Experience bullet "Delivered 65 systems end to end over 3 years" comes from the ATS resume (source of truth) and is **not** changed. The portfolio lists 57 entries because operational workstreams and sub-deliveries are excluded; the section intro therefore avoids a hard count.
- The hero CTA and OG description are unchanged.
- Nav order becomes: Initiatives, Portfolio, Principles, Experience, Capabilities, Certifications, Contact.

## 11. Out of scope

- Filtering/search UI (may be layered on later if the section feels unwieldy).
- Any change to the five narrative Initiatives.
- Resume/LinkedIn content changes.
