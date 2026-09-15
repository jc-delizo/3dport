// One correct way to land on a section (2026-09-15, after trail clicks put
// headings under the navbar or cut section tops off):
//
// - The target is the enclosing <section>'s top, not the heading's — heading
//   ids sit below the plane padding, so scrolling the heading to the top cut
//   the section's own top edge off above the viewport.
// - Position comes from the section's rect, which no transform touches — the
//   Atrium planes animate a translate on entry, and native anchor scrolling
//   chases that moving transformed box (landings varied by up to 34px with
//   scroll timing).
// - The sticky header's real height is measured, not assumed.
export function scrollToSection(id, { instant = false } = {}) {
  const el = document.getElementById(id)
  if (!el) return false
  const section = el.closest('section') ?? el
  const header = document.querySelector('.site-header')
  const offset = (header?.offsetHeight ?? 0) + 12
  const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset)
  // 'auto' defers to the CSS scroll-behavior rules (smooth, and already
  // instant under prefers-reduced-motion); 'instant' is for hash loads.
  window.scrollTo({ top, behavior: instant ? 'instant' : 'auto' })
  return true
}
