import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'
import { sendInvoiceEmail } from '../services/emailService.js'
import { sendInvoiceWhatsApp } from '../services/whatsappService.js'

const router = Router()

// GET /api/v1/sales/orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { status, customerId } = req.query
    let query = 'SELECT * FROM sales_orders WHERE user_id = $1'
    const params = [req.user.id]
    let paramIdx = 2

    if (status) {
      query += ` AND status = $${paramIdx++}`
      params.push(status)
    }
    if (customerId) {
      query += ` AND customer_id = $${paramIdx++}`
      params.push(customerId)
    }

    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Get sales error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/sales/orders
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { customerId, customerName, customerPhone, items, isGst, cgstRate, sgstRate, discount, totalAmount, paymentMethod } = req.body

    if (!items || !totalAmount) {
      return res.status(400).json({ error: 'Items and total amount are required' })
    }

    let resolvedCustomerId = customerId || null

    // Auto-find or create customer by phone
    if (customerPhone && !resolvedCustomerId) {
      const existing = await pool.query(
        'SELECT id FROM customers WHERE phone = $1 AND user_id = $2',
        [customerPhone, req.user.id]
      )
      if (existing.rows.length > 0) {
        resolvedCustomerId = existing.rows[0].id
      } else if (customerName) {
        // Create new customer
        const newCust = await pool.query(
          'INSERT INTO customers (user_id, name, phone) VALUES ($1, $2, $3) RETURNING id',
          [req.user.id, customerName, customerPhone]
        )
        resolvedCustomerId = newCust.rows[0].id
      }
    }

    // Validate stock for items with inventory_id
    for (const item of items) {
      if (item.inventory_id) {
        const inv = await pool.query(
          'SELECT quantity, name FROM inventory WHERE id = $1 AND user_id = $2',
          [item.inventory_id, req.user.id]
        )
        if (inv.rows.length === 0) {
          return res.status(400).json({ error: `Inventory item not found: ${item.name}` })
        }
        const qty = parseInt(item.qty) || 1
        if (inv.rows[0].quantity < qty) {
          return res.status(400).json({ error: `Insufficient stock for "${inv.rows[0].name}". Available: ${inv.rows[0].quantity}, Requested: ${qty}` })
        }
      }
    }

    const result = await pool.query(
      `INSERT INTO sales_orders (user_id, customer_id, customer_name, customer_phone, items, is_gst, cgst_rate, sgst_rate, discount, total_amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending')
       RETURNING *`,
      [req.user.id, resolvedCustomerId, customerName || 'Walk-in', customerPhone || null, JSON.stringify(items), isGst !== false, cgstRate || 1.5, sgstRate || 1.5, discount || 0, totalAmount, paymentMethod || 'Cash']
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create sales order error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/sales/orders/:id
router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM sales_orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get sales order error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/v1/sales/orders/:id
router.put('/orders/:id', authenticateToken, async (req, res) => {
  const client = await pool.connect()
  try {
    const { status, items, totalAmount, discount, paymentMethod } = req.body

    // Fetch current order to check previous status
    const current = await client.query(
      'SELECT * FROM sales_orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (current.rows.length === 0) {
      client.release()
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = current.rows[0]

    // If status is changing to 'Completed', handle inventory + customer updates in a transaction
    if (status === 'Completed' && order.status !== 'Completed') {
      await client.query('BEGIN')

      try {
        const orderItems = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]')

        // Deduct inventory for each item with inventory_id
        for (const item of orderItems) {
          if (item.inventory_id) {
            const qty = parseInt(item.qty) || 1
            // Check stock
            const inv = await client.query(
              'SELECT quantity FROM inventory WHERE id = $1 AND user_id = $2 FOR UPDATE',
              [item.inventory_id, req.user.id]
            )
            if (inv.rows.length === 0) {
              await client.query('ROLLBACK')
              client.release()
              return res.status(400).json({ error: `Inventory item not found: ${item.name}` })
            }
            if (inv.rows[0].quantity < qty) {
              await client.query('ROLLBACK')
              client.release()
              return res.status(400).json({ error: `Insufficient stock for "${item.name}". Available: ${inv.rows[0].quantity}` })
            }

            const newQty = inv.rows[0].quantity - qty
            await client.query(
              'UPDATE inventory SET quantity = $1, status = $2, updated_at = NOW() WHERE id = $3',
              [newQty, newQty <= 0 ? 'Sold' : 'In Stock', item.inventory_id]
            )
          }
        }

        // Update customer stats if customer_id exists
        if (order.customer_id) {
          const orderTotal = parseFloat(order.total_amount) || 0
          const loyaltyEarned = Math.floor(orderTotal / 100)
          await client.query(
            `UPDATE customers SET
              total_purchases = total_purchases + $1,
              total_orders = total_orders + 1,
              loyalty_points = loyalty_points + $2,
              last_purchase_date = NOW(),
              updated_at = NOW()
            WHERE id = $3`,
            [orderTotal, loyaltyEarned, order.customer_id]
          )
        }

        // Update order status
        const result = await client.query(
          `UPDATE sales_orders SET status = $1, updated_at = NOW()
           WHERE id = $2 AND user_id = $3 RETURNING *`,
          ['Completed', req.params.id, req.user.id]
        )

        await client.query('COMMIT')
        client.release()
        return res.json(result.rows[0])
      } catch (txErr) {
        await client.query('ROLLBACK')
        throw txErr
      }
    } else {
      // Normal update (no special Completed logic)
      client.release()
      const result = await pool.query(
        `UPDATE sales_orders SET status = COALESCE($1, status), items = COALESCE($2, items),
         total_amount = COALESCE($3, total_amount), discount = COALESCE($4, discount),
         payment_method = COALESCE($5, payment_method), updated_at = NOW()
         WHERE id = $6 AND user_id = $7 RETURNING *`,
        [status, items ? JSON.stringify(items) : null, totalAmount, discount, paymentMethod, req.params.id, req.user.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' })
      return res.json(result.rows[0])
    }
  } catch (err) {
    client.release()
    console.error('Update sales order error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/sales/orders/:id/send-email
router.post('/orders/:id/send-email', authenticateToken, async (req, res) => {
  try {
    const order = await pool.query(
      'SELECT * FROM sales_orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' })

    const orderData = order.rows[0]

    // Get customer email
    let customerEmail = req.body.email
    if (!customerEmail && orderData.customer_id) {
      const cust = await pool.query('SELECT email FROM customers WHERE id = $1', [orderData.customer_id])
      customerEmail = cust.rows[0]?.email
    }

    // Get business settings
    const settings = await pool.query('SELECT * FROM settings WHERE user_id = $1', [req.user.id])
    const businessSettings = settings.rows[0] || {}

    const result = await sendInvoiceEmail(orderData, customerEmail, businessSettings)
    res.status(result.success ? 200 : 400).json(result)
  } catch (err) {
    console.error('Send email error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/v1/sales/orders/:id/send-whatsapp
router.post('/orders/:id/send-whatsapp', authenticateToken, async (req, res) => {
  try {
    const order = await pool.query(
      'SELECT * FROM sales_orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' })

    const orderData = order.rows[0]
    const phone = req.body.phone || orderData.customer_phone

    const settings = await pool.query('SELECT * FROM settings WHERE user_id = $1', [req.user.id])
    const businessSettings = settings.rows[0] || {}

    const result = await sendInvoiceWhatsApp(orderData, phone, businessSettings)
    res.status(result.success ? 200 : 400).json(result)
  } catch (err) {
    console.error('Send whatsapp error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/v1/sales/orders/:id
router.delete('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM sales_orders WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' })
    res.json({ message: 'Order deleted' })
  } catch (err) {
    console.error('Delete sales order error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
