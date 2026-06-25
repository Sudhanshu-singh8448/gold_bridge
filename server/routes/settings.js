import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const router = Router()

// GET /api/v1/settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM settings WHERE user_id = $1',
      [req.user.id]
    )
    if (result.rows.length === 0) {
      // Create default settings if none exist
      const newResult = await pool.query(
        `INSERT INTO settings (user_id) VALUES ($1) RETURNING *`,
        [req.user.id]
      )
      return res.json(newResult.rows[0])
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get settings error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { businessName, address, gstin, phone, email, logoUrl, currency, dateFormat, defaultTemplate } = req.body

    const result = await pool.query(
      `UPDATE settings SET business_name = COALESCE($1, business_name), address = COALESCE($2, address),
       gstin = COALESCE($3, gstin), phone = COALESCE($4, phone), email = COALESCE($5, email),
       logo_url = COALESCE($6, logo_url), currency = COALESCE($7, currency),
       date_format = COALESCE($8, date_format), default_template = COALESCE($9, default_template),
       updated_at = NOW()
       WHERE user_id = $10 RETURNING *`,
      [businessName, address, gstin, phone, email, logoUrl, currency, dateFormat, defaultTemplate, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Update settings error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/settings/password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }

    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id])
    const valid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(12)
    const newHash = await bcrypt.hash(newPassword, salt)
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, req.user.id])

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Update password error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
