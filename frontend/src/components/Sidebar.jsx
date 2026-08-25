import { NavLink, useNavigate } from 'react-router-dom'
import { logout, getProfile } from '../api/auth.api'
import { useQuery } from '@tanstack/react-query'

const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function Sidebar() {
  const navigate = useNavigate()
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then(r => r.data.data),
    retry: false
  })

  const handleLogout = async () => {
    try { await logout() } catch {}
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">✈️</div>
        <div>
          <div className="sidebar-brand-text">Rooty ERP</div>
          <div className="sidebar-brand-sub">Travel Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <IconGrid /> Dashboard
        </NavLink>
        <NavLink to="/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
          <IconCalendar /> Bookings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {profile && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">{profile.name}</div>
              <div className="sidebar-user-role">{profile.role}</div>
            </div>
          </div>
        )}
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <IconLogout /> Logout
        </button>
      </div>
    </aside>
  )
}
