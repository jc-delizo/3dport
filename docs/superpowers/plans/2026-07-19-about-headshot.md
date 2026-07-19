# About Headshot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add JC's background-removed portrait to the About section of the recruiter landing page, served as a 12K AVIF with a 24K JPEG fallback.

**Architecture:** A committed ImageMagick script derives two web assets from a cutout master kept outside `src/`. The About section becomes a two-column grid: a bordered `<figure>` whose portrait bleeds off the bottom edge, beside the existing paragraph. No new runtime dependencies.

**Tech Stack:** React 18, Vite 6, Tailwind 3, Vitest 2 + Testing Library, ImageMagick (`convert`, already installed).

Spec: `docs/superpowers/specs/2026-07-19-about-headshot-design.md`
Parent spec: `docs/superpowers/specs/2026-07-18-portfolio-landing-page-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **The published URL must not change.** It is printed on a résumé, LinkedIn and JobStreet.
- **No new runtime dependencies.** The site ships 4; the parent spec treats that as an achievement. ImageMagick is a build-time tool invoked via `child_process`, not a dependency.
- **Bundle budget:** `dist` is currently 392K. Adding the portrait must keep it under **440K**.
- **Asset sizes:** `public/head.avif` ≤ 40KB, `public/head.jpg` ≤ 60KB. Measured actuals are 12K and 24K.
- **Display size:** 240×320 desktop, 180×240 mobile. Aspect ratio 3:4. Assets generated at 480px wide (2× retina).
- **Card background:** `#FAFAFA` (`bg-card`). Border `#E4E4E7` (`bg-hairline`). Corner radius `rounded-xl`.
- **Do not use the `Card` primitive** for the portrait — it hard-codes `p-6 md:p-8`, and a `p-0` override is decided by Tailwind's stylesheet ordering rather than class order. Use a `<figure>` carrying the tokens directly.
- **Public assets referenced from JS must go through `import.meta.env.BASE_URL`.** Vite rewrites asset paths in HTML and CSS but **not** in JS strings. A bare `/head.avif` resolves to `https://jc-delizo.github.io/head.avif` in production and 404s. No existing component references a public asset, so nothing currently guards this.
- **`alt="JC Delizo"`** — parent spec §3.5 requires real alt text on the headshot.
- **Confidentiality:** internal codenames must never appear in content. Enforced by hashed comparison in `src/content/site.test.js`. If that test fails, fix the content, never the test.
- **All 51 existing tests must stay green.**
- **Verify each new test by deliberate failure** — reintroduce the fault it guards against and confirm it fails. This project's history includes a test that asserted class `reveal` while the revealed state was `reveal-visible`; it passed in both states and tested nothing.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `assets/head-master.png` | Create (move) | Cutout master, 1086×1448 RGBA. Outside `src/` so Vite never bundles it. Input to the generator. |
| `scripts/generate-headshot.mjs` | Create | Derives both web assets from the master. Fails loudly. |
| `public/head.avif` | Create (generated) | Primary asset, alpha preserved. |
| `public/head.jpg` | Create (generated) | Fallback, `#FAFAFA` flattened in. |
| `src/test/assets.test.js` | Create | Guards asset existence and size budget on disk. |
| `src/components/About.jsx` | Modify | Two-column layout with the portrait figure. |
| `src/components/About.test.jsx` | Create | Guards alt text, source order, and the BASE_URL footgun. |
| `package.json` | Modify | Adds the `headshot` script. |
| `src/file_000000005dfc7207bf53688745f79d8e.png` | Delete | Original dark-background photo, superseded and unusable. |
| Both spec files + `docs/decision-log.md` | Modify | Record the amendment. |

---

## Task 1: Asset pipeline

Produces the two web assets and the on-disk guard that keeps them honest.

**Files:**
- Create: `assets/head-master.png` (moved from `src/head.png`)
- Create: `scripts/generate-headshot.mjs`
- Create: `src/test/assets.test.js`
- Modify: `package.json`
- Delete: `src/file_000000005dfc7207bf53688745f79d8e.png`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `public/head.avif` and `public/head.jpg`, both referenced by Task 2 as `head.avif` / `head.jpg` relative to `import.meta.env.BASE_URL`. An `npm run headshot` script that regenerates them.

- [ ] **Step 1: Move the master out of `src/` and delete the superseded original**

`src/` is Vite's source root; a 1.58MB PNG there would be bundled if anything ever imported it.

```bash
cd "/home/odoo/jc/3d portfolio/3dport"
mkdir -p assets
git mv src/head.png assets/head-master.png 2>/dev/null || mv src/head.png assets/head-master.png
rm -f src/file_000000005dfc7207bf53688745f79d8e.png
ls -la assets/
```

Expected: `assets/head-master.png` exists, ~1.58MB. `src/` contains no PNG files.

- [ ] **Step 2: Write the failing asset test**

Create `src/test/assets.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

// The portrait ships as two derived files. If either goes missing, About renders a
// broken image; if either bloats, the page's size budget goes with it.
// Regenerate with `npm run headshot`.
const publicDir = resolve(__dirname, '../../public')

const AVIF_MAX = 40 * 1024
const JPEG_MAX = 60 * 1024

describe('portrait assets', () => {
  it('ships both the AVIF and its JPEG fallback', () => {
    expect(existsSync(resolve(publicDir, 'head.avif'))).toBe(true)
    expect(existsSync(resolve(publicDir, 'head.jpg'))).toBe(true)
  })

  it('keeps both inside the size budget', () => {
    expect(statSync(resolve(publicDir, 'head.avif')).size).toBeLessThanOrEqual(AVIF_MAX)
    expect(statSync(resolve(publicDir, 'head.jpg')).size).toBeLessThanOrEqual(JPEG_MAX)
  })
})
```

- [ ] **Step 3: Run it to confirm it fails**

```bash
npx vitest run src/test/assets.test.js
```

Expected: FAIL — `expected false to be true`, because neither asset exists yet.

- [ ] **Step 4: Write the generator**

Create `scripts/generate-headshot.mjs`. It mirrors `scripts/generate-og.mjs`: deterministic, and it throws rather than emitting a broken asset.

```js
/**
 * Regenerates the About portrait from the cutout master.
 *
 * Fails loudly rather than emitting a broken asset — a silently-wrong image on a
 * recruiter-facing page is worse than a failed build.
 *
 * The master is a background-removed PNG supplied by JC. The original studio photo
 * cannot be cut out programmatically: the subject is darker than the backdrop
 * (hair (0,0,1), suit (14,20,39), background corner (23,23,21)), so no colour or
 * luminance threshold separates them. Do not attempt a local re-cut.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const master = resolve(here, '..', 'assets', 'head-master.png')
const avif = resolve(here, '..', 'public', 'head.avif')
const jpg = resolve(here, '..', 'public', 'head.jpg')

const WIDTH = 480 // 2x the 240px desktop display size
const CARD_BG = '#FAFAFA' // spec §5 — lets the JPEG fallback skip an alpha channel
const AVIF_MAX = 40 * 1024
const JPEG_MAX = 60 * 1024

if (!existsSync(master)) {
  throw new Error(`missing cutout master: ${master}`)
}

// Primary: alpha preserved, sits on the card background at runtime.
execFileSync('convert', [master, '-resize', `${WIDTH}x`, '-strip', '-quality', '55', avif], {
  stdio: 'inherit',
})

// Fallback: the card background is a known flat colour, so it can be baked in.
// This is why the fallback costs 24K instead of PNG's 268K.
execFileSync(
  'convert',
  [master, '-resize', `${WIDTH}x`, '-background', CARD_BG, '-flatten', '-strip', '-quality', '78', jpg],
  { stdio: 'inherit' },
)

// If the AVIF lost its alpha it would render as a solid rectangle, which looks
// deliberate enough to ship unnoticed.
const minAlpha = execFileSync(
  'convert',
  [avif, '-alpha', 'extract', '-format', '%[fx:minima]', 'info:'],
  { encoding: 'utf8' },
).trim()

if (Number(minAlpha) !== 0) {
  throw new Error(`AVIF lost its alpha channel (min alpha ${minAlpha}); the portrait would render on a solid block`)
}

for (const [file, max] of [
  [avif, AVIF_MAX],
  [jpg, JPEG_MAX],
]) {
  const bytes = statSync(file).size
  if (bytes < 2048) throw new Error(`${file} is only ${bytes}B — almost certainly not a real image`)
  if (bytes > max) throw new Error(`${file} is ${bytes}B, over the ${max}B budget`)
  console.log(`wrote ${file} (${(bytes / 1024).toFixed(1)}K)`)
}
```

- [ ] **Step 5: Register the npm script**

In `package.json`, add `headshot` to `scripts`, immediately after `og`:

```json
    "og": "node scripts/generate-og.mjs",
    "headshot": "node scripts/generate-headshot.mjs"
```

- [ ] **Step 6: Generate the assets**

```bash
npm run headshot
```

Expected output:

```
wrote .../public/head.avif (11.7K)
wrote .../public/head.jpg (23.4K)
```

Sizes may vary by a few hundred bytes across ImageMagick builds. Anything over budget throws.

- [ ] **Step 7: Run the asset test to confirm it passes**

```bash
npx vitest run src/test/assets.test.js
```

Expected: PASS, 2 tests.

- [ ] **Step 8: Verify the test is load-bearing**

```bash
mv public/head.avif /tmp/head.avif.bak
npx vitest run src/test/assets.test.js
```

Expected: FAIL — `expected false to be true`. Then restore:

```bash
mv /tmp/head.avif.bak public/head.avif
npx vitest run src/test/assets.test.js
```

Expected: PASS again.

- [ ] **Step 9: Confirm the full suite is still green**

```bash
npm test
```

Expected: 53 passed (51 existing + 2 new).

- [ ] **Step 10: Commit**

```bash
git add assets/head-master.png scripts/generate-headshot.mjs src/test/assets.test.js package.json public/head.avif public/head.jpg
git commit -m "feat: derive About portrait assets from the cutout master

AVIF 12K primary with a 24K JPEG fallback; PNG rejected at 268K, which is
68% of the entire bundle. The fallback bakes in the #FAFAFA card background
because that colour is known and flat.

Generator fails loudly on a missing master, lost alpha, or a size regression."
```

---

## Task 2: Portrait in the About section

**Files:**
- Modify: `src/components/About.jsx` (whole file replaced — it is 17 lines)
- Create: `src/components/About.test.jsx`

**Interfaces:**
- Consumes: `public/head.avif` and `public/head.jpg` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the failing component test**

Create `src/components/About.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the portrait with real alt text', () => {
    render(<About />)
    expect(screen.getByAltText('JC Delizo')).toBeInTheDocument()
  })

  it('offers AVIF first, with the JPEG as the img fallback', () => {
    const { container } = render(<About />)
    const source = container.querySelector('picture source')
    expect(source).toHaveAttribute('type', 'image/avif')
    expect(source.getAttribute('srcset')).toMatch(/head\.avif$/)
    expect(screen.getByAltText('JC Delizo').getAttribute('src')).toMatch(/head\.jpg$/)
  })

  it('prefixes both asset paths with the deploy base', () => {
    // Vite rewrites asset paths in HTML and CSS but not in JS strings. A bare
    // "/head.avif" would 404 under the /3dport/ base. This is the only component
    // that references a public asset, so nothing else guards it.
    //
    // Verified 2026-07-19: under Vitest 2.1.9 + jsdom, import.meta.env.BASE_URL
    // resolves to '/3dport/' (it inherits vite.config.js `base`), so this
    // assertion distinguishes correct code from the bug. Do not assume this —
    // some Vitest setups resolve BASE_URL to '/' in test mode, which would make
    // the assertion untestable rather than merely fragile.
    const { container } = render(<About />)
    expect(container.querySelector('picture source').getAttribute('srcset')).toBe('/3dport/head.avif')
    expect(screen.getByAltText('JC Delizo').getAttribute('src')).toBe('/3dport/head.jpg')
  })

  it('reserves the image box so the portrait cannot shift layout', () => {
    render(<About />)
    const img = screen.getByAltText('JC Delizo')
    expect(img).toHaveAttribute('width', '240')
    expect(img).toHaveAttribute('height', '320')
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
npx vitest run src/components/About.test.jsx
```

Expected: FAIL — `Unable to find an element with the alt text: JC Delizo`.

- [ ] **Step 3: Rewrite `About.jsx`**

Replace the entire contents of `src/components/About.jsx`:

```jsx
import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

// Public assets must go through BASE_URL. Vite rewrites asset paths in HTML and CSS
// but not in JS strings, so a bare "/head.avif" would 404 under the /3dport/ deploy
// base. This is the first component in the project to reference a public asset.
const asset = (file) => `${import.meta.env.BASE_URL}${file}`

export function About() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="about" label="Background" title="About." />
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* Not the Card primitive: Card hard-codes p-6 md:p-8, and a p-0 override
                is resolved by Tailwind's stylesheet order, not class order. The
                portrait needs zero padding so it can bleed off the bottom edge. */}
            <figure className="shrink-0 overflow-hidden rounded-xl border border-hairline bg-card">
              <picture>
                <source srcSet={asset('head.avif')} type="image/avif" />
                <img
                  src={asset('head.jpg')}
                  alt="JC Delizo"
                  width="240"
                  height="320"
                  className="block h-[240px] w-[180px] object-cover object-bottom md:h-[320px] md:w-[240px]"
                />
              </picture>
            </figure>
            <p className="measure text-body text-muted">{site.about}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
```

`object-bottom` anchors the shoulders to the frame's lower edge. The master is exactly 3:4 and the box is exactly 3:4, so nothing is cropped today; the anchor matters only if either ratio ever drifts.

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run src/components/About.test.jsx
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify the BASE_URL test is load-bearing**

This is the guard most likely to be silently broken by a future refactor, so prove it fires. Temporarily change the `asset` helper in `About.jsx` to drop the base:

```jsx
const asset = (file) => `/${file}`
```

```bash
npx vitest run src/components/About.test.jsx
```

Expected: FAIL — `expected '/head.avif' to be '/3dport/head.avif'`. Now restore the correct helper and re-run:

```bash
npx vitest run src/components/About.test.jsx
```

Expected: PASS, 4 tests.

- [ ] **Step 6: Confirm the whole suite and the build**

```bash
npm test && npm run build && du -sh dist
```

Expected: 57 passed (51 existing + 2 from Task 1 + 4 here). Build exits 0. `dist` at or under 440K.

- [ ] **Step 7: Verify `/3dport/` survived in the built output**

```bash
grep -o '/3dport/head\.[a-z]*' dist/assets/*.js | sort -u
ls -la dist/head.avif dist/head.jpg
```

Expected: both `/3dport/head.avif` and `/3dport/head.jpg` appear in the bundle, and both files exist in `dist/`.

- [ ] **Step 8: Commit**

```bash
git add src/components/About.jsx src/components/About.test.jsx
git commit -m "feat: add the portrait to the About section

Two-column grid, portrait bleeding off the bottom edge of a bordered figure.
Uses a plain figure rather than the Card primitive because Card's padding
cannot be reliably overridden.

Asset paths go through import.meta.env.BASE_URL — Vite does not rewrite asset
paths inside JS strings, so a bare /head.avif would 404 under the /3dport/ base.
A test pins both paths."
```

---

## Task 3: Record the amendment

Documentation only. Prevents a future reader from finding "headshot: skipped" and concluding the site has no photo.

**Files:**
- Modify: `docs/superpowers/specs/2026-07-18-portfolio-landing-page-design.md` (§9, open item 1)
- Modify: `docs/decision-log.md`

**Interfaces:** none.

- [ ] **Step 1: Amend the parent spec's open item**

In `docs/superpowers/specs/2026-07-18-portfolio-landing-page-design.md`, find open item 1 in §9 and append the amendment so it reads:

```markdown
1. ~~**Headshot** for the OG image~~ — **Resolved 2026-07-18.** Skipped; the preview card is
   type-only. A photo can be added later without touching anything else.
   **Amended 2026-07-19:** still true of the OG card, which remains type-only — but a headshot
   *was* added to the About section under
   `docs/superpowers/specs/2026-07-19-about-headshot-design.md`. The site has a photo; the link
   preview does not.
```

- [ ] **Step 2: Add the entry to the decision log**

In `docs/decision-log.md`, under **"Editorial calls worth not re-litigating"**, append:

```markdown
**The About portrait is a supplied cutout, not the original photo.** The studio headshot had a
near-black gradient background that fought the light page — and it could not be cut out
programmatically, because the subject is *darker than the backdrop*: hair `(0,0,1)` and suit
`(14,20,39)` against a `(23,23,21)` corner. Every threshold erased the jacket and the crown of the
hair before touching the background. Tools that succeed here use semantic segmentation, not colour
keying. JC supplied a background-removed master; it lives at `assets/head-master.png`, outside
`src/` so Vite never bundles it. Regenerate the web assets with `npm run headshot` — do not attempt
a local re-cut of the original.
```

- [ ] **Step 3: Add the standing constraint**

In `docs/decision-log.md`, under **"Standing constraints for future changes"**, append:

```markdown
- **Portrait assets are derived, not hand-made.** `public/head.avif` and `public/head.jpg` come from
  `npm run headshot`. Do not edit them directly. The generator enforces a size budget and fails if
  the AVIF loses its alpha channel.
```

- [ ] **Step 4: Confirm nothing else drifted**

```bash
npm test
```

Expected: 57 passed. Docs changes touch no test, but the confidentiality guard reads the content tree and the run is cheap.

- [ ] **Step 5: Commit**

```bash
git add docs/
git commit -m "docs: record the About headshot in the parent spec and decision log

The parent spec's 'headshot: skipped' item was true only of the OG card.
Amended so a future reader does not conclude the site has no photo."
```

---

## Verification Before Done

Run the whole thing end to end before claiming completion. Evidence before assertions.

- [ ] `npm test` → 57 passed
- [ ] `npm run build` → exit 0
- [ ] `du -sh dist` → ≤ 440K
- [ ] `grep -c '/3dport/' dist/index.html` → non-zero (base path intact)
- [ ] `ls dist/head.avif dist/head.jpg` → both present
- [ ] Open `dist/index.html` in a browser at 375px and 1440px width. Confirm: portrait renders (not a broken image), shoulders meet the frame's bottom edge, no horizontal overflow at 375px, and the section reads correctly stacked on mobile.
- [ ] Confirm the portrait is the only image change — the OG card at `public/og.png` is untouched.

**Not in this plan:** deploying. Publication is a separate decision, and the parent spec's own history records that a green checkmark is not evidence of publication — verify the live URL, the preview image, and the served metadata before believing a deploy worked.
