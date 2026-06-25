import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'

const footerLinks = {
  Product: [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Gold Rates', path: '/gold-rates' },
    { label: 'Reports', path: '/reports' },
    { label: 'FAQ', path: '/faq' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Industries', path: '/industries' },
    { label: 'Careers', path: '#' },
    { label: 'Blog', path: '#' },
  ],
  Support: [
    { label: 'Help Center', path: '#' },
    { label: 'Documentation', path: '#' },
    { label: 'API Reference', path: '#' },
    { label: 'Status', path: '#' },
    { label: 'Privacy Policy', path: '#' },
  ],
}

const socialLinks = [
  { icon: <FaFacebookF />, url: '#' },
  { icon: <FaTwitter />, url: '#' },
  { icon: <FaInstagram />, url: '#' },
  { icon: <FaLinkedinIn />, url: '#' },
  { icon: <FaYoutube />, url: '#' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-navy-600)', color: 'rgba(255,255,255,0.8)' }}>
      {/* Newsletter Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400), var(--color-bronze-400))',
        padding: '48px 40px', textAlign: 'center',
      }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
          Ready to Transform Your Jewelry Business?
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '24px' }}>
          Join 5,000+ goldsmiths already using GoldBridge ERP
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
          <input
            placeholder="Enter your email"
            style={{
              flex: 1, minWidth: '240px', padding: '14px 20px', borderRadius: 'var(--radius-full)',
              border: 'none', fontSize: '15px', outline: 'none',
            }}
          />
          <button className="btn btn-dark btn-lg">Get Free Demo</button>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container-lg" style={{ padding: '64px 40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '48px' }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-bronze-400))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px',
              }}>
                G
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px', color: 'white' }}>
                Gold<span style={{ color: 'var(--color-gold-400)' }}>Bridge</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>
              Complete ERP solution designed exclusively for goldsmiths and jewelry businesses.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socialLinks.map((s, i) => (
                <a key={i} href={s.url} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)',
                  fontSize: '14px', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gold-500)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>
                {title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {links.map(link => (
                  <Link key={link.label} to={link.path} style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold-400)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <FiMapPin style={{ marginTop: '3px', color: 'var(--color-gold-400)', flexShrink: 0 }} />
                <span>Surat, Gujarat, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiPhone style={{ color: 'var(--color-gold-400)', flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiMail style={{ color: 'var(--color-gold-400)', flexShrink: 0 }} />
                <span>hello@goldbridge.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          fontSize: '13px', color: 'rgba(255,255,255,0.4)',
        }}>
          <span>© 2025 GoldBridge. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
