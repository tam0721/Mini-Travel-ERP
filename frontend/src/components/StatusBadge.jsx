export default function StatusBadge({ status }) {
  const map = {
    PENDING:   { cls: 'badge-pending',   label: 'Pending' },
    CONFIRMED: { cls: 'badge-confirmed', label: 'Confirmed' },
    COMPLETED: { cls: 'badge-completed', label: 'Completed' },
    CANCELLED: { cls: 'badge-cancelled', label: 'Cancelled' },
  }
  const { cls, label } = map[status] || { cls: '', label: status }
  return <span className={`badge ${cls}`}>{label}</span>
}