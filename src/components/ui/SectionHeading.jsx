import { useTheme } from '../../theme/ThemeContext'

export function SectionHeading({ id, label, title, children }) {
  // Tiles rhythm (Cupertino) centers section openers like product-tile headlines.
  const centered = useTheme().grammar.rhythm === 'tiles'
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <p id={id} className="scroll-mt-24 font-mono text-label uppercase tracking-widest text-muted">
        {label}
      </p>
      <h2 className="font-display mt-2 text-section font-semibold tracking-display">{title}</h2>
      {children ? (
        <p className={`measure mt-4 text-body text-muted ${centered ? 'mx-auto' : ''}`}>
          {children}
        </p>
      ) : null}
    </div>
  )
}
