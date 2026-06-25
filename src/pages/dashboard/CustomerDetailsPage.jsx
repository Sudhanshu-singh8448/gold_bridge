import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPhone, FiMail, FiMapPin, FiAward, FiShoppingCart, FiDollarSign, FiCalendar, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function CustomerDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { authHeaders } = useAuth()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => { fetchCustomer() }, [id])

  async function fetchCustomer() {
    try {
      const res = await fetch(`/api/v1/customers/${id}`, { headers: authHeaders() })
      if (res.ok) {
        setCustomer(await res.json())
      } else {
        navigate('/dashboard/customers')
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>
  if (!customer) return null

  const stats = customer.statistics || {}
  const orders = customer.purchaseHistory || []

  const statCards = [
    { label: 'Total Purchases', value: `₹${parseFloat(stats.totalPurchases || 0).toLocaleString('en-IN')}`, icon: <FiDollarSign />, color: '#22C55E' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: <FiShoppingCart />, color: '#3B82F6' },
    { label: 'Loyalty Points', value: stats.loyaltyPoints || 0, icon: <FiAward />, color: '#D4A843' },
    { label: 'Avg. Order Value', value: `₹${parseFloat(stats.averageOrderValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: <FiDollarSign />, color: '#8B5CF6' },
  ]

  return (
    <div>
      {/* Back button + header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/dashboard/customers')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy-400)', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
          <FiArrowLeft />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '2px' }}>{customer.name}</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-navy-300)' }}>Customer since {new Date(customer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-bronze-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '24px', flexShrink: 0 }}>
            {customer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', flex: 1 }}>
            {customer.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy-600)' }}>
                <FiPhone size={16} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} /> {customer.phone}
              </div>
            )}
            {customer.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy-600)' }}>
                <FiMail size={16} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} /> {customer.email}
              </div>
            )}
            {customer.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy-500)' }}>
                <FiMapPin size={16} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} /> {customer.address}
              </div>
            )}
            {customer.pan_number && (
              <div style={{ fontSize: '12px', color: 'var(--color-navy-300)' }}>PAN: {customer.pan_number}</div>
            )}
          </div>
          {/* Last Purchase */}
          {stats.lastPurchaseDate && (
            <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--color-navy-400)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                <FiCalendar size={14} /> Last purchase
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-navy-600)', marginTop: '2px' }}>
                {new Date(stats.lastPurchaseDate).toLocaleDateString('en-IN')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-navy-400)', fontWeight: 600, marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-navy-700)' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase History */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy-700)' }}>Purchase History</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-navy-300)', marginTop: '2px' }}>{orders.length} orders found</p>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <FiShoppingCart style={{ fontSize: '40px', color: 'var(--color-warm-300)', marginBottom: '12px' }} />
            <p style={{ color: 'var(--color-navy-300)' }}>No purchase history yet</p>
          </div>
        ) : (
          <div>
            {orders.map(order => {
              const orderItems = Array.isArray(order.items) ? order.items : []
              const isExpanded = expandedOrder === order.id
              return (
                <div key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    style={{ padding: '16px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.15s', ':hover': { background: 'var(--color-warm-50)' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%',
                        background: order.status === 'Completed' ? '#22C55E' : order.status === 'Pending' ? '#F59E0B' : '#3B82F6' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy-700)' }}>
                          ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                          <span style={{ fontWeight: 400, color: 'var(--color-navy-400)', fontSize: '12px', marginLeft: '8px' }}>
                            {orderItems.length} items • {order.payment_method}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-navy-300)', marginTop: '2px' }}>
                          {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                        background: order.status === 'Completed' ? '#ECFDF5' : order.status === 'Pending' ? '#FFF9E6' : '#EFF6FF',
                        color: order.status === 'Completed' ? '#059669' : order.status === 'Pending' ? '#D97706' : '#2563EB' }}>
                        {order.status}
                      </span>
                      {isExpanded ? <FiChevronUp size={16} color="var(--color-navy-400)" /> : <FiChevronDown size={16} color="var(--color-navy-400)" />}
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div style={{ padding: '0 24px 16px 48px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                            <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600, color: 'var(--color-navy-400)' }}>Item</th>
                            <th style={{ padding: '8px 0', textAlign: 'center', fontWeight: 600, color: 'var(--color-navy-400)' }}>Weight</th>
                            <th style={{ padding: '8px 0', textAlign: 'center', fontWeight: 600, color: 'var(--color-navy-400)' }}>Qty</th>
                            <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--color-navy-400)' }}>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                              <td style={{ padding: '8px 0', color: 'var(--color-navy-700)' }}>{item.name || 'Item'}</td>
                              <td style={{ padding: '8px 0', textAlign: 'center', color: 'var(--color-navy-500)' }}>{item.weight ? `${item.weight}g` : '—'}</td>
                              <td style={{ padding: '8px 0', textAlign: 'center', color: 'var(--color-navy-500)' }}>{item.qty || 1}</td>
                              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--color-navy-700)' }}>₹{parseFloat(item.price || 0).toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {order.is_gst && (
                        <div style={{ fontSize: '12px', color: 'var(--color-navy-300)', marginTop: '8px', textAlign: 'right' }}>
                          GST Applied (CGST {order.cgst_rate}% + SGST {order.sgst_rate}%)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
