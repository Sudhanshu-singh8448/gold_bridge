import { Router } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

// In-memory cache for the latest fetched rates
let cachedRates = {
  gold24k: 0,
  gold22k: 0,
  gold18k: 0,
  silver: 0,
  timestamp: null,
}

// Fetch live rates from RapidAPI and update cache
async function fetchLiveRates() {
  const response = await fetch('https://gold-silver-rates-india.p.rapidapi.com/api/Fetch-Gold-Silver/?city=mumbai', {
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': 'gold-silver-rates-india.p.rapidapi.com',
      'x-rapidapi-key': process.env.API_TOKEN
    }
  })

  if (!response.ok) {
    throw new Error(`API returned status: ${response.status}`)
  }

  const json = await response.json()

  if (json.success && json.data) {
    cachedRates.gold24k = json.data.gold['24k']['1gram']
    cachedRates.gold22k = json.data.gold['22k']['1gram']
    cachedRates.gold18k = Math.round(cachedRates.gold24k * 0.75)
    cachedRates.silver = json.data.silver['1gram']
    cachedRates.timestamp = new Date().toISOString()
    return true
  }

  return false
}

// GET /api/v1/rates/live
router.get('/live', async (req, res) => {
  try {
    await fetchLiveRates()

    const rates = [
      { label: '24K Gold (999)', rate: cachedRates.gold24k, change: 0, unit: '₹/gram' },
      { label: '22K Gold (916)', rate: cachedRates.gold22k, change: 0, unit: '₹/gram' },
      { label: '18K Gold (750)', rate: cachedRates.gold18k, change: 0, unit: '₹/gram' },
      { label: 'Silver (999)', rate: cachedRates.silver, change: 0, unit: '₹/gram' },
    ]

    res.json({
      timestamp: cachedRates.timestamp,
      rates,
      rateMap: { 24: cachedRates.gold24k, 22: cachedRates.gold22k, 18: cachedRates.gold18k }
    })
  } catch (error) {
    console.error('Error fetching rates:', error)

    // If we have cached data, return it even on API failure
    if (cachedRates.timestamp) {
      const rates = [
        { label: '24K Gold (999)', rate: cachedRates.gold24k, change: 0, unit: '₹/gram' },
        { label: '22K Gold (916)', rate: cachedRates.gold22k, change: 0, unit: '₹/gram' },
        { label: '18K Gold (750)', rate: cachedRates.gold18k, change: 0, unit: '₹/gram' },
        { label: 'Silver (999)', rate: cachedRates.silver, change: 0, unit: '₹/gram' },
      ]
      return res.json({
        timestamp: cachedRates.timestamp,
        rates,
        rateMap: { 24: cachedRates.gold24k, 22: cachedRates.gold22k, 18: cachedRates.gold18k },
        cached: true,
      })
    }

    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// GET /api/v1/rates/history (public — no auth required)
// Generates realistic simulated history based on current live rate
router.get('/history', async (req, res) => {
  try {
    const { purity = 24, days = 30 } = req.query

    // Ensure we have current rates to base history on
    if (!cachedRates.timestamp) {
      try { await fetchLiveRates() } catch (e) { /* ignore */ }
    }

    const baseRate = purity == 24 ? cachedRates.gold24k
      : purity == 22 ? cachedRates.gold22k
      : purity == 18 ? cachedRates.gold18k
      : cachedRates.silver

    // If we still have no rate, return empty
    if (!baseRate) {
      return res.json([])
    }

    // Generate simulated history: small daily drift toward today's rate
    // Uses a seeded-like approach so the same day always returns the same value
    const history = []
    const numDays = parseInt(days) || 30
    const variationPct = purity == 999 || purity == 0 ? 0.03 : 0.015 // Silver is more volatile

    for (let i = numDays; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Create a deterministic-ish variation based on date string hash
      let hash = 0
      for (let j = 0; j < dateStr.length; j++) {
        hash = ((hash << 5) - hash + dateStr.charCodeAt(j)) | 0
      }
      const normalizedHash = (Math.abs(hash) % 1000) / 1000 // 0 to 1
      const variation = (normalizedHash - 0.5) * 2 * variationPct * baseRate

      // Trend toward current price as we approach today
      const trendFactor = i / numDays // 1 at start, 0 at today
      const trendedRate = baseRate + (variation * trendFactor) - (baseRate * 0.02 * trendFactor)

      history.push({
        date: dateStr,
        rate: Math.round(Math.max(trendedRate, baseRate * 0.9)),
        purity: parseInt(purity),
      })
    }

    res.json(history)
  } catch (err) {
    console.error('History error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
