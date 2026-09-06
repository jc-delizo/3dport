export function Card({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`portfolio-card card-lift rounded-card border border-hairline bg-card p-5 md:p-7 ${className}`}>
      {children}
    </Tag>
  )
}
