import { useState, useEffect } from 'react'
import { FiPlus, FiX, FiShoppingCart, FiDollarSign, FiClock, FiCheckCircle, FiTrash2, FiPrinter, FiMail, FiMessageCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import InvoiceModal from '../../components/InvoiceModal'

export default function SalesPage() {
  const { authHeaders } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [inventoryItems, setInventoryItems] = useState([])
  const [invoiceOrder, setInvoiceOrder] = useState(null)
  const [stockError, setStockError] = useState('')
  const [form, setForm] = useState({
    customerName: '', customerPhone: '',
    items: [{ inventory_id: '', name: '', weight: '', category: '', price: '', qty: 1 }],
    isGst: true, cgstRate: 1.5, sgstRate: 1.5, discount: 0, paymentMethod: 'Cash'
  })

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    try {
      const res = await fetch('/api/v1/sales/orders', { headers: authHeaders() })
      if (res.ok) setOrders(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function fetchInventory() {
    try {
      const res = await fetch('/api/v1/inventory?status=In+Stock', { headers: authHeaders() })
      if (res.ok) setInventoryItems(await res.json())
    } catch (err) { console.error(err) }
  }

  function openModal() {
    fetchInventory()
    setStockError('')
    setForm({
      customerName: '', customerPhone: '',
      items: [{ inventory_id: '', name: '', weight: '', category: '', price: '', qty: 1 }],
      isGst: true, cgstRate: 1.5, sgstRate: 1.5, discount: 0, paymentMethod: 'Cash'
    })
    setShowModal(true)
  }

  function selectInventoryItem(idx, inventoryId) {
    const items = [...form.items]
    if (!inventoryId) {
      items[idx] = { inventory_id: '', name: '', weight: '', category: '', price: '', qty: 1 }
    } else {
      const inv = inventoryItems.find(i => i.id === inventoryId)
      if (inv) {
        items[idx] = {
          inventory_id: inv.id,
          name: inv.name,
          weight: inv.weight,
          category: inv.category,
          price: inv.making_charge || '',
          qty: 1,
          maxQty: inv.quantity
        }
      }
    }
    setForm({ ...form, items })
    setStockError('')
  }

  function calcTotal() {
    const subtotal = form.items.reduce((s, i) => s + ((parseFloat(i.price) || 0) * (parseInt(i.qty) || 1)), 0)
    const gst = form.isGst ? subtotal * (form.cgstRate + form.sgstRate) / 100 : 0
    return subtotal + gst - (parseFloat(form.discount * 0.01 * subtotal) || 0)
  }

  function validateStock() {
    for (const item of form.items) {
      if (item.inventory_id && item.maxQty !== undefined) {
        const qty = parseInt(item.qty) || 1
        if (qty > item.maxQty) {
          setStockError(`Insufficient stock for "${item.name}". Available: ${item.maxQty}, Requested: ${qty}`)
          return false
        }
      }
    }
    setStockError('')
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStock()) return
    try {
      const submitItems = form.items.map(({ maxQty, ...rest }) => rest)
      const res = await fetch('/api/v1/sales/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...form, items: submitItems, totalAmount: calcTotal() })
      })
      if (res.ok) {
        setShowModal(false)
        fetchOrders()
      } else {
        const data = await res.json()
        setStockError(data.error || 'Failed to create order')
      }
    } catch (err) { console.error(err) }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/v1/sales/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status })
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to update status')
      }
      fetchOrders()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this order?')) return
    try {
      await fetch(`/api/v1/sales/orders/${id}`, { method: 'DELETE', headers: authHeaders() })
      fetchOrders()
    } catch (err) { console.error(err) }
  }

  const stats = [
    { label: "Today's Sales", value: `₹${orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).reduce((s, o) => s + parseFloat(o.total_amount || 0), 0).toLocaleString('en-IN')}`, icon: <FiDollarSign />, color: '#22C55E' },
    { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: <FiClock />, color: '#F59E0B' },
    { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, icon: <FiCheckCircle />, color: '#3B82F6' },
    { label: 'Total Orders', value: orders.length, icon: <FiShoppingCart />, color: '#8B5CF6' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Sales & Billing</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>Manage your sales orders and invoices</p>
        </div>
        <button className="btn btn-gold" onClick={openModal}><FiPlus /> New Order</button>
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

      {/* Orders Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <FiShoppingCart style={{ fontSize: '48px', color: 'var(--color-warm-300)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--color-navy-300)' }}>No orders yet. Create your first sales order!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-warm-50)' }}>
                  {['Customer', 'Phone', 'Items', 'Amount', 'GST', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-400)', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{order.customer_name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-500)', fontSize: '13px' }}>{order.customer_phone || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{Array.isArray(order.items) ? order.items.length : 0} items</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>{order.is_gst ? '✓' : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{order.payment_method}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select className="input" value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', fontWeight: 600, borderRadius: 'var(--radius-full)',
                          background: order.status === 'Completed' ? '#ECFDF5' : order.status === 'Pending' ? '#FFF9E6' : '#EFF6FF',
                          color: order.status === 'Completed' ? 'var(--color-success-500)' : order.status === 'Pending' ? 'var(--color-warning-500)' : 'var(--color-info-500)',
                          border: 'none' }}>
                        <option>Pending</option><option>Processing</option><option>Completed</option><option>Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-400)', fontSize: '13px' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {order.status === 'Completed' && (
                          <button onClick={() => setInvoiceOrder(order)} title="Invoice" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold-600)', display: 'flex' }}><FiPrinter size={16} /></button>
                        )}
                        <button onClick={() => handleDelete(order.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-500)', display: 'flex' }}><FiTrash2 size={16} /></button>
                      </div>
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

      {/* Create Order Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '620px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>New Sales Order</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-navy-400)', display: 'flex' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Customer Name</label>
                  <input className="input" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Walk-in customer" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Phone Number</label>
                  <input className="input" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="Auto-links customer" />
                </div>
              </div>

              {/* Items */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Items</label>
              {form.items.map((item, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '8px' }}>
                    <select className="input" value={item.inventory_id} onChange={e => selectInventoryItem(idx, e.target.value)}>
                      <option value="">— Select from inventory —</option>
                      {inventoryItems.filter(inv => inv.quantity > 0).map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({inv.category}, {inv.weight}g, {inv.purity}K) — Qty: {inv.quantity}
                        </option>
                      ))}
                    </select>
                    {form.items.length > 1 && <button type="button" onClick={() => { const items = form.items.filter((_, i) => i !== idx); setForm({ ...form, items }) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-400)', display: 'flex', alignItems: 'center' }}><FiX /></button>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px' }}>
                    <input className="input" placeholder="Item name" value={item.name} onChange={e => { const items = [...form.items]; items[idx].name = e.target.value; setForm({ ...form, items }) }} />
                    <input className="input" placeholder="Weight" type="number" step="0.01" value={item.weight} onChange={e => { const items = [...form.items]; items[idx].weight = e.target.value; setForm({ ...form, items }) }} />
                    <input className="input" placeholder="Qty" type="number" min="1" value={item.qty} onChange={e => { const items = [...form.items]; items[idx].qty = e.target.value; setForm({ ...form, items }); setStockError('') }} />
                    <input className="input" placeholder="Price ₹" type="number" value={item.price} onChange={e => { const items = [...form.items]; items[idx].price = e.target.value; setForm({ ...form, items }) }} />
                  </div>
                  {item.inventory_id && item.maxQty !== undefined && (
                    <div style={{ fontSize: '11px', color: parseInt(item.qty) > item.maxQty ? 'var(--color-error-500)' : 'var(--color-navy-300)', marginTop: '4px' }}>
                      Available stock: {item.maxQty}
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { inventory_id: '', name: '', weight: '', category: '', price: '', qty: 1 }] })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold-500)', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>+ Add Item</button>

              {/* Stock Error */}
              {stockError && (
                <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error-500)', fontSize: '13px', marginBottom: '12px', fontWeight: 500 }}>
                  ⚠️ {stockError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Payment Method</label>
                  <select className="input" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option><option>Credit</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Discount (%)</label>
                  <input className="input" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                  <input type="checkbox" checked={form.isGst} onChange={e => setForm({ ...form, isGst: e.target.checked })} /> Apply GST (CGST {form.cgstRate}% + SGST {form.sgstRate}%)
                </label>
              </div>

              <div style={{ padding: '16px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy-700)' }}>
                  <span>Total</span><span>₹{calcTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
