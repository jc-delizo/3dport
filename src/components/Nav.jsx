import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, SunMoon, X } from 'lucide-react'
import { site } from '../content/site'
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
      trigger={
        <>
          <SunMoon aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">Theme</span>
        </>
      }
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
function NavEntries({ openId, setOpenId, linkClass, panelLinkClass }) {
  return site.nav.map((entry) =>
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
          <a key={id} href={`#${id}`} onClick={() => setOpenId(null)} className={panelLinkClass}>
            {label}
          </a>
        ))}
      </Dropdown>
    ) : (
      <a key={entry.id} href={`#${entry.id}`} className={linkClass}>
        {entry.label}
      </a>
    )
  )
}

function MobilePanel({ closeAndFocus }) {
  return (
    <nav aria-label="Mobile" className="border-t border-hairline bg-canvas md:hidden">
      <Container className="flex flex-col gap-5 py-6">
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
                    href={`#${id}`}
                    onClick={() => closeAndFocus(id)}
                    className="text-body text-muted hover:text-ink"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              onClick={() => closeAndFocus(entry.id)}
              className="text-body text-muted hover:text-ink"
            >
              {entry.label}
            </a>
          )
        )}
        <Button href={site.contact.resume} variant="ghost" download={site.contact.resumeFilename} className="self-start">
          Résumé
        </Button>
      </Container>
    </nav>
  )
}

const PANEL_LINK = 'block px-4 py-1.5 text-label text-muted hover:bg-card hover:text-ink'

// Studio: black ribbon under the nav scrolling the delivery domains in mono
// caps. Decorative (the same names head the portfolio groups), so aria-hidden;
// prefers-reduced-motion stops the animation via CSS.
function MarqueeStrip() {
  const row = site.portfolio.groups.map((g) => g.group).join(' · ')
  return (
    <div aria-hidden="true" className="marquee bg-black text-white">
      <div className="marquee-track font-mono text-[11px] uppercase tracking-widest">
        <span>{row} · </span>
        <span>{row} · </span>
      </div>
    </div>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false) // mobile panel
  const [openId, setOpenId] = useState(null) // which desktop dropdown
  const { grammar } = useTheme()

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
      className={`md:hidden ${cls}`}
    >
      {open ? <X size={18} /> : <Menu size={18} />}
    </button>
  )

  // Cupertino: a single ultra-thin black global bar — quiet 12px links with the
  // blue pill Résumé CTA riding at the far right.
  if (grammar.nav === 'global-bar') {
    return (
      <header data-testid="global-nav" className="sticky top-0 z-40">
        <div className="bg-black text-white">
          <Container className="flex h-12 items-center justify-between">
            <a href="#top" className="text-[13px] font-semibold tracking-display">
              JC Delizo
            </a>
            <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
              <NavEntries
                openId={openId}
                setOpenId={setOpenId}
                linkClass="text-[12px] text-white/75 hover:text-white"
                panelLinkClass={PANEL_LINK}
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
        </div>
        {open ? <MobilePanel closeAndFocus={closeAndFocus} /> : null}
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="text-body font-semibold tracking-display">
          JC Delizo
        </a>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex lg:gap-7">
          <NavEntries
            openId={openId}
            setOpenId={setOpenId}
            linkClass="text-label text-muted hover:text-ink"
            panelLinkClass={PANEL_LINK}
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

      {grammar.nav === 'marquee' ? <MarqueeStrip /> : null}
      {open ? <MobilePanel closeAndFocus={closeAndFocus} /> : null}
    </header>
  )
}
