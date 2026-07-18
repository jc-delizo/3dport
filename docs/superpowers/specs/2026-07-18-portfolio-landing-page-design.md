# Portfolio → Recruiter Landing Page: Design Spec

Date: 2026-07-18
Repo: `jc-delizo/3dport` — branch `redesign/landing-page`
Published URL: https://jc-delizo.github.io/3dport/ (**must not change**)

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

### Quality test for every section

Each section must answer a **different** recruiter question. If a section answers a question already
answered, shorten or cut it.

| Section | Question it answers |
|---|---|
| Hero | Why should I keep reading? |
| Proof bar | Is the headline believable? |
| Case Studies | How does he solve problems? |
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
- Internal business-unit or entity codenames (CFB, PCNI, L&H, ODVI, SUKI, DVCD, FC).
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

## 4. Page structure

Order is deliberate. **About sits near the end** — nobody arrives wondering about JC's story; they
arrive wondering whether he can solve their problem.

1. Hero
2. Proof bar
3. Case Studies
4. Experience
5. Capabilities
6. Tools
7. About
8. Availability + Contact

---

## 5. Section-by-section copy

### 5.1 Hero

> # JC Delizo
> ## Digital Transformation & Technical Delivery
>
> I help organizations deliver software faster by transforming the way teams work.
>
> Increased software delivery capacity from **2 systems/year to 20–28 projects/year** through
> Agile, AI-powered workflows, and scalable delivery systems.

Buttons: **View Case Studies** · **Download Résumé** · **LinkedIn**

Nothing else. No 3D. One screen. Visual interest from typography, spacing, and a restrained CSS
background treatment only.

### 5.2 Proof bar — three stats

| | |
|---|---|
| **10×** | Increase in delivery capacity |
| **20–28** | Projects delivered per year |
| **15** | Enterprise systems live in production |

Three, not five. Mixing metrics with non-metrics ("Scrum", "Enterprise") dilutes the row.

### 5.3 Case Studies

Section title: **Case Studies.** (Considered "Selected Transformation Initiatives"; rejected — three
words where one works, and long headings wrap badly on mobile.)

Uniform template: **Problem** (two sentences) → **Approach** (three or four bullets) →
**Outcome** (numbers) → **Lesson** (one sentence). No screenshots, no client names.

---

#### CS1 — Scaling Software Delivery

**Problem.** The digital transformation team could deliver only about two enterprise systems a year.
Planning was inconsistent, workflows were fragmented, and there was no shared visibility into
delivery status.

**Approach.**
- Introduced Scrum with sprint planning, backlog refinement, and delivery metrics.
- Standardized intake and prioritization across all requesting business functions.
- Introduced AI-assisted workflows to remove repetitive coordination work.
- Made delivery status visible to executives through live dashboards.

**Outcome.** Delivery capacity increased from roughly **2 systems per year to 20–28 projects per
year**, while delivery schedules stayed predictable.

**Lesson.** Scaling delivery was never about adding people — it was about removing bottlenecks.

---

#### CS2 — Multi-Entity ERP Rollout

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

**Lesson.** Sequencing matters more than scope: one module at a time kept adoption high and risk low.

---

#### CS3 — AI-Powered Request Management

**Problem.** Developers were interrupted constantly by stakeholders across several communication
channels. Requests arrived unstructured, so engineering time went to clarification rather than build.

**Approach.**
- Designed an AI-assisted intake process that centralized all stakeholder requests.
- Automated requirement gathering and structured ticket generation.
- Routed requests to the right owner without developer involvement.

**Outcome.** Developer context switching dropped, incoming requirements arrived materially better
formed, and the team gained a single source of truth for incoming work.

**Lesson.** Let AI absorb the repetitive coordination so engineers can spend attention on hard problems.

---

#### CS4 — Enterprise Transformation Portfolio

**Problem.** Business units across HR, finance, treasury, legal, credit, and operations all needed
digital solutions while sharing one constrained engineering team.

**Approach.**
- Managed prioritization across a portfolio of more than two dozen initiatives.
- Balanced stakeholder expectations against technical dependencies and real delivery capacity.
- Held **5–11 projects in flight** at any one time without losing schedule predictability.

**Outcome.** Delivered systems spanning payroll, recruitment, employee records, performance
management, finance workflows, treasury queuing, legal case management, inventory tracking, and
AI-enabled internal operations.

**Lesson.** Saying no to the wrong work is what makes the right work predictable.

---

#### CS5 — Building a Scalable Delivery System

**Problem.** Project management depended on manual coordination. That limited transparency and made
throughput impossible to increase without adding headcount.

**Approach.**
- Evolved delivery from traditional project management to Scrum.
- Standardized documentation and workflows in Coda.
- Migrated execution tracking to Linear and layered AI-assisted automation on top.

**Outcome.** A repeatable delivery system that supports substantially higher throughput while
improving visibility, prioritization, and cross-functional collaboration.

**Lesson.** A delivery system compounds; heroics don't.

*(Note: the blanket "no technology list" rule is dropped for CS5 — here the tooling* is *the story.)*

### 5.4 Experience

Cards, not a timeline. Company · Role · Years · three achievements each. No repetition of case-study detail.

**Oak Drive Ventures Inc.** — Digital Transformation Project Manager — 07/2023–Present
- Scaled team delivery capacity roughly 10×, from ~2 systems a year to 20–28 projects a year.
- Led the shift from traditional project execution to Agile delivery practices.
- Delivered enterprise applications across HR, finance, credit, treasury, and legal functions.

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

### 5.5 Capabilities — six

Agile Transformation · Technical Delivery Leadership · AI Workflow Design ·
Process Optimization · Enterprise Systems (ERP / HRIS) · Cross-Functional Leadership

### 5.6 Tools

Small, grouped text tags. No logos, no 3D.

- **Delivery:** Jira, Linear, Coda
- **Enterprise Systems:** Odoo ERP
- **Design:** Figma, Balsamiq
- **Development:** Git, GitHub, Vercel
- **AI:** Claude, Cursor, ChatGPT, Gemini, Codex

Odoo is listed explicitly — it is JC's most searchable technical specialization and was absent from
every earlier draft.

### 5.7 About — one paragraph

> I'm a Digital Transformation Project Manager with an engineering background who enjoys redesigning
> the way software teams work. My focus is helping organizations improve delivery through Agile,
> AI-powered workflows, and operational process design rather than relying solely on additional
> resources.

### 5.8 Availability + Contact

> ## Currently exploring new opportunities
>
> I'm currently employed and open to discussing Digital Transformation Manager and Technical Program /
> Delivery Manager opportunities where I can help organizations improve software delivery, operational
> efficiency, and cross-functional execution.

Buttons: **Email** (mailto, address shown in plain text) · **LinkedIn** · **Résumé**

No contact form. The old EmailJS form used three-year-old keys and failed silently — it told every
visitor "Thank you, I will get back to you" whether or not anything sent. A mailto link cannot fail
silently.

### 5.9 Footer

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

Dependencies to drop: `three`, `@react-three/fiber`, `@react-three/drei`, `maath`,
`@emailjs/browser`, `react-vertical-timeline-component`, `react-parallax-tilt`.
`framer-motion` stays for restrained scroll reveals.

---

## 7. Link preview (first impression before the click)

Most recruiters meet this site as a LinkedIn or JobStreet link card, not as a page.

- **Title:** `JC Delizo | Digital Transformation & Technical Delivery`
  (Deliberately not "Project Manager" or "Scrum Master" — titles change, value doesn't.)
- **Description (≤155 chars):** `Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design.`
- **OG image (1200×630):** dark background, large type, reading
  `JC Delizo · Digital Transformation & Technical Delivery · 2 systems/year → 20–28 projects/year`,
  with a small professional headshot bottom-right. No gradients, no laptops, no stock photography.
  It should read like a consulting firm's landing page, not a Behance portfolio.

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

1. **Headshot** for the OG image — blocked on JC.
2. **Linear write-back** — JC's "you can put descriptions on them too" was ambiguous. Linear is
   untouched pending confirmation of whether he wants project descriptions written into the company
   workspace or only used here.
3. The third proof stat is **15** (production only). JC may elect 18 (including in-flight) instead;
   both are verified, 15 is the more conservative claim. No further decision needed unless he prefers 18.
