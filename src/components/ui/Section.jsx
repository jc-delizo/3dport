import { useTheme } from '../../theme/ThemeContext'
import { AtriumPlane } from './AtriumPlane'

// Section shell that renders the active theme's rhythm.
//   bordered (Daylight/Midnight): hairline dividers between sections.
//   tiles (Cupertino): full-bleed surfaces — the theme grammar's tile map picks
//   light/parchment/dark per section, and the data-surface attribute re-scopes
//   the color tokens locally (see index.css), so children re-theme untouched.
export function Section({ surface, divider = true, compact = false, className = '', children, ...rest }) {
  const { grammar } = useTheme()
  const flowSpacing = compact ? 'py-10 md:py-14' : 'section-gap'
  const tileSpacing = compact ? 'py-10 md:py-14' : 'section-gap-tile'

  if (grammar.rhythm === 'tiles') {
    const tile = grammar.tiles?.[surface] ?? 'light'
    return (
      <section data-surface={tile} className={`${tileSpacing} bg-canvas ${className}`} {...rest}>
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
        <section className={`${flowSpacing} bg-canvas ${className}`} {...rest}>
          {children}
        </section>
      )
    }
    return (
      <section
        data-section={surface}
        className={`bg-canvas ${compact ? 'py-3 md:py-4' : 'py-4 md:py-7'} ${className}`}
        {...rest}
      >
        <div className="mx-auto w-full max-w-[80rem] px-4 md:px-6">
          <div
            data-surface={block}
            className={`studio-block overflow-hidden rounded-[28px] border border-hairline bg-canvas ${compact ? 'py-7 md:py-9' : 'py-11 md:py-16'}`}
          >
            {children}
          </div>
        </div>
      </section>
    )
  }

  // Planes (Atrium): every section becomes a floating plane on a shared CSS 3D
  // stage. One perspective origin lives on the stage wrapper in App, so the
  // planes read as one room rather than as unrelated tilting cards.
  if (grammar.rhythm === 'planes') {
    const plane = grammar.tiles?.[surface]
    const elev = grammar.depths?.[surface]
    return (
      <section className={`${flowSpacing} bg-canvas ${className}`} {...rest}>
        {/* atrium-cell carries the perspective: per-section, so the vanishing
            point is always near the plane it projects (projection safety
            contract, index.css). */}
        <div className="atrium-cell mx-auto w-full max-w-[80rem] px-4 md:px-6">
          <AtriumPlane
            {...(plane ? { 'data-surface': plane } : {})}
            {...(elev ? { 'data-elev': elev } : {})}
            className={compact ? 'px-5 py-8 md:px-10 md:py-10' : 'px-5 py-10 md:px-12 md:py-16'}
          >
            {children}
          </AtriumPlane>
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
        className={`${flowSpacing} bg-canvas ${className}`}
        {...rest}
      >
        {children}
      </section>
    )
  }

  return (
    <section
      className={`${divider ? 'border-b border-hairline ' : ''}${flowSpacing} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
