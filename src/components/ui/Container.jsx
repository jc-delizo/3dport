export function Container({ wide = false, className = '', children }) {
  return <div className={`${wide ? 'container-wide' : 'container-page'} ${className}`}>{children}</div>
}
