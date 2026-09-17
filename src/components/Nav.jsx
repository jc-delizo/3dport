import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Flame, Menu, X } from 'lucide-react'
import { site } from '../content/site'
import { SECTIONS } from './SectionNavigator'
import { useTheme } from '../theme/ThemeContext'
import { Container } from './ui/Container'
import { Button } from './ui/Button'

// Shared dropdown shell: trigger + panel, closing on Escape (focus returns to
// the trigger), on outside click, and on selection. `openId` is lifted to Nav
// so only one dropdown is ever open.
function Dropdown({ id, openId, setOpenId, trigger, triggerClass, chevron = true, children }) {
  const open = openId === id
  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpenId(null)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenId(null)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, setOpenId])

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpenId(open ? null : id)}
        className={triggerClass}
      >
        {trigger}
        {chevron ? (
          <ChevronDown
            aria-hidden="true"
            className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[13rem] rounded-lg border border-hairline bg-canvas py-2 shadow-lg shadow-ink/5">
          {children}
        </div>
      ) : null}
    </div>
  )
}

function ThemeMenu({ openId, setOpenId, triggerClass }) {
  const { theme, setTheme, themes } = useTheme()
  return (
    <Dropdown
      id="theme"
      openId={openId}
      setOpenId={setOpenId}
      triggerClass={triggerClass}
      chevron={false}
      trigger="Themes"
    >
      <div role="menu" aria-label="Theme">
        {themes.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="menuitemradio"
            aria-checked={theme === id}
            onClick={() => {
              setTheme(id)
              setOpenId(null)
            }}
            className={`block w-full px-4 py-1.5 text-left text-label hover:bg-card ${
              theme === id ? 'text-accent' : 'text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </Dropdown>
  )
}

// Desktop nav entries: dropdown groups + direct links. Styling comes from the
// caller so the same structure serves both nav grammars.
// Always same-document (2026-09-17): the Lab is a view of this page now, so
// section links are plain hashes even while the Lab is open — the App's
// anchor interceptor switches the view first when the target isn't mounted.
const entryHref = (entry) => entry.href ?? `#${entry.id}`

function LabNavLabel() {
  return (
    <>
      <span className="lab-nav-ember" aria-hidden="true">
        <Flame className="h-3.5 w-3.5" />
      </span>
      <span>Lab</span>
      <span className="lab-nav-count" aria-hidden="true">
        05
      </span>
    </>
  )
}

// The compact bar's one dropdown: every section, in page order, straight from
// the trail's own map — Home is the brand, Lab keeps its own button.
const PORTFOLIO_GROUP = {
  label: 'Portfolio',
  items: SECTIONS.filter(({ id }) => id !== 'top' && id !== 'lab'),
}
// The bar defers to the trail (JC, 2026-09-15): wherever the trail exists,
// no Portfolio button. Three bands —
//   <1520px      Portfolio dropdown + Lab (no trail; the dropdown is the map)
//   1520-1679px  Lab only — the compact trail carries section navigation
//   >=1680px     flat Case Studies / Lab / Contact beside the full trail
const LAB_ONLY = site.nav.filter((n) => n.page === 'lab')
const COMPACT_ENTRIES = [PORTFOLIO_GROUP, ...LAB_ONLY]

function NavEntries({ entries = site.nav, openId, setOpenId, linkClass, panelLinkClass, currentPage, onOpenLab }) {
  return entries.map((entry) =>
    entry.items ? (
      <Dropdown
        key={entry.label}
        id={entry.label}
        openId={openId}
        setOpenId={setOpenId}
        trigger={entry.label}
        triggerClass={`flex items-center gap-1 ${linkClass}`}
      >
        {entry.items.map(({ id, label }) => (
          <a
            key={id}
            href={entryHref({ id })}
            onClick={() => setOpenId(null)}
            className={panelLinkClass}
          >
            {label}
          </a>
        ))}
      </Dropdown>
    ) : (
      <a
        key={entry.id ?? entry.href}
        href={entryHref(entry)}
        aria-current={entry.page === currentPage ? 'page' : undefined}
        onClick={
          entry.page === 'lab' && onOpenLab
            ? (e) => {
                // Plain click opens the Lab view in place; modified clicks
                // (new tab) keep the real /lab/ URL.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                e.preventDefault()
                onOpenLab()
              }
            : undefined
        }
        className={`${linkClass} ${entry.page === 'lab' ? 'lab-nav-link' : ''}`}
      >
        {entry.page === 'lab' ? <LabNavLabel /> : entry.label}
      </a>
    )
  )
}

// The desktop nav's three width bands, CSS-switched (1520/1680) so no resize
// listener is needed. All share openId, so only one dropdown opens at once.
function ResponsiveNavEntries({ gapClass, ...shared }) {
  return (
    <>
      <div className={`flex items-center min-[1520px]:hidden ${gapClass}`}>
        <NavEntries entries={COMPACT_ENTRIES} {...shared} />
      </div>
      <div className={`hidden items-center min-[1520px]:flex min-[1680px]:hidden ${gapClass}`}>
        <NavEntries entries={LAB_ONLY} {...shared} />
      </div>
      <div className={`hidden items-center min-[1680px]:flex ${gapClass}`}>
        <NavEntries {...shared} />
      </div>
    </>
  )
}

function MobilePanel({ closeAndFocus, close, currentPage, onOpenLab }) {
  const { theme, setTheme, themes } = useTheme()
  const select = (entry, e) => {
    if (entry.page === 'lab' && onOpenLab) {
      e?.preventDefault()
      close()
      onOpenLab()
      return
    }
    if (currentPage === 'home' && entry.id && !entry.href) closeAndFocus(entry.id)
    else close()
  }

  return (
    <nav aria-label="Mobile" className="mobile-nav-panel border-t border-hairline bg-canvas lg:hidden">
      <Container className="flex max-h-[calc(100dvh-4rem)] flex-col gap-5 overflow-y-auto py-6">
        {site.nav.map((entry) =>
          entry.items ? (
            <div key={entry.label}>
              <p className="font-mono text-label uppercase tracking-widest text-muted">
                {entry.label}
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {entry.items.map(({ id, label }) => (
                  <a
                    key={id}
                    href={entryHref({ id })}
                    onClick={() => select({ id })}
                    className="text-body text-muted hover:text-ink"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a
              key={entry.id ?? entry.href}
              href={entryHref(entry)}
              aria-current={entry.page === currentPage ? 'page' : undefined}
              onClick={(e) => select(entry, e)}
              className={`text-body text-muted hover:text-ink ${
                entry.page === 'lab' ? 'lab-nav-link self-start' : ''
              }`}
            >
              {entry.page === 'lab' ? <LabNavLabel /> : entry.label}
            </a>
          )
        )}
        <div>
          <p className="font-mono text-label uppercase tracking-widest text-muted">
            Appearance
          </p>
          <div role="radiogroup" aria-label="Theme" className="mt-2 grid grid-cols-2 gap-2">
            {themes.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={theme === id}
                onClick={() => setTheme(id)}
                className={`min-h-[2.75rem] rounded-button border px-3 text-left text-label transition-colors ${
                  theme === id
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-hairline bg-card text-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Button href={site.contact.resume} variant="ghost" download={site.contact.resumeFilename} className="self-start">
          Résumé
        </Button>
      </Container>
    </nav>
  )
}

const PANEL_LINK = 'block px-4 py-1.5 text-label text-muted hover:bg-card hover:text-ink'

function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return progress
}

function Brand({ href, inverse = false, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`nav-brand group flex flex-col leading-tight transition-opacity hover:opacity-65 ${
        inverse ? 'text-white' : 'text-ink'
      }`}
    >
      <span className="text-[14px] font-semibold tracking-display">{site.hero.name}</span>
      <span
        className={`font-mono text-[8.5px] uppercase tracking-[0.12em] ${
          inverse ? 'text-white/55' : 'text-muted'
        }`}
      >
        {site.hero.title}
      </span>
    </a>
  )
}

function Progress({ value }) {
  // inset-x-0 against the positioned Container, never w-screen/100vw: on
  // classic-scrollbar systems (Windows default) 100vw includes the scrollbar
  // width, and the overhang off the sticky header put a page-wide horizontal
  // scroll on the whole site. The visual full-bleed comes from negative
  // margins spanning the Container's own padding instead.
  return (
    <div
      aria-hidden="true"
      className="nav-progress absolute bottom-0 inset-x-0 h-[2px] bg-hairline/70"
    >
      <span className="block h-full origin-left bg-accent" style={{ transform: `scaleX(${value})` }} />
    </div>
  )
}

// Slides in beside the brand while the Lab is open — the explicit way home,
// alongside the browser's own Back (the view router pushes real history).
function BackToPortfolio({ onBackHome, inverse = false }) {
  return (
    <button
      type="button"
      data-btn=""
      onClick={onBackHome}
      className={`back-chip mr-4 inline-flex min-h-11 items-center gap-1.5 rounded-button border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
        inverse
          ? 'border-white/30 text-white/80 hover:text-white'
          : 'border-hairline text-muted hover:border-accent hover:text-ink'
      }`}
    >
      <span aria-hidden="true">←</span> Portfolio
    </button>
  )
}

export function Nav({ currentPage = 'home', onOpenLab, onBackHome }) {
  const [open, setOpen] = useState(false) // mobile panel
  const [openId, setOpenId] = useState(null) // which desktop dropdown
  const { grammar } = useTheme()
  const brandHref = currentPage === 'home' ? '#top' : import.meta.env.BASE_URL
  const brandBack =
    currentPage === 'lab' && onBackHome
      ? (e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
          e.preventDefault()
          onBackHome()
        }
      : undefined
  const scrollProgress = useScrollProgress()

  const closeAndFocus = (id) => {
    setOpen(false)
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    })
  }

  const menuButton = (cls = '') => (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className={`grid h-11 w-11 place-items-center rounded-full border border-hairline lg:hidden ${cls}`}
    >
      {open ? <X size={18} /> : <Menu size={18} />}
    </button>
  )

  // Cupertino: a single ultra-thin black global bar — quiet 12px links with the
  // blue pill Résumé CTA riding at the far right.
  if (grammar.nav === 'global-bar') {
    return (
      <header data-testid="global-nav" className="site-header sticky top-0 z-40">
        <div className="relative bg-black text-white">
          <Container className="relative flex h-14 items-center justify-between">
            <span className="flex items-center">
              {currentPage === 'lab' ? <BackToPortfolio onBackHome={onBackHome} inverse /> : null}
              <Brand href={brandHref} inverse onClick={brandBack} />
            </span>
            <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
              <ResponsiveNavEntries
                gapClass="gap-6"
                onOpenLab={onOpenLab}
                openId={openId}
                setOpenId={setOpenId}
                linkClass="text-[12px] text-white/75 hover:text-white"
                panelLinkClass={PANEL_LINK}
                currentPage={currentPage}
              />
              <ThemeMenu
                openId={openId}
                setOpenId={setOpenId}
                triggerClass="flex items-center gap-1 text-white/75 hover:text-white"
              />
              <Button
                href={site.contact.resume}
                download={site.contact.resumeFilename}
                size="sm"
              >
                Résumé
              </Button>
            </nav>
            {menuButton('text-white')}
          </Container>
          <Progress value={scrollProgress} />
        </div>
        {open ? (
          <MobilePanel
            closeAndFocus={closeAndFocus}
            onOpenLab={onOpenLab}
            close={() => setOpen(false)}
            currentPage={currentPage}
          />
        ) : null}
      </header>
    )
  }

  return (
    <header className="site-header sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
      <Container className="relative flex h-[4.5rem] items-center justify-between">
        <span className="flex items-center">
          {currentPage === 'lab' ? <BackToPortfolio onBackHome={onBackHome} /> : null}
          <Brand href={brandHref} onClick={brandBack} />
        </span>

        <nav aria-label="Main" className="hidden items-center gap-5 lg:flex xl:gap-7">
          <ResponsiveNavEntries
            gapClass="gap-5 xl:gap-7"
            onOpenLab={onOpenLab}
            openId={openId}
            setOpenId={setOpenId}
            linkClass="text-label text-muted hover:text-ink"
            panelLinkClass={PANEL_LINK}
            currentPage={currentPage}
          />
          <ThemeMenu
            openId={openId}
            setOpenId={setOpenId}
            triggerClass="flex items-center gap-1 text-label text-muted hover:text-ink"
          />
          <Button href={site.contact.resume} variant="ghost" download={site.contact.resumeFilename} size="sm">
            Résumé
          </Button>
        </nav>

        {menuButton()}
      </Container>
      <Progress value={scrollProgress} />

      {open ? (
        <MobilePanel
          closeAndFocus={closeAndFocus}
            onOpenLab={onOpenLab}
          close={() => setOpen(false)}
          currentPage={currentPage}
        />
      ) : null}
    </header>
  )
}
