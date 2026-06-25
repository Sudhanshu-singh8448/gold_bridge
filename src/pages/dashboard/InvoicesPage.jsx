import { useState, useEffect } from 'react'
import { FiFileText, FiPrinter, FiMail, FiMessageCircle, FiDownload, FiClock, FiCheckCircle, FiDollarSign } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import InvoiceModal from '../../components/InvoiceModal'

export default function InvoicesPage() {
  const { authHeaders } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    try {
      const res = await fetch('/api/v1/sales/orders', { headers: authHeaders() })
      if (res.ok) setOrders(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const stats = [
    { label: 'Total Invoices', value: orders.length, icon: <FiFileText />, color: '#8B5CF6' },
    { label: 'Paid / Completed', value: orders.filter(o => o.status === 'Completed').length, icon: <FiCheckCircle />, color: '#22C55E' },
    { label: 'Pending / Unpaid', value: orders.filter(o => o.status === 'Pending').length, icon: <FiClock />, color: '#F59E0B' },
    { label: 'Total Revenue', value: `₹${orders.filter(o => o.status === 'Completed').reduce((s, o) => s + parseFloat(o.total_amount || 0), 0).toLocaleString('en-IN')}`, icon: <FiDollarSign />, color: '#3B82F6' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Invoices</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>View, print, and send invoices for all orders</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-navy-400)', fontWeight: 600, marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-navy-700)' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders / Invoices Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <FiFileText style={{ fontSize: '48px', color: 'var(--color-warm-300)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--color-navy-300)' }}>No orders found to generate invoices.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-warm-50)' }}>
                  {['Order ID', 'Customer', 'Phone', 'Amount', 'Payment', 'Status', 'Date', 'Invoice Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-400)', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-500)', fontSize: '13px' }}>ORD-{order.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{order.customer_name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-500)', fontSize: '13px' }}>{order.customer_phone || '—'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>{order.payment_method}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        background: order.status === 'Completed' ? '#ECFDF5' : order.status === 'Pending' ? '#FFF9E6' : '#EFF6FF',
                        color: order.status === 'Completed' ? '#059669' : order.status === 'Pending' ? '#D97706' : '#2563EB' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-400)', fontSize: '13px' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => setInvoiceOrder(order)} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}>
                        <FiFileText /> Generate Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} authHeaders={authHeaders} />
      )}
    </div>
  )
}
