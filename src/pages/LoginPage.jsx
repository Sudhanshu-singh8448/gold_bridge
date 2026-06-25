import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { FaGoogle, FaGem } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left - Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', background: 'white',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px',
            }}>G</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '22px', color: 'var(--color-navy-700)' }}>
              Gold<span style={{ color: 'var(--color-gold-500)' }}>Bridge</span>
            </span>
          </Link>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-navy-300)', fontSize: '15px', marginBottom: '32px' }}>
            Sign in to manage your jewelry business
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
              background: '#FEF2F2', borderRadius: 'var(--radius-md)', marginBottom: '20px',
              color: 'var(--color-error-500)', fontSize: '14px', fontWeight: 500,
            }}>
              <FiAlertCircle /> {error}
            </div>
          )}

          <button onClick={() => window.location.href = '/api/v1/auth/google'} style={{
            width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-warm-300)', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'var(--color-navy-600)',
            marginBottom: '24px', transition: 'all 0.2s ease',
          }}>
            <FaGoogle style={{ color: '#DB4437' }} /> Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-warm-300)' }} />
            <span style={{ fontSize: '13px', color: 'var(--color-navy-300)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-warm-300)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
                <input className="input" placeholder="you@example.com" type="email" required
                  value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '42px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
                <input className="input" placeholder="Enter password" type={showPass ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--color-warm-400)', cursor: 'pointer', display: 'flex',
                }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <Link to="/forgot-password" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-gold-500)' }}>
                Forgot Password?
              </Link>
            </div>
            <button className="btn btn-gold" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: 'var(--color-navy-300)' }}>
            Don't have an account? <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-gold-500)' }}>Create Account</Link>
          </p>
        </div>
      </div>

      {/* Right - Decorative */}
      <div className="login-visual" style={{
        flex: 1, background: 'linear-gradient(135deg, var(--color-navy-500), var(--color-navy-600))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(218,165,32,0.12) 0%, transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', left: '-100px', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(205,127,50,0.08) 0%, transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '40px' }}>
          <div style={{ fontSize: '80px', color: 'var(--color-gold-400)', marginBottom: '24px' }}>
            <FaGem />
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            Manage Your <span className="text-gold-gradient">Gold</span> Business
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.7 }}>
            Complete ERP solution for inventory, billing, GST compliance, and business analytics.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-visual { display: none !important; }
        }
      `}</style>
    </div>
  )
}
