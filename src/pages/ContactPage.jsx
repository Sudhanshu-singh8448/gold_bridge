import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi'

export default function ContactPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <section style={{ padding: '80px 0 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>📞 Contact</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Get in <span className="text-gold-gradient">Touch</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-navy-300)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Have questions? We'd love to hear from you. Our team typically responds within 2 hours.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'start' }}>
            {/* Contact Info */}
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--color-navy-700)' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                {[
                  { icon: <FiMapPin />, label: 'Address', value: 'Diamond Bourse, Surat, Gujarat 395002, India' },
                  { icon: <FiPhone />, label: 'Phone', value: '+91 98765 43210' },
                  { icon: <FiMail />, label: 'Email', value: 'hello@goldbridge.in' },
                  { icon: <FiClock />, label: 'Hours', value: 'Mon–Sat, 9:00 AM – 7:00 PM IST' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'var(--color-gold-50)', color: 'var(--color-gold-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-400)', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '15px', color: 'var(--color-navy-700)' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div style={{
                background: 'var(--color-warm-200)', borderRadius: 'var(--radius-lg)',
                height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-navy-300)', fontSize: '14px', fontWeight: 500,
              }}>
                🗺️ Map — Surat, Gujarat, India
              </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: '36px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: 'var(--color-navy-700)' }}>Send us a Message</h3>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Full Name</label>
                    <input className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Phone</label>
                    <input className="input" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Email</label>
                  <input className="input" placeholder="you@example.com" type="email" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Subject</label>
                  <select className="input">
                    <option>General Inquiry</option>
                    <option>Request Demo</option>
                    <option>Technical Support</option>
                    <option>Pricing Question</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-600)', marginBottom: '6px' }}>Message</label>
                  <textarea className="input" rows={5} placeholder="Tell us how we can help..." style={{ resize: 'vertical' }} />
                </div>
                <button className="btn btn-gold" style={{ padding: '14px' }} type="submit">
                  <FiSend /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .container > div { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </div>
  )
}
