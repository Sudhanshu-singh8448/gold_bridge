import { useState, useEffect } from 'react'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiPackage } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const categories = ['Rings', 'Necklaces', 'Earrings', 'Bangles', 'Chains', 'Coins', 'Pendants', 'Bracelets']
const purities = [24, 22, 18, 14]
const statuses = ['In Stock', 'Sold', 'Reserved', 'Under Repair']

export default function InventoryPage() {
  const { authHeaders } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [filters, setFilters] = useState({ category: '', purity: '', status: '', search: '' })
  const [form, setForm] = useState({ sku: '', name: '', category: 'Rings', weight: '', purity: 22, makingCharge: '', status: 'In Stock', barcode: '', description: '' })

  useEffect(() => { fetchItems() }, [filters])

  async function fetchItems() {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.purity) params.set('purity', filters.purity)
      if (filters.status) params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      const res = await fetch(`/api/v1/inventory?${params}`, { headers: authHeaders() })
      if (res.ok) setItems(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const url = editItem ? `/api/v1/inventory/${editItem.id}` : '/api/v1/inventory'
    const method = editItem ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...form, weight: parseFloat(form.weight) || 0, makingCharge: parseFloat(form.makingCharge) || 0 })
      })
      if (res.ok) { setShowModal(false); setEditItem(null); resetForm(); fetchItems() }
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return
    try {
      await fetch(`/api/v1/inventory/${id}`, { method: 'DELETE', headers: authHeaders() })
      fetchItems()
    } catch (err) { console.error(err) }
  }

  function openEdit(item) {
    setEditItem(item)
    setForm({ sku: item.sku || '', name: item.name, category: item.category, weight: item.weight, purity: item.purity, makingCharge: item.making_charge || '', status: item.status, barcode: item.barcode || '', description: item.description || '' })
    setShowModal(true)
  }

  function resetForm() {
    setForm({ sku: '', name: '', category: 'Rings', weight: '', purity: 22, makingCharge: '', status: 'In Stock', barcode: '', description: '' })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Inventory Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>{items.length} items in stock</p>
        </div>
        <button className="btn btn-gold" onClick={() => { resetForm(); setEditItem(null); setShowModal(true) }}>
          <FiPlus /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
          <input className="input" placeholder="Search items..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} style={{ paddingLeft: '38px', height: '40px', fontSize: '14px' }} />
        </div>
        <select className="input" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={{ width: 'auto', minWidth: '140px', height: '40px', fontSize: '14px' }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.purity} onChange={e => setFilters({ ...filters, purity: e.target.value })} style={{ width: 'auto', minWidth: '120px', height: '40px', fontSize: '14px' }}>
          <option value="">All Purity</option>
          {purities.map(p => <option key={p} value={p}>{p}K</option>)}
        </select>
        <select className="input" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={{ width: 'auto', minWidth: '130px', height: '40px', fontSize: '14px' }}>
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <FiPackage style={{ fontSize: '48px', color: 'var(--color-warm-300)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--color-navy-300)', fontSize: '15px' }}>No inventory items yet. Add your first item!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-warm-50)' }}>
                  {['SKU', 'Name', 'Category', 'Weight (g)', 'Purity', 'Making Charge', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-400)', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-warm-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--color-navy-600)' }}>{item.sku || '—'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{item.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-navy-500)' }}>{item.category}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.weight}g</td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-gold">{item.purity}K</span></td>
                    <td style={{ padding: '12px 16px' }}>₹{item.making_charge || 0}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${item.status === 'In Stock' ? 'success' : item.status === 'Sold' ? 'error' : 'gold'}`}>{item.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-info-500)', fontSize: '16px', display: 'flex' }}><FiEdit2 /></button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-500)', fontSize: '16px', display: 'flex' }}><FiTrash2 /></button>
                      </div>
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
          <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-navy-400)', display: 'flex' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>SKU</label>
                  <input className="input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. RNG-001" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Name *</label>
                  <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Gold Ring" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Category *</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Purity</label>
                  <select className="input" value={form.purity} onChange={e => setForm({ ...form, purity: parseInt(e.target.value) })}>
                    {purities.map(p => <option key={p} value={p}>{p}K</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Weight (g)</label>
                  <input className="input" type="number" step="0.001" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="12.5" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Making Charge (₹)</label>
                  <input className="input" type="number" value={form.makingCharge} onChange={e => setForm({ ...form, makingCharge: e.target.value })} placeholder="1500" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Barcode</label>
                  <input className="input" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} placeholder="Barcode #" />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Item description..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">{editItem ? 'Update' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
