import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiX, FiSearch, FiUsers, FiTrash2, FiEdit2, FiPhone, FiMail, FiAward } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function CustomersPage() {
  const navigate = useNavigate()
  const { authHeaders } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', panNumber: '' })

  useEffect(() => { fetchCustomers() }, [search])

  async function fetchCustomers() {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const res = await fetch(`/api/v1/customers${params}`, { headers: authHeaders() })
      if (res.ok) setCustomers(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const url = editItem ? `/api/v1/customers/${editItem.id}` : '/api/v1/customers'
    const method = editItem ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form)
      })
      if (res.ok) { setShowModal(false); setEditItem(null); setForm({ name: '', phone: '', email: '', address: '', panNumber: '' }); fetchCustomers() }
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this customer?')) return
    try {
      await fetch(`/api/v1/customers/${id}`, { method: 'DELETE', headers: authHeaders() })
      fetchCustomers()
    } catch (err) { console.error(err) }
  }

  function openEdit(c) {
    setEditItem(c)
    setForm({ name: c.name, phone: c.phone || '', email: c.email || '', address: c.address || '', panNumber: c.pan_number || '' })
    setShowModal(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Customers</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>{customers.length} customers registered</p>
        </div>
        <button className="btn btn-gold" onClick={() => { setEditItem(null); setForm({ name: '', phone: '', email: '', address: '', panNumber: '' }); setShowModal(true) }}>
          <FiPlus /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-400)' }} />
          <input className="input" placeholder="Search by name, phone, or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '38px', height: '40px', fontSize: '14px' }} />
        </div>
      </div>

      {/* Customer Cards */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>
      ) : customers.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <FiUsers style={{ fontSize: '48px', color: 'var(--color-warm-300)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--color-navy-300)' }}>No customers found. Add your first customer!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {customers.map(c => (
            <div key={c.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-bronze-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                    {c.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-navy-700)' }}>{c.name}</div>
                    {c.pan_number && <div style={{ fontSize: '12px', color: 'var(--color-navy-300)' }}>PAN: {c.pan_number}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-info-500)', display: 'flex' }}><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-500)', display: 'flex' }}><FiTrash2 size={16} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', cursor: 'pointer' }} onClick={() => navigate(`/dashboard/customers/${c.id}`)}>
                {c.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy-500)' }}><FiPhone size={14} /> {c.phone}</div>}
                {c.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy-500)' }}><FiMail size={14} /> {c.email}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-600)' }}><FiAward size={14} /> {c.loyalty_points || 0} loyalty points</div>
              </div>
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '13px', cursor: 'pointer' }} onClick={() => navigate(`/dashboard/customers/${c.id}`)}>
                <span style={{ color: 'var(--color-navy-400)' }}>Total Purchases</span>
                <span style={{ fontWeight: 700, color: 'var(--color-navy-700)' }}>₹{parseFloat(c.total_purchases || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{editItem ? 'Edit Customer' : 'Add Customer'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-navy-400)', display: 'flex' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Full Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Email</label>
                  <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Address</label>
                <textarea className="input" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>PAN Number</label>
                <input className="input" value={form.panNumber} onChange={e => setForm({ ...form, panNumber: e.target.value })} placeholder="ABCDE1234F" />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">{editItem ? 'Update' : 'Add Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
