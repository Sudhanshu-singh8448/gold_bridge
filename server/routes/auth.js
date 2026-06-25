import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
}

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, businessName } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, business_name)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, business_name, phone, created_at`,
      [name, email, passwordHash, phone || null, businessName || null]
    )

    const user = result.rows[0]

    // Create default settings
    await pool.query(
      `INSERT INTO settings (user_id, business_name, email, phone)
       VALUES ($1, $2, $3, $4)`,
      [user.id, businessName || name, email, phone || null]
    )

    // Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refresh token
    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id])

    res.status(201).json({
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.business_name,
        phone: user.phone,
      }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = result.rows[0]

    // If user registered via OAuth and has no password
    if (!user.password_hash) {
      return res.status(401).json({ error: `This account uses ${user.oauth_provider || 'OAuth'} login. Please use the social login button.` })
    }

    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refresh token
    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id])

    res.json({
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.business_name,
        phone: user.phone,
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' })
    }

    // Verify refresh token
    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' })
    }

    // Check if refresh token matches stored one
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND refresh_token = $2', [decoded.id, refreshToken])
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Refresh token revoked or invalid' })
    }

    const user = result.rows[0]

    // Generate new tokens
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    // Update stored refresh token
    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [newRefreshToken, user.id])

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (err) {
    console.error('Refresh error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/auth/forgot-password (placeholder — needs email service)
router.post('/forgot-password', async (req, res) => {
  res.json({ message: 'Password reset link sent to your email' })
})

// POST /api/v1/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [req.user.id])
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error('Logout error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/users/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, business_name, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    const user = result.rows[0]
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.business_name,
      phone: user.phone,
      createdAt: user.created_at,
    })
  } catch (err) {
    console.error('Get user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ========================
// GOOGLE OAUTH 2.0
// ========================

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/v1/auth/google/callback'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// GET /api/v1/auth/google — Redirect to Google consent screen
router.get('/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env' })
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

// GET /api/v1/auth/google/callback — Exchange code for tokens
router.get('/google/callback', async (req, res) => {
  const { code, error: oauthError } = req.query

  if (oauthError || !code) {
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_cancelled`)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData)
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`)
    }

    // Fetch user info from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })
    const googleUser = await userInfoRes.json()

    if (!googleUser.email) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_email`)
    }

    // Find or create user in our DB
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [googleUser.email])
    let user

    if (userResult.rows.length > 0) {
      // Existing user — update OAuth info
      user = userResult.rows[0]
      if (!user.oauth_provider) {
        await pool.query('UPDATE users SET oauth_provider = $1, oauth_id = $2 WHERE id = $3', ['google', googleUser.id, user.id])
      }
    } else {
      // New user — create account
      const result = await pool.query(
        `INSERT INTO users (name, email, oauth_provider, oauth_id)
         VALUES ($1, $2, 'google', $3) RETURNING *`,
        [googleUser.name || googleUser.email.split('@')[0], googleUser.email, googleUser.id]
      )
      user = result.rows[0]

      // Create default settings
      await pool.query(
        `INSERT INTO settings (user_id, business_name, email)
         VALUES ($1, $2, $3)`,
        [user.id, googleUser.name || 'My Business', googleUser.email]
      )
    }

    // Generate our JWT tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refresh token
    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id])

    // Redirect back to frontend with tokens in URL
    const params = new URLSearchParams({
      token: accessToken,
      refreshToken: refreshToken,
    })
    res.redirect(`${FRONTEND_URL}/auth/callback?${params}`)

  } catch (err) {
    console.error('Google OAuth callback error:', err)
    res.redirect(`${FRONTEND_URL}/login?error=oauth_error`)
  }
})

export default router
