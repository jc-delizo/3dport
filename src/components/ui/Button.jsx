const VARIANTS = {
  primary: 'bg-accent text-white hover:opacity-90',
  ghost: 'border border-hairline text-ink hover:bg-card',
}

export function Button({ href, variant = 'primary', external = false, className = '', children }) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a
      href={href}
      {...externalProps}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-body font-medium transition-colors ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  )
}
