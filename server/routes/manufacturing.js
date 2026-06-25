import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/manufacturing
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { stage } = req.query
    let query = 'SELECT * FROM manufacturing_jobs WHERE user_id = $1'
    const params = [req.user.id]

    if (stage) {
      query += ' AND stage = $2'
      params.push(stage)
    }

    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Get manufacturing error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/manufacturing
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { artisanName, itemType, weight, purity, stage, wastage, dueDate, notes } = req.body

    if (!artisanName || !itemType) {
      return res.status(400).json({ error: 'Artisan name and item type are required' })
    }

    const result = await pool.query(
      `INSERT INTO manufacturing_jobs (user_id, artisan_name, item_type, weight, purity, stage, wastage, due_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, artisanName, itemType, weight || 0, purity || 22, stage || 'Design', wastage || 0, dueDate || null, notes || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create manufacturing job error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/manufacturing/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { artisanName, itemType, weight, purity, stage, wastage, dueDate, notes } = req.body
    const result = await pool.query(
      `UPDATE manufacturing_jobs SET artisan_name = COALESCE($1, artisan_name), item_type = COALESCE($2, item_type),
       weight = COALESCE($3, weight), purity = COALESCE($4, purity), stage = COALESCE($5, stage),
       wastage = COALESCE($6, wastage), due_date = COALESCE($7, due_date), notes = COALESCE($8, notes),
       updated_at = NOW()
       WHERE id = $9 AND user_id = $10 RETURNING *`,
      [artisanName, itemType, weight, purity, stage, wastage, dueDate, notes, req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Update manufacturing job error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/v1/manufacturing/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM manufacturing_jobs WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' })
    res.json({ message: 'Job deleted' })
  } catch (err) {
    console.error('Delete manufacturing job error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
