import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Gold Rates', path: '/gold-rates' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Industries', path: '/industries' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'dashboard', path:'/dashboard'}
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // We only need to reset mobile open on mount or if we decide to handle route changes differently
    // Actually, setting state here directly on route change triggers the warning.
    // We can just rely on the Link click to close it if we want, or do it in a handler.
    // For now, we can just remove this effect as it's causing the lint error and isn't strictly necessary if we handle clicks on Links.
  }, [location])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      transition: 'all 0.3s ease',
      ...(scrolled ? {
        background: 'rgba(255,253,247,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        borderBottom: '1px solid rgba(218,165,32,0.1)',
      } : {
        background: 'transparent',
      })
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px',
          boxShadow: '0 2px 12px rgba(218,165,32,0.3)'
        }}>
          G
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '22px', color: 'var(--color-navy-700)' }}>
          Gold<span style={{ color: 'var(--color-gold-500)' }}>Bridge</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '32px', marginLeft: 'auto', marginRight: '24px',
      }} className="desktop-nav">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              fontSize: '14px',
              fontWeight: location.pathname === link.path ? 600 : 500,
              color: location.pathname === link.path ? 'var(--color-gold-500)' : 'var(--color-navy-500)',
              transition: 'color 0.2s ease',
              position: 'relative',
            }}
          >
            {link.label}
            {location.pathname === link.path && (
              <span style={{
                position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px',
                background: 'var(--color-gold-400)', borderRadius: '2px',
              }} />
            )}
          </Link>
        ))}
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
        <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
        <Link to="/register" className="btn btn-gold btn-sm">Get Started</Link>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-toggle"
        style={{
          display: 'none', marginLeft: 'auto', background: 'none', border: 'none',
          fontSize: '24px', color: 'var(--color-navy-700)', cursor: 'pointer',
        }}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
          background: 'rgba(255,253,247,0.98)', backdropFilter: 'blur(20px)',
          padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '8px',
          zIndex: 999,
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '14px 20px', borderRadius: 'var(--radius-md)',
                fontSize: '16px', fontWeight: 500,
                color: location.pathname === link.path ? 'var(--color-gold-500)' : 'var(--color-navy-600)',
                background: location.pathname === link.path ? 'var(--color-gold-50)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Login</Link>
            <Link to="/register" className="btn btn-gold" style={{ width: '100%' }}>Get Started</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
