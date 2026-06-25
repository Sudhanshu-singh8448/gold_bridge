import nodemailer from 'nodemailer'

/**
 * Send an invoice email to a customer.
 * Requires SMTP env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 * Returns { success: boolean, message: string }
 */
export async function sendInvoiceEmail(orderData, customerEmail, businessSettings) {
  // Check if SMTP is configured
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { success: false, message: 'Email not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS to .env' }
  }

  if (!customerEmail) {
    return { success: false, message: 'Customer email address is required' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: (parseInt(SMTP_PORT) || 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })

    const shopName = businessSettings?.business_name || 'GoldBridge Jewellers'
    const gstin = businessSettings?.gstin || ''
    const shopAddress = businessSettings?.address || ''
    const shopPhone = businessSettings?.phone || ''

    const items = Array.isArray(orderData.items) ? orderData.items : []
    const subtotal = items.reduce((s, i) => s + (parseFloat(i.price) || 0), 0)
    const gstAmt = orderData.is_gst ? subtotal * ((parseFloat(orderData.cgst_rate) || 1.5) + (parseFloat(orderData.sgst_rate) || 1.5)) / 100 : 0
    const discount = parseFloat(orderData.discount) || 0
    const total = parseFloat(orderData.total_amount) || 0

    const itemRows = items.map((item, idx) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${idx + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name || 'Item'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.weight || '—'}g</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${parseFloat(item.price || 0).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')

    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#333;">
        <div style="background:linear-gradient(135deg,#D4A843,#B8860B);padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:24px;">${shopName}</h1>
          ${gstin ? `<p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">GSTIN: ${gstin}</p>` : ''}
          ${shopAddress ? `<p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:12px;">${shopAddress}</p>` : ''}
        </div>
        <div style="padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a2e;">Invoice</h2>
          <p style="margin:4px 0;font-size:14px;"><strong>Customer:</strong> ${orderData.customer_name || 'Walk-in'}</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Date:</strong> ${new Date(orderData.created_at).toLocaleDateString('en-IN')}</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Payment:</strong> ${orderData.payment_method || 'Cash'}</p>
          
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
            <thead>
              <tr style="background:#f8f8f8;">
                <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #D4A843;">#</th>
                <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #D4A843;">Item</th>
                <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #D4A843;">Weight</th>
                <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #D4A843;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="text-align:right;font-size:14px;margin-top:16px;">
            <p style="margin:4px 0;">Subtotal: <strong>₹${subtotal.toLocaleString('en-IN')}</strong></p>
            ${orderData.is_gst ? `<p style="margin:4px 0;">GST: <strong>₹${gstAmt.toLocaleString('en-IN')}</strong></p>` : ''}
            ${discount > 0 ? `<p style="margin:4px 0;">Discount: <strong>-₹${discount.toLocaleString('en-IN')}</strong></p>` : ''}
            <p style="margin:12px 0 0;font-size:20px;color:#D4A843;"><strong>Total: ₹${total.toLocaleString('en-IN')}</strong></p>
          </div>

          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          <p style="text-align:center;font-size:12px;color:#999;">Thank you for your purchase! ${shopPhone ? `Contact: ${shopPhone}` : ''}</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: customerEmail,
      subject: `Invoice from ${shopName} — ₹${total.toLocaleString('en-IN')}`,
      html
    })

    return { success: true, message: `Invoice sent to ${customerEmail}` }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, message: `Failed to send email: ${err.message}` }
  }
}
