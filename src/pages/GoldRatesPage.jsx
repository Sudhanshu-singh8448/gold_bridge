import { useState, useEffect } from 'react'
import { FiTrendingUp, FiTrendingDown, FiLoader } from 'react-icons/fi'

export default function GoldRatesPage() {
  const [weight, setWeight] = useState(10)
  const [purity, setPurity] = useState(22)
  
  const [rates, setRates] = useState([])
  const [rateMap, setRateMap] = useState({ 24: 0, 22: 0, 18: 0 })
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('/api/v1/rates/live')
        if (!response.ok) {
          throw new Error('Failed to fetch rates')
        }
        const data = await response.json()
        setRates(data.rates || [])
        setRateMap(data.rateMap || { 24: 0, 22: 0, 18: 0 })
        setLastUpdated(new Date(data.timestamp))
      } catch (err) {
        console.error('Error fetching live rates:', err)
        setError('Failed to load live rates. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    async function fetchHistory() {
      try {
        const res = await fetch('/api/v1/rates/history?purity=24&days=30')
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (err) {
        console.error('Error fetching history:', err)
      }
    }

    fetchRates()
    fetchHistory()
  }, [])

  // Calculate min/max for bar chart scaling
  const historyRates = history.map(h => h.rate).filter(Boolean)
  const minRate = historyRates.length > 0 ? Math.min(...historyRates) : 0
  const maxRate = historyRates.length > 0 ? Math.max(...historyRates) : 1
  const rateRange = maxRate - minRate || 1

  return (
    <div style={{ paddingTop: '100px' }}>
      <section style={{ padding: '80px 0 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>📊 Live Rates</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Today's <span className="text-gold-gradient">Gold & Silver</span> Rates
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-navy-300)' }}>
            Updated every 15 minutes • Last updated: {lastUpdated ? lastUpdated.toLocaleString('en-IN') : '—'}
          </p>
        </div>
      </section>

      {/* Rate Cards */}
      <section className="section-sm" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-navy-400)' }}>
              <FiLoader style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '16px' }}>Fetching live rates from API...</p>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#FEF2F2', color: 'var(--color-error-600)', borderRadius: 'var(--radius-lg)', marginBottom: '60px' }}>
              {error}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '60px' }}>
              {rates.map((r, i) => (
                <div key={i} className="card-gold" style={{ padding: '28px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-300)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-700)', marginBottom: '8px' }}>
                    ₹{r.rate?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-navy-300)', marginBottom: '12px' }}>{r.unit}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    fontSize: '13px', fontWeight: 600,
                    background: r.change >= 0 ? '#ECFDF5' : '#FEF2F2',
                    color: r.change >= 0 ? 'var(--color-success-500)' : 'var(--color-error-500)',
                  }}>
                    {r.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    {r.change >= 0 ? '+' : ''}{r.change}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calculator */}
          <div className="card" style={{ padding: '40px', maxWidth: '560px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', textAlign: 'center', color: 'var(--color-navy-700)' }}>
              💰 Gold Value Calculator
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Weight (grams)</label>
                <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Purity</label>
                <select className="input" value={purity} onChange={e => setPurity(Number(e.target.value))}>
                  <option value={24}>24K (999)</option>
                  <option value={22}>22K (916)</option>
                  <option value={18}>18K (750)</option>
                </select>
              </div>
            </div>
            <div style={{
              background: 'var(--color-gold-50)', borderRadius: 'var(--radius-lg)', padding: '24px',
              textAlign: 'center', border: '1px solid var(--color-gold-200)',
            }}>
              <div style={{ fontSize: '14px', color: 'var(--color-navy-300)', marginBottom: '4px' }}>Estimated Value</div>
              <div style={{ fontSize: '40px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-gold-600)' }}>
                ₹{(weight * (rateMap[purity] || 0)).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-navy-300)', marginTop: '4px' }}>
                {weight}g × ₹{(rateMap[purity] || 0).toLocaleString('en-IN')}/g ({purity}K)
              </div>
            </div>
          </div>

          {/* Rate Trend Chart — Real data from API */}
          <div className="card" style={{ padding: '32px', marginTop: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: 'var(--color-navy-700)' }}>📈 24K Gold Rate Trend (Last 30 Days)</h3>
            {history.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--color-navy-300)' }}>
                  <span>₹{minRate.toLocaleString('en-IN')}</span>
                  <span>₹{maxRate.toLocaleString('en-IN')}</span>
                </div>
                <div style={{
                  height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '0 0 24px',
                }}>
                  {history.map((h, i) => {
                    const heightPct = ((h.rate - minRate) / rateRange) * 80 + 15 // 15-95% range
                    const isLast = i === history.length - 1
                    return (
                      <div key={i} style={{
                        flex: 1,
                        height: `${heightPct}%`,
                        background: isLast
                          ? 'linear-gradient(to top, var(--color-gold-500), var(--color-gold-300))'
                          : 'var(--color-gold-100)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'all 0.3s ease',
                        minHeight: '4px',
                        cursor: 'pointer',
                      }} title={`${h.date}: ₹${h.rate.toLocaleString('en-IN')}/g`} />
                    )
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-navy-300)' }}>
                  <span>{history[0]?.date}</span>
                  <span>{history[history.length - 1]?.date}</span>
                </div>
              </>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy-300)' }}>
                Loading trend data...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
