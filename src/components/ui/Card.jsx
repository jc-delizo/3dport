export function Card({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`rounded-xl border border-hairline bg-card p-6 md:p-8 ${className}`}>
      {children}
    </Tag>
  )
}
