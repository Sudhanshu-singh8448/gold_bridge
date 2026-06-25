import { useState, useEffect } from 'react'
import { FiPlus, FiX, FiTool, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const stages = ['Design', 'Casting', 'Polishing', 'Setting', 'QC', 'Complete']
const stageColors = { Design: '#8B5CF6', Casting: '#F59E0B', Polishing: '#3B82F6', Setting: '#EC4899', QC: '#10B981', Complete: '#22C55E' }

export default function ManufacturingPage() {
  const { authHeaders } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ artisanName: '', itemType: '', weight: '', purity: 22, stage: 'Design', wastage: '', dueDate: '', notes: '' })

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    try {
      const res = await fetch('/api/v1/manufacturing', { headers: authHeaders() })
      if (res.ok) setJobs(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...form, weight: parseFloat(form.weight) || 0, wastage: parseFloat(form.wastage) || 0 })
      })
      if (res.ok) { setShowModal(false); setForm({ artisanName: '', itemType: '', weight: '', purity: 22, stage: 'Design', wastage: '', dueDate: '', notes: '' }); fetchJobs() }
    } catch (err) { console.error(err) }
  }

  async function updateStage(id, stage) {
    try {
      await fetch(`/api/v1/manufacturing/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ stage })
      })
      fetchJobs()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this job?')) return
    try {
      await fetch(`/api/v1/manufacturing/${id}`, { method: 'DELETE', headers: authHeaders() })
      fetchJobs()
    } catch (err) { console.error(err) }
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Manufacturing</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>Track job work and production stages</p>
        </div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}><FiPlus /> New Job</button>
      </div>

      {/* Kanban Board */}
      {jobs.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <FiTool style={{ fontSize: '48px', color: 'var(--color-warm-300)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--color-navy-300)' }}>No manufacturing jobs yet. Create your first job!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, minmax(220px, 1fr))`, gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {stages.map(stage => {
            const stageJobs = jobs.filter(j => j.stage === stage)
            return (
              <div key={stage}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '0 4px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: stageColors[stage] }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy-600)' }}>{stage}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-navy-300)', background: 'var(--color-warm-100)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{stageJobs.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px', background: 'var(--color-warm-50)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
                  {stageJobs.map(job => (
                    <div key={job.id} className="card" style={{ padding: '16px', cursor: 'default' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-navy-700)' }}>{job.item_type}</div>
                        <button onClick={() => handleDelete(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy-300)', display: 'flex', fontSize: '14px' }}><FiTrash2 /></button>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-navy-500)', marginBottom: '6px' }}>Artisan: <strong>{job.artisan_name}</strong></div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-navy-400)', marginBottom: '10px' }}>
                        <span>{job.weight}g</span>
                        <span>{job.purity}K</span>
                        {job.wastage > 0 && <span style={{ color: 'var(--color-error-400)' }}>Waste: {job.wastage}g</span>}
                      </div>
                      {job.due_date && <div style={{ fontSize: '11px', color: 'var(--color-navy-300)' }}>Due: {new Date(job.due_date).toLocaleDateString('en-IN')}</div>}
                      {stage !== 'Complete' && (
                        <select className="input" value={stage} onChange={e => updateStage(job.id, e.target.value)}
                          style={{ marginTop: '10px', width: '100%', padding: '4px 8px', fontSize: '11px', height: 'auto' }}>
                          {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>New Manufacturing Job</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-navy-400)', display: 'flex' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Artisan Name *</label>
                  <input className="input" value={form.artisanName} onChange={e => setForm({ ...form, artisanName: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Item Type *</label>
                  <input className="input" value={form.itemType} onChange={e => setForm({ ...form, itemType: e.target.value })} placeholder="e.g. Ring, Necklace" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Weight (g)</label>
                  <input className="input" type="number" step="0.001" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Purity</label>
                  <select className="input" value={form.purity} onChange={e => setForm({ ...form, purity: parseInt(e.target.value) })}>
                    <option value={24}>24K</option><option value={22}>22K</option><option value={18}>18K</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Wastage (g)</label>
                  <input className="input" type="number" step="0.001" value={form.wastage} onChange={e => setForm({ ...form, wastage: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Due Date</label>
                <input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Notes</label>
                <textarea className="input" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Create Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
