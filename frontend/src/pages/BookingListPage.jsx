import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllBookings, deleteBooking, updateBookingStatus } from '../api/booking.api'
import { StatusModal, DeleteModal } from '../components/BookingModal'
import BookingTable from '../components/BookingTable'
import Pagination from '../components/Pagination'
import Navbar from '../components/Navbar'

// ── Main Page ───────────────────────────────────────────────────
export default function BookingListPage() {
  const navigate = useNavigate()

  // Filter / pagination state
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('created_at_desc')
  const [page, setPage] = useState(1)
  const limit = 10

  // Modal state
  const [statusModal, setStatusModal] = useState(null) // booking object
  const [deleteModal, setDeleteModal] = useState(null) // booking object

  const queryClient = useQueryClient()
  const { data: result, isLoading } = useQuery({
    queryKey: ['bookings', { keyword, status, sort, page, limit }],
    queryFn: () => getAllBookings({ keyword, status, sort, page, limit }).then(r => r.data),
    keepPreviousData: true
  })
  const bookings   = result?.data ?? []
  const pagination = result?.pagination ?? {}
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar 
          title="Manage Booking" 
          subtitle={pagination.total != null ? `${pagination.total} booking` : '—'}
        >
          <Link to="/bookings/new" className="btn btn-primary">+ Create booking</Link>
        </Navbar>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              id="search-input"
              className="form-input search-input"
              placeholder="Tìm tên, SĐT, tour..."
              value={keyword}
              onChange={e => {setKeyword(e.target.value); setPage(1)}}
            />
          </div>

          <select id="status-filter" className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select id="sort-select" className="form-select" value={sort} onChange={e => {setSort(e.target.value); setPage(1)}}>
            <option value="created_at_desc">Created Date (Newest)</option>
            <option value="created_at_asc">Created Date (Oldest)</option>
            <option value="travel_date_asc">Departure Date (Oldest)</option>
            <option value="travel_date_desc">Departure Date (Newest)</option>
          </select>
        </div>

        {/* Table */}
        <BookingTable 
          bookings={bookings} 
          isLoading={isLoading} 
          setStatusModal={setStatusModal} 
          setDeleteModal={setDeleteModal} 
        />

        {/* Pagination */}
        <Pagination page={page} totalPages={pagination.totalPages} setPage={setPage} />
      </main>

      {statusModal && (
        <StatusModal 
          booking={statusModal} 
          onClose={() => setStatusModal(null)} 
          onSuccess={() => invalidate()} 
        />
      )}
      
      {deleteModal && (
        <DeleteModal 
          booking={deleteModal} 
          onClose={() => setDeleteModal(null)} 
          onSuccess={() => invalidate()} 
        />
      )}
    </div>
  )
}