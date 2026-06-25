import { FiBarChart2, FiDownload, FiCalendar, FiTrendingUp, FiPackage, FiUsers, FiDollarSign } from 'react-icons/fi'

const reports = [
  { icon: <FiDollarSign />, title: 'Daily Sales Report', desc: 'Track daily sales, returns, and net revenue across all counters.', color: '#22C55E' },
  { icon: <FiPackage />, title: 'Stock Valuation Report', desc: 'Real-time stock valuation by purity, category, and location.', color: '#DAA520' },
  { icon: <FiTrendingUp />, title: 'Profit & Loss Report', desc: 'Complete P&L analysis with margin breakdown by product category.', color: '#2563EB' },
  { icon: <FiBarChart2 />, title: 'Gold Movement Report', desc: 'Track gold inflow, outflow, wastage, and net position daily.', color: '#CD7F32' },
  { icon: <FiUsers />, title: 'Employee Productivity', desc: 'Artisan-wise production metrics, time tracking, and efficiency scores.', color: '#8B5CF6' },
  { icon: <FiCalendar />, title: 'GST Tax Reports', desc: 'Auto-generated GSTR-1, GSTR-3B summaries ready for filing.', color: '#F59E0B' },
]

export default function ReportsPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <section style={{ padding: '80px 0 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>📊 Reports</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Powerful <span className="text-gold-gradient">Reports & Analytics</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-navy-300)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Make data-driven decisions with comprehensive reports designed for the jewelry industry.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {reports.map((r, i) => (
              <div key={i} className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${r.color}, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: `${r.color}12`, color: r.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                  }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-navy-700)' }}>{r.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-navy-300)', lineHeight: 1.6, marginBottom: '16px' }}>{r.desc}</p>
                    <button className="btn btn-sm btn-outline" style={{ gap: '6px' }}>
                      <FiDownload style={{ fontSize: '14px' }} /> Preview Report
                    </button>
                  </div>
                </div>
                {/* Mock chart */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
                  {Array.from({ length: 14 }, (_, j) => (
                    <div key={j} style={{
                      flex: 1, height: `${30 + Math.random() * 70}%`,
                      background: j === 13 ? r.color : `${r.color}25`,
                      borderRadius: '2px 2px 0 0',
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
