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

**Testimonials were never faked.** Before real recommendations existed, the page used verifiable
metrics as credibility markers instead of inventing quotes.

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
