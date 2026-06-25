import { Link } from 'react-router-dom'
import { FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FaGem } from 'react-icons/fa'

export default function ForgotPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))',
    }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--color-gold-50)', color: 'var(--color-gold-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 20px',
          }}>
            <FaGem />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)', marginBottom: '28px', lineHeight: 1.6 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={e => e.preventDefault()} style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
              <input className="input" placeholder="you@example.com" type="email" style={{ paddingLeft: '42px' }} />
            </div>
            <button className="btn btn-gold" style={{ width: '100%', padding: '14px' }} type="submit">
              Send Reset Link <FiArrowRight />
            </button>
          </form>

          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '24px',
            fontSize: '14px', fontWeight: 500, color: 'var(--color-navy-300)',
          }}>
            <FiArrowLeft /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
