const VARIANTS = {
  // accent-contrast, not white: on inverted surfaces (Paper's coral band) the
  // primary flips to a cream button with coral text.
  primary: 'bg-accent text-accent-contrast hover:opacity-90',
  ghost: 'border border-hairline text-ink hover:bg-card',
}

// Size owns padding + type scale so callers never fight the Tailwind cascade
// with conflicting utility overrides.
const SIZES = {
  md: 'px-5 py-2.5 text-body',
  sm: 'px-3.5 py-1.5 text-label',
}

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  external = false,
  download = false,
  className = '',
  children,
}) {
  // A download stays in the same tab — the browser saves the file directly,
  // so external's target="_blank" would only leave a blank tab behind.
  const externalProps = external && !download ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const variantClasses = VARIANTS[variant] || VARIANTS.primary
  const sizeClasses = SIZES[size] || SIZES.md
  return (
    <a
      href={href}
      data-btn=""
      {...(download ? { download: download === true ? '' : download } : {})}
      {...externalProps}
      className={`inline-flex items-center justify-center rounded-button font-medium transition-[color,background-color,transform] ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </a>
  )
}
