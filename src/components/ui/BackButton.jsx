import { ArrowLeft } from 'lucide-react'

// The full-screen modals' close control: a back arrow with an INSTANT
// "Back to Portfolio" tooltip — a custom span, because the native title
// attribute only appears after a hover delay. No transition = immediate.
export function BackButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      aria-label="Back to Portfolio"
      onClick={onClick}
      // Positioning comes from the caller (fixed corner vs. in-header
      // relative): hardcoding `relative` here would override `fixed` in the
      // cascade and drop the button into the document flow.
      className={`group ${className}`}
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-label text-canvas opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
        Back to Portfolio
      </span>
    </button>
  )
}
