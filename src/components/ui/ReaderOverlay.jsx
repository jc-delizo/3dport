import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../theme/ThemeContext'
import { BackButton } from './BackButton'
import { pushModal, popModal, isTopModal } from './modalStack'

// Shared full-screen reader (case studies + initiatives): the backdrop floods
// the viewport with the section's themed surface (via data-surface scoping),
// a page-width panel rises into it, ✕ pins top-right and wrap-around
// prev/next pin to the bottom corners. Portaled to <body> so the panel escapes
// the section's surface scope (it once shipped purple). Escape is routed
// through the modal stack so nested layers unwind one at a time.
const CORNER_BTN =
  'fixed z-50 flex items-center gap-1.5 rounded-button border border-hairline bg-canvas px-4 py-2 font-mono text-label font-medium uppercase tracking-widest text-muted shadow-lg shadow-ink/10 transition-colors hover:bg-card hover:text-ink'

export function ReaderOverlay({
  surfaceKey,
  ariaLabelledBy,
  onClose,
  onNavigate,
  navNoun,
  resetKey,
  children,
}) {
  const { grammar } = useTheme()
  const scrollRef = useRef(null)
  const panelRef = useRef(null)
  const modalId = useId()
  const surface = grammar.tiles?.[surfaceKey]

  useEffect(() => {
    pushModal(modalId)
    const onKey = (e) => {
      if (e.key === 'Escape' && isTopModal(modalId)) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      popModal(modalId)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, modalId])

  // On open and on prev/next, focus the panel and start reading from the top.
  useEffect(() => {
    panelRef.current?.focus()
    scrollRef.current?.scrollTo?.(0, 0)
  }, [resetKey])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      ref={scrollRef}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div
        aria-hidden="true"
        {...(surface ? { 'data-surface': surface } : {})}
        onClick={onClose}
        className="case-overlay-backdrop fixed inset-0 bg-canvas"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="case-overlay-panel relative mx-auto my-16 w-full max-w-[72rem] px-4 outline-none md:my-20"
      >
        <div className="rounded-card border border-hairline bg-canvas p-6 shadow-2xl shadow-ink/20 md:p-12">
          {children}
        </div>
      </div>

      <BackButton onClick={onClose} className={`${CORNER_BTN} left-4 top-4 p-2`} />
      {onNavigate ? (
        <>
          <button
            type="button"
            aria-label={`Previous ${navNoun}`}
            onClick={() => onNavigate(-1)}
            className={`${CORNER_BTN} bottom-4 left-4`}
          >
            ← Prev
          </button>
          <button
            type="button"
            aria-label={`Next ${navNoun}`}
            onClick={() => onNavigate(1)}
            className={`${CORNER_BTN} bottom-4 right-4`}
          >
            Next →
          </button>
        </>
      ) : null}
    </div>,
    document.body
  )
}
