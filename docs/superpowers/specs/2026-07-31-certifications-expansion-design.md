# Certifications Expansion: Design Spec

Date: 2026-07-31
Repo: `jc-delizo/3dport` — branch `feature/certifications-expansion`
Parent spec: `2026-07-18-portfolio-landing-page-design.md` (all its constraints inherit; nothing here overrides it)

## 1. Goal

Grow the Certifications section from 5 entries to 18, and give **every** entry a clickable
credential link. The section keeps its one job — answering *"what is independently verified?"* —
without visually outweighing Initiatives and Experience on a page built for a 30–60 second read.

Source of record: JC's Google Sheet (read 2026-07-31 via the `google-sync` service account).

## 2. What is added

**13 new certifications, all July 2026:**

- 7 × The Open University (OpenLearn) — governance, PMO, software delivery, change management
- 6 × Anthropic (Skilljar-verified) — AI fluency, MCP, Claude on Google Cloud

**Credential URLs for the 5 existing entries** (2 × PICS, 3 × Zuitt).

The four 2022 marketing/design certifications remain excluded — the editorial decision in the
decision log stands, and they are not in the source sheet.

## 3. Verified facts

**All 18 credential URLs were verified publicly accessible on 2026-07-31** (anonymous fetch; each
page title matched its certificate). The 9 Google Drive files are set to anyone-with-link viewing —
JC confirmed this is intentional and permanent. The Zuitt MySQL link in the sheet was `http://`;
it ships as `https://` (verified working).

Two official titles were corrected against their Skilljar verification pages:

| Sheet said | Verification page says (ships as) |
|---|---|
| Al Fluency Framework & Foundations | AI Fluency: Framework & Foundations |
| Teaching the AI Fluency Framework | Teaching AI Fluency |

## 4. Display names (approved renames)

The Open University course titles read introductory. Display names are trimmed/reordered — never
inflated — so a recruiter opening the linked certificate can still match title to claim at a glance.
JC approved all seven on 2026-07-31:

| Official title (on certificate) | Display name |
|---|---|
| Software development for enterprise systems | Software Development for Enterprise Systems |
| Project Governance and Project Management Office (PMO) | Project Governance & PMO |
| Approaches to software development | Software Development Approaches |
| Successful IT systems | Delivering Successful IT Systems |
| Project management: the start of the project journey | Project Management Essentials |
| Hybrid working: change management | Change Management for Hybrid Work |
| Managing virtual project teams | Managing Virtual Project Teams |

Anthropic titles ship exactly as verified. Zuitt and PICS entries keep the names already on the
site (fuller than the sheet's, e.g. "Object-Oriented Programming with JavaScript", title-case PICS).

## 5. Layout

Two tiers, **no grouping** (JC's explicit call — a flat list, not issuer sections):

1. **Featured cards:** the two PICS certifications keep the current full-card treatment with
   their ranking notes, and gain a credential link like every other entry — the decision log already establishes them as the
   strongest verifiable credential.
2. **Compact list (new):** the other 16 render as hairline-divided rows. Each row shows all
   three required fields — display name, issuer, issue date — with the name as a hyperlink
   followed by a small external-link icon (`lucide-react`, already a dependency). Rows stack
   cleanly at 375px per the parent spec's mobile-first constraint.

**Links:** every entry, featured cards included, links to its credential URL with
`target="_blank"` and `rel="noopener noreferrer"`. The hyperlink is the accessible element; the
icon is only the visual affordance.

**Dates display year-only** ("2026", "2018") in both tiers. Chosen deliberately: 13 certificates
share "Jul 2026" and a repeating month column emphasizes the clustering without adding
information. Nothing is hidden — every linked certificate carries its full date.

**Ordering — relevance, not date** (existing rule in the content file): PICS featured pair, then
the 7 Open University delivery/governance certs (PMO first, then sheet order), then the 6
Anthropic AI certs (sheet order), then the 3 Zuitt bootcamp certs (current site order).

## 6. Content model

`src/content/site.js` certifications become:

```js
{ name, issuer, date, url, note?, featured? }
```

Copy stays in the one content module; the component renders whatever the module holds. No new
dependencies, no meta/OG changes (so no link-preview re-scrape needed).

## 7. Tests

Update `Certifications.test.jsx` to assert:

- 18 entries render; the 2 featured PICS cards show their ranking notes.
- Every entry has an `href`; all links carry `target="_blank"` and `rel="noopener noreferrer"`.
- Every `url` in the content module is `https://`.

Existing guards (excluded LinkedIn recommendation, forbidden terms, meta drift) are untouched and
must stay green.

## 8. Out of scope

- No changes to any other section, the OG image, or meta tags.
- No re-litigation of the four excluded 2022 certifications.
- Certificate PDFs/images are **not** copied into the repo — Drive links are the agreed hosting.

## 9. Documentation updates that ship with this change

- Decision log: amend the certifications paragraph (currently "five of nine") to record the
  expansion, the rename policy (trim, never inflate), and the year-only date choice.
- This spec records the official↔display title mapping as the provenance for every rename.
