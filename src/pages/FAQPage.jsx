import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const faqSections = [
  {
    category: 'General',
    items: [
      { q: 'What is GoldBridge?', a: 'GoldBridge is a comprehensive ERP (Enterprise Resource Planning) software designed exclusively for goldsmiths and jewelry businesses. It helps you manage inventory, billing, GST compliance, customer relationships, manufacturing, and more — all in one platform.' },
      { q: 'Who is GoldBridge designed for?', a: 'GoldBridge is built specifically for goldsmiths, jewelry manufacturers, retail jewelry shops, wholesale jewelers, and bullion traders. Whether you\'re a solo artisan or a large manufacturing unit, GoldBridge scales with your business.' },
      { q: 'Is there a free trial available?', a: 'Yes! We offer a 14-day free trial on all plans. No credit card required. You get full access to all features during the trial period.' },
    ]
  },
  {
    category: 'Billing & GST',
    items: [
      { q: 'Does GoldBridge support GST invoicing?', a: 'Yes, GoldBridge fully supports GST-compliant invoicing. It auto-calculates CGST, SGST, and IGST based on your location and customer details. You can also generate GSTR-1 and GSTR-3B summaries.' },
      { q: 'Can I download bills in different formats?', a: 'Absolutely! GoldBridge offers 4 premium bill templates — Classic, Modern, Minimal, and Premium. You can download invoices as PDF and share them via WhatsApp, email, or print.' },
      { q: 'Does it support both GST and non-GST billing?', a: 'Yes. You can switch between GST and non-GST billing modes based on your business type and transaction requirements.' },
    ]
  },
  {
    category: 'Inventory & Gold Tracking',
    items: [
      { q: 'How does gold purity tracking work?', a: 'GoldBridge automatically classifies gold inventory by purity — 18K (750), 22K (916), and 24K (999). You can track stock by weight, purity, category, and location in real-time.' },
      { q: 'Can I get live gold rates?', a: 'Yes! Our Professional and Enterprise plans include live gold rate integration. Rates are updated every 15 minutes and can be used directly in billing calculations.' },
      { q: 'Does it support barcode scanning?', a: 'Yes, GoldBridge supports both barcode and QR code generation and scanning for inventory management. You can print labels and scan items at the counter.' },
    ]
  },
  {
    category: 'Technical & Support',
    items: [
      { q: 'Is my data secure?', a: 'Absolutely. GoldBridge uses bank-grade encryption (AES-256) for data storage and SSL/TLS for data transmission. Your data is backed up daily and stored in secure Indian data centers.' },
      { q: 'Can I access GoldBridge on mobile?', a: 'Yes, GoldBridge is fully responsive and works on any device — desktop, tablet, or mobile phone. We also have a dedicated mobile app in development.' },
      { q: 'What kind of support do you offer?', a: 'Basic plans include email support. Professional plans get priority support with phone access. Enterprise plans get a dedicated account manager with 24/7 support.' },
    ]
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid var(--color-warm-200)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden', transition: 'all 0.2s ease',
      background: open ? 'white' : 'transparent',
      boxShadow: open ? 'var(--shadow-card)' : 'none',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer',
        textAlign: 'left', gap: '16px',
      }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{q}</span>
        <span style={{ color: 'var(--color-gold-500)', fontSize: '18px', flexShrink: 0 }}>
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: '14px', color: 'var(--color-navy-400)', lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <section style={{ padding: '80px 0 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>❓ FAQ</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-navy-300)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Everything you need to know about GoldBridge. Can't find the answer? Contact our support team.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {faqSections.map((section, i) => (
            <div key={i} style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy-700)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold-100)' }}>
                {section.category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.items.map((item, j) => (
                  <FAQItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
