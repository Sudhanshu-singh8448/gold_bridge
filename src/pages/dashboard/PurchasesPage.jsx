import { useState, useEffect } from 'react'
import { FiPlus, FiX, FiTruck, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function PurchasesPage() {
  const { authHeaders } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ supplierName: '', supplierPhone: '', items: [{ name: '', weight: '', purity: 22, category: 'Gold', cost: '', qty: 1 }], totalAmount: '', notes: '' })

  useEffect(() => { fetchPurchases() }, [])

  // Auto-calculate total whenever items change
  useEffect(() => {
    const total = form.items.reduce((sum, item) => {
      const cost = parseFloat(item.cost) || 0
      const qty = parseInt(item.qty) || 1
      return sum + (cost * qty)
    }, 0)
    setForm(prev => ({ ...prev, totalAmount: total > 0 ? total.toFixed(2) : '' }))
  }, [form.items])

  async function fetchPurchases() {
    try {
      const res = await fetch('/api/v1/purchases', { headers: authHeaders() })
      if (res.ok) setPurchases(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...form, totalAmount: parseFloat(form.totalAmount) || 0 })
      })
      if (res.ok) {
        setShowModal(false)
        setForm({ supplierName: '', supplierPhone: '', items: [{ name: '', weight: '', purity: 22, category: 'Gold', cost: '', qty: 1 }], totalAmount: '', notes: '' })
        fetchPurchases()
      }
    } catch (err) { console.error(err) }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/v1/purchases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchPurchases()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this purchase?')) return
    try {
      await fetch(`/api/v1/purchases/${id}`, { method: 'DELETE', headers: authHeaders() })
      fetchPurchases()
    } catch (err) { console.error(err) }
  }

  function updateItem(idx, field, value) {
    const items = [...form.items]
    items[idx] = { ...items[idx], [field]: value }
    setForm(prev => ({ ...prev, items }))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Purchases</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>Track raw material purchases from suppliers</p>
        </div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}><FiPlus /> New Purchase</button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>
        ) : purchases.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <FiTruck style={{ fontSize: '48px', color: 'var(--color-warm-300)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--color-navy-300)' }}>No purchases recorded yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-warm-50)' }}>
                  {['Supplier', 'Phone', 'Items', 'Total Amount', 'Status', 'Date', 'Notes', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-400)', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{p.supplier_name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-500)' }}>{p.supplier_phone || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{Array.isArray(p.items) ? p.items.length : 0} items</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{parseFloat(p.total_amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select className="input" value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                        style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', fontWeight: 600, borderRadius: 'var(--radius-full)', border: 'none',
                          background: p.status === 'Received' ? '#ECFDF5' : p.status === 'Pending' ? '#FFF9E6' : '#EFF6FF',
                          color: p.status === 'Received' ? 'var(--color-success-500)' : p.status === 'Pending' ? 'var(--color-warning-500)' : 'var(--color-info-500)' }}>
                        <option>Pending</option><option>In Transit</option><option>Received</option><option>Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-400)', fontSize: '13px' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-400)', fontSize: '13px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.notes || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-500)', display: 'flex' }}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>New Purchase</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-navy-400)', display: 'flex' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Supplier Name *</label>
                  <input className="input" value={form.supplierName} onChange={e => setForm({ ...form, supplierName: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Phone</label>
                  <input className="input" value={form.supplierPhone} onChange={e => setForm({ ...form, supplierPhone: e.target.value })} />
                </div>
              </div>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Items</label>
              {form.items.map((item, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                    <input className="input" placeholder="Item name" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                    <select className="input" value={item.category || 'Gold'} onChange={e => updateItem(idx, 'category', e.target.value)}>
                      <option>Gold</option><option>Silver</option><option>Diamond</option><option>Platinum</option><option>Other</option>
                    </select>
                    <input className="input" placeholder="Purity" type="number" value={item.purity} onChange={e => updateItem(idx, 'purity', e.target.value)} />
                    {form.items.length > 1 && <button type="button" onClick={() => setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-400)', display: 'flex', alignItems: 'center' }}><FiX /></button>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <input className="input" placeholder="Weight (g)" type="number" step="0.01" value={item.weight} onChange={e => updateItem(idx, 'weight', e.target.value)} />
                    <input className="input" placeholder="Qty" type="number" min="1" value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} />
                    <input className="input" placeholder="Cost ₹" type="number" value={item.cost} onChange={e => updateItem(idx, 'cost', e.target.value)} />
                  </div>
                  {(parseFloat(item.cost) > 0 && parseInt(item.qty) > 0) && (
                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-navy-400)', marginTop: '6px', fontWeight: 600 }}>
                      Line total: ₹{((parseFloat(item.cost) || 0) * (parseInt(item.qty) || 1)).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setForm(prev => ({ ...prev, items: [...prev.items, { name: '', weight: '', purity: 22, category: 'Gold', cost: '', qty: 1 }] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold-500)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>+ Add Item</button>

              <div style={{ padding: '16px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy-700)' }}>
                  <span>Total</span>
                  <span>₹{parseFloat(form.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-navy-300)', marginTop: '4px' }}>Auto-calculated from items</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Notes</label>
                <textarea className="input" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Add Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
