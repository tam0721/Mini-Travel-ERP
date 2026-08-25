import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../api/dashboard.api'
import StatusBadge from '../components/StatusBadge'
const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then(r => r.data.data)
  })

  const stats = [
    { label: 'Total', value: data?.totalBookings ?? 0, icon: '📋', color: 'rgba(108,99,255,0.15)' },
    { label: 'Pending', value: data?.bookingsByStatus?.PENDING ?? 0, icon: '⏳', color: 'rgba(245,158,11,0.15)' },
    { label: 'Confirmed', value: data?.bookingsByStatus?.CONFIRMED ?? 0, icon: '✅', color: 'rgba(59,130,246,0.15)' },
    { label: 'Cancelled', value: data?.bookingsByStatus?.CANCELLED ?? 0, icon: '❌', color: 'rgba(239,68,68,0.15)' },
  ]

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar 
          title="Dashboard" 
          subtitle={`Booking overview — ${dayjs().format('DD/MM/YYYY')}`} 
        />

        {
          isLoading &&
          <div className='loading-page'>
            <span className='spinner' style={{ width: 32, height: 32 }}>Loading...</span>
          </div>
        }

        {
          isError &&
          <div className='card' style={{ color: 'var(--danger)', textAlign: 'center' }}>
            <p>Cannot load dashboard data</p>
          </div>
        }

        {/* Stat cards */}
        <div className="stat-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-card-icon" style={{ background: s.color }}>{s.icon}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          {data && (
            <>
              {/* Recent bookings */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Recent Bookings</h2>
                  <Link to="/bookings" className="btn btn-ghost btn-sm">All Bookings →</Link>
                </div>

                {data?.recentBookings?.length === 0 && <div className="empty-state">...</div>}

                {data?.recentBookings?.map((b) => (
                  <div className="recent-booking-row" key={b.id}>
                    <div className="recent-avatar">{b.customerName?.charAt(0)?.toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="td-name" style={{ fontSize: 14 }}>{b.customerName}</div>
                      <div className="td-sub">{b.tourName}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <StatusBadge status={b.status} />
                      <div className="td-sub" style={{ marginTop: 4 }}>{dayjs(b.travelDate).format('DD/MM/YYYY')}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue + progress */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Total Revenue</h2>
                <div>
                  <div className="revenue-label">Total Revenue (Confirmed + Completed)</div>
                  <div className="revenue-amount">{fmt(data.totalRevenue)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Completed', value: data.bookingsByStatus.COMPLETED, color: 'var(--success)' },
                    { label: 'Confirmed', value: data.bookingsByStatus.CONFIRMED, color: 'var(--info)' },
                    { label: 'Pending', value: data.bookingsByStatus.PENDING, color: 'var(--warning)' },
                  ].map(({ label, value, color }) => {
                    const pct = Math.round((value / (data.totalBookings || 1)) * 100)
                    return (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ color: 'var(--text)' }}>{label}</span>
                          <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{value}</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: '0.6s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}