import { useState } from 'react'
import { FiX, FiPrinter, FiDownload, FiMail, FiMessageCircle, FiCheck, FiAlertCircle } from 'react-icons/fi'

export default function InvoiceModal({ order, onClose, authHeaders }) {
  const [sending, setSending] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const items = Array.isArray(order.items) ? order.items : []
  const subtotal = items.reduce((s, i) => s + ((parseFloat(i.price) || 0) * (parseInt(i.qty) || 1)), 0)
  const gstRate = (parseFloat(order.cgst_rate) || 1.5) + (parseFloat(order.sgst_rate) || 1.5)
  const gstAmt = order.is_gst ? subtotal * gstRate / 100 : 0
  const discountAmt = parseFloat(order.discount) || 0
  const total = parseFloat(order.total_amount) || 0
  const loyaltyEarned = Math.floor(total / 100)

  function handlePrint() {
    const printArea = document.getElementById('invoice-print-area')
    if (!printArea) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html><head><title>Invoice</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 32px; }
        .invoice-header { background: linear-gradient(135deg, #D4A843, #B8860B); color: white; padding: 24px; border-radius: 12px 12px 0 0; }
        .invoice-header h1 { font-size: 22px; margin-bottom: 4px; }
        .invoice-header p { font-size: 12px; opacity: 0.85; }
        .invoice-body { padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
        th { background: #f8f6f0; padding: 10px 12px; text-align: left; border-bottom: 2px solid #D4A843; font-weight: 600; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; }
        .totals { text-align: right; margin-top: 16px; font-size: 14px; }
        .totals .grand { font-size: 20px; color: #D4A843; font-weight: 800; margin-top: 8px; }
        .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        @media print { body { padding: 16px; } }
      </style></head><body>
        ${printArea.innerHTML}
      </body></html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => { printWindow.print(); printWindow.close() }, 300)
  }

  async function handleSendEmail() {
    setSending('email')
    setFeedback(null)
    try {
      const res = await fetch(`/api/v1/sales/orders/${order.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({})
      })
      const data = await res.json()
      setFeedback({ type: data.success ? 'success' : 'error', message: data.message })
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error sending email' })
    }
    setSending(null)
  }

  async function handleSendWhatsApp() {
    setSending('whatsapp')
    setFeedback(null)
    try {
      const res = await fetch(`/api/v1/sales/orders/${order.id}/send-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({})
      })
      const data = await res.json()
      setFeedback({ type: data.success ? 'success' : 'error', message: data.message })
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error sending WhatsApp' })
    }
    setSending(null)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto', padding: 0, borderRadius: '16px' }}>
        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, background: 'white', zIndex: 1, borderRadius: '16px 16px 0 0' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handlePrint} className="btn btn-sm" style={{ background: 'var(--color-navy-700)', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              <FiPrinter size={14} /> Print
            </button>
            <button onClick={handlePrint} className="btn btn-sm" style={{ background: 'var(--color-info-500)', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              <FiDownload size={14} /> PDF
            </button>
            <button onClick={handleSendEmail} disabled={sending === 'email'} className="btn btn-sm" style={{ background: '#EA4335', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: sending === 'email' ? 0.6 : 1 }}>
              <FiMail size={14} /> {sending === 'email' ? 'Sending...' : 'Email'}
            </button>
            <button onClick={handleSendWhatsApp} disabled={sending === 'whatsapp'} className="btn btn-sm" style={{ background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: sending === 'whatsapp' ? 0.6 : 1 }}>
              <FiMessageCircle size={14} /> {sending === 'whatsapp' ? 'Sending...' : 'WhatsApp'}
            </button>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-navy-400)', display: 'flex' }}><FiX /></button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div style={{ margin: '12px 24px 0', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px',
            background: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            color: feedback.type === 'success' ? '#059669' : '#DC2626',
            border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}` }}>
            {feedback.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
            {feedback.message}
          </div>
        )}

        {/* Invoice Content */}
        <div id="invoice-print-area" style={{ padding: '24px' }}>
          {/* Header */}
          <div className="invoice-header" style={{ background: 'linear-gradient(135deg, #D4A843, #B8860B)', color: 'white', padding: '24px', borderRadius: '12px 12px 0 0' }}>
            <h1 style={{ fontSize: '22px', marginBottom: '2px', fontWeight: 800 }}>GoldBridge Jewellers</h1>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>Tax Invoice</p>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', border: '1px solid #e5e5e5', borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
              <div>
                <p><strong>Customer:</strong> {order.customer_name || 'Walk-in'}</p>
                {order.customer_phone && <p style={{ color: '#666', marginTop: '2px' }}>Phone: {order.customer_phone}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                <p style={{ color: '#666', marginTop: '2px' }}>Payment: {order.payment_method || 'Cash'}</p>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8f6f0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #D4A843', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #D4A843', fontWeight: 600 }}>Item</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #D4A843', fontWeight: 600 }}>Weight</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #D4A843', fontWeight: 600 }}>Qty</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '2px solid #D4A843', fontWeight: 600 }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', fontWeight: 500 }}>{item.name || 'Item'}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.weight ? `${item.weight}g` : '—'}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.qty || 1}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>₹{((parseFloat(item.price) || 0) * (parseInt(item.qty) || 1)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}>Subtotal: <strong>₹{subtotal.toLocaleString('en-IN')}</strong></p>
              {order.is_gst && <p style={{ margin: '4px 0' }}>CGST ({order.cgst_rate}%): <strong>₹{(subtotal * (parseFloat(order.cgst_rate) || 1.5) / 100).toFixed(2)}</strong></p>}
              {order.is_gst && <p style={{ margin: '4px 0' }}>SGST ({order.sgst_rate}%): <strong>₹{(subtotal * (parseFloat(order.sgst_rate) || 1.5) / 100).toFixed(2)}</strong></p>}
              {discountAmt > 0 && <p style={{ margin: '4px 0' }}>Discount: <strong>-₹{discountAmt.toLocaleString('en-IN')}</strong></p>}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #D4A843' }}>
                <p style={{ fontSize: '22px', color: '#D4A843', fontWeight: 800 }}>Total: ₹{total.toLocaleString('en-IN')}</p>
              </div>
              {loyaltyEarned > 0 && (
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#8B5CF6', fontWeight: 600 }}>
                  🏆 {loyaltyEarned} loyalty points earned
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee', fontSize: '12px', color: '#999' }}>
              Thank you for your purchase! 🙏
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
