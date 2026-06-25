import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/reports/sales
router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query
    let dateFormat
    switch (groupBy) {
      case 'week': dateFormat = 'IYYY-IW'; break
      case 'month': dateFormat = 'YYYY-MM'; break
      default: dateFormat = 'YYYY-MM-DD'
    }

    let query = `SELECT TO_CHAR(created_at, '${dateFormat}') as period,
      COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
      FROM sales_orders WHERE user_id = $1`
    const params = [req.user.id]
    let paramIdx = 2

    if (startDate) {
      query += ` AND created_at >= $${paramIdx++}`
      params.push(startDate)
    }
    if (endDate) {
      query += ` AND created_at <= $${paramIdx++}`
      params.push(endDate)
    }

    query += ` GROUP BY period ORDER BY period DESC`
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Sales report error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/reports/stock-valuation
router.get('/stock-valuation', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, purity, COUNT(*) as items, COALESCE(SUM(weight), 0) as total_weight,
       COALESCE(SUM(making_charge), 0) as total_making_charge
       FROM inventory WHERE user_id = $1 AND status = 'In Stock'
       GROUP BY category, purity ORDER BY category`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Stock valuation error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/reports/gst
router.get('/gst', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query
    const result = await pool.query(
      `SELECT COUNT(*) as total_invoices,
       COALESCE(SUM(total_amount), 0) as total_sales,
       COALESCE(SUM(total_amount * cgst_rate / 100), 0) as total_cgst,
       COALESCE(SUM(total_amount * sgst_rate / 100), 0) as total_sgst
       FROM sales_orders WHERE user_id = $1 AND is_gst = true
       AND EXTRACT(MONTH FROM created_at) = $2
       AND EXTRACT(YEAR FROM created_at) = $3`,
      [req.user.id, month || new Date().getMonth() + 1, year || new Date().getFullYear()]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('GST report error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/v1/reports/profit
router.get('/profit', authenticateToken, async (req, res) => {
  try {
    const salesResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM sales_orders WHERE user_id = $1 AND status = 'Completed'`,
      [req.user.id]
    )
    const purchaseResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total_purchases FROM purchases WHERE user_id = $1`,
      [req.user.id]
    )
    const sales = parseFloat(salesResult.rows[0].total_sales)
    const purchases = parseFloat(purchaseResult.rows[0].total_purchases)

    res.json({
      totalSales: sales,
      totalPurchases: purchases,
      grossProfit: sales - purchases,
      profitMargin: sales > 0 ? ((sales - purchases) / sales * 100).toFixed(2) : 0
    })
  } catch (err) {
    console.error('Profit report error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
