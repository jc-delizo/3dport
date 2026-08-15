// Text-only disclosure controls replacing the old bordered SeeMoreToggle.
// Both render a real <button> with aria-expanded; only the styling is "just text".

// Sits under a truncated list and names what it hides: "+ 13 more certifications".
export function ListMore({ expanded, onToggle, controls, moreLabel, className = '' }) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
      className={`text-label font-medium text-accent hover:underline ${className}`}
    >
      {expanded ? 'Show less' : `+ ${moreLabel}`}
    </button>
  )
}
