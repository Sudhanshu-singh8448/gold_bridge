import { useState, useEffect } from 'react'
import { FiFileText, FiDownload, FiBarChart2, FiPieChart, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const reportTypes = [
  { id: 'sales', label: 'Sales Report', icon: <FiBarChart2 />, color: '#3B82F6', desc: 'Sales by period with revenue breakdown' },
  { id: 'stock', label: 'Stock Valuation', icon: <FiPieChart />, color: '#8B5CF6', desc: 'Current stock value by category and purity' },
  { id: 'gst', label: 'GST Report', icon: <FiFileText />, color: '#F59E0B', desc: 'GSTR-1 and GSTR-3B summary' },
  { id: 'profit', label: 'Profit & Loss', icon: <FiDollarSign />, color: '#22C55E', desc: 'Revenue, expenses, and gross profit margin' },
]

export default function DashboardReportsPage() {
  const { authHeaders } = useAuth()
  const [activeReport, setActiveReport] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '', groupBy: 'day' })

  async function generateReport(type) {
    setActiveReport(type)
    setReportData(null)
    setLoading(true)
    try {
      let url = ''
      switch (type) {
        case 'sales':
          const params = new URLSearchParams()
          if (dateRange.startDate) params.set('startDate', dateRange.startDate)
          if (dateRange.endDate) params.set('endDate', dateRange.endDate)
          params.set('groupBy', dateRange.groupBy)
          url = `/api/v1/reports/sales?${params}`
          break
        case 'stock': url = '/api/v1/reports/stock-valuation'; break
        case 'gst': url = `/api/v1/reports/gst?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`; break
        case 'profit': url = '/api/v1/reports/profit'; break
      }
      const res = await fetch(url, { headers: authHeaders() })
      if (res.ok) setReportData(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Reports & Analytics</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>Generate detailed business reports</p>
      </div>

      {/* Report Type Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {reportTypes.map(r => (
          <div key={r.id} className="card" style={{ padding: '24px', cursor: 'pointer', border: activeReport === r.id ? `2px solid ${r.color}` : undefined }}
            onClick={() => generateReport(r.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${r.color}15`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-navy-700)' }}>{r.label}</div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-navy-400)', lineHeight: 1.5 }}>{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Date Range (for sales) */}
      {activeReport === 'sales' && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="input" type="date" value={dateRange.startDate} onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })} style={{ width: 'auto', height: '40px', fontSize: '14px' }} />
          <span style={{ color: 'var(--color-navy-300)' }}>to</span>
          <input className="input" type="date" value={dateRange.endDate} onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })} style={{ width: 'auto', height: '40px', fontSize: '14px' }} />
          <select className="input" value={dateRange.groupBy} onChange={e => setDateRange({ ...dateRange, groupBy: e.target.value })} style={{ width: 'auto', height: '40px', fontSize: '14px' }}>
            <option value="day">Daily</option><option value="week">Weekly</option><option value="month">Monthly</option>
          </select>
          <button className="btn btn-gold btn-sm" onClick={() => generateReport('sales')}>Generate</button>
        </div>
      )}

      {/* Report Results */}
      {activeReport && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)' }}>
              {reportTypes.find(r => r.id === activeReport)?.label} Results
            </h3>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Generating report...</div>
          ) : !reportData ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-navy-300)' }}>No data available</div>
          ) : activeReport === 'sales' && Array.isArray(reportData) ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-warm-50)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Period</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Orders</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.period}</td>
                      <td style={{ padding: '12px 16px' }}>{row.orders}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{parseFloat(row.revenue).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-navy-300)' }}>No sales data for this period</div>}
            </div>
          ) : activeReport === 'stock' && Array.isArray(reportData) ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-warm-50)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Category</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Purity</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Items</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Total Weight</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Making Charges</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{row.category}</td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-gold">{row.purity}K</span></td>
                      <td style={{ padding: '12px 16px' }}>{row.items}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500 }}>{parseFloat(row.total_weight).toFixed(2)}g</td>
                      <td style={{ padding: '12px 16px' }}>₹{parseFloat(row.total_making_charge).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-navy-300)' }}>No stock data</div>}
            </div>
          ) : activeReport === 'gst' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Total Invoices', value: reportData.total_invoices || 0 },
                { label: 'Total Sales', value: `₹${parseFloat(reportData.total_sales || 0).toLocaleString('en-IN')}` },
                { label: 'CGST Collected', value: `₹${parseFloat(reportData.total_cgst || 0).toLocaleString('en-IN')}` },
                { label: 'SGST Collected', value: `₹${parseFloat(reportData.total_sgst || 0).toLocaleString('en-IN')}` },
              ].map((s, i) => (
                <div key={i} style={{ padding: '20px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-navy-400)', marginBottom: '8px', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)' }}>{s.value}</div>
                </div>
              ))}
            </div>
          ) : activeReport === 'profit' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Total Sales', value: `₹${parseFloat(reportData.totalSales || 0).toLocaleString('en-IN')}`, color: '#22C55E' },
                { label: 'Total Purchases', value: `₹${parseFloat(reportData.totalPurchases || 0).toLocaleString('en-IN')}`, color: '#F59E0B' },
                { label: 'Gross Profit', value: `₹${parseFloat(reportData.grossProfit || 0).toLocaleString('en-IN')}`, color: '#3B82F6' },
                { label: 'Profit Margin', value: `${reportData.profitMargin || 0}%`, color: '#8B5CF6' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '20px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-navy-400)', marginBottom: '8px', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
