import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/dashboard/summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Total revenue
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM sales_orders WHERE user_id = $1 AND status = 'Completed'`,
      [userId]
    )

    // Total orders
    const ordersResult = await pool.query(
      'SELECT COUNT(*) as total FROM sales_orders WHERE user_id = $1',
      [userId]
    )

    // New customers (last 30 days)
    const customersResult = await pool.query(
      `SELECT COUNT(*) as total FROM customers WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'`,
      [userId]
    )

    // Gold stock weight
    const stockResult = await pool.query(
      `SELECT COALESCE(SUM(weight), 0) as total FROM inventory WHERE user_id = $1 AND status = 'In Stock'`,
      [userId]
    )

    res.json({
      totalRevenue: { value: parseFloat(revenueResult.rows[0].total), trend: 12.5 },
      totalOrders: { value: parseInt(ordersResult.rows[0].total), trend: 5.2 },
      newCustomers: { value: parseInt(customersResult.rows[0].total), trend: -2.1 },
      goldStock: { value: parseFloat(stockResult.rows[0].total), unit: 'g', trend: 1.5 }
    })
  } catch (err) {
    console.error('Dashboard summary error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/dashboard/charts
router.get('/charts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Sales by day (last 7 days)
    const salesByDay = await pool.query(
      `SELECT DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as total
       FROM sales_orders WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at) ORDER BY date`,
      [userId]
    )

    // Sales by category (from inventory items in orders)
    const categoryResult = await pool.query(
      `SELECT i.category, COUNT(*) as count
       FROM inventory i WHERE i.user_id = $1
       GROUP BY i.category ORDER BY count DESC LIMIT 6`,
      [userId]
    )

    // Stock by category
    const stockByCategory = await pool.query(
      `SELECT category, COALESCE(SUM(weight), 0) as total_weight
       FROM inventory WHERE user_id = $1 AND status = 'In Stock'
       GROUP BY category ORDER BY total_weight DESC LIMIT 6`,
      [userId]
    )

    res.json({
      salesTrend: salesByDay.rows,
      categoryDistribution: categoryResult.rows,
      stockByCategory: stockByCategory.rows,
    })
  } catch (err) {
    console.error('Dashboard charts error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/dashboard/recent-orders
router.get('/recent-orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT so.id, so.customer_name, so.total_amount, so.status, so.created_at
       FROM sales_orders so WHERE so.user_id = $1
       ORDER BY so.created_at DESC LIMIT 10`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Recent orders error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
