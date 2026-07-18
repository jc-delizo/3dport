export function SectionHeading({ id, label, title, children }) {
  return (
    <header className="mb-12">
      <p id={id} className="scroll-mt-24 text-label uppercase tracking-widest text-muted">
        {label}
      </p>
      <h2 className="mt-2 text-section font-semibold tracking-tight">{title}</h2>
      {children ? <p className="measure mt-4 text-body text-muted">{children}</p> : null}
    </header>
  )
}
