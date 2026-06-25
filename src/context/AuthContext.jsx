import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('gb_token'))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('gb_refresh_token'))
  const [loading, setLoading] = useState(true)

  // Auto-load user on mount if token exists
  useEffect(() => {
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchUser(accessToken) {
    try {
      const res = await fetch('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setLoading(false)
      } else if (res.status === 403 || res.status === 401) {
        // Try refresh
        const refreshed = await tryRefresh()
        if (!refreshed) {
          clearAuth()
        }
        setLoading(false)
      } else {
        clearAuth()
        setLoading(false)
      }
    } catch {
      clearAuth()
      setLoading(false)
    }
  }

  async function tryRefresh() {
    const rt = localStorage.getItem('gb_refresh_token')
    if (!rt) return false

    try {
      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt })
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('gb_token', data.token)
        localStorage.setItem('gb_refresh_token', data.refreshToken)
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        await fetchUser(data.token)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function clearAuth() {
    localStorage.removeItem('gb_token')
    localStorage.removeItem('gb_refresh_token')
    setToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  // Handle OAuth callback — store tokens from URL params
  function handleOAuthCallback(tokenParam, refreshTokenParam) {
    if (tokenParam && refreshTokenParam) {
      localStorage.setItem('gb_token', tokenParam)
      localStorage.setItem('gb_refresh_token', refreshTokenParam)
      setToken(tokenParam)
      setRefreshToken(refreshTokenParam)
      fetchUser(tokenParam)
      return true
    }
    return false
  }

  async function login(email, password) {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')

    localStorage.setItem('gb_token', data.token)
    localStorage.setItem('gb_refresh_token', data.refreshToken)
    setToken(data.token)
    setRefreshToken(data.refreshToken)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password, phone, businessName) {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, businessName })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')

    localStorage.setItem('gb_token', data.token)
    localStorage.setItem('gb_refresh_token', data.refreshToken)
    setToken(data.token)
    setRefreshToken(data.refreshToken)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {
      // Ignore network errors on logout
    }
    clearAuth()
  }

  // Helper to get auth headers for API calls
  function authHeaders() {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authHeaders, handleOAuthCallback }}>
      {children}
    </AuthContext.Provider>
  )
}
