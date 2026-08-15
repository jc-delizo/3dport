import { useTheme } from '../../theme/ThemeContext'

// Section shell that renders the active theme's rhythm.
//   bordered (Daylight/Midnight): hairline dividers between sections.
//   tiles (Cupertino): full-bleed surfaces — the theme grammar's tile map picks
//   light/parchment/dark per section, and the data-surface attribute re-scopes
//   the color tokens locally (see index.css), so children re-theme untouched.
export function Section({ surface, divider = true, className = '', children, ...rest }) {
  const { grammar } = useTheme()

  if (grammar.rhythm === 'tiles') {
    const tile = grammar.tiles?.[surface] ?? 'light'
    return (
      <section data-surface={tile} className={`section-gap-tile bg-canvas ${className}`} {...rest}>
        {children}
      </section>
    )
  }

  // Blocks (Studio): a mapped section becomes a rounded pastel panel inset on
  // the white canvas — a giant sticky note; the page returns to white between
  // any two blocks. Unmapped sections flow plain.
  if (grammar.rhythm === 'blocks') {
    const block = grammar.tiles?.[surface]
    if (!block) {
      return (
        <section className={`section-gap bg-canvas ${className}`} {...rest}>
          {children}
        </section>
      )
    }
    return (
      <section className={`bg-canvas py-6 md:py-10 ${className}`} {...rest}>
        <div className="mx-auto w-full max-w-[80rem] px-4 md:px-6">
          <div data-surface={block} className="rounded-[24px] bg-canvas py-12 md:py-16">
            {children}
          </div>
        </div>
      </section>
    )
  }

  // Bands (Paper): sections flow on the canvas with no dividers; only the
  // mapped signature moments get a surface of their own.
  if (grammar.rhythm === 'bands') {
    const band = grammar.tiles?.[surface]
    return (
      <section
        {...(band ? { 'data-surface': band } : {})}
        className={`section-gap bg-canvas ${className}`}
        {...rest}
      >
        {children}
      </section>
    )
  }

  return (
    <section
      className={`${divider ? 'border-b border-hairline ' : ''}section-gap ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
