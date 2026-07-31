# Certifications Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow the Certifications section from 5 to 19 entries — two featured PICS cards plus a flat compact list — with every credentialed entry linking to its certificate in a new tab.

**Architecture:** Data-driven: `src/content/site.js` gains 14 entries and `url`/`featured` fields; `src/components/Certifications.jsx` splits rendering into featured cards (existing treatment) and compact hairline rows. No new dependencies, no meta changes.

**Tech Stack:** React 18, Vite 6, Tailwind 3, Vitest 2 + Testing Library, lucide-react (already installed).

**Spec:** `docs/superpowers/specs/2026-07-31-certifications-expansion-design.md` — read it first; §4 holds the official↔display title mapping, §5 the layout rules.

## Global Constraints

- Branch: `feature/certifications-expansion`. **`master` is untouched; no merge without explicit user approval.**
- Vite `base` stays `/3dport/`; the published URL must not change.
- All copy lives in `src/content/site.js` — components render data, never hardcode copy.
- No new npm dependencies.
- Dates display **year-only** in this section: `'2018'`, `'2023'`, `'2026'`.
- Every credential link: `target="_blank"` + `rel="noopener noreferrer"`, `https://` only.
- The Alison entry ("Agile Project Management") has **no** `url` and must render without an anchor.
- Existing guards (forbidden terms, excluded recommendation, meta drift) must stay green. If the forbidden-terms test fails, fix the content, never the test.
- Mobile is first-class: a **measured** 375px check is required before the branch is declared done (jsdom is blind to layout).

---

### Task 1: Content data — 19 certifications with URLs

**Files:**
- Modify: `src/content/site.js:193-226` (the `certifications` array)
- Test: `src/content/site.test.js` (append a describe block)

**Interfaces:**
- Produces: `site.certifications: Array<{ name: string, issuer: string, date: string, url?: string, note?: string, featured?: boolean }>` — 19 entries, exactly 2 with `featured: true`, exactly 18 with `url`. Task 2's component consumes this shape.

- [ ] **Step 1: Write the failing data-guard tests**

Append to `src/content/site.test.js` (top-level, alongside the existing describes):

```js
describe('certifications data', () => {
  it('has 19 entries; 18 carry https credential URLs, Alison carries none', () => {
    expect(site.certifications.length).toBe(19)
    const withUrl = site.certifications.filter((c) => c.url)
    expect(withUrl.length).toBe(18)
    withUrl.forEach((c) => expect(c.url).toMatch(/^https:\/\//))
    const alison = site.certifications.find((c) => c.issuer === 'Alison')
    expect(alison.name).toBe('Agile Project Management')
    expect(alison.url).toBeUndefined()
  })

  it('features exactly the two PICS national-ranking certifications, first', () => {
    const featured = site.certifications.filter((c) => c.featured)
    expect(featured.map((c) => c.name)).toEqual([
      'Certified Instrumentation and Control Engineer',
      'Certified Instrumentation and Control Technician',
    ])
    featured.forEach((c) => expect(c.note).toMatch(/^Ranked/))
    expect(site.certifications.indexOf(featured[0])).toBe(0)
    expect(site.certifications.indexOf(featured[1])).toBe(1)
  })

  it('uses year-only dates in this section', () => {
    site.certifications.forEach((c) => expect(c.date).toMatch(/^\d{4}$/))
  })
})
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `npm test -- src/content/site.test.js`
Expected: FAIL — length 5 ≠ 19.

- [ ] **Step 3: Replace the `certifications` array in `src/content/site.js`**

Replace the entire array (lines 193–226, from the `// Ordered by relevance…` comment through the closing `],`) with:

```js
  // Ordered by relevance to the target roles, not by date. The two PICS certifications
  // lead as featured cards — the national exam rankings are the strongest verifiable
  // credential here. Open University display names are approved renames; the official
  // certificate titles are recorded in
  // docs/superpowers/specs/2026-07-31-certifications-expansion-design.md §4.
  certifications: [
    {
      name: 'Certified Instrumentation and Control Engineer',
      issuer: 'Philippine Instrumentation and Control Society',
      date: '2018',
      url: 'https://drive.google.com/file/d/1KQnIfynOvAwnVbk1sjalBO1kvbvwb76j/view?usp=sharing',
      note: 'Ranked 8th of 1,057 examinees',
      featured: true,
    },
    {
      name: 'Certified Instrumentation and Control Technician',
      issuer: 'Philippine Instrumentation and Control Society',
      date: '2018',
      url: 'https://drive.google.com/file/d/1xjIMN90watG8_hBkIYzvLZZnYpraH6TR/view?usp=sharing',
      note: 'Ranked 11th of 2,089 examinees',
      featured: true,
    },
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
    },
    {
      name: 'AI Fluency: Framework & Foundations',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/jcisomdtuk9f',
    },
    {
      name: 'AI Fluency for Builders',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/k2o4dxyjy3yk',
    },
    {
      name: 'Model Context Protocol: Advanced Topics',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/x3yhyuej563n',
    },
    {
      name: 'Claude on Google Cloud',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/3np2qtp8rujt',
    },
    {
      name: 'Teaching AI Fluency',
      issuer: 'Anthropic',
      date: '2026',
      url: 'https://verify.skilljar.com/c/qh73wcpgrf37',
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
  ],
```

Do not change anything else in the file.

- [ ] **Step 4: Run the whole suite — it must be fully green**

Run: `npm test`
Expected: all pass. (The current component renders every entry as a card and ignores `url`/`featured`, so the existing component tests still pass with the new data — 19 cards is ugly but correct until Task 2.)

- [ ] **Step 5: Commit**

```bash
git add src/content/site.js src/content/site.test.js
git commit -m "feat: certifications content — 19 entries with verified credential URLs"
```

---

### Task 2: Two-tier Certifications component with credential links

**Files:**
- Modify: `src/components/Certifications.jsx` (full rewrite, shown below)
- Create: `src/components/Certifications.test.jsx`
- Modify: `src/components/Recommendations.test.jsx` (remove its `describe('Certifications', …)` block and the now-unused `Certifications` import)

**Interfaces:**
- Consumes: `site.certifications` (shape from Task 1).
- Produces: no exports consumed elsewhere; `<Certifications />` is already mounted in `App.jsx`.

- [ ] **Step 1: Create `src/components/Certifications.test.jsx` (failing tests)**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Certifications } from './Certifications'
import { site } from '../content/site'

describe('Certifications', () => {
  it('renders all 19 certifications with issuer and date', () => {
    const { container } = render(<Certifications />)
    expect(site.certifications.length).toBe(19)
    site.certifications.forEach(({ name, issuer, date }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getAllByText(issuer).length).toBeGreaterThan(0)
      expect(screen.getAllByText(date).length).toBeGreaterThan(0)
    })
    // Two tiers: exactly the two featured entries render as cards (h3 headings).
    expect(container.querySelectorAll('h3').length).toBe(2)
  })

  it('links every credentialed entry to its certificate in a new tab, safely', () => {
    const { container } = render(<Certifications />)
    const links = container.querySelectorAll('a')
    expect(links.length).toBe(18)
    links.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toBe('noopener noreferrer')
      expect(a.getAttribute('href')).toMatch(/^https:\/\//)
    })
  })

  it('renders the Alison entry as plain text — no anchor, no dead link', () => {
    render(<Certifications />)
    const alison = screen.getByText('Agile Project Management')
    expect(alison.closest('a')).toBeNull()
  })

  it('leads with the two national exam rankings, which are the strongest credential', () => {
    render(<Certifications />)
    expect(screen.getByText(/8th of 1,057/)).toBeInTheDocument()
    expect(screen.getByText(/11th of 2,089/)).toBeInTheDocument()
  })

  it('omits the 2022 marketing and design courses, which dilute the positioning', () => {
    const { container } = render(<Certifications />)
    expect(container.textContent).not.toMatch(/Social Media Management|FB Ads|Copywriting|Canva/i)
  })
})
```

- [ ] **Step 2: Run the new file to verify it fails**

Run: `npm test -- src/components/Certifications.test.jsx`
Expected: FAIL — `h3` count is 19 (old component cards everything), link count is 0.

- [ ] **Step 3: Rewrite `src/components/Certifications.jsx`**

Replace the whole file with:

```jsx
import { ExternalLink } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

// The name is the accessible link; the icon is only the visual cue that it leaves the page.
// Entries without a credential URL (Alison) render as plain text — never a dead link.
function CredentialName({ name, url, className = '' }) {
  if (!url) return <span className={className}>{name}</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition-colors hover:text-accent`}
    >
      {name}
      <ExternalLink size={14} aria-hidden="true" className="ml-1.5 inline-block text-muted" />
    </a>
  )
}

export function Certifications() {
  const featured = site.certifications.filter((c) => c.featured)
  const compact = site.certifications.filter((c) => !c.featured)

  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="certifications" label="Verified" title="Certifications." />
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map(({ name, issuer, date, note, url }, i) => (
            <Reveal key={name} delay={Math.min(i, 3) * 60}>
              <Card className="h-full">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-card-title font-semibold tracking-tight">
                    <CredentialName name={name} url={url} />
                  </h3>
                  <p className="shrink-0 text-label uppercase tracking-widest text-muted">{date}</p>
                </div>
                <p className="mt-2 text-body text-muted">{issuer}</p>
                {note ? <p className="mt-3 text-label text-accent">{note}</p> : null}
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <ul className="mt-8 border-t border-hairline">
            {compact.map(({ name, issuer, date, note, url }) => (
              <li
                key={name}
                className="flex flex-col gap-1 border-b border-hairline py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <div className="min-w-0">
                  <CredentialName name={name} url={url} className="text-body font-medium" />
                  {note ? <p className="mt-1 text-label text-accent">{note}</p> : null}
                </div>
                <p className="flex shrink-0 items-baseline gap-3 text-label text-muted">
                  <span>{issuer}</span>
                  <span className="uppercase tracking-widest">{date}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Remove the old Certifications tests from `src/components/Recommendations.test.jsx`**

Delete the entire `describe('Certifications', …)` block (everything from `describe('Certifications', () => {` to its closing `})`) and the `import { Certifications } from './Certifications'` line. The `describe('Recommendations', …)` block stays untouched.

- [ ] **Step 5: Run the full suite — green**

Run: `npm test`
Expected: all pass, including the new `Certifications.test.jsx`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Certifications.jsx src/components/Certifications.test.jsx src/components/Recommendations.test.jsx
git commit -m "feat: two-tier Certifications — featured PICS cards plus compact linked rows"
```

---

### Task 3: Decision-log amendment, build, and measured mobile check

**Files:**
- Modify: `docs/decision-log.md` (the "Four of nine certifications" paragraph, around line 129)

**Interfaces:**
- Consumes: the shipped result of Tasks 1–2. Produces: docs only.

- [ ] **Step 1: Amend the decision log**

In `docs/decision-log.md`, find the paragraph beginning `**Four of nine certifications were left out**` and append directly after it (as a new paragraph):

```markdown
**Amended 2026-07-31: the section grew from 5 to 19 entries** after a deliberate July 2026
upskilling sprint — 7 Open University governance/delivery courses, 6 Anthropic AI
certifications, 1 Alison course. The two PICS rankings keep the featured-card treatment;
everything else is a compact linked row. Open University display names are trimmed — never
inflated — renames; the official↔display mapping lives in
`docs/superpowers/specs/2026-07-31-certifications-expansion-design.md` §4. Dates in this
section display year-only, so a column of identical "Jul 2026" labels doesn't shout about the
clustering the linked certificates already disclose. Every credential URL was verified
publicly accessible before shipping; the Alison entry has no shareable credential and renders
unlinked. The 2022 marketing/design courses stay excluded.
```

- [ ] **Step 2: Full verification — suite and build**

- Run `npm test` → all green.
- Run `npm run build` → exit 0.
- Run `grep -c '/3dport/' dist/index.html` → non-zero (base path intact).
- Run `du -sh dist` → still well under 1M (this change adds only text).

- [ ] **Step 3: Measured 375px check — do not eyeball it**

jsdom performs no layout; this is the only step that can catch a compact row overflowing on
mobile. From the project root:

```bash
cat > ./measure-tmp.mjs <<'EOF'
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage()
for (const w of [375, 768, 1440]) {
  await p.setViewport({ width: w, height: 900 })
  await p.goto('http://localhost:4180/3dport/', { waitUntil: 'networkidle0' })
  const r = await p.evaluate(() => {
    const sec = document.getElementById('certifications').closest('section')
    const links = sec.querySelectorAll('a').length
    const items = sec.querySelectorAll('li').length
    return { scrollW: document.documentElement.scrollWidth, secW: Math.round(sec.getBoundingClientRect().width), links, items }
  })
  console.log(`${w}px scrollWidth=${r.scrollW} section=${r.secW} links=${r.links} rows=${r.items}`)
}
await b.close()
EOF
npx vite preview --port 4180 >/dev/null 2>&1 &
sleep 4 && node ./measure-tmp.mjs; kill %1; rm -f ./measure-tmp.mjs
```

Expected, recorded not assumed: `scrollWidth` equals the viewport width at all three widths
(no horizontal overflow), `links=18`, `rows=17`. Any `scrollWidth` above the viewport means a
row is overflowing — fix the row layout, re-run, and only then proceed.

- [ ] **Step 4: Commit**

```bash
git add docs/decision-log.md
git commit -m "docs: record the certifications expansion in the decision log"
```

- [ ] **Step 5: Stop.** Do not merge. Report results (test counts, build size, measured widths) and hand back for review — merging `feature/certifications-expansion` into `master` and deploying is a separate, explicitly approved step (superpowers:finishing-a-development-branch).
