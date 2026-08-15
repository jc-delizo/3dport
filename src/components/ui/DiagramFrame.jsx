import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, X } from 'lucide-react'
import { pushModal, popModal, isTopModal } from './modalStack'

// Frame for the inlined draw.io exports (sanitized outside the repo, see
// src/content/diagrams/). Fixed white ground in every theme — the exports'
// colors are baked for a light canvas — and wide diagrams scroll in their own
// frame instead of stretching the page (max-w-full + the parent's min-w-0 are
// both required for that). With `expandable`, clicking opens a full-screen
// lightbox. The exports ship their own flow animation; index.css kills it
// under prefers-reduced-motion.

function Svg({ svg, ariaLabel }) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="min-w-max"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function Lightbox({ svg, ariaLabel, onClose }) {
  const modalId = useId()
  useEffect(() => {
    pushModal(modalId)
    const onKey = (e) => {
      // The modal stack routes Escape: only the top layer closes.
      if (e.key === 'Escape' && isTopModal(modalId)) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      popModal(modalId)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, modalId])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      data-diagram-lightbox=""
      className="fixed inset-0 z-[60] overflow-auto bg-white"
    >
      <button
        type="button"
        aria-label="Close diagram"
        onClick={onClose}
        className="fixed right-4 top-4 z-[61] rounded-button border border-hairline bg-white p-2 text-muted shadow-lg hover:text-ink"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
      <div className="p-6 md:p-10">
        <Svg svg={svg} ariaLabel={ariaLabel} />
      </div>
    </div>,
    document.body
  )
}

export function DiagramFrame({ svg, ariaLabel, className = '', expandable = false }) {
  const [open, setOpen] = useState(false)

  const frame = (
    <div className="diagram-frame max-w-full overflow-x-auto rounded-card border border-hairline bg-white p-4">
      <Svg svg={svg} ariaLabel={ariaLabel} />
    </div>
  )

  if (!expandable) return <div className={className}>{frame}</div>

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={`${ariaLabel} — view full screen`}
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in text-left"
      >
        {frame}
        <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-widest text-muted">
          <Maximize2 aria-hidden="true" className="h-3 w-3" /> View full screen
        </span>
      </button>
      {open ? <Lightbox svg={svg} ariaLabel={ariaLabel} onClose={() => setOpen(false)} /> : null}
    </div>
  )
}
