import { useState, useEffect } from 'react'
import {
  FiTrendingUp, FiTrendingDown, FiShoppingCart, FiUsers,
  FiPackage, FiDollarSign, FiArrowRight, FiMoreVertical, FiLoader
} from 'react-icons/fi'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

// Register ChartJS
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend
)

export default function DashboardHome() {
  const { authHeaders } = useAuth()
  const [period, setPeriod] = useState('This Week')
  const [loading, setLoading] = useState(true)

  // Real data state
  const [summary, setSummary] = useState(null)
  const [charts, setCharts] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [summaryRes, chartsRes, ordersRes] = await Promise.all([
          fetch('/api/v1/dashboard/summary', { headers: authHeaders() }),
          fetch('/api/v1/dashboard/charts', { headers: authHeaders() }),
          fetch('/api/v1/dashboard/recent-orders', { headers: authHeaders() }),
        ])

        {/* Useful api fetch*/}
        if (summaryRes.ok) setSummary(await summaryRes.json())

        if (chartsRes.ok) setCharts(await chartsRes.json())
        if (ordersRes.ok) setRecentOrders(await ordersRes.json())
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Stats from real summary
  const stats = summary ? [



    { label: 'Total Revenue', value: `₹${parseFloat(summary.totalRevenue.value).toLocaleString('en-IN')}`, trend: `${summary.totalRevenue.trend > 0 ? '+' : ''}${summary.totalRevenue.trend}%`, isUp: summary.totalRevenue.trend >= 0, icon: <FiDollarSign />, color: '#22C55E' },




    { label: 'Total Orders', value: summary.totalOrders.value.toString(), trend: `${summary.totalOrders.trend > 0 ? '+' : ''}${summary.totalOrders.trend}%`, isUp: summary.totalOrders.trend >= 0, icon: <FiShoppingCart />, color: '#3B82F6' },
    { label: 'New Customers', value: summary.newCustomers.value.toString(), trend: `${summary.newCustomers.trend > 0 ? '+' : ''}${summary.newCustomers.trend}%`, isUp: summary.newCustomers.trend >= 0, icon: <FiUsers />, color: '#8B5CF6' },
    { label: 'Gold Stock', value: `${parseFloat(summary.goldStock.value).toFixed(1)} ${summary.goldStock.unit}`, trend: `${summary.goldStock.trend > 0 ? '+' : ''}${summary.goldStock.trend}%`, isUp: summary.goldStock.trend >= 0, icon: <FiPackage />, color: '#DAA520' },
  ] : []

  // Sales trend chart from real data
  const salesTrend = charts?.salesTrend || []
  const salesData = {
    labels: salesTrend.length > 0 ? salesTrend.map(s => {
      const d = new Date(s.date)
      return d.toLocaleDateString('en-IN', { weekday: 'short' })
    }) : ['No data'],
    datasets: [{
      label: 'Sales (₹)',
      data: salesTrend.length > 0 ? salesTrend.map(s => parseFloat(s.total)) : [0],
      borderColor: '#DAA520',
      backgroundColor: 'rgba(218, 165, 32, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  }

  // Category distribution from real data
  const categoryDist = charts?.categoryDistribution || []
  const categoryColors = ['#DAA520', '#CD7F32', '#22C55E', '#2563EB', '#8B5CF6', '#F59E0B']
  const categoryData = {
    labels: categoryDist.length > 0 ? categoryDist.map(c => c.category) : ['No data'],
    datasets: [{
      data: categoryDist.length > 0 ? categoryDist.map(c => parseInt(c.count)) : [1],
      backgroundColor: categoryDist.length > 0 ? categoryDist.map((_, i) => categoryColors[i % categoryColors.length]) : ['#E8EDF5'],
      borderWidth: 0,
    }]
  }

  // Stock by category from real data
  const stockByCat = charts?.stockByCategory || []
  const stockData = {
    labels: stockByCat.length > 0 ? stockByCat.map(s => s.category) : ['No data'],
    datasets: [{
      label: 'Stock Weight (g)',
      data: stockByCat.length > 0 ? stockByCat.map(s => parseFloat(s.total_weight)) : [0],
      backgroundColor: stockByCat.length > 0 ? stockByCat.map((_, i) => categoryColors[i % categoryColors.length]) : ['#E8EDF5'],
      borderRadius: 4,
    }]
  }

  // Calculate total for doughnut center
  const totalCategoryItems = categoryDist.reduce((s, c) => s + parseInt(c.count), 0)
  const topCategoryPct = totalCategoryItems > 0
    ? Math.round((parseInt(categoryDist[0]?.count || 0) / totalCategoryItems) * 100)
    : 0

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { border: { display: false }, grid: { color: 'rgba(0,0,0,0.04)' } },
      x: { border: { display: false }, grid: { display: false } }
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px', color: 'var(--color-navy-400)' }}>
        <FiLoader style={{ fontSize: '32px', animation: 'spin 1s linear infinite', marginRight: '12px' }} />
        <span style={{ fontSize: '16px' }}>Loading dashboard...</span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Dashboard Overview</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <select
          className="input"
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{ width: 'auto', padding: '8px 36px 8px 16px', background: 'white', borderRadius: 'var(--radius-full)' }}
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {stats.length > 0 ? stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-400)', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-700)' }}>{stat.value}</div>
              </div>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${stat.color}15`, color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>{stat.icon}</div>
            </div>


              {/*trending up sign problem : from where data is coming  */}
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600,
                color: stat.isUp ? 'var(--color-success-500)' : 'var(--color-error-500)'
              }}>
                {stat.isUp ? <FiTrendingUp /> : <FiTrendingDown />} {stat.trend}
              </span>
              <span style={{ color: 'var(--color-navy-300)' }}>vs last period</span>



            </div> */}
          </div>
        )) : (
          <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-navy-300)' }}>
            <FiPackage style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--color-warm-300)' }} />
            <p>No data yet. Start by adding inventory and creating sales orders!</p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Sales Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)' }}>Revenue Trend</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy-300)' }}><FiMoreVertical /></button>
          </div>
          <div style={{ height: '300px' }}>
            {salesTrend.length > 0 ? (
              <Line data={salesData} options={chartOptions} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-navy-300)', fontSize: '14px' }}>
                No sales data yet. Create your first order to see trends.
              </div>
            )}
          </div>
        </div>

        {/* Category Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)' }}>Inventory by Category</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy-300)' }}><FiMoreVertical /></button>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            {categoryDist.length > 0 ? (
              <>
                <Doughnut data={categoryData} options={{ ...chartOptions, cutout: '75%' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)' }}>{topCategoryPct}%</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-navy-300)' }}>{categoryDist[0]?.category || ''}</div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-navy-300)', fontSize: '14px' }}>
                No inventory data yet.
              </div>
            )}
          </div>
          {categoryDist.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
              {categoryData.labels.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-navy-600)', fontWeight: 500 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: categoryData.datasets[0].backgroundColor[i] }} />
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)' }}>Recent Orders</h3>
            <Link to="/dashboard/sales" className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {recentOrders.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'var(--color-navy-400)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Amount</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 500, color: 'var(--color-navy-700)' }}>{row.customer_name}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-navy-700)' }}>₹{parseFloat(row.total_amount).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className={`badge badge-${row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Processing' ? 'info' : 'gold'}`}>{row.status}</span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--color-navy-400)', fontSize: '13px' }}>{new Date(row.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-navy-300)', fontSize: '14px' }}>
                <FiShoppingCart style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--color-warm-300)' }} />
                <p>No orders yet. Go to Sales to create your first order.</p>
              </div>
            )}
          </div>
        </div>

        {/* Stock Valuation Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)' }}>Stock by Category</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy-300)' }}><FiMoreVertical /></button>
          </div>
          <div style={{ height: '280px' }}>
            {stockByCat.length > 0 ? (
              <Bar data={stockData} options={{ ...chartOptions, scales: { y: { display: false }, x: { grid: { display: false }, border: { display: false } } } }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-navy-300)', fontSize: '14px' }}>
                No stock data yet. Add items to inventory.
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .card { overflow-x: auto; }
          div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
