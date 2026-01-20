export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center text-secondary small py-2">
      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
      <span>{label}</span>
    </div>
  )
}
