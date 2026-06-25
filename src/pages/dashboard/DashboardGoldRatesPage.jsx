import { useState, useEffect } from 'react'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

export default function DashboardGoldRatesPage() {
  const { authHeaders } = useAuth()
  const [rates, setRates] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedPurity, setSelectedPurity] = useState(24)
  const [calcWeight, setCalcWeight] = useState('')
  const [calcPurity, setCalcPurity] = useState(24)

  useEffect(() => { fetchRates(); fetchHistory() }, [])
  useEffect(() => { fetchHistory() }, [selectedPurity])

  async function fetchRates() {
    try {
      const res = await fetch('/api/v1/rates/live', { headers: authHeaders() })
      if (res.ok) setRates(await res.json())
    } catch (err) { console.error(err) }
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`/api/v1/rates/history?purity=${selectedPurity}&days=30`, { headers: authHeaders() })
      if (res.ok) setHistory(await res.json())
    } catch (err) { console.error(err) }
  }

  function getRate(purity) {
    if (!rates) return 0
    if (purity === 999) {
      const silverData = rates.rates?.find(r => r.label.includes('Silver'))
      return silverData ? silverData.rate : 0
    }
    return rates.rateMap?.[purity] || 0
  }

  function calcValue() {
    const weight = parseFloat(calcWeight) || 0
    return (weight * getRate(calcPurity)).toLocaleString('en-IN')
  }

  const chartData = {
    labels: history.map(h => h.date.slice(5)),
    datasets: [{
      label: `${selectedPurity}K Gold (₹/g)`,
      data: history.map(h => h.rate),
      borderColor: '#DAA520',
      backgroundColor: 'rgba(218, 165, 32, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 2,
    }]
  }

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { border: { display: false }, grid: { color: 'rgba(0,0,0,0.04)' } },
      x: { border: { display: false }, grid: { display: false }, ticks: { maxTicksLimit: 10 } }
    }
  }

  // Fallback if data is empty
  const displayRates = rates?.rates || []

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Live Gold Rates</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>
          Current market rates • Updated {rates ? new Date(rates.timestamp).toLocaleString('en-IN') : '—'}
        </p>
      </div>

      {/* Rate Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {displayRates.length > 0 ? displayRates.map(rateData => {
          const change = rateData.change || 0
          const isUp = change >= 0
          const isSilver = rateData.label.includes('Silver')
          
          return (
            <div key={rateData.label} className="card-gold" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: isSilver ? 'rgba(200,200,220,0.1)' : 'rgba(218,165,32,0.06)' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-400)', marginBottom: '8px' }}>{rateData.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-700)', marginBottom: '8px' }}>
                ₹{rateData.rate?.toLocaleString('en-IN') || '—'}
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-navy-300)' }}>/g</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: isUp ? 'var(--color-success-500)' : 'var(--color-error-500)' }}>
                {isUp ? <FiTrendingUp /> : <FiTrendingDown />} {change > 0 ? '+' : ''}{change}%
              </div>
              <div style={{ position: 'absolute', top: '12px', right: '16px' }}>
                <div className="pulse-live" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success-400)' }} />
              </div>
            </div>
          )
        }) : <div style={{ color: 'var(--color-navy-300)', padding: '20px' }}>Loading rates...</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Historical Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)' }}>30-Day Rate Trend</h3>
            <select className="input" value={selectedPurity} onChange={e => setSelectedPurity(parseInt(e.target.value))}
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}>
              <option value={24}>24K Gold</option>
              <option value={22}>22K Gold</option>
              <option value={18}>18K Gold</option>
            </select>
          </div>
          <div style={{ height: '300px' }}>
            {history.length > 0 ? <Line data={chartData} options={chartOptions} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-navy-300)' }}>Loading chart...</div>}
          </div>
        </div>

        {/* Calculator */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '20px' }}>Rate Calculator</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Weight (grams)</label>
            <input className="input" type="number" step="0.01" value={calcWeight} onChange={e => setCalcWeight(e.target.value)} placeholder="Enter weight" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Purity</label>
            <select className="input" value={calcPurity} onChange={e => setCalcPurity(parseInt(e.target.value))}>
              <option value={24}>24K Gold</option>
              <option value={22}>22K Gold</option>
              <option value={18}>18K Gold</option>
              <option value={999}>Silver 999</option>
            </select>
          </div>
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, var(--color-gold-50), var(--color-warm-100))', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-navy-400)', marginBottom: '8px' }}>Estimated Value</div>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-700)' }}>₹{calcValue()}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-navy-300)', marginTop: '4px' }}>
              Rate: ₹{getRate(calcPurity).toLocaleString('en-IN')}/g
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 1024px) { div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
