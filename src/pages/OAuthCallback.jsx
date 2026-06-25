import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const { handleOAuthCallback } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const refreshToken = searchParams.get('refreshToken')
    const oauthError = searchParams.get('error')

    if (oauthError) {
      setError('OAuth login failed. Please try again.')
      setTimeout(() => navigate('/login'), 3000)
      return
    }

    if (token && refreshToken) {
      const success = handleOAuthCallback(token, refreshToken)
      if (success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError('Failed to process login. Please try again.')
        setTimeout(() => navigate('/login'), 3000)
      }
    } else {
      setError('Invalid callback. Missing tokens.')
      setTimeout(() => navigate('/login'), 3000)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))',
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {error ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '8px' }}>
              Authentication Error
            </h2>
            <p style={{ color: 'var(--color-navy-400)' }}>{error}</p>
            <p style={{ color: 'var(--color-navy-300)', fontSize: '13px', marginTop: '12px' }}>Redirecting to login...</p>
          </>
        ) : (
          <>
            <div style={{
              width: '48px', height: '48px', margin: '0 auto 16px',
              border: '3px solid var(--color-gold-300)', borderTop: '3px solid var(--color-gold-500)',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '8px' }}>
              Signing you in...
            </h2>
            <p style={{ color: 'var(--color-navy-400)' }}>Please wait while we complete authentication.</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </>
        )}
      </div>
    </div>
  )
}
