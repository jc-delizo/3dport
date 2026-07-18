# Portfolio → Recruiter Landing Page: Design Spec

Date: 2026-07-18
Repo: `jc-delizo/3dport` — branch `redesign/landing-page`
Published URL: https://jc-delizo.github.io/3dport/ (**must not change**)

## Contents

1. [Goal](#1-goal) — audience, positioning, design philosophy, the section-question test
2. [Constraints](#2-constraints) — technical, mobile, confidentiality
3. [Verified facts](#3-verified-facts) — every number, and its provenance
3.5 [Design language](#35-design-language) — palette, type, layout, motion, accessibility
4. [Page structure](#4-page-structure) — section order
5. [Section-by-section copy](#5-section-by-section-copy) — final wording
6. [What is removed](#6-what-is-removed) — and the dependencies dropped
7. [Link preview](#7-link-preview-first-impression-before-the-click) — meta and OG image
8. [Deployment](#8-deployment)
9. [Open items](#9-open-items)

*Kept as one file deliberately — see §9.4.*

---

## 1. Goal

Convert the site from a **portfolio** ("here is everything I have done") into a **landing page**
("here is why you should interview me").

**Audience:** recruiters and hiring managers for two role types — Digital Transformation Manager
and Technical Program / Delivery Manager. Explicitly *not* product management at a product company.

**Attention budget:** 30–60 seconds.

**Central claim every section must reinforce:**

> I help organizations deliver software faster by transforming the way teams work.

**Differentiator:** not "project manager" — *builds delivery systems*. Many people manage projects;
few redesign how an engineering organization operates.

### Design philosophy

> **Target impression: a well-run internal software platform, not a portfolio.**

Everything in §3.5 derives from this one sentence. Someone hiring for these roles is hiring *clarity
brought to complexity*; the site must feel like that before a word is read.

### Quality test for every section

> **Every section must answer a different recruiter question.**

This is the rule that prevents scope creep. Whenever something is tempting to add, ask which recruiter
question it answers. If it doesn't answer a new one, delete it.

| Section | Question it answers |
|---|---|
| Hero | Why should I keep reading? |
| Proof bar | Is the headline believable? |
| Initiatives | How does he solve problems? |
| Principles | **How does he think?** |
| Experience | Where has he done this? |
| Capabilities | What domains can he operate in? |
| Tools | Can he fit our environment? |
| About | Who is he to work with? |
| Availability + Contact | Can I hire him now? |

---

## 2. Constraints

### Technical
- Stack stays: React 18, Vite, Tailwind CSS. Static site, GitHub Pages. No backend, no framework change.
- Vite `base` stays `/3dport/`. The URL is printed on JC's résumé, LinkedIn, and JobStreet.
- **All WebGL is removed** (see §6). Target: 0 WebGL contexts, down from 15.
- **Mobile is a first-class constraint, not an afterthought.** Recruiters arrive from the LinkedIn
  mobile app. Eight sections of large type is exactly where mobile layouts break. Every section is
  designed mobile-first and verified at 375px before desktop.

### Confidentiality
Source material comes from an internal Linear workspace. The following must **never** appear:
- Internal business-unit or entity codenames (see `src/content/forbidden.js`).
- Colleague names or email addresses.
- Which projects were cancelled, or internal HR/contract notes.

Permitted: naming **Oak Drive Ventures Inc.** as employer (already public on résumé and LinkedIn),
and describing systems **by function** — "a payroll module in a multi-entity ERP rollout", never the
internal project name.

---

## 3. Verified facts

Numbers on this site must survive an interviewer probing them. Verified against the Linear
workspace on 2026-07-18 (54 projects total; JC is lead on 26).

| Claim | Status |
|---|---|
| 10× increase in delivery capacity (≈2 systems/yr → 20–28 projects/yr) | From résumé. Use as headline. |
| **15 enterprise systems live in production** | Verified. **Use this as the third stat.** |
| 3 further systems in active delivery | Verified (18 delivered-or-in-flight if a bigger number is wanted). |
| 26 initiatives led | True but **do not use**: 7 have not started and 1 was cancelled. Implies delivery; collapses under questioning. |
| 7 Odoo modules live, 8th (payroll) in active delivery | Verified. |
| 5–11 concurrent projects | From résumé. Demoted from the proof bar — smaller than the alternatives. |

**Rule:** any new factual claim gets verified before it ships.

---

## 3.5 Design language

**Target impression: a well-run internal software platform, not a portfolio.**

Someone hiring a Digital Transformation or Technical Delivery Manager is hiring *clarity brought to
complexity*. The site must feel like that before a word is read. The emotions being sold are calm,
clarity, control, and confidence — not creativity, not technical brilliance.

Reference points: Linear, Raycast, Stripe Dashboard, shadcn/ui, Notion, GitHub. What these share is
that they are software people trust to organize complex work.

**Bar:** it should look less like a portfolio and more like the dashboard of someone you'd trust to
run a multi-million-dollar transformation programme.

### Vocabulary

Use the audience's own dialect throughout: **Initiatives, Systems, Delivery, Outcomes** — not
"Projects". This reinforces the positioning without stating it.

### Colour — near-monochrome, light

| Token | Value |
|---|---|
| Background | `#FFFFFF` (or `#FCFCFC`) |
| Primary text | `#09090B` |
| Secondary text | `#52525B` |
| Borders | `#E4E4E7` |
| Card background | `#FAFAFA` |
| Accent (one only) | `#2563EB` |

The accent appears **only** on buttons, links, and metric numbers. Nowhere else. This is a deliberate
reversal of the current dark theme (`#050816`).

Background may carry a 1px grid at ~3% opacity. Nothing else — no gradients, no blobs, no particles.

### Typography

Self-hosted **Geist** (woff2, bundled — no Google Fonts or CDN request). Inter is the fallback.
Geist reads as *engineered* rather than *designed*, which is the point.

| Role | Size |
|---|---|
| Hero | 56–64px |
| Section title | 32px |
| Card title | 20px |
| Body | 16px |
| Label | 13px |

### Layout, cards, motion, icons

- **Container width: `max-width: 72rem`** for standard sections; `80rem` is permitted only for the
  full-bleed proof bar. Specified explicitly so it isn't invented at build time.
- **Paragraph measure: `max-width: 65ch`.** No prose runs the full container width. This single rule
  does more for readability than any other.
- Everything aligns to an invisible grid. No floating decoration. Whitespace *is* the design.
- Section spacing: 160px after hero, 120px between subsequent sections (scaled down on mobile).
- Cards are uniform: border, `rounded-xl`, background, padding. **No shadows, no elevation, no
  glassmorphism.** Effectively a shadcn Card.
- Motion: fade, slide, and opacity only. No bounce, scale, rotate, or spin. Executives don't notice
  good animation but do notice distracting animation.
- Icons: Lucide only, single colour, 16–18px, and only where they carry meaning. No emoji, no
  colourful brand logos.
- Buttons: exactly **one** filled primary per screen; everything else is ghost/outline.

### Metric cards

Big number, tiny label, nothing else:

```
+--------------------------+
|                          |
| 10×                      |
|                          |
| Increase in              |
| Delivery Capacity        |
|                          |
+--------------------------+
```

### Accessibility (non-negotiable)

Cheap to build, and a site selling "clarity and control" that fails these undercuts its own claim.

- **WCAG AA contrast** on all text. The `#52525B` secondary on `#FFFFFF` passes; verify any variation.
- **Visible keyboard focus** on every interactive element. Never `outline: none` without a replacement.
- **`prefers-reduced-motion`** respected — all fade/slide reveals disabled when set.
- **Semantic landmarks**: `header`, `nav`, `main`, `section`, `footer`, with one `h1` and no skipped
  heading levels.
- **Skip-to-content** link as the first focusable element.
- Real `alt` text on the headshot; decorative elements marked `aria-hidden`.

### The one bespoke visual element

In place of a hero illustration, a **typographic delivery pipeline** — no graphics, type only:

```
Business  →  Process  →  System  →  Team  →  Outcome
```

Animated very subtly (fade/slide on entry only). It quietly communicates how JC thinks, and costs
almost nothing to build. This is the *only* decorative element on the site.

---

## 4. Page structure

Order is deliberate. **About sits near the end** — nobody arrives wondering about JC's story; they
arrive wondering whether he can solve their problem.

1. Hero
2. Proof bar
3. Initiatives
4. Principles
5. Experience
6. Capabilities
7. Tools
8. About
9. Availability + Contact

---

## 5. Section-by-section copy

### 5.0 Navigation

Sticky, very thin, near-invisible until needed. Links: **Transformation · Initiatives · Experience ·
Capabilities · Contact**, with an outlined **Résumé** button on the right. Collapses to a single menu
on mobile. The nav is the one place a second bordered button is allowed.

### 5.1 Hero

> # JC Delizo
> ## Digital Transformation & Delivery Manager
>
> I help organizations deliver software faster by transforming the way teams work.
>
> Increased software delivery capacity from **2 systems/year to 20–28 projects/year** through
> Agile, AI-powered workflows, and scalable delivery systems.

Buttons: **View Initiatives** · **Download Résumé** · **LinkedIn**

Below the buttons, the typographic delivery pipeline from §3.5
(`Business → Process → System → Team → Outcome`).

Nothing else. No 3D. One screen. Visual interest comes from typography, spacing, and the faint
background grid only.

### 5.2 Proof bar — three stats

| | |
|---|---|
| **10×** | Increase in delivery capacity |
| **20–28** | Projects delivered per year |
| **15** | Enterprise systems live in production |

Three, not five. Mixing metrics with non-metrics ("Scrum", "Enterprise") dilutes the row.

### 5.3 Initiatives

Section title: **Initiatives.**

(Decision history: "Selected Transformation Initiatives" was rejected as three words where one works,
and long headings wrap badly on mobile. "Case Studies" was then chosen. Now superseded by the single
word **Initiatives** — it satisfies the length objection completely while speaking the audience's own
vocabulary per §3.5. Trade-off accepted: "Case Studies" is instantly legible to anyone, "Initiatives"
is insider language — which is the point, since the audience uses it daily. Trivially reversible.)

Uniform template: **Category label** (2–3 words, small caps, above the title) → **Title** →
**Problem** (two sentences) → **Approach** (three or four bullets) → **Outcome** (numbers).
No screenshots, no client names.

The category label exists because people scan headings rather than read paragraphs — it lets a
recruiter grasp the shape of all five initiatives in about five seconds.

**Depth comes from real constraints, never from inflation.** These initiatives should read as
difficult because they were. The credibility of the 10× headline depends on everything around it
being verifiable — a padded description doesn't just fail under interview questioning, it makes an
interviewer wonder what else was padded. So: name the actual constraints (multi-tenancy, sequential
locking, dependency sequencing, shared engineering capacity), never invent scale, technologies, or
outcomes. The genuine complexity here is currently *under*-sold, not over-sold.

*(An earlier draft had "Building a Scalable Delivery System" as CS5. It answered the same question as
CS1 — how did you scale delivery? — so per the section-question test one had to go. Its tooling-evolution
content is folded into CS1's Approach, and CS5 is now the approval platform, which is the strongest
evidence on the page for the "technical" half of Technical Delivery Manager.)*

**The per-initiative "Lesson" line is removed.** It previously carried the "how does he think?" job,
which now belongs to the Principles section (§5.4) — and the lessons duplicated the principles almost
word for word. Applying the section-question test: one of them had to go.

---

#### CS1 — Scaling Software Delivery

`DELIVERY TRANSFORMATION`

**Problem.** The digital transformation team could deliver only about two enterprise systems a year.
Planning was inconsistent, workflows were fragmented, and there was no shared visibility into
delivery status.

**Approach.**
- Introduced Scrum with sprint planning, backlog refinement, and delivery metrics.
- Standardized intake and prioritization across all requesting business functions.
- Introduced AI-assisted workflows to remove repetitive coordination work.
- Made delivery status visible to executives through live dashboards.
- Evolved the tooling deliberately rather than all at once: traditional project management to Scrum,
  documentation standardized in Coda, execution tracking migrated to Linear, AI automation layered
  on last.

**Outcome.** Delivery capacity increased from roughly **2 systems per year to 20–28 projects per
year**, while delivery schedules stayed predictable.


---

#### CS2 — Multi-Entity ERP Rollout

`ENTERPRISE ERP`

**Problem.** Several corporate entities ran HR, finance, and operations on fragmented and largely
manual processes. There was no shared source of truth across payroll, recruitment, employee records,
or accounting.

**Approach.**
- Led a phased Odoo ERP implementation across the core platform and its functional modules.
- Sequenced one module per entity at a time so adoption never halted operations.
- Ran scoping, requirements gathering, configuration, and user training with each business function.
- Kept rollback cheap by keeping each rollout independently reversible.

**Outcome.** **Seven Odoo modules live in production** — accounting, employee records, recruitment,
helpdesk, agreements, performance management, and the shared core — with payroll in active delivery.


---

#### CS3 — AI-Powered Request Management

`AI WORKFLOW`

**Problem.** Developers were interrupted constantly by stakeholders across several communication
channels. Requests arrived unstructured, so engineering time went to clarification rather than build.

**Approach.**
- Designed an AI-assisted intake process that centralized all stakeholder requests.
- Automated requirement gathering and structured ticket generation.
- Routed requests to the right owner without developer involvement.

**Outcome.** Developer context switching dropped, incoming requirements arrived materially better
formed, and the team gained a single source of truth for incoming work.


---

#### CS4 — Enterprise Transformation Portfolio

`PORTFOLIO MANAGEMENT`

**Problem.** Business units across HR, finance, treasury, legal, credit, and operations all needed
digital solutions while sharing one constrained engineering team.

**Approach.**
- Managed prioritization across a portfolio of more than two dozen initiatives.
- Balanced stakeholder expectations against technical dependencies and real delivery capacity.
- Held **5–11 projects in flight** at any one time without losing schedule predictability.

**Outcome.** Delivered systems spanning payroll, recruitment, employee records, performance
management, finance workflows, treasury queuing, legal case management, inventory tracking, and
AI-enabled internal operations.


---

#### CS5 — Multi-Entity Approval Workflow Platform

`APPROVAL SYSTEMS`

**Problem.** Operational and financial approvals — travel, repairs, project execution, asset
management — ran on email and paper across five corporate entities. Routing was inconsistent, no two
departments approved the same way, and nothing was auditable.

**Approach.**
- Specified a multi-tenant data model scoping every user and document to its corporate entity, so
  cross-entity routing and segment reporting were possible at all.
- Designed a dynamic routing engine: instead of fixed templates, a requester composes the approval
  chain per document, selecting approvers from a global directory and tagging each with an action
  type — prepared, reviewed, recommended, noted, approved, final approval.
- Enforced strict sequential locking, so a step cannot act until the preceding step completes, with
  drag-and-drop ordering at composition time.
- Balanced that freedom with safeguards: an admin view that can halt, reorder, or inject approvers
  mid-flight; a return-for-correction path; and an immutable audit trail of every action and change.
- Added SSO with automatic provisioning of claimable accounts and a first-run onboarding flow.

**Outcome.** Replaced ad-hoc approvals across five corporate entities with a single auditable
platform. Currently in user training ahead of rollout.

*(Confidentiality: the five entities are never named — "five corporate entities" only. See §2.)*

### 5.4 Principles — four cards

Answers the one question nothing else on the page answers: **how does he think?** The Initiatives
show *what he did*; this shows *how he approaches work*. People remember principles.

Four cards, one line each, no elaboration:

- **Build systems, not heroics.**
- **Measure outcomes, not activity.**
- **Simplify before scaling.**
- **Use AI to remove repetitive work.**

Thirty seconds to read. This section replaces the per-initiative "Lesson" lines, which said the same
things five times over.

### 5.5 Experience

Cards, not a timeline. Company · Role · Years · three achievements each. No repetition of case-study detail.

**No achievement already proven elsewhere may be repeated here.** The 10× figure appears in the hero,
the proof bar, and Initiative 1 — stating it a fourth time reads as padding. Experience answers
*where*, and specifically *what else*.

**Oak Drive Ventures Inc.** — Digital Transformation Project Manager — 07/2023–Present
- Led delivery for business functions spanning HR, finance, credit, treasury, legal, and operations.
- Owned the delivery process end to end: intake, prioritization, sprint execution, and release.
- Built the team's documentation and executive reporting practice across Coda, Linear, and dashboards.

**TaskUs – SuperBam** — Content Moderator — 02/2021–06/2023
- Protected and monetized content for high-profile creators through copyright claim workflows.
- Specialized in potential and Pex claims to identify infringement at scale.
- Supported creator transitions onto new platforms.

**EISSS** — Project Engineer — 10/2017–01/2021
- Assessed complex engineering systems across plants and factories.
- Produced CAD documentation used to align clients and contractors.
- Diagnosed issues and delivered practical engineering solutions.

**SJ E&I Inc.** — QA/QC Engineer — 02/2016–09/2017
- Conducted pre-loop and final loop inspections for DCS systems.
- Ensured compliance with safety and quality standards.
- Identified issues early to protect project delivery schedules.

### 5.6 Capabilities — six

Agile Transformation · Technical Delivery Leadership · AI Workflow Design ·
Process Optimization · Enterprise Systems (ERP / HRIS) · Cross-Functional Leadership

### 5.7 Tools

Small, grouped text tags. No logos, no 3D.

- **Delivery:** Jira, Linear, Coda
- **Enterprise Systems:** Odoo ERP
- **Design:** Figma, Balsamiq
- **Development:** Git, GitHub, Vercel
- **AI:** Claude, Cursor, ChatGPT, Gemini, Codex

Odoo is listed explicitly — it is JC's most searchable technical specialization and was absent from
every earlier draft.

### 5.8 About — one paragraph

> I'm a Digital Transformation Project Manager with an engineering background who specializes in
> redesigning software delivery systems through Agile, AI-powered workflows, and operational process
> design — improving throughput without relying solely on additional resources.

### 5.9 Availability + Contact

> ## Currently exploring new opportunities
>
> I'm currently employed and selectively exploring Digital Transformation Manager and Technical
> Program / Delivery Manager opportunities where I can help organizations improve software delivery, operational
> efficiency, and cross-functional execution.

Buttons: **Email** (mailto, address shown in plain text) · **LinkedIn** · **Résumé**

No contact form. The old EmailJS form used three-year-old keys and failed silently — it told every
visitor "Thank you, I will get back to you" whether or not anything sent. A mailto link cannot fail
silently.

### 5.10 Footer

Copyright line only.

---

## 6. What is removed

| Removed | Reason |
|---|---|
| 3D computer model (`public/desktop_pc`, 16MB) | Costs 16MB to communicate nothing to a recruiter. |
| 3D globe (`public/planet`, 2.9MB) | Decorative; nobody is hired because of a spinning Earth. |
| Floating 3D tool spheres | One WebGL context each — the root cause of the blank-hero bug. |
| Stars canvas | Last remaining WebGL context. |
| Vertical timeline | Gave every bullet equal weight, burying the 10× achievement. |
| Three bootcamp projects | Read as junior; one link (ImageVerse) is already dead. |
| EmailJS contact form | Silent failure; see §5.8. |
| Unused images (tripguide, carrent, jobit, booknook) | ≈5MB bundled and never rendered. |
| Role cards ("React Developer" etc.) | Replaced by Capabilities. |

**No WebGL replacement is built.** A bespoke animated node graph would cost more than the model it
replaces and communicate just as little. Visual interest comes from typography, spacing, and CSS.

**Dependencies to drop:** `three`, `@react-three/fiber`, `@react-three/drei`, `maath`,
`@emailjs/browser`, `react-vertical-timeline-component`, `react-parallax-tilt`, and
**`framer-motion`**.

Framer Motion is dropped too. §3.5 allows only fade, slide, and opacity — that's CSS transitions plus
an `IntersectionObserver` hook, roughly 20 lines, against ~50KB of library. Keeping it would invite
exactly the animation the design language forbids.

**Dependencies to add:** `lucide-react` (icons), and self-hosted Geist woff2 files (no CDN request).

Expected result: the bundle drops from ~1.1MB of JavaScript and ~24MB of 3D assets to a small
static page.

---

## 7. Link preview (first impression before the click)

Most recruiters meet this site as a LinkedIn or JobStreet link card, not as a page.

- **Title:** `JC Delizo | Digital Transformation & Delivery Manager`

  An earlier draft used "Digital Transformation & Technical Delivery" on the reasoning that titles
  change but value doesn't. That's true for positioning and wrong for discovery: **recruiters search
  job titles, not concepts.** Nobody searches "technical delivery". This phrasing carries both
  searchable strings — "Digital Transformation" and "Delivery Manager" — and the two target titles
  are stated explicitly in §5.9 anyway.
- **Description (≤155 chars):** `Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design.`
- **OG image — type-only, no headshot** (decided 2026-07-18; a photo can be added later without
  changing anything else).

  **Dimensions: 1200 × 630 px — a 1.91:1 ratio.** This is the near-universal standard: LinkedIn,
  Facebook, Slack, and X (`summary_large_image`) all render it without letterboxing.

  - Keep all text inside a centred **safe area of roughly 1080 × 540**. Some clients crop the edges
    slightly, and different feeds crop differently — anything near the border can be cut.
  - Export as PNG (type-only artwork stays crisp and small). Keep it **under 1MB**; platform limits
    are higher, but large files get fetched slowly or skipped.
  - **`og:image` must be an absolute URL**, not a relative path — `https://jc-delizo.github.io/3dport/og.png`.
    Relative paths are the single most common reason preview cards silently fail to render.
  - Re-scraping: LinkedIn caches aggressively. After deploying, run the URL through LinkedIn's Post
    Inspector to force a refresh, or the old blank card persists for weeks.

  **Content:** must match the site's light, near-monochrome design language (§3.5) — white background,
  `#09090B` type, the single `#2563EB` accent on the metric only. Large type reading
  `JC Delizo · Digital Transformation & Delivery Manager · 2 systems/year → 20–28 projects/year`.
  No gradients, no laptops, no stock photography. It should read like a consulting firm's landing
  page, not a Behance portfolio.

  *(An earlier draft specified a dark background; that predates the move to a light theme and is
  superseded. The link card is the first impression and must not contradict the page behind it.)*

Requires `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, plus the Twitter card
equivalents, in `index.html`.

**Blocked:** needs a headshot from JC.

---

## 8. Deployment

`.github/workflows/main.yml` triggers on pushes to `main`, but the repository's only branch is
`master`, so the workflow has never run. Fix the trigger to `master` as part of this work, and
verify the first deploy actually publishes before considering the redesign done.

---

## 9. Open items

1. ~~**Headshot** for the OG image~~ — **Resolved 2026-07-18.** Skipped; the preview card is
   type-only. A photo can be added later without touching anything else.
2. ~~**Linear write-back**~~ — **Resolved 2026-07-18.** JC meant descriptions for the portfolio, not
   for Linear. The company workspace is read-only for this project and stays untouched.
3. ~~**Third proof stat**~~ — **Resolved 2026-07-18. Locked to 15** ("Enterprise systems live in
   production"). The alternative, "7 — ERP Modules Delivered", was considered and rejected: next to
   `10×` and `20–28`, a `7` reads as the weakest number in the row, and the ERP tangibility is already
   carried by Initiative 2, which opens with the seven modules.

4. **Single file vs. split into `vision.md` / `design-system.md` / `content.md` / `implementation.md`.**
   Kept as one file for now. Separation of concerns applies when parts change independently, and here
   they don't — the palette constrains the OG image, the positioning constrains the copy, the motion
   budget determines a dependency. The two contradictions caught during review (dark OG image against
   a light page; the reopened proof-stat decision) were both found *because* everything sat in one
   document. Revisit if this passes ~800 lines or if the design system starts being reused elsewhere.
