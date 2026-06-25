import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  // Generate initials from user name
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-warm-50)' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '260px' : '72px', transition: 'margin-left 0.3s ease' }}>
        {/* Top Bar */}
        <header className="glass" style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy-500)', fontSize: '20px', display: 'flex' }}>
              <FiMenu />
            </button>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
              <input
                className="input"
                placeholder="Search anything..."
                style={{ paddingLeft: '38px', width: '320px', height: '40px', fontSize: '14px', borderRadius: 'var(--radius-full)', background: 'var(--color-warm-100)', border: '1px solid transparent' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <FiBell style={{ fontSize: '20px', color: 'var(--color-navy-400)' }} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--color-error-500)', borderRadius: '50%', border: '2px solid white' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-bronze-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>
                {initials}
              </div>
              <div onClick={() => navigate('/dashboard/settings')}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-warm-400)' }} >{user?.role || 'Admin'}</div>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main style={{ flex: 1, padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
