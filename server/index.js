import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Routes
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import inventoryRoutes from './routes/inventory.js'
import salesRoutes from './routes/sales.js'
import customersRoutes from './routes/customers.js'
import purchasesRoutes from './routes/purchases.js'
import manufacturingRoutes from './routes/manufacturing.js'
import ratesRoutes from './routes/rates.js'
import reportsRoutes from './routes/reports.js'
import invoicesRoutes from './routes/invoices.js'
import settingsRoutes from './routes/settings.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5001
const NODE_ENV = process.env.NODE_ENV || 'development'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Trust proxy (for deployments behind reverse proxies like Railway/Render)
app.set('trust proxy', 1)

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production'
    ? FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: NODE_ENV })
})

// API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', authRoutes)  // /me endpoint is on auth router
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/inventory', inventoryRoutes)
app.use('/api/v1/sales', salesRoutes)
app.use('/api/v1/customers', customersRoutes)
app.use('/api/v1/purchases', purchasesRoutes)
app.use('/api/v1/manufacturing', manufacturingRoutes)
app.use('/api/v1/rates', ratesRoutes)
app.use('/api/v1/reports', reportsRoutes)
app.use('/api/v1/invoices', invoicesRoutes)
app.use('/api/v1/settings', settingsRoutes)

// Serve frontend build in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// SPA fallback — serve index.html for all non-API routes
app.use((req, res, next) => {
  // Don't serve index.html for API routes
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next()
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // dist folder doesn't exist yet (dev mode)
      res.status(404).json({ error: 'Frontend not built. Run "npm run build" first.' })
    }
  })
})

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 GoldBridge API running on http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${NODE_ENV}`)
  if (NODE_ENV === 'production') {
    console.log(`📦 Serving frontend from: ${distPath}`)
  }
})
