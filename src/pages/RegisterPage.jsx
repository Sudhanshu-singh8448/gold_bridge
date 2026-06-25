import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { FaGoogle, FaGem } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password, phone)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left - Decorative */}
      <div className="register-visual" style={{
        flex: 1, background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400), var(--color-bronze-400))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-200px', left: '-200px', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '40px' }}>
          <div style={{ fontSize: '80px', color: 'white', marginBottom: '24px', opacity: 0.9 }}><FaGem /></div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            Start Your Journey
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.7 }}>
            Join 5,000+ goldsmiths who trust GoldBridge for their business management.
          </p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '40px' }}>
            {[{ val: '14 Days', label: 'Free Trial' }, { val: '24/7', label: 'Support' }, { val: '100%', label: 'Secure' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', textDecoration: 'none' }}>
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

          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--color-navy-300)', fontSize: '15px', marginBottom: '28px' }}>Get started with your free 14-day trial</p>

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
            cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'var(--color-navy-600)', marginBottom: '24px',
          }}>
            <FaGoogle style={{ color: '#DB4437' }} /> Sign up with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-warm-300)' }} />
            <span style={{ fontSize: '13px', color: 'var(--color-navy-300)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-warm-300)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
                  <input className="input" placeholder="Rajesh Soni" required
                    value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: '42px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Phone</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
                  <input className="input" placeholder="+91 98765 43210"
                    value={phone} onChange={e => setPhone(e.target.value)} style={{ paddingLeft: '42px' }} />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
                <input className="input" placeholder="you@example.com" type="email" required
                  value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '42px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
                <input className="input" placeholder="Min 8 characters" type={showPass ? 'text' : 'password'} required minLength={8}
                  value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--color-warm-400)', cursor: 'pointer', display: 'flex',
                }}>{showPass ? <FiEyeOff /> : <FiEye />}</button>
              </div>
            </div>
            <button className="btn btn-gold" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : <>Create Account <FiArrowRight /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-navy-300)' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-gold-500)' }}>Sign In</Link>
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .register-visual { display: none !important; } }`}</style>
    </div>
  )
}
