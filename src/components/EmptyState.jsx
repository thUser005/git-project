export default function EmptyState({ title = 'Nothing here', subtitle = 'Try a different selection or create new.' }) {
  return (
    <div className="text-center text-muted py-5">
      <p className="fs-5 mb-1">{title}</p>
      <p className="mb-0">{subtitle}</p>
    </div>
  )
}
