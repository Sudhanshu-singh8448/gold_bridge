import { useState, useEffect } from 'react'
import { FiSave, FiUser, FiBriefcase, FiSliders, FiLock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function SettingsPage() {
  const { authHeaders, user } = useAuth()
  const [activeTab, setActiveTab] = useState('business')
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/v1/settings', { headers: authHeaders() })
      if (res.ok) setSettings(await res.json())
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function saveSettings(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          businessName: settings.business_name,
          address: settings.address,
          gstin: settings.gstin,
          phone: settings.phone,
          email: settings.email,
          currency: settings.currency,
          dateFormat: settings.date_format,
          defaultTemplate: settings.default_template,
        })
      })
      if (res.ok) setMessage('Settings saved successfully!')
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  async function changePassword(e) {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/v1/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Password updated successfully!')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage(data.error || 'Failed to update password')
      }
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: <FiBriefcase /> },
    { id: 'account', label: 'Account', icon: <FiUser /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSliders /> },
  ]

  if (loading || !settings) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-navy-300)' }}>Loading settings...</div>

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>Manage your business and account preferences</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{ padding: '12px 20px', marginBottom: '16px', borderRadius: 'var(--radius-md)', background: message.includes('success') ? '#ECFDF5' : '#FEF2F2', color: message.includes('success') ? 'var(--color-success-500)' : 'var(--color-error-500)', fontSize: '14px', fontWeight: 500 }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--color-warm-100)', padding: '4px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMessage('') }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-navy-700)' : 'var(--color-navy-400)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-card)' : 'none',
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Business Profile */}
      {activeTab === 'business' && (
        <div className="card" style={{ padding: '32px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '24px' }}>Business Information</h3>
          <form onSubmit={saveSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Business Name</label>
                <input className="input" value={settings.business_name || ''} onChange={e => setSettings({ ...settings, business_name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>GSTIN</label>
                <input className="input" value={settings.gstin || ''} onChange={e => setSettings({ ...settings, gstin: e.target.value })} placeholder="22AAAAA0000A1Z5" />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Address</label>
              <textarea className="input" rows={3} value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Phone</label>
                <input className="input" value={settings.phone || ''} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Email</label>
                <input className="input" type="email" value={settings.email || ''} onChange={e => setSettings({ ...settings, email: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-gold" type="submit" disabled={saving}>{saving ? 'Saving...' : <><FiSave /> Save Changes</>}</button>
          </form>
        </div>
      )}

      {/* Account */}
      {activeTab === 'account' && (
        <div className="card" style={{ padding: '32px', maxWidth: '480px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '8px' }}>Change Password</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-navy-300)', marginBottom: '24px' }}>Ensure your account stays secure</p>
          <form onSubmit={changePassword}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Current Password</label>
              <input className="input" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>New Password</label>
              <input className="input" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required minLength={8} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Confirm Password</label>
              <input className="input" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
            </div>
            <button className="btn btn-gold" type="submit" disabled={saving}>{saving ? 'Updating...' : <><FiLock /> Update Password</>}</button>
          </form>
        </div>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <div className="card" style={{ padding: '32px', maxWidth: '480px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '24px' }}>Display Preferences</h3>
          <form onSubmit={saveSettings}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Currency</label>
              <select className="input" value={settings.currency || 'INR'} onChange={e => setSettings({ ...settings, currency: e.target.value })}>
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Date Format</label>
              <select className="input" value={settings.date_format || 'DD/MM/YYYY'} onChange={e => setSettings({ ...settings, date_format: e.target.value })}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Default Invoice Template</label>
              <select className="input" value={settings.default_template || 'classic'} onChange={e => setSettings({ ...settings, default_template: e.target.value })}>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <button className="btn btn-gold" type="submit" disabled={saving}>{saving ? 'Saving...' : <><FiSave /> Save Preferences</>}</button>
          </form>
        </div>
      )}
    </div>
  )
}
