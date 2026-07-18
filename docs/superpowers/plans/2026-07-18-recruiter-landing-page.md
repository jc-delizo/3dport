# Recruiter Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `jc-delizo/3dport` from a 3D developer portfolio into a static recruiter landing page, per `docs/superpowers/specs/2026-07-18-portfolio-landing-page-design.md`.

**Architecture:** Single-page React app, no router, no backend. All copy lives in one content module (`src/content/site.js`) so wording is editable without touching components, and so automated tests can assert the spec's confidentiality and factual rules against a single source. Components are presentational and read from that module. All WebGL is deleted; motion is CSS plus one `IntersectionObserver` hook.

**Tech Stack:** React 18, Vite 6, Tailwind CSS 3, Vitest + React Testing Library + jsdom, `lucide-react` for icons, `@fontsource/geist-sans` for self-hosted type, `puppeteer-core` (dev only) to render the OG image.

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- **Published URL must not change:** `https://jc-delizo.github.io/3dport/`. Vite `base` stays `'/3dport/'`.
- **Zero WebGL contexts.** No `three`, no `@react-three/*`, no `<canvas>`.
- **Mobile-first.** Every section verified at 375px before desktop.
- **Container width:** `max-width: 72rem` standard; `80rem` permitted only for the proof bar.
- **Paragraph measure:** `max-width: 65ch`. No prose runs full container width.
- **Palette (only these):** background `#FFFFFF`, primary text `#09090B`, secondary text `#52525B`, borders `#E4E4E7`, card `#FAFAFA`, accent `#2563EB`. Accent appears **only** on buttons, links, and metric numbers.
- **Type scale:** hero 56–64px, section title 32px, card title 20px, body 16px, label 13px.
- **Cards:** border + `rounded-xl` + background + padding. No shadows, no elevation, no glassmorphism.
- **Motion:** fade, slide, opacity only. No bounce, scale, rotate, spin. Must respect `prefers-reduced-motion`.
- **Buttons:** exactly one filled primary per screen; all others ghost/outline.
- **Icons:** Lucide only, single colour, 16–18px, only where they carry meaning.
- **Section spacing:** 160px after hero, 120px between sections (reduced on mobile).
- **No CDN requests.** Fonts are bundled. (The current `index.css` imports Poppins from Google Fonts — this must go.)
- **Confidentiality — these strings must never appear in shipped output:** `CFB`, `PCNI`, `L&H`, `ODVI`, `SUKI`, `DVCD`, `Isla Terra`, `Oak Drive Capital`, `Sandy Beach`, `Moonrock`, or any colleague name. `Oak Drive Ventures` **is** permitted (employer).
- **Factual rule:** never claim "26 initiatives". Third proof stat is **15 — Enterprise systems live in production**.
- **Accessibility:** WCAG AA contrast, visible keyboard focus, semantic landmarks, one `h1`, skip-to-content link, `prefers-reduced-motion` respected.

---

### Task 1: Toolchain and test infrastructure

The repo is on Vite 2.9 (2022) with `@vitejs/plugin-react` 1.x. Modern Vitest requires Vite 5+, and Vite 2 already emits esbuild warnings under Node 22. Upgrading is in-scope — the spec fixes the *stack*, not the version — and it unblocks every test in this plan.

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`
- Create: `src/test/smoke.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` (Vitest, jsdom, RTL matchers loaded) and a working `npm run build`. Every later task depends on both.

- [ ] **Step 1: Upgrade build tooling and add test dependencies**

```bash
npm install --save-dev vite@^6 @vitejs/plugin-react@^4 vitest@^2 jsdom@^25 \
  @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Point Vite at the test setup**

Replace `vite.config.js` entirely:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/3dport/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 3: Create the test setup file**

`src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'

// jsdom implements neither of these; components under test use both.
global.IntersectionObserver = class {
  constructor(callback) { this.callback = callback }
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })
}
```

- [ ] **Step 4: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a smoke test**

`src/test/smoke.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('test harness', () => {
  it('renders React into jsdom', () => {
    render(<h1>hello</h1>)
    expect(screen.getByRole('heading', { name: 'hello' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test — expect PASS**

Run: `npm test`
Expected: `1 passed`. If it fails with a JSX transform error, confirm `@vitejs/plugin-react` v4 installed correctly.

- [ ] **Step 7: Confirm the production build still works**

Run: `npm run build`
Expected: exit 0, `dist/index.html` emitted. The old 3D site still builds at this point — that is correct, nothing has been deleted yet.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test/
git commit -m "build: upgrade to Vite 6, add Vitest and Testing Library"
```

---

### Task 2: Content module and spec-compliance tests

All site copy in one file. This is the highest-value task in the plan: it makes the spec's confidentiality and factual rules **executable**, so a future edit that leaks an entity codename or resurrects the "26" claim fails CI rather than shipping.

**Files:**
- Create: `src/content/site.js`
- Create: `src/content/site.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: named export `site` — an object with keys `meta`, `nav`, `hero`, `pipeline`, `proof`, `initiatives`, `principles`, `experience`, `capabilities`, `tools`, `about`, `availability`, `contact`, `footer`. Every component task imports from here. Exact shapes are defined below and must not be altered by later tasks.

- [ ] **Step 1: Write the content module**

`src/content/site.js`:

```js
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
```

- [ ] **Step 2: Write the compliance tests**

`src/content/site.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { site } from './site'

// Every string in the content tree, flattened.
function allStrings(value, acc = []) {
  if (typeof value === 'string') acc.push(value)
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, acc))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => allStrings(v, acc))
  return acc
}

const corpus = allStrings(site).join('\n')

describe('confidentiality', () => {
  // Spec §2. These are internal entity codenames and must never ship.
  const forbidden = ['PCNI', 'SUKI', 'DVCD', 'Isla Terra', 'Oak Drive Capital', 'Sandy Beach', 'Moonrock']

  it.each(forbidden)('does not leak %s', (term) => {
    expect(corpus).not.toContain(term)
  })

  it('does not leak the CFB or L&H codenames', () => {
    // Word-boundary matched so "L&H" is caught but ordinary prose is not.
    expect(corpus).not.toMatch(/\bCFB\b/)
    expect(corpus).not.toMatch(/L&H/)
  })

  it('still names the employer, which is permitted', () => {
    expect(corpus).toContain('Oak Drive Ventures')
  })
})

describe('factual rules', () => {
  it('never claims 26 initiatives', () => {
    expect(corpus).not.toMatch(/\b26\b/)
  })

  it('uses 15 enterprise systems as the third proof stat', () => {
    expect(site.proof).toHaveLength(3)
    expect(site.proof[2].value).toBe('15')
    expect(site.proof[2].label).toMatch(/live in production/i)
  })
})

describe('link preview', () => {
  it('keeps the meta description within 155 characters', () => {
    expect(site.meta.description.length).toBeLessThanOrEqual(155)
  })

  it('uses an absolute og:image URL', () => {
    // Relative paths are the most common cause of blank preview cards.
    expect(site.meta.ogImage).toMatch(/^https:\/\//)
  })
})

describe('structure', () => {
  it('has exactly five initiatives, each with a category', () => {
    expect(site.initiatives).toHaveLength(5)
    site.initiatives.forEach((i) => {
      expect(i.category).toBeTruthy()
      expect(i.approach.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('has exactly four principles', () => {
    expect(site.principles).toHaveLength(4)
  })

  it('does not repeat the 10x figure in experience bullets', () => {
    // Spec §5.5: proven in hero, proof bar and initiative 1 already.
    const experienceText = allStrings(site.experience).join('\n')
    expect(experienceText).not.toMatch(/10×|10x/)
  })
})
```

- [ ] **Step 3: Run the tests — expect PASS**

Run: `npm test`
Expected: all tests pass. If "does not leak the CFB codename" fails, a codename has crept into the copy — fix the copy, never the test.

- [ ] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add site content module with spec-compliance tests"
```

---

### Task 3: Design tokens, fonts, and base styles

**Files:**
- Modify: `tailwind.config.cjs`
- Modify: `src/index.css` (full replacement)
- Modify: `src/main.jsx`
- Delete: `src/styles.js`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind tokens `bg-canvas`, `text-ink`, `text-muted`, `border-hairline`, `bg-card`, `text-accent`/`bg-accent`; utility classes `.container-page` (72rem), `.container-wide` (80rem), `.measure` (65ch); the `.reveal` / `.reveal-visible` animation pair. All later tasks use these names.

- [ ] **Step 1: Install the self-hosted font**

```bash
npm install @fontsource/geist-sans
```

- [ ] **Step 2: Replace the Tailwind config**

`tailwind.config.cjs`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        ink: '#09090B',
        muted: '#52525B',
        hairline: '#E4E4E7',
        card: '#FAFAFA',
        accent: '#2563EB',
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        label: ['0.8125rem', { lineHeight: '1.25rem' }], // 13px
        body: ['1rem', { lineHeight: '1.65rem' }], // 16px
        'card-title': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        section: ['2rem', { lineHeight: '2.4rem' }], // 32px
        hero: ['3.5rem', { lineHeight: '3.9rem' }], // 56px
        'hero-lg': ['4rem', { lineHeight: '4.4rem' }], // 64px
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Replace `src/index.css` entirely**

Deletes the Google Fonts import (spec forbids CDN requests) and every legacy gradient/canvas class.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    color-scheme: light;
  }

  body {
    @apply bg-canvas text-ink font-sans text-body antialiased;
  }

  /* Spec: visible keyboard focus on every interactive element. */
  :focus-visible {
    outline: 2px solid theme('colors.accent');
    outline-offset: 3px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .container-page {
    @apply mx-auto w-full px-6;
    max-width: 72rem;
  }

  .container-wide {
    @apply mx-auto w-full px-6;
    max-width: 80rem;
  }

  /* Spec: no prose runs the full container width. */
  .measure {
    max-width: 65ch;
  }

  .section-gap {
    @apply py-16 md:py-[7.5rem];
  }

  .reveal {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 500ms ease-out, transform 500ms ease-out;
  }

  .reveal-visible {
    opacity: 1;
    transform: none;
  }
}

/* Skip link: first focusable element, visible only on focus. */
.skip-link {
  @apply absolute left-4 z-50 rounded-md bg-ink px-4 py-2 text-canvas;
  top: -100px;
}
.skip-link:focus {
  top: 1rem;
}
```

- [ ] **Step 4: Import the font in `src/main.jsx`**

Add these two imports above the existing `./index.css` import:

```js
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/600.css'
```

- [ ] **Step 5: Leave `src/styles.js` in place for now**

Do **not** delete it in this task. It exports the old dark-theme `styles` object, and `Works.jsx`,
`Tech.jsx` and `Feedbacks.jsx` still import it — deleting it here would break `npm run build` for
every task up to Task 12. It is removed in Task 12 alongside the components that use it.

- [ ] **Step 6: Verify Tailwind compiles the new tokens**

Run: `npx tailwindcss -c tailwind.config.cjs -i src/index.css -o /tmp/tw-check.css`
Expected: exit 0, and `grep -c "container-page" /tmp/tw-check.css` returns at least 1.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.cjs src/index.css src/main.jsx package.json package-lock.json
git commit -m "feat: light monochrome design tokens, self-hosted Geist, a11y base styles"
```

---

### Task 4: UI primitives

**Files:**
- Create: `src/components/ui/Container.jsx`
- Create: `src/components/ui/Card.jsx`
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/SectionHeading.jsx`
- Create: `src/components/ui/Reveal.jsx`
- Create: `src/components/ui/Reveal.test.jsx`
- Create: `src/components/ui/Button.test.jsx`

**Interfaces:**
- Consumes: Tailwind tokens from Task 3.
- Produces:
  - `<Container wide={false}>` → `div.container-page` (or `.container-wide` when `wide`).
  - `<Card as="div" className="">` → bordered `#FAFAFA` card, `rounded-xl`, no shadow.
  - `<Button href variant="primary"|"ghost" external={false}>` → renders an `<a>`.
  - `<SectionHeading id label title>` → `<h2>` plus small uppercase label; sets the scroll anchor id.
  - `<Reveal as="div" delay={0}>` → fades/slides children in once on scroll.

- [ ] **Step 1: Write the failing tests**

`src/components/ui/Button.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders a link with its label', () => {
    render(<Button href="#x">Go</Button>)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '#x')
  })

  it('adds safe rel attributes for external links', () => {
    render(<Button href="https://example.com" external>Out</Button>)
    const link = screen.getByRole('link', { name: 'Out' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the ghost variant without the filled accent background', () => {
    render(<Button href="#x" variant="ghost">Ghost</Button>)
    expect(screen.getByRole('link', { name: 'Ghost' }).className).not.toMatch(/bg-accent/)
  })
})
```

`src/components/ui/Reveal.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('starts hidden so the entry animation has somewhere to travel from', () => {
    const { container } = render(<Reveal><p>content</p></Reveal>)
    expect(container.firstChild.className).toMatch(/reveal/)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./Button"`.

- [ ] **Step 3: Implement the primitives**

`src/components/ui/Container.jsx`:

```jsx
export function Container({ wide = false, className = '', children }) {
  return <div className={`${wide ? 'container-wide' : 'container-page'} ${className}`}>{children}</div>
}
```

`src/components/ui/Card.jsx`:

```jsx
export function Card({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`rounded-xl border border-hairline bg-card p-6 md:p-8 ${className}`}>
      {children}
    </Tag>
  )
}
```

`src/components/ui/Button.jsx`:

```jsx
const VARIANTS = {
  primary: 'bg-accent text-white hover:opacity-90',
  ghost: 'border border-hairline text-ink hover:bg-card',
}

export function Button({ href, variant = 'primary', external = false, className = '', children }) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a
      href={href}
      {...externalProps}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-body font-medium transition-colors ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  )
}
```

`src/components/ui/SectionHeading.jsx`:

```jsx
export function SectionHeading({ id, label, title, children }) {
  return (
    <header className="mb-12">
      <p id={id} className="scroll-mt-24 text-label uppercase tracking-widest text-muted">
        {label}
      </p>
      <h2 className="mt-2 text-section font-semibold tracking-tight">{title}</h2>
      {children ? <p className="measure mt-4 text-body text-muted">{children}</p> : null}
    </header>
  )
}
```

`src/components/ui/Reveal.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react'

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Respect the user's motion preference: show immediately, never animate.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // reveal once, never re-hide
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 5 new tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Container, Card, Button, SectionHeading and Reveal primitives"
```

---

### Task 5: Navigation

**Files:**
- Create: `src/components/Nav.jsx`
- Create: `src/components/Nav.test.jsx`

**Interfaces:**
- Consumes: `site.nav`, `site.contact.resume`, `Button`, `Container`.
- Produces: `<Nav />` — sticky header, and the page's skip-link target contract (`#main`).

- [ ] **Step 1: Write the failing test**

`src/components/Nav.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'
import { site } from '../content/site'

describe('Nav', () => {
  it('renders every nav link pointing at its section anchor', () => {
    render(<Nav />)
    site.nav.forEach(({ id, label }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    })
  })

  it('exposes a résumé link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', site.contact.resume)
  })

  it('uses a navigation landmark', () => {
    render(<Nav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./Nav`.

- [ ] **Step 3: Implement**

`src/components/Nav.jsx`:

```jsx
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Button } from './ui/Button'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="text-body font-semibold tracking-tight">
          JC Delizo
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {site.nav.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="text-label text-muted hover:text-ink">
              {label}
            </a>
          ))}
          <Button href={site.contact.resume} variant="ghost" external className="px-4 py-1.5 text-label">
            Résumé
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-hairline md:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {site.nav.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="text-body text-muted hover:text-ink"
              >
                {label}
              </a>
            ))}
            <Button href={site.contact.resume} variant="ghost" external className="self-start">
              Résumé
            </Button>
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
```

Note: the desktop and mobile menus both render links, so the test queries would match twice if both were visible. They are not — the mobile `<nav>` only mounts when `open` is true, which is false by default.

- [ ] **Step 4: Install the icon library**

```bash
npm install lucide-react
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.jsx src/components/Nav.test.jsx package.json package-lock.json
git commit -m "feat: add sticky navigation with mobile menu"
```

---

### Task 6: Hero and delivery pipeline

**Files:**
- Create: `src/components/Hero.jsx`
- Create: `src/components/Hero.test.jsx`
- Delete: `src/components/Hero.jsx` is a *replacement* — the existing 3D hero file at this path is overwritten.

**Interfaces:**
- Consumes: `site.hero`, `site.pipeline`, `Container`, `Button`, `Reveal`.
- Produces: `<Hero />` containing the page's single `<h1>` and its single filled primary button.

- [ ] **Step 1: Write the failing test**

`src/components/Hero.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { site } from '../content/site'

describe('Hero', () => {
  it('renders the name as the only h1', () => {
    render(<Hero />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(site.hero.name)
  })

  it('states the central claim and the supporting metric', () => {
    render(<Hero />)
    expect(screen.getByText(site.hero.claim)).toBeInTheDocument()
    expect(screen.getByText(/20–28 projects\/year/)).toBeInTheDocument()
  })

  it('renders exactly one filled primary button', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('a.bg-accent')).toHaveLength(1)
  })

  it('renders every pipeline stage', () => {
    render(<Hero />)
    site.pipeline.forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument()
    })
  })

  it('renders no canvas element', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('canvas')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — the current `Hero.jsx` exports a default 3D component, not a named `Hero`.

- [ ] **Step 3: Implement (overwrite the file completely)**

`src/components/Hero.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

function Pipeline() {
  return (
    <Reveal delay={200} className="mt-16">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-label uppercase tracking-widest text-muted">
        {site.pipeline.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3">
            <span>{stage}</span>
            {i < site.pipeline.length - 1 ? (
              <span aria-hidden="true" className="text-hairline">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

export function Hero() {
  const { name, title, claim, support, primaryCta, secondaryCtas } = site.hero

  return (
    <section id="top" className="border-b border-hairline pt-20 pb-16 md:pt-28 md:pb-24">
      <Container>
        <Reveal>
          <h1 className="text-hero font-semibold tracking-tight md:text-hero-lg">{name}</h1>
          <p className="mt-3 text-section font-medium text-muted">{title}</p>
        </Reveal>

        <Reveal delay={80}>
          <p className="measure mt-8 text-body md:text-card-title">{claim}</p>
          <p className="measure mt-4 text-body text-muted">{support}</p>
        </Reveal>

        <Reveal delay={140} className="mt-10 flex flex-wrap gap-3">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCtas.map((cta) => (
            <Button key={cta.label} href={cta.href} variant="ghost" external>
              {cta.label}
            </Button>
          ))}
        </Reveal>

        <Pipeline />
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 5 new tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.test.jsx
git commit -m "feat: replace 3D hero with typographic hero and delivery pipeline"
```

---

### Task 7: Proof bar

**Files:**
- Create: `src/components/ProofBar.jsx`
- Create: `src/components/ProofBar.test.jsx`

**Interfaces:**
- Consumes: `site.proof`, `Container`, `Reveal`.
- Produces: `<ProofBar />` — three metric cards, the only place besides buttons and links where the accent colour appears.

- [ ] **Step 1: Write the failing test**

`src/components/ProofBar.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProofBar } from './ProofBar'
import { site } from '../content/site'

describe('ProofBar', () => {
  it('renders exactly three stats', () => {
    const { container } = render(<ProofBar />)
    expect(container.querySelectorAll('[data-stat]')).toHaveLength(3)
  })

  it('renders each value and label', () => {
    render(<ProofBar />)
    site.proof.forEach(({ value, label }) => {
      expect(screen.getByText(value)).toBeInTheDocument()
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('does not claim 26 initiatives', () => {
    const { container } = render(<ProofBar />)
    expect(container.textContent).not.toMatch(/\b26\b/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./ProofBar`.

- [ ] **Step 3: Implement**

`src/components/ProofBar.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { Reveal } from './ui/Reveal'

export function ProofBar() {
  return (
    <section aria-label="Impact at a glance" className="border-b border-hairline section-gap">
      <Container wide>
        <div className="grid gap-4 sm:grid-cols-3">
          {site.proof.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 80}>
              <Card className="h-full">
                <p data-stat className="text-hero font-semibold tracking-tight text-accent">
                  {value}
                </p>
                <p className="measure mt-3 text-label uppercase tracking-widest text-muted">{label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

Note: `Card` accepts only `as`, `className` and `children` — it does not spread extra props onto the DOM. So `data-stat` goes on the inner `<p>`, which is what the test counts. Do not add it to `Card`; it would be silently dropped and the test would fail with 0 matches.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS. `[data-stat]` matches the three `<p>` elements.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProofBar.jsx src/components/ProofBar.test.jsx
git commit -m "feat: add three-stat proof bar"
```

---

### Task 8: Initiatives

**Files:**
- Create: `src/components/Initiatives.jsx`
- Create: `src/components/Initiatives.test.jsx`

**Interfaces:**
- Consumes: `site.initiatives`, `Container`, `Card`, `SectionHeading`, `Reveal`.
- Produces: `<Initiatives />` with anchor id `initiatives`.

- [ ] **Step 1: Write the failing test**

`src/components/Initiatives.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Initiatives } from './Initiatives'
import { site } from '../content/site'

describe('Initiatives', () => {
  it('renders all five initiatives with title and category', () => {
    render(<Initiatives />)
    site.initiatives.forEach(({ title, category }) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('renders Problem, Approach and Outcome for each', () => {
    render(<Initiatives />)
    expect(screen.getAllByText('Problem')).toHaveLength(5)
    expect(screen.getAllByText('Approach')).toHaveLength(5)
    expect(screen.getAllByText('Outcome')).toHaveLength(5)
  })

  it('does not render a Lesson block, which the spec removed', () => {
    render(<Initiatives />)
    expect(screen.queryByText('Lesson')).toBeNull()
  })

  it('leaks no internal entity codenames', () => {
    const { container } = render(<Initiatives />)
    expect(container.textContent).not.toMatch(/\bCFB\b|PCNI|SUKI|Isla Terra|Moonrock/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./Initiatives`.

- [ ] **Step 3: Implement**

`src/components/Initiatives.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

function Block({ label, children }) {
  return (
    <div className="mt-6">
      <p className="text-label uppercase tracking-widest text-muted">{label}</p>
      <div className="measure mt-2 text-body">{children}</div>
    </div>
  )
}

export function Initiatives() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="initiatives" label="Selected work" title="Initiatives." />

        <div className="grid gap-4">
          {site.initiatives.map(({ id, category, title, problem, approach, outcome }, i) => (
            <Reveal key={id} delay={Math.min(i, 3) * 60}>
              <Card as="article">
                <p className="text-label uppercase tracking-widest text-accent">{category}</p>
                <h3 className="mt-2 text-card-title font-semibold tracking-tight">{title}</h3>

                <Block label="Problem">{problem}</Block>

                <Block label="Approach">
                  <ul className="list-disc space-y-2 pl-5 text-muted">
                    {approach.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Block>

                <Block label="Outcome">{outcome}</Block>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 4 new tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/Initiatives.jsx src/components/Initiatives.test.jsx
git commit -m "feat: add initiatives section with problem/approach/outcome cards"
```

---

### Task 9: Principles and Capabilities

**Files:**
- Create: `src/components/Principles.jsx`
- Create: `src/components/Capabilities.jsx`
- Create: `src/components/Principles.test.jsx`

**Interfaces:**
- Consumes: `site.principles`, `site.capabilities`, `Container`, `Card`, `SectionHeading`, `Reveal`, `lucide-react`.
- Produces: `<Principles />` (anchor `principles`) and `<Capabilities />` (anchor `capabilities`).

- [ ] **Step 1: Write the failing test**

`src/components/Principles.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Principles } from './Principles'
import { Capabilities } from './Capabilities'
import { site } from '../content/site'

describe('Principles', () => {
  it('renders all four principles', () => {
    render(<Principles />)
    site.principles.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument())
  })
})

describe('Capabilities', () => {
  it('renders all six capabilities', () => {
    render(<Capabilities />)
    site.capabilities.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./Principles`.

- [ ] **Step 3: Implement Principles**

`src/components/Principles.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Principles() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="principles" label="How I work" title="Principles." />
        <div className="grid gap-4 sm:grid-cols-2">
          {site.principles.map((principle, i) => (
            <Reveal key={principle} delay={i * 60}>
              <Card className="h-full">
                <p className="text-card-title font-medium tracking-tight">{principle}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Implement Capabilities**

`src/components/Capabilities.jsx`:

```jsx
import { Workflow, GitBranch, Sparkles, Target, Database, Users } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

const ICONS = { Workflow, GitBranch, Sparkles, Target, Database, Users }

export function Capabilities() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="capabilities" label="Where I operate" title="Capabilities." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.capabilities.map(({ icon, label }, i) => {
            const Icon = ICONS[icon]
            return (
              <Reveal key={label} delay={Math.min(i, 3) * 60}>
                <Card className="flex h-full items-center gap-3">
                  <Icon size={18} aria-hidden="true" className="shrink-0 text-muted" />
                  <span className="text-body font-medium">{label}</span>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Principles.jsx src/components/Capabilities.jsx src/components/Principles.test.jsx
git commit -m "feat: add principles and capabilities sections"
```

---

### Task 10: Experience

**Files:**
- Create: `src/components/Experience.jsx` (overwrites the existing vertical-timeline component)
- Create: `src/components/Experience.test.jsx`

**Interfaces:**
- Consumes: `site.experience`, `Container`, `Card`, `SectionHeading`, `Reveal`.
- Produces: `<Experience />` with anchor id `experience`.

- [ ] **Step 1: Write the failing test**

`src/components/Experience.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Experience } from './Experience'
import { site } from '../content/site'

describe('Experience', () => {
  it('renders a card per role with company, role and period', () => {
    render(<Experience />)
    site.experience.forEach(({ company, role, period }) => {
      expect(screen.getByRole('heading', { name: company })).toBeInTheDocument()
      expect(screen.getByText(role)).toBeInTheDocument()
      expect(screen.getByText(period)).toBeInTheDocument()
    })
  })

  it('does not repeat the 10x figure proven elsewhere', () => {
    const { container } = render(<Experience />)
    expect(container.textContent).not.toMatch(/10×|10x/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — existing `Experience.jsx` has no named `Experience` export.

- [ ] **Step 3: Implement (overwrite completely)**

`src/components/Experience.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Experience() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="experience" label="Track record" title="Experience." />
        <div className="grid gap-4">
          {site.experience.map(({ company, role, period, points }, i) => (
            <Reveal key={company} delay={Math.min(i, 3) * 60}>
              <Card as="article">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-card-title font-semibold tracking-tight">{company}</h3>
                  <p className="text-label uppercase tracking-widest text-muted">{period}</p>
                </div>
                <p className="mt-1 text-body text-muted">{role}</p>
                <ul className="measure mt-4 list-disc space-y-2 pl-5 text-body text-muted">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Experience.jsx src/components/Experience.test.jsx
git commit -m "feat: replace vertical timeline with experience cards"
```

---

### Task 11: Tools, About, Availability, Contact and Footer

**Files:**
- Create: `src/components/Tools.jsx`
- Create: `src/components/About.jsx` (overwrites the existing About)
- Create: `src/components/Contact.jsx` (overwrites the existing EmailJS form)
- Create: `src/components/Footer.jsx` (overwrites the existing socials footer)
- Create: `src/components/Contact.test.jsx`

**Interfaces:**
- Consumes: `site.tools`, `site.about`, `site.availability`, `site.contact`, `site.footer`.
- Produces: `<Tools />`, `<About />`, `<Contact />` (anchor `contact`), `<Footer />`.

- [ ] **Step 1: Write the failing test**

`src/components/Contact.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { Tools } from './Tools'
import { site } from '../content/site'

describe('Contact', () => {
  it('renders a mailto link rather than a form', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('form')).toBeNull()
    expect(screen.getByRole('link', { name: new RegExp(site.contact.email, 'i') })).toHaveAttribute(
      'href',
      `mailto:${site.contact.email}`
    )
  })

  it('states availability using confident phrasing', () => {
    render(<Contact />)
    expect(screen.getByText(/selectively exploring/i)).toBeInTheDocument()
  })
})

describe('Tools', () => {
  it('renders every group and item, including Odoo', () => {
    render(<Tools />)
    site.tools.forEach(({ group, items }) => {
      expect(screen.getByText(group)).toBeInTheDocument()
      items.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument())
    })
    expect(screen.getByText('Odoo ERP')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Contact` has no named export; `Tools` does not exist.

- [ ] **Step 3: Implement Tools**

`src/components/Tools.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Tools() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="tools" label="Environment" title="Tools." />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {site.tools.map(({ group, items }, i) => (
            <Reveal key={group} delay={Math.min(i, 3) * 60}>
              <p className="text-label uppercase tracking-widest text-muted">{group}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-hairline bg-card px-2.5 py-1 text-label"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Implement About (overwrite completely)**

`src/components/About.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function About() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="about" label="Background" title="About." />
        <Reveal>
          <p className="measure text-body text-muted">{site.about}</p>
        </Reveal>
      </Container>
    </section>
  )
}
```

- [ ] **Step 5: Implement Contact (overwrite completely — removes EmailJS)**

`src/components/Contact.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function Contact() {
  const { heading, body } = site.availability
  const { email, linkedin, resume } = site.contact

  return (
    <section className="section-gap">
      <Container>
        <SectionHeading id="contact" label="Availability" title={heading} />
        <Reveal>
          <p className="measure text-body text-muted">{body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${email}`}>{email}</Button>
            <Button href={linkedin} variant="ghost" external>
              LinkedIn
            </Button>
            <Button href={resume} variant="ghost" external>
              Résumé
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
```

- [ ] **Step 6: Implement Footer (overwrite completely)**

`src/components/Footer.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-hairline py-10">
      <Container>
        <p className="text-label text-muted">{site.footer}</p>
      </Container>
    </footer>
  )
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/Tools.jsx src/components/About.jsx src/components/Contact.jsx src/components/Footer.jsx src/components/Contact.test.jsx
git commit -m "feat: add tools, about, availability/contact and footer sections"
```

---

### Task 12: Assemble the page and delete the old site

This is the task that removes ~24MB of assets and seven dependencies. Do it in one commit so the tree is never in a half-deleted state.

**Files:**
- Modify: `src/App.jsx` (full replacement)
- Delete: `src/components/canvas/` (entire directory), `src/components/Loader.jsx`, `src/components/Works.jsx`, `src/components/Tech.jsx`, `src/components/Feedbacks.jsx`, `src/components/index.js`, `src/hoc/` (entire directory), `src/utils/motion.js`, `src/constants/index.js`, `src/styles.js`, `src/assets/` (entire directory), `public/desktop_pc/`, `public/planet/`
- Create: `src/App.test.jsx`
- Modify: `package.json` (remove dependencies)

**Interfaces:**
- Consumes: every component from Tasks 5–11.
- Produces: the assembled page. No later task imports from `App`.

- [ ] **Step 1: Write the failing test**

`src/App.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders exactly one h1', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('renders the required landmarks', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('provides a skip-to-content link as the first focusable element', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('renders no canvas anywhere', () => {
    const { container } = render(<App />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('renders exactly one filled primary button on the page', () => {
    const { container } = render(<App />)
    // Hero's "View Initiatives" and Contact's mailto are both primary by design;
    // the spec allows one per screen, not one per page. Assert they are the only two.
    expect(container.querySelectorAll('a.bg-accent')).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `App` still renders the 3D site and imports deleted modules.

- [ ] **Step 3: Replace `src/App.jsx`**

```jsx
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProofBar } from './components/ProofBar'
import { Initiatives } from './components/Initiatives'
import { Principles } from './components/Principles'
import { Experience } from './components/Experience'
import { Capabilities } from './components/Capabilities'
import { Tools } from './components/Tools'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <ProofBar />
        <Initiatives />
        <Principles />
        <Experience />
        <Capabilities />
        <Tools />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Delete the old site**

```bash
git rm -r src/components/canvas src/hoc src/assets public/desktop_pc public/planet
git rm src/components/Loader.jsx src/components/Works.jsx src/components/Tech.jsx \
       src/components/Feedbacks.jsx src/components/index.js src/utils/motion.js \
       src/constants/index.js src/styles.js
```

`src/styles.js` is removed here rather than in Task 3 because the components above import it; deleting
it earlier would break the build for every intervening task.

- [ ] **Step 5: Remove dead dependencies**

```bash
npm uninstall three @react-three/fiber @react-three/drei maath @emailjs/browser \
  react-vertical-timeline-component react-parallax-tilt framer-motion react-router-dom
```

`react-router-dom` goes too: the old `App.jsx` wrapped everything in `BrowserRouter` and nothing routes.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, all suites green.

- [ ] **Step 7: Verify the build and measure the result**

Run: `npm run build`
Expected: exit 0. Then:

```bash
du -sh dist
```

Expected: dramatically smaller than the previous ~25MB — a few hundred KB. Record the number in the commit message.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: assemble landing page and remove the 3D site

Deletes all WebGL components, 24MB of 3D assets, and eight dependencies."
```

---

### Task 13: Link preview metadata and OG image

**Files:**
- Modify: `index.html`
- Create: `scripts/og-template.html`
- Create: `scripts/generate-og.mjs`
- Create: `public/og.png` (generated)

**Interfaces:**
- Consumes: `site.meta` values (duplicated into static HTML — `index.html` is not processed by React).
- Produces: `public/og.png` at 1200×630, and the meta tags that reference it.

- [ ] **Step 1: Replace `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/3dport/logo-no-background.svg" />

    <title>JC Delizo | Digital Transformation &amp; Delivery Manager</title>
    <meta
      name="description"
      content="Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design."
    />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://jc-delizo.github.io/3dport/" />
    <meta property="og:title" content="JC Delizo | Digital Transformation &amp; Delivery Manager" />
    <meta
      property="og:description"
      content="Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design."
    />
    <meta property="og:image" content="https://jc-delizo.github.io/3dport/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="JC Delizo | Digital Transformation &amp; Delivery Manager" />
    <meta
      name="twitter:description"
      content="Digital Transformation leader who scaled software delivery from 2 to 20–28 projects a year through Agile, AI-powered workflows, and delivery system design."
    />
    <meta name="twitter:image" content="https://jc-delizo.github.io/3dport/og.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create the OG image template**

`scripts/og-template.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @import url('../node_modules/@fontsource/geist-sans/400.css');
      @import url('../node_modules/@fontsource/geist-sans/600.css');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1200px; height: 630px;
        background: #FFFFFF; color: #09090B;
        font-family: 'Geist Sans', Inter, system-ui, sans-serif;
        display: flex; flex-direction: column; justify-content: center;
        padding: 90px;
      }
      .name { font-size: 68px; font-weight: 600; letter-spacing: -0.02em; }
      .title { font-size: 34px; color: #52525B; margin-top: 12px; }
      .rule { height: 1px; background: #E4E4E7; margin: 44px 0; }
      .metric { font-size: 40px; font-weight: 600; }
      .accent { color: #2563EB; }
      .label { font-size: 20px; color: #52525B; margin-top: 10px;
               text-transform: uppercase; letter-spacing: 0.14em; }
    </style>
  </head>
  <body>
    <div class="name">JC Delizo</div>
    <div class="title">Digital Transformation &amp; Delivery Manager</div>
    <div class="rule"></div>
    <div class="metric">2 systems/year <span class="accent">&rarr; 20&ndash;28 projects/year</span></div>
    <div class="label">Delivery capacity</div>
  </body>
</html>
```

All content sits inside the 1080×540 safe area because of the 90px padding.

- [ ] **Step 3: Write the generator script**

`scripts/generate-og.mjs`:

```js
import puppeteer from 'puppeteer-core'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const template = `file://${resolve(here, 'og-template.html')}`
const output = resolve(here, '..', 'public', 'og.png')

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(template, { waitUntil: 'networkidle0' })
await page.screenshot({ path: output })
await browser.close()

console.log(`wrote ${output}`)
```

- [ ] **Step 4: Install the dev dependency and add a script**

```bash
npm install --save-dev puppeteer-core
```

Add to `package.json` scripts:

```json
"og": "node scripts/generate-og.mjs"
```

- [ ] **Step 5: Generate the image and verify its dimensions**

Run: `npm run og`
Then: `file public/og.png`
Expected: `PNG image data, 1200 x 630`. Also confirm it is under 1MB with `du -h public/og.png`.

- [ ] **Step 6: Look at the generated image**

Open `public/og.png` and confirm: white background, no text touching the edges, accent blue on the metric only. Regenerate if the type overflows.

- [ ] **Step 7: Commit**

```bash
git add index.html scripts/ public/og.png package.json package-lock.json
git commit -m "feat: add link preview metadata and generated OG image"
```

---

### Task 14: Fix deployment and verify end to end

The workflow triggers on `main`; the repository's only branch is `master`, so it has never run. The live site was published by some other means.

**Files:**
- Modify: `.github/workflows/main.yml`

**Interfaces:**
- Consumes: a passing build from Task 12.
- Produces: a deploy that actually fires.

- [ ] **Step 1: Fix the workflow trigger and Node version**

In `.github/workflows/main.yml`, change:

```yaml
on:
  push:
    branches: ['master']
```

and bump the Node setup step to `node-version: 20` (Vite 6 requires Node 18+; the workflow currently pins 18, which works, but 20 matches local development more closely).

- [ ] **Step 2: Run the full check locally**

```bash
npm test && npm run build
```

Expected: all tests pass, build exits 0.

- [ ] **Step 3: Serve the production build and inspect it in a browser**

```bash
npx vite preview --port 5180
```

Open `http://localhost:5180/3dport/` and verify by eye, at both 375px and 1440px widths:
- One screen of hero, no horizontal scrolling at 375px.
- Three proof cards, five initiative cards, four principles, four experience cards, six capabilities.
- No canvas, no 3D, no console errors.
- Tab through the page: skip link appears first, focus rings visible throughout.

- [ ] **Step 4: Confirm zero WebGL contexts**

In the browser console on the preview:

```js
document.querySelectorAll('canvas').length
```

Expected: `0`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/main.yml
git commit -m "ci: deploy from master, which is the branch that actually exists"
```

- [ ] **Step 6: Merge and deploy**

Do not merge without explicit approval — this publishes to a URL already printed on a résumé, LinkedIn, and JobStreet.

```bash
git checkout master
git merge --no-ff redesign/landing-page
git push origin master
```

- [ ] **Step 7: Verify the deploy actually published**

Wait for the Actions run to finish, then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://jc-delizo.github.io/3dport/
curl -s https://jc-delizo.github.io/3dport/ | grep -c 'og:image'
curl -s -o /dev/null -w "%{http_code}\n" https://jc-delizo.github.io/3dport/og.png
```

Expected: `200`, at least `1`, `200`. If the OG image 404s, the preview card will be blank regardless of the meta tags.

- [ ] **Step 8: Force LinkedIn to re-scrape**

Paste `https://jc-delizo.github.io/3dport/` into LinkedIn's Post Inspector. Without this, LinkedIn serves its cached blank card for weeks, including on posts already published.

---

## Self-Review

**Spec coverage.** §1 goal and section-question test → task ordering and `src/content/site.js` structure. §2 constraints → Global Constraints, plus executable tests in Task 2. §3 verified facts → Task 2 factual tests. §3.5 design language → Tasks 3 and 4 (tokens, container widths, 65ch measure, motion, icons, accessibility). §4 page structure → Task 12 assembly order. §5 all section copy → Tasks 5–11, copy verbatim from the spec. §6 removals → Task 12. §7 link preview → Task 13. §8 deployment → Task 14. §9 open items → all resolved before planning.

**Known gap, accepted:** the spec's 160px/120px section spacing is implemented as `section-gap` (`py-16 md:py-[7.5rem]` = 120px desktop) applied uniformly, with the hero carrying its own larger padding. This is a simplification; if the visual rhythm looks wrong in Task 14 Step 3, adjust the hero padding rather than adding a second spacing class.

**Placeholder scan:** no TBDs, no "add error handling", no "similar to Task N". Every code step contains complete code.

**Type consistency:** `site` is the single named export from `src/content/site.js`, used identically in every component. Primitives are named exports (`Container`, `Card`, `Button`, `SectionHeading`, `Reveal`); section components are named exports; `App` is the sole default export. `Card` accepts `as`, `className`, `children` only — Task 7's note documents that extra props on `Card` are inert.
