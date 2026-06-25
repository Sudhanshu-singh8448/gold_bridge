import { Link, useLocation } from 'react-router-dom'
import {
  FiHome, FiPackage, FiShoppingCart, FiUsers, FiFileText,
  FiBarChart2, FiSettings, FiDollarSign, FiTruck, FiTool,
  FiLogOut, FiChevronLeft
} from 'react-icons/fi'

const menuItems = [
  { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  { label: 'Inventory', icon: <FiPackage />, path: '/dashboard/inventory' },
  { label: 'Sales & Billing', icon: <FiShoppingCart />, path: '/dashboard/sales' },
  { label: 'Purchases', icon: <FiTruck />, path: '/dashboard/purchases' },
  { label: 'Customers', icon: <FiUsers />, path: '/dashboard/customers' },
  // { label: 'Manufacturing', icon: <FiTool />, path: '/dashboard/manufacturing' }
  { label: 'Gold Rates', icon: <FiDollarSign />, path: '/dashboard/gold-rates' },
  { label: 'Reports', icon: <FiBarChart2 />, path: '/dashboard/reports' },
  { label: 'Invoices', icon: <FiFileText />, path: '/dashboard/invoices' },
  { label: 'Settings', icon: <FiSettings />, path: '/dashboard/settings' },
]

export default function Sidebar({ isOpen, onToggle, onLogout }) {
  const location = useLocation()

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: isOpen ? '260px' : '72px',
      background: 'var(--color-navy-600)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      zIndex: 50,
      boxShadow: 'var(--shadow-sidebar)',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        padding: isOpen ? '0 20px' : '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        justifyContent: isOpen ? 'space-between' : 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-bronze-400))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px',
            flexShrink: 0,
          }}>
            G
          </div>
          {isOpen && (
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', color: 'white', whiteSpace: 'nowrap' }}>
              Gold<span style={{ color: 'var(--color-gold-400)' }}>Bridge</span>
            </span>
          )}
        </div>
        {isOpen && (
          <button onClick={onToggle} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: '18px', display: 'flex',
          }}>
            <FiChevronLeft />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isOpen ? '11px 14px' : '11px 0',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(218,165,32,0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  position: 'relative',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }
                }}
                onMouseLeave={e => {
                  if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }
                }}
              >
                {isActive && (
                  <span style={{
                    position: 'absolute', left: isOpen ? '-8px' : '-8px', top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '20px', background: 'var(--color-gold-400)', borderRadius: '0 3px 3px 0',
                  }} />
                )}
                <span style={{ fontSize: '18px', display: 'flex', flexShrink: 0, color: isActive ? 'var(--color-gold-400)' : 'inherit' }}>
                  {item.icon}
                </span>
                {isOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div style={{
        padding: '16px 8px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: isOpen ? '11px 14px' : '11px 0',
          borderRadius: 'var(--radius-md)', fontSize: '14px',
          color: 'rgba(255,255,255,0.45)', justifyContent: isOpen ? 'flex-start' : 'center',
          transition: 'all 0.2s ease', textDecoration: 'none',
          background: 'none', border: 'none', cursor: 'pointer', width: '100%',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-error-400)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
        >
          <FiLogOut style={{ fontSize: '18px', flexShrink: 0 }} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
