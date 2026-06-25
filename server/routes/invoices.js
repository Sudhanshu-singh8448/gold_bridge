import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/invoices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Get invoices error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/invoices
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { orderId, invoiceNumber, customerName, template, items, subtotal, gstAmount, total } = req.body

    if (!invoiceNumber || !total) {
      return res.status(400).json({ error: 'Invoice number and total are required' })
    }

    const result = await pool.query(
      `INSERT INTO invoices (user_id, order_id, invoice_number, customer_name, template, items, subtotal, gst_amount, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, orderId || null, invoiceNumber, customerName || 'Walk-in', template || 'classic', JSON.stringify(items || []), subtotal || 0, gstAmount || 0, total]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create invoice error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/invoices/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get invoice error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/invoices/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, template } = req.body
    const result = await pool.query(
      `UPDATE invoices SET status = COALESCE($1, status), template = COALESCE($2, template), updated_at = NOW()
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [status, template, req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Update invoice error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/v1/invoices/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })
    res.json({ message: 'Invoice deleted' })
  } catch (err) {
    console.error('Delete invoice error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
