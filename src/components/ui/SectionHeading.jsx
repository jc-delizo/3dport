import { useTheme } from '../../theme/ThemeContext'

export function SectionHeading({ id, label, title, children }) {
  // Tiles rhythm (Cupertino) centers section openers like product-tile headlines.
  const centered = useTheme().grammar.rhythm === 'tiles'
  return (
    <div
      className={`section-heading mb-9 md:mb-11 ${
        centered
          ? 'text-center'
          : children
            ? 'md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.75fr)] md:items-end md:gap-12'
            : ''
      }`}
    >
      <div>
        <p id={id} className="scroll-mt-24 font-mono text-label uppercase tracking-widest text-muted">
          {label}
        </p>
        <h2 className="font-display mt-2 text-section font-semibold tracking-display">{title}</h2>
      </div>
      {children ? (
        <div className={centered ? 'mx-auto mt-4 max-w-2xl' : 'mt-4 md:mt-0'}>
          <p className={`measure mt-2 text-label leading-6 text-muted ${centered ? 'mx-auto' : ''}`}>
            {children}
          </p>
        </div>
      ) : null}
    </div>
  )
}
