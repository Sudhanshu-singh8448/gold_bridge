import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, sortBy } = req.query
    let query = 'SELECT * FROM customers WHERE user_id = $1'
    const params = [req.user.id]

    if (search) {
      query += ` AND (name ILIKE $2 OR phone ILIKE $2 OR email ILIKE $2)`
      params.push(`%${search}%`)
    }

    query += ` ORDER BY ${sortBy === 'purchases' ? 'total_purchases DESC' : 'created_at DESC'}`
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Get customers error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/customers
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, address, panNumber } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Customer name is required' })
    }

    const result = await pool.query(
      `INSERT INTO customers (user_id, name, phone, email, address, pan_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, name, phone || null, email || null, address || null, panNumber || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/customers/:id — Enhanced with full profile + order history
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' })

    const customer = result.rows[0]

    // Get all sales orders for this customer with full item details
    const orders = await pool.query(
      'SELECT * FROM sales_orders WHERE customer_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    )

    // Compute statistics
    const completedOrders = orders.rows.filter(o => o.status === 'Completed')
    const statistics = {
      totalPurchases: parseFloat(customer.total_purchases) || 0,
      totalOrders: parseInt(customer.total_orders) || orders.rows.length,
      completedOrders: completedOrders.length,
      pendingOrders: orders.rows.filter(o => o.status === 'Pending').length,
      loyaltyPoints: parseInt(customer.loyalty_points) || 0,
      lastPurchaseDate: customer.last_purchase_date,
      averageOrderValue: completedOrders.length > 0
        ? completedOrders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0) / completedOrders.length
        : 0
    }

    res.json({
      ...customer,
      statistics,
      purchaseHistory: orders.rows
    })
  } catch (err) {
    console.error('Get customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/customers/:id/history — Dedicated history endpoint
router.get('/:id/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' })

    const customer = result.rows[0]

    const orders = await pool.query(
      'SELECT * FROM sales_orders WHERE customer_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    )

    const completedOrders = orders.rows.filter(o => o.status === 'Completed')

    res.json({
      customer,
      statistics: {
        totalPurchases: parseFloat(customer.total_purchases) || 0,
        totalOrders: parseInt(customer.total_orders) || orders.rows.length,
        completedOrders: completedOrders.length,
        loyaltyPoints: parseInt(customer.loyalty_points) || 0,
        lastPurchaseDate: customer.last_purchase_date,
        averageOrderValue: completedOrders.length > 0
          ? completedOrders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0) / completedOrders.length
          : 0
      },
      orders: orders.rows
    })
  } catch (err) {
    console.error('Get customer history error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/customers/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, address, panNumber, loyaltyPoints } = req.body
    const result = await pool.query(
      `UPDATE customers SET name = COALESCE($1, name), phone = COALESCE($2, phone),
       email = COALESCE($3, email), address = COALESCE($4, address),
       pan_number = COALESCE($5, pan_number), loyalty_points = COALESCE($6, loyalty_points),
       updated_at = NOW()
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [name, phone, email, address, panNumber, loyaltyPoints, req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/v1/customers/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' })
    res.json({ message: 'Customer deleted' })
  } catch (err) {
    console.error('Delete customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
