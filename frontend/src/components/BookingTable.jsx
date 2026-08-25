import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import StatusBadge from './StatusBadge'

const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

export default function BookingTable({ bookings, isLoading, setStatusModal, setDeleteModal }) {
  const navigate = useNavigate()

  return (
    <div className="card" style={{ padding: 0 }}>
      {
        isLoading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading data...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-light)' }}>
            No booking found.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Tour</th>
                  <th>Departure Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Creator</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--text-light)', fontSize: 12 }}>#{b.id}</td>
                    <td>
                      <div className="td-name">{b.customerName}</div>
                      <div className="td-sub">{b.customerPhone}</div>
                    </td>
                    <td><div style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{b.tourName}</div></td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{dayjs(b.travelDate).format('DD/MM/YYYY')}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>{fmt(b.totalPrice)}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td style={{ fontSize: 13 }}>{b.user?.name ?? '—'}</td>
                    <td>
                      <div className="action-group" style={{ justifyContent: 'flex-end' }}>
                        <button id={`edit-btn-${b.id}`} className="btn btn-ghost btn-sm btn-icon" title="Edit" onClick={() => navigate(`/bookings/${b.id}/edit`)}>✏️</button>
                        <button id={`status-btn-${b.id}`} className="btn btn-ghost btn-sm btn-icon" title="Change Status" onClick={() => setStatusModal(b)}>🔄</button>
                        <button id={`delete-btn-${b.id}`} className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleteModal(b)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}