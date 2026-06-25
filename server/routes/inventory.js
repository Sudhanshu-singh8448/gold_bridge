import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/inventory
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, purity, status, search } = req.query
    let query = 'SELECT * FROM inventory WHERE user_id = $1'
    const params = [req.user.id]
    let paramIdx = 2

    if (category) {
      query += ` AND category = $${paramIdx++}`
      params.push(category)
    }
    if (purity) {
      query += ` AND purity = $${paramIdx++}`
      params.push(parseInt(purity))
    }
    if (status) {
      query += ` AND status = $${paramIdx++}`
      params.push(status)
    }
    if (search) {
      query += ` AND (name ILIKE $${paramIdx} OR sku ILIKE $${paramIdx})`
      params.push(`%${search}%`)
      paramIdx++
    }

    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Get inventory error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/inventory
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { sku, name, category, weight, purity, makingCharge, status, barcode, description } = req.body

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' })
    }

    const result = await pool.query(
      `INSERT INTO inventory (user_id, sku, name, category, weight, purity, making_charge, status, barcode, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, sku || null, name, category, weight || 0, purity || 22, makingCharge || 0, status || 'In Stock', barcode || null, description || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create inventory error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/inventory/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM inventory WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get inventory item error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/inventory/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { sku, name, category, weight, purity, makingCharge, status, barcode, description } = req.body
    const result = await pool.query(
      `UPDATE inventory SET sku = COALESCE($1, sku), name = COALESCE($2, name), category = COALESCE($3, category),
       weight = COALESCE($4, weight), purity = COALESCE($5, purity), making_charge = COALESCE($6, making_charge),
       status = COALESCE($7, status), barcode = COALESCE($8, barcode), description = COALESCE($9, description),
       updated_at = NOW()
       WHERE id = $10 AND user_id = $11 RETURNING *`,
      [sku, name, category, weight, purity, makingCharge, status, barcode, description, req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Update inventory error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/v1/inventory/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM inventory WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' })
    res.json({ message: 'Item deleted' })
  } catch (err) {
    console.error('Delete inventory error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
