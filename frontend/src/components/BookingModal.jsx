import { useState } from 'react'
import { updateBookingStatus, deleteBooking } from '../api/booking.api'

export function StatusModal({ booking, onClose, onSuccess }) {
  const [status, setStatus] = useState(booking.status)
  const [note, setNote]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusOptions = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
  const statusLabels  = { PENDING: 'Pending', CONFIRMED: 'Confirmed', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }
  
  const handleSubmit = async () => {
    if (status === booking.status) {
      onClose()
      return
    }

    setLoading(true)
    setError('')

    try {
      await updateBookingStatus(booking.id, { status, note })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while updating booking status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Change status of booking #{booking.id}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">New Status</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Note (optional)</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Note..."
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {error && <div className='login-error' style={{ margin: '16px 24px 0', padding: 12 }}>{error}</div>}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...': 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function DeleteModal({ booking, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteBooking(booking.id)
      onSuccess()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete this booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Delete Booking</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>
          Are you sure to delete booking of {' '}
          <strong style={{ color: 'var(--text-heading)' }}>{booking.customerName}</strong>?
          This action can't be undone.
        </p>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            🗑 {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}