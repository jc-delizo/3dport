# Decision Log — Portfolio Rebuild, July 2026

Why this site is the way it is. Written so that a future change doesn't quietly undo a
deliberate choice, and so the reasoning survives after the details are forgotten.

The full design spec is in `docs/superpowers/specs/` and the implementation plan in
`docs/superpowers/plans/`. This document is the shorter "why".

---

## The core reframe

The 2023 site was built to answer **"can this person build React apps?"** — the right question
when its author was a bootcamp graduate looking for a first developer job.

That is no longer the question. Recruiters for Digital Transformation and Technical Program /
Delivery Manager roles are asking **"can this person lead software delivery and improve how an
engineering organization operates?"**

The old site still argued the first case. That mismatch — not the visual design — was the actual
problem, and everything below follows from fixing it.

A second reframe mattered just as much: this is a **landing page**, not a portfolio. A portfolio
says "here is everything I have done." A landing page says "here is why you should interview me."
For these roles the second wins.

**Central claim, which every section reinforces:** *I help organizations deliver software faster by
transforming the way teams work.*

**Differentiator:** not "project manager" — *builds delivery systems*. Many people manage projects;
far fewer redesign how an engineering organization works.

---

## The rule that governs the page

> **Every section must answer a different recruiter question.**

| Section | Question |
|---|---|
| Hero | Why should I keep reading? |
| Proof bar | Is the headline believable? |
| Initiatives | How does he solve problems? |
| Principles | How does he think? |
| Experience | Where has he done this? |
| Recommendations | Do others vouch for this? |
| Capabilities | What domains can he operate in? |
| Tools | Can he fit our environment? |
| Certifications | What is independently verified? |
| About | Who is he to work with? |
| Availability + Contact | Can I hire him now? |

This is the guard against scope creep. Before adding anything, ask which question it answers. If it
answers one already answered, shorten or cut it instead.

It has already been applied twice in anger: an early fifth initiative was cut because it answered the
same question as the first, and the per-initiative "Lesson" lines were removed once the Principles
section took over the "how does he think?" job.

**About sits near the end deliberately.** Nobody arrives wondering about someone's story; they arrive
wondering whether he can solve their problem. Evidence first, biography last.

---

## Numbers: the discipline

Every figure on this site will be probed in an interview, so each one was checked against source
records before shipping. The spec records the provenance of each.

The most important call: **an early draft claimed "26 initiatives led."** True on paper, but several
had not started and one was cancelled — and the phrasing implies delivery. Under twenty minutes of
follow-up questions it would have collapsed, and taken the credibility of the headline 10× figure
with it. It was replaced with **15 enterprise systems live in production**, which is bulletproof.

The general principle, written into the spec: *depth comes from real constraints, never from
inflation.* A padded claim doesn't just fail when an interviewer digs — it makes them wonder what
else was padded, including the number you most need believed. The real work was being **under**-sold,
not over-sold; naming the actual constraints (multi-tenancy, sequential locking, shared engineering
capacity) reads as harder than vague grandeur, and survives questioning.

---

## Title strategy: three surfaces, three jobs

The career arc — *Digital Transformation PM → Scrum Master → Technical Product Leader* — is 85
characters. Browser tabs truncate around 30 and search results around 60, so it cannot go in the
title, no matter how well it reads.

More importantly, the tab and meta title are the **searchable** surface. Recruiters type job titles
into search boxes and ATS filters. "Digital Transformation Project Manager" is a term people search;
an arrow chain is searchable by nobody.

So: **tab and meta title** carry the short searchable title, matching LinkedIn so cross-checking finds
consistency. **Hero heading** the same, giving a skimmer one clear answer. **The arc** lives as the
typographic row under the hero buttons, where length is not a constraint.

The arc replaced a method pipeline (*Business → Process → System → Team → Outcome*). That pipeline
described how the author works — which the Principles section says more memorably and every initiative
demonstrates concretely. The arc duplicates nothing, so it earned the slot.

---

## What was removed, and why

| Removed | Reason |
|---|---|
| 3D computer model (16MB) | Cost 16MB to communicate nothing to a recruiter. A downloaded stock model is not evidence of skill — the working site itself is. |
| 3D globe (2.9MB) | Decorative. Nobody is hired because of a spinning Earth. |
| Floating 3D tool spheres | One WebGL context each — the direct cause of a blank-hero bug (see below). |
| Vertical timeline | Gave every bullet equal visual weight, burying the strongest achievement among routine ones. |
| Three bootcamp projects | Read as junior beside enterprise delivery work, and one demo link was already dead. |
| Contact form | Ran on three-year-old credentials and failed **silently** — telling every visitor "thank you, I will get back to you" whether or not anything sent. A `mailto:` link cannot fail that way. |
| ~5MB of unused images | Imported and shipped, rendered nowhere. |

**No 3D replacement was built.** A bespoke animated visualization would cost more than the model it
replaced and communicate just as little. Visual interest comes from typography, spacing and CSS.

Result: build output fell from ~25MB to under 400K, and dependencies from 13 to 4.

---

## Editorial calls worth not re-litigating

**One LinkedIn recommendation was left out.** It is warm and well written, but recommends its subject
as a *full stack web developer* and praises his CSS and React. That is precisely the positioning this
rebuild moved away from; including it under a page arguing for delivery leadership would undercut the
argument at the moment a recruiter is deciding. A test now fails if it is pasted back in.

**Four of nine certifications were left out** — 2022 marketing and design courses. Real, but they
dilute the story. The five that shipped all support it, led by two national exam rankings, which are
the strongest independently verifiable credential available.

**Amended 2026-07-31: the section grew from 5 to 19 entries** after a deliberate July 2026
upskilling sprint — 7 Open University governance/delivery courses, 6 Anthropic AI
certifications, 1 Alison course. All 19 render as compact linked rows in one flat list, sorted newest first; the two 2018 PICS
rankings close it, their national-ranking notes shown on the row. Open University display names are trimmed — never
inflated — renames; the official↔display mapping lives in
`docs/superpowers/specs/2026-07-31-certifications-expansion-design.md` §4. Dates in this
section display year-only, so a column of identical "Jul 2026" labels doesn't shout about the
clustering the linked certificates already disclose. Every credential URL was verified
publicly accessible before shipping; the Alison entry has no shareable credential and renders
unlinked. The 2022 marketing/design courses stay excluded. A "Certifications" nav link was added
the same day, and entries with issuer-assigned credential IDs (Anthropic, Zuitt) show them on the
row.

**Testimonials were never faked.** Before real recommendations existed, the page used verifiable
metrics as credibility markers instead of inventing quotes.

**The About portrait is a supplied cutout, not the original photo.** The studio headshot had a
near-black gradient background that fought the light page — and it could not be cut out
programmatically, because the subject is *darker than the backdrop*: hair `(0,0,1)` and suit
`(14,20,39)` against a `(23,23,21)` corner. Every threshold erased the jacket and the crown of the
hair before touching the background. Tools that succeed here use semantic segmentation, not colour
keying. JC supplied a background-removed master; it lives at `assets/head-master.png`, outside
`src/` so Vite never bundles it. Regenerate the web assets with `npm run headshot` — do not attempt
a local re-cut of the original.

---

## Defects the process caught

Recorded because each was invisible on inspection and only surfaced by deliberately trying to break
things.

- **A confidentiality guard covering 5 of 7 terms.** Two were unguarded; content containing them would
  have shipped silently.
- **A test that could not fail.** It asserted an element had class `reveal`, but the *revealed* state
  is `reveal-visible` — which contains that substring. It passed in both states, testing nothing.
  Found by making the component start visible and observing the test still pass.
- **An untriggered mock.** The `IntersectionObserver` stub never invoked its callback, so the entire
  scroll-reveal path was unexecuted by any test.
- **Meta tags with no drift guard.** Title, description and preview image are duplicated in static HTML
  and the content module. Editing the content module — the natural place to edit copy — would have left
  the shared link stale forever with no warning.
- **A dead URL in `package.json`**, advertising an address that 404s.
- **The confidentiality guard published the terms it protected.** The forbidden list was written out
  literally, in files committed to a public repository. Now compared as truncated SHA-256 digests
  (`src/content/forbidden.js`); a failing test reports a hash, never the term.

The habit that caught most of these: after fixing, deliberately reintroduce the fault and confirm the
test fails. A test that has never been observed failing is not known to work.

---

## Two engineering constraints to remember

**Browsers cap a page at roughly 16 live WebGL contexts.** The old site rendered each tool icon in its
own canvas. At the limit, adding three more icons pushed it over, and the browser silently discarded
the *oldest* context — which was the hero. The symptom was a blank white hero with no error shown to
the user. Entirely moot now that all WebGL is gone, but the failure mode is worth knowing: silent
discard of the oldest context, not an exception.

**The deploy workflow had never run.** It triggered on a branch name that did not exist in the
repository, so every "deployment" since 2023 was a no-op, and the live site only changed when someone
published it another way. Fixed to the real branch, with the deprecated Pages actions bumped. The
lesson generalizes: a green checkmark is not evidence of publication — verify the live URL, the
preview image, and the served metadata.

---

## Standing constraints for future changes

- **The published URL must not change.** It is printed on a résumé, LinkedIn and JobStreet.
- **Copy lives in one content module.** The static HTML duplicates the meta tags; a test guards them
  against drifting apart.
- **Confidentiality:** internal codenames and entity names must never appear. Enforced by hashed
  comparison. If that test fails, fix the content — never the test.
- **Never revive the retracted "26" claim.** See the spec for why.
- Link previews are cached for about a week; after changing the preview card, force a re-scrape or the
  stale version persists — including on already-published posts.
- **Portrait assets are derived, not hand-made.** `public/head.avif` and `public/head.jpg` come from
  `npm run headshot`. Do not edit them directly. The generator enforces a size budget and fails if
  the AVIF loses its alpha channel.

---

## 2026-08-05 — Delivery Portfolio section

Added the full-breadth project index (57 anonymized entries, 9 domain groups) between
Initiatives and Principles, per docs/superpowers/specs/2026-08-05-delivery-portfolio-design.md.
Key choices: anonymize every internal name (guard-enforced), one-line descriptions with
no interactivity, role chips restricted to Led/Coordinated/Oversight, and no hard project
count in the intro so the resume-backed "65 systems" Experience bullet stays authoritative.

---

## 2026-09-13 — Four signature themes (Order, Throughput, Signal, Atrium)

Built the replacement signature feature left open in the 2026-08-15 spec when the command
palette was pulled ("wrong audience: recruiters don't reach for ⌘K"). Four light-mode themes,
each with one gesture that works with no interaction, no explanation, and no desktop:

- **Order** — warm plan-set canvas with a persistent drafting grid; twelve scattered cards
  snap onto it once on load. Chaos → system, which is the job description.
- **Throughput** — scroll advances 65 work items through Intake/Build/Review/Shipped.
- **Signal** — lit white instrument panels on a recessed deck; a sparkline rail on the right.
- **Atrium** — CSS 3D planes on one shared stage. Earns the repo's name without WebGL.

Key choices:

- **Zero new runtime dependencies.** GSAP 3.15 already ships Flip/SplitText/DrawSVG unused;
  the effects here need none of them, and react-three-fiber (~600KB) was rejected for Atrium
  in favour of `preserve-3d` — this deploys to GitHub Pages for recruiters on mobile data.
- **Every figure is sourced.** The Throughput rail ships exactly 65 and the Signal rail shows
  20–28/65/15 — all already stated in `site.proof`. A console displaying numbers it cannot
  source is the credibility risk this audience notices first.
- **Reduced motion is a designed state, not a fallback.** Order starts assembled, Throughput
  starts with the board full and the count landed, Atrium starts flat. Each reads as composed
  rather than as an effect that failed to load.
- **Only one new `rhythm`.** Order reuses `bordered`, Throughput `bands`, Signal `tiles`;
  only Atrium needed `planes`. Every new branch is surface area in a file 11 components read.
- **`DEFAULT_THEME` stays `quiet`.** The four are for evaluation; the default moves only once
  one is chosen, and that change versions the storage key (as the Quiet switch did).
- Accents validated against their own canvas *and* their own chart surface — 16 pairs, all
  AA or better. See `grammar.chart` per theme.

Sandboxes: `scripts/theme-sandboxes.sh start|stop` runs all four on :5181–:5184 via
`VITE_FORCE_THEME`, a dev-only pin in ThemeContext that production builds never consult.

---

## 2026-09-14 — Atrium chosen; Order, Throughput, Signal removed

JC reviewed all four signature candidates live on the sandboxes and picked
**Atrium**. The other three were removed the same day — registry entries,
components, CSS blocks, and tests — not just hidden: an unreachable theme is
dead code 11 grammar consumers would still have to honour.

What survives: the `planes` rhythm, `AtriumPlane`, the Atrium token/CSS block,
and the sandbox script (now Atrium-only on :5184, with a `setsid` fix so
`stop` kills the vite child, not just the npx wrapper). `DEFAULT_THEME` is
still `quiet` — promoting Atrium is a separate, deliberate step that versions
the storage key.

If a dropped theme is ever wanted back, it's one revert away: commit f78e8a9
(themes) and 6f170c6/3a9877c (their fixes).

---

## 2026-09-14 — Atrium Signature Pass + Receipts Pass (+ quiet wins)

Approved from the researched ideas menu (Awwwards/Muzli winners + PM-recruiter
guidance). Everything still zero new runtime dependencies.

**Atrium Signature Pass**
- Planes now compose one transform from custom properties: `--elev` (resting
  depth), `--tip-*` (entering tilt), `--par-*` (cursor parallax). The 600ms
  transition doubles as the parallax smoother.
- Entrance dolly: the stage mounts one frame deep (`data-arrived='false'`),
  then releases. Replays when Atrium becomes the active theme.
- Depth as information via `grammar.depths`: hero/initiatives/case-studies/
  recommendations raised (+26px), tools/certifications/footer recessed (−34px).
- Cursor parallax gated on NOT `(pointer: coarse)` — headless/kiosk browsers
  report `pointer: none` and fire no pointer events, so excluding only coarse
  is both safer and testable. Touch-primary devices skip it.
- View Transitions API: theme switches route through `startViewTransition`
  (flushSync inside the callback); `@view-transition { navigation: auto }`
  gives main ↔ Lab a cross-document morph. Both stand down for reduced motion.

**Receipts Pass**
- Every case study carries `facts` (Role / Team / Duration / Context) rendered
  as a bordered definition list on card and overlay. Hard rule, tested: every
  value restates a fact already in the entry's story/timeline or Experience —
  the strip summarizes, never introduces claims.

**Quiet wins**
- Person JSON-LD in index.html, guarded by site.test.js against drifting from
  site.js meta.
- public/404.html: self-contained (no webfonts, no JS), Atrium-styled tilted
  plane, "This page never shipped."
- Data-saver: `navigator.connection.saveData` skips the decorative Backdrop
  and all Atrium stage motion (`prefersLiteData()`).

Deliberately NOT done: scrollytelling for the 2→28 story (adjacent to the
rejected Throughput concept; JC can opt in later), Scenario Playbook (offered,
not yet approved). DEFAULT_THEME still 'quiet'.

---

## 2026-09-14 (later) — Projection safety: the hover-divergence post-mortem

JC reported: hovering one tool highlighted another, the tools glare vanished,
and the entrance dolly/parallax were invisible. One root cause, found by
measurement, not guessing:

**`perspective` lived on the page-height stage.** Percent perspective-origins
resolve against the element's own box, so the vanishing point sat at
`700px, 5952px` — ~6,000px off-screen. Every plane projected relative to a
point nobody could see. With the signature pass's persistent resting Z
(±26/34px), visual geometry diverged from hit-test geometry (a real mouse over
"Jira" hovered nothing), Chrome stopped repainting `background-clip: text`
glare inside the non-flat 3D context, and motion read as smear, not depth.

**The contract now (regression-tested in signature.test.jsx):**
1. `perspective` is declared per-section on `.atrium-cell`, never on the stage.
2. Planes rest FLAT. Persistent effects are 2D only — elevation is
   scale (±1.5%) + shadow depth; parallax is a differential 2D drift
   (raised 12px, base 6px, recessed 2px — the differential is the depth cue).
3. 3D is transient: scroll-in tilt and the entrance dolly (deepened to
   −300px, a true zoom under local perspective), both ending at identity.

Verified live: 12/12 chips hit-test exact with elevation applied, `li:hover`
true under a real mouse, glare paints (1,295px changed between frames 400ms
apart), raised plane drifts 23px cursor-left-to-right. Planes collapse to 2D
matrices at rest — also cheaper to render.

Lesson recorded: never leave a persistent non-identity 3D transform under
content that must be hovered, and never put perspective on an element taller
than the viewport.

---

## 2026-09-15 — Flat nav, footer sitemap, rails swapped

JC proposed removing Portfolio/Experience/Contact from the nav (redundant with
the trail) and moving the trail left / glyphs right. Amended after review: the
trail only exists at ≥1680px, so removing nav items would strand laptop and
phone visitors — the majority, and the audience. Agreed outcome:

- **Nav flattened, not gutted:** `Case Studies · Lab · Contact` + Résumé and
  Themes. Both dropdowns removed from `site.nav`; the money links survive at
  every width. The config-driven dropdown machinery in Nav.jsx is kept —
  entries with `items` would still render as groups.
- **Footer sitemap** (`site.footerNav`): the eight demoted sections in one
  quiet mono row. Page-aware — the footer also renders on Lab, so links there
  route back via BASE_URL (Footer now takes `currentPage`, as Nav does).
- **Rails swapped:** SectionNavigator to the left gutter (reads as a document
  outline; hover/active nudge flipped to push toward content), all 44 desktop
  backdrop glyphs mirrored to the right gutter with rotations negated. The
  layers keep opposite gutters — tested.

Verified at 1920px: trail at x=28, nearest glyph at x=1755, flat nav rendering,
sitemap row live. 237 tests green.

---

## 2026-09-15 (later) — Width system: compact nav dropdown + two-stage trail

JC: 13-inch-class screens should get a single Portfolio dropdown (all
sections) · Lab · Themes · Résumé; and his 15.6" laptop had no trail — 125%
Windows scaling makes a 1920×1080 panel a 1536px viewport, under the trail's
1680px gate. The width system now:

| viewport      | nav                              | trail          |
|---------------|----------------------------------|----------------|
| <1024 (lg)    | hamburger panel (unchanged)      | hidden         |
| 1024–1439     | Portfolio dropdown · Lab · Themes · Résumé | hidden |
| 1440–1679     | flat Case Studies · Lab · Contact | numbers only  |
| ≥1680         | flat                             | full labels    |

- The compact dropdown's items derive from SectionNavigator's SECTIONS (page
  order, minus Home/Lab) — one source of truth for "all the sections".
- Both variants render always and are CSS-switched at 1440px (no resize
  listeners); the dropdown machinery kept on 09-15 got its use back. Applied
  to the Cupertino global bar too.
- Compact trail is numbers-only with aria-label + title per stop: the
  1440-1679 gutter (~80-200px) can't fit labels without touching the planes.
- Backdrop glyphs stay ≥1680 — the right gutter below that is genuinely bare.

Verified at 1280/1366/1536/1680/1920: no horizontal overflow, correct
variant at every width; 1536 (JC's laptop) = flat nav + numbers trail.

---

## 2026-09-15 (revision) — Dropdown to 1680; trail always shows its labels

JC on his 1536px laptop: no dropdown (flat nav held until 1440 there... it
showed flat) and a numbers-only trail — "it must also show the texts". The
numbers-only compromise is dead; what scales now is the type, not the content:

| viewport   | nav                              | trail                    |
|------------|----------------------------------|--------------------------|
| <1024      | hamburger panel                  | hidden                   |
| 1024–1519  | Portfolio dropdown · Lab · Themes · Résumé | hidden (dropdown carries nav) |
| 1520–1679  | Portfolio dropdown (same)        | numbers + labels, 9px compact type, left-3 |
| ≥1680      | flat Case Studies · Lab · Contact | numbers + labels, full type |

Verified clearances (trail right edge → first plane left edge): 12px at 1536,
41px at 1680, 161px at 1920; no horizontal overflow 1366–1920.

---

## 2026-09-15 (evening) — Glare exempt from reduce; uniform widths; trail pitch

Three JC reports, three root causes:

1. **Tools glare "gone" (again).** The sweep painted fine in every headless
   check — the one path that fully disables it is `prefers-reduced-motion`,
   which Windows reports when "animation effects" is off (common on work
   laptops). Decision: the tools sweep is a color shimmer, not spatial
   motion, so it is now EXEMPT from reduce (JS gate removed in Tools.jsx,
   selector removed from the CSS reduce block). The hero's one-pass
   .text-glare and all Atrium motion stay gated — those are motion.
2. **Section widths differ on small screens.** The ±1.5% elevation scale made
   raised planes ~37px wider than recessed ones — depth on a 27" monitor,
   misalignment on a laptop. The scale vars now live inside a
   `min-width: 1680px` media query; below that all planes share one width
   (verified: five sections at exactly 1232px @1536) and depth is carried by
   shadow + parallax alone.
3. **Trail labels too far apart at compact size.** `text-[9px]` without a
   leading inherited a 26.4px line height (vs text-label's 20px) — pitch was
   39.4px vs 33px. `leading-5` pins the compact line box to the full-size
   one: 33px pitch at every width now.

Told JC: if he also wants the entrance dolly/parallax/hero glare on his
machine, Windows Settings > Accessibility > Visual effects > Animation
effects ON — those remain reduce-gated by design.

---

## 2026-09-15 (night) — Anchor landings: scrollToSection everywhere

JC: trail clicks landed sections under the navbar or cut their tops off.
Measured: headings at 18-50px under a 73px sticky header, section tops up to
-136px off-screen, variance driven by two defects — no scroll offset for the
sticky header anywhere, and native anchor scrolling chasing the transformed
position of planes still animating their entrance (getBoundingClientRect
includes the translate; landings drifted up to 34px with timing).

Fix: `src/lib/scrollToSection.js` — targets the enclosing <section>'s layout
position (transforms never touch it), under the *measured* header height plus
12px. One document-level click interceptor in App routes every same-page
anchor through it (trail, nav, footer sitemap, hero CTAs, mobile panel),
pushes the hash, and falls back to native behavior for missing targets; the
skip link is exempt (its job is focus). Hash loads use the same helper with
instant behavior.

Verified at 1920 and 1536: every section lands at exactly 85px (header 73 +
12). Contact stops at 126px — the page bottom-clamps; that is scroll physics,
not a defect.

---

## 2026-09-15 (late) — Tier 2: Scenario Playbook + Now strip

Both Tier-2 items from the researched menu, on JC's go.

**Scenario Playbook** ("How I'd run your project") — lives inside Principles
(no new section id, so nav/trail/footer maps untouched). Three scenarios —
Greenfield build / Legacy replacement / Rescue mission — each showing the
opening plays, the risks flagged before work starts, and a "receipt" link to
the initiative or case study that proves it. Fact discipline enforced by
test: every play restates a playbook stage/ceremony/governance rule, every
risk restates a documented case-study moment, every evidence href targets an
existing section, forbidden-names guard covers the module. Proper tablist
(roving tabindex, arrow keys); panel swap animation stands down under
reduced motion; "Read the full playbook" reuses PlaybookOverlay.

**Now strip** — site.now { updated, items } rendered at the top of the
footer: accent "NOW · <month year>" plus three current lines, each restating
an existing site claim (5–11 concurrent, 949 tickets, this site's Atrium
work). Update items + date with deploys that change them.

---

## 2026-09-17 — Domain marks on the delivery portfolio

Chosen over real app logos (JC asked; recommendation accepted): logos would
have broken the site's anonymization promise — a logo identifies a system
faster than its name — and most entries had none, so coverage would have
read as patchy. Instead: nine stroke-only marks, one per portfolio category,
drawn in the backdrop library's line-art language (64×64, currentColor) but
WITHOUT pathLength — the draw-in dash is scoped to [data-backdrop] and these
render statically.

Every category header carries its mark in accent; every entry carries a
small muted one. Coverage is enforced both ways by test: a new category
without a mark fails, and an orphaned mark for a removed category fails.

---

## 2026-09-17 — Atrium default; unique per-project marks

- **Atrium is the default theme.** Storage key v2 → v3 so returning visitors
  see it; every theme test pins its theme through the v3 key now. The
  case-study overlay's themed-surface test pins Quiet explicitly (Atrium
  maps no case-studies tile — plain canvas there is the intended look).
- **57 unique project marks** (src/components/portfolio/projectGlyphs.jsx),
  one per delivery-portfolio entry, keyed by exact title, drawn in the same
  64×64 stroke language. Entry marks grew (h-4 muted/70 → h-7 ink/75) per
  JC. Category marks stay on group headers; they also serve as the code
  fallback for an entry whose mark isn't drawn yet — though the coverage
  test makes that state unshippable. Guards: title↔mark coverage both ways,
  and a uniqueness test comparing rendered geometry (it caught a stray mark
  for a non-portfolio title during the build).

---

## 2026-09-17 — The Lab becomes a room of the one-page app

JC's proposal (Lab slides in, Back-to-portfolio chip beside the brand),
built with the recommended depth variant: under Atrium the outgoing view
recedes into the stage and the incoming one dollies forward; other themes
slide, both views entering from the right. Architecture:

- One app, two views. LabView extracted from the old standalone LabApp and
  lazy-loaded (its own ~64KB-gz chunk; an idle prefetch at +2.5s makes first
  clicks instant, and the router warms the chunk BEFORE switching — a sync
  switch that suspends on an unloaded lazy component withholds React's whole
  commit, which froze the first switch until the import resolved).
- Real URLs survive: /lab/ still exists and its html boots the same app
  straight into the Lab view; switching pushes history; popstate drives the
  view; browser Back/Forward verified both ways.
- The outgoing view stays mounted for 620ms as a frozen, aria-hidden
  fixed-layer snapshot rendered AFTER the live view (so duplicated ids never
  win getElementById), translated to its scroll position.
- Side rails choreograph with the switch — trail out left, glyphs out right,
  both back in on return — and, like the back chip, are deliberately NOT
  reduce-gated (small peripheral strips; the sliding is the requested
  design; the full-screen swap is what reduce suppresses).
- All section links are same-document hashes now; the anchor interceptor
  switches views first when a target isn't mounted. Footer/Nav cross-page
  routing deleted. lab-main.jsx and LabApp.jsx removed.
