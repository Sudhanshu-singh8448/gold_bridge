/**
 * Send an invoice via WhatsApp Cloud API (Meta Business).
 * Requires env vars: WHATSAPP_TOKEN, WHATSAPP_PHONE_ID
 * Returns { success: boolean, message: string }
 */
export async function sendInvoiceWhatsApp(orderData, customerPhone, businessSettings) {
  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_ID } = process.env
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return { success: false, message: 'WhatsApp not configured. Add WHATSAPP_TOKEN and WHATSAPP_PHONE_ID to .env' }
  }

  if (!customerPhone) {
    return { success: false, message: 'Customer phone number is required' }
  }

  try {
    // Clean phone number — remove spaces, dashes, ensure country code
    let phone = customerPhone.replace(/[\s\-\(\)]/g, '')
    if (phone.startsWith('0')) phone = '91' + phone.slice(1)
    if (!phone.startsWith('+') && !phone.startsWith('91')) phone = '91' + phone

    const shopName = businessSettings?.business_name || 'GoldBridge Jewellers'
    const items = Array.isArray(orderData.items) ? orderData.items : []
    const total = parseFloat(orderData.total_amount) || 0

    // Build readable invoice text
    const itemLines = items.map((item, idx) =>
      `${idx + 1}. ${item.name || 'Item'} — ${item.weight ? item.weight + 'g' : ''} — ₹${parseFloat(item.price || 0).toLocaleString('en-IN')}`
    ).join('\n')

    const message = [
      `🧾 *Invoice from ${shopName}*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `*Customer:* ${orderData.customer_name || 'Walk-in'}`,
      `*Date:* ${new Date(orderData.created_at).toLocaleDateString('en-IN')}`,
      `*Payment:* ${orderData.payment_method || 'Cash'}`,
      ``,
      `📦 *Items:*`,
      itemLines,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      orderData.is_gst ? `GST: ₹${(parseFloat(orderData.total_amount) * 0.03).toFixed(2)}` : '',
      parseFloat(orderData.discount) > 0 ? `Discount: -₹${parseFloat(orderData.discount).toLocaleString('en-IN')}` : '',
      `*💰 Total: ₹${total.toLocaleString('en-IN')}*`,
      ``,
      `Thank you for your purchase! 🙏`
    ].filter(Boolean).join('\n')

    const res = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message }
      })
    })

    const data = await res.json()
    if (res.ok && data.messages?.[0]?.id) {
      return { success: true, message: `Invoice sent to WhatsApp: ${customerPhone}` }
    } else {
      console.error('WhatsApp API error:', data)
      return { success: false, message: `WhatsApp API error: ${data.error?.message || 'Unknown error'}` }
    }
  } catch (err) {
    console.error('WhatsApp send error:', err)
    return { success: false, message: `Failed to send WhatsApp: ${err.message}` }
  }
}
