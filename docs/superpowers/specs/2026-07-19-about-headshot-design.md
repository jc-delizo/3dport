# About Headshot: Design Spec

Adds JC's professional headshot to the About section of the recruiter landing page.

Parent spec: `docs/superpowers/specs/2026-07-18-portfolio-landing-page-design.md`.
This document extends it and amends its §9 open item 1 (see §8 below). Where the two disagree,
this one governs for the headshot only; every other constraint in the parent spec still binds.

---

## 1. Goal

Give the About section a face.

The parent spec assigns About one job: *"who is he to work with?"* It currently answers that with a
single paragraph of prose. A portrait answers it faster and more durably than any sentence, at the
moment a recruiter has already read the evidence and is deciding whether to make contact.

**Scope is deliberately narrow.** One section changes. No copy changes, no new dependencies, no
change to the link preview card.

---

## 2. What is not changing

Recorded so a future reader does not assume this work reopened more than it did.

- **The OG link preview stays type-only.** Parent spec §7 chose that deliberately. Adding a face
  there was considered and declined: it would reopen a settled decision and require a forced
  LinkedIn re-scrape to take effect. Revisit separately if ever wanted.
- **Page structure is unchanged.** About stays at position 8, near the end. Evidence first,
  biography last.
- **No copy changes.** `site.about` is untouched.
- **The published URL is unchanged.** It is printed on a résumé, LinkedIn and JobStreet.

---

## 3. Source asset

JC supplied a background-removed PNG at `src/head.png` — 1086×1448, 8-bit RGBA, 1.58MB.

**Verified before acceptance**, because a bad cutout is worse than no photo:

| Check | Result |
|---|---|
| Alpha channel real | Yes — mean 140, full 0–255 range, 55% transparent |
| Hair edge quality | Clean at 200% zoom; individual strands preserved |
| Matte fringe / dark halo | None — the usual giveaway of a cheap cutout is absent |
| Bottom edge | Jacket fills to the frame; no transparent gap |

The original dark-background photo was unusable as-is and **could not have been cut out locally**.
Sampling showed the subject is darker than the backdrop — hair `(0,0,1)` and suit `(14,20,39)`
against a `(23,23,21)` corner — so no luminance or color threshold can separate them. Every
ImageMagick attempt erased the jacket and the crown of the hair before it touched the background.
Tools that succeed here (remove.bg, Photoshop Select Subject, Apple's Copy Subject) use semantic
segmentation, not color keying. **Do not attempt a local re-cut.**

---

## 4. Layout

Two-column grid inside the existing About section, at the standard `container-page` (72rem).

```
+-- About. ------------------------------------------------+
|                                                          |
|  +----------------+   I'm a Digital Transformation       |
|  |                |   Project Manager with an            |
|  |   [portrait]   |   engineering background who         |
|  |                |   specializes in redesigning         |
|  |   bleeds off   |   software delivery systems...       |
|  |   bottom edge  |                                      |
|  +----------------+                                      |
|                                                          |
+----------------------------------------------------------+
```

- **Desktop (`md` and up):** portrait column fixed at **240px**, paragraph fills the remainder.
  Paragraph keeps its existing `measure` cap of 65ch.
- **Mobile:** stacks, portrait above the text, fixed at **180px** so it does not consume the
  viewport. The parent spec already flags that 11 sections is a long scroll.
- **Portrait aspect ratio: 3:4** (240×320 desktop, 180×240 mobile), matching the source crop.
- **Vertical alignment:** portrait and paragraph align to the top of the grid row.

---

## 5. Treatment

The portrait sits in a bordered surface using the existing design tokens:

- `rounded-xl`, `border border-hairline` (`#E4E4E7`), `bg-card` (`#FAFAFA`)
- `overflow-hidden`
- **No padding.** The figure is bottom-aligned and bleeds off the card's lower edge, so the
  shoulders are cropped by the frame.
- **No shadow, no elevation, no gradient** — parent spec §3.5.

**Why bottom-bleed:** a cutout figure floating with clear space under it reads as a sticker. Cropping
the shoulders at the frame grounds it and makes the removal look intentional rather than incidental.

**Why a bordered surface rather than bare on white:** every other block on this site sits on a
defined surface. An unframed figure would be the only exception.

### Implementation note: do not use the `Card` primitive

`Card` hard-codes `p-6 md:p-8`. Overriding that with `p-0` in `className` is unreliable — the two
classes have equal CSS specificity, so which wins depends on Tailwind's stylesheet ordering, not on
the order they appear in the class string. This is a silent-breakage footgun.

Use a dedicated `<figure>` carrying the tokens directly. Do not add a `padded={false}` prop to
`Card` for one caller.

---

## 6. Assets and pipeline

Measured encodes at 480px wide (2× the 240px display size):

| Format | Size | Role |
|---|---|---|
| AVIF, alpha preserved | **12K** | Primary |
| JPEG q78, `#FAFAFA` baked in | **24K** | Fallback |
| PNG, alpha | 268K | **Rejected** — 68% of the entire current bundle |

Served via `<picture>`: AVIF source, JPEG fallback in `<img>`. Non-AVIF browsers never fetch the
AVIF; AVIF browsers never fetch the JPEG.

The JPEG fallback can bake in `#FAFAFA` precisely because the card background is a known flat
colour. This is why the fallback costs 24K instead of 268K.

**Budget:** `dist` grows 392K → ~428K (+9%). The parent spec's headline achievement was 25MB →
388K; a 9% increase for a real headshot is proportionate. Anything approaching PNG's 268K is not.

**Generation:** a committed script, following the `scripts/generate-og.mjs` pattern — deterministic,
and fails loudly rather than silently emitting a broken asset. Derived files must be reproducible,
not mystery binaries.

**Source hygiene:** both masters currently sit in `src/` (3.6MB combined), where Vite would bundle
them if ever imported. Move the cutout master to **`assets/head-master.png`** — outside `src/`, so
Vite never sees it — and commit it there as the reproducible input to the generation script. Delete
the original dark-background photo from `src/`; it is superseded and unusable (§3).

---

## 7. Accessibility

Non-negotiable, per parent spec §3.5.

- **`alt="JC Delizo"`** — a real portrait of a named person, not decoration. The parent spec
  explicitly requires "real `alt` text on the headshot."
- **Explicit `width` and `height`** so the box is reserved before load. No cumulative layout shift.
- The portrait is not interactive: no focus target, no tabindex, no link.
- Contrast is unaffected — no text sits on the image.

---

## 8. Amendment to the parent spec

Parent §9 open item 1 currently reads:

> ~~**Headshot** for the OG image~~ — **Resolved 2026-07-18.** Skipped; the preview card is
> type-only. A photo can be added later without touching anything else.

That remains accurate **for the OG card**, which is still type-only. Amend it to note that a
headshot was added to the About section on 2026-07-19 under this spec, so a future reader does not
read "skipped" and conclude the site has no photo anywhere.

---

## 9. Testing

- The About section renders the portrait with its alt text.
- Both `<picture>` sources are present, with the AVIF listed first.
- Existing 51 tests stay green.

Per the parent project's established habit: after writing each test, reintroduce the fault it
guards against and confirm it fails. A test that has never been observed failing is not known to
work. This habit caught a test in the original build that asserted class `reveal` while the revealed
state was `reveal-visible` — it passed in both states and tested nothing.

---

## 10. Out of scope

- Headshot on the OG card (§2).
- Any other placement. Only About and the OG card were evaluated; hero, nav and footer placements
  were never considered and are not rejected on the record — if one is ever wanted, it needs its own
  argument.
- Image CDN, responsive `srcset` beyond the single 480w asset, or lazy-loading. The image is one
  screen from the bottom of a page that already loads in well under 400K; complexity here would buy
  nothing measurable.
