import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/purchases
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query
    let query = 'SELECT * FROM purchases WHERE user_id = $1'
    const params = [req.user.id]

    if (status) {
      query += ' AND status = $2'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Get purchases error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/purchases
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { supplierName, supplierPhone, items, totalAmount, notes } = req.body

    if (!supplierName || !totalAmount) {
      return res.status(400).json({ error: 'Supplier name and total amount are required' })
    }

    const result = await pool.query(
      `INSERT INTO purchases (user_id, supplier_name, supplier_phone, items, total_amount, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, supplierName, supplierPhone || null, JSON.stringify(items || []), totalAmount, notes || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create purchase error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/purchases/:id
router.put('/:id', authenticateToken, async (req, res) => {
  const client = await pool.connect()
  try {
    const { supplierName, supplierPhone, items, totalAmount, status, notes } = req.body

    // Fetch current purchase
    const current = await client.query(
      'SELECT * FROM purchases WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (current.rows.length === 0) {
      client.release()
      return res.status(404).json({ error: 'Purchase not found' })
    }

    const purchase = current.rows[0]

    // If status is changing to 'Received', sync items to inventory
    if (status === 'Received' && purchase.status !== 'Received') {
      await client.query('BEGIN')

      try {
        const purchaseItems = Array.isArray(purchase.items) ? purchase.items : JSON.parse(purchase.items || '[]')

        for (const item of purchaseItems) {
          const itemName = item.name || 'Unknown Item'
          const itemCategory = item.category || 'Gold'
          const itemWeight = parseFloat(item.weight) || 0
          const itemPurity = parseInt(item.purity) || 22
          const itemCost = parseFloat(item.cost) || 0
          const itemQty = parseInt(item.qty) || 1

          // Check if inventory item with same name + category exists for this user
          const existing = await client.query(
            'SELECT id, quantity FROM inventory WHERE user_id = $1 AND LOWER(name) = LOWER($2) AND LOWER(category) = LOWER($3) FOR UPDATE',
            [req.user.id, itemName, itemCategory]
          )

          if (existing.rows.length > 0) {
            // Increment quantity
            await client.query(
              `UPDATE inventory SET quantity = quantity + $1, purchase_price = $2, status = 'In Stock', updated_at = NOW()
               WHERE id = $3`,
              [itemQty, itemCost, existing.rows[0].id]
            )
          } else {
            // Insert new inventory item
            await client.query(
              `INSERT INTO inventory (user_id, name, category, weight, purity, purchase_price, quantity, status)
               VALUES ($1, $2, $3, $4, $5, $6, $7, 'In Stock')`,
              [req.user.id, itemName, itemCategory, itemWeight, itemPurity, itemCost, itemQty]
            )
          }
        }

        // Update purchase status
        const result = await client.query(
          `UPDATE purchases SET status = 'Received', updated_at = NOW()
           WHERE id = $1 AND user_id = $2 RETURNING *`,
          [req.params.id, req.user.id]
        )

        await client.query('COMMIT')
        client.release()
        return res.json(result.rows[0])
      } catch (txErr) {
        await client.query('ROLLBACK')
        throw txErr
      }
    } else {
      // Normal update
      client.release()
      const result = await pool.query(
        `UPDATE purchases SET supplier_name = COALESCE($1, supplier_name), supplier_phone = COALESCE($2, supplier_phone),
         items = COALESCE($3, items), total_amount = COALESCE($4, total_amount), status = COALESCE($5, status),
         notes = COALESCE($6, notes), updated_at = NOW()
         WHERE id = $7 AND user_id = $8 RETURNING *`,
        [supplierName, supplierPhone, items ? JSON.stringify(items) : null, totalAmount, status, notes, req.params.id, req.user.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' })
      return res.json(result.rows[0])
    }
  } catch (err) {
    client.release()
    console.error('Update purchase error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/v1/purchases/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM purchases WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' })
    res.json({ message: 'Purchase deleted' })
  } catch (err) {
    console.error('Delete purchase error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
