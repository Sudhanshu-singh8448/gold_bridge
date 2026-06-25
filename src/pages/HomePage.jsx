import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import {
  FiPackage, FiShield, FiShoppingCart, FiFileText, FiUsers,
  FiTrendingUp, FiCheckCircle, FiArrowRight, FiStar, FiZap,
  FiBarChart2, FiCpu, FiLayers
} from 'react-icons/fi'
import { FaGem, FaBalanceScale, FaIndustry, FaStore, FaHandshake } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
  { icon: <FiPackage />, title: 'Inventory Control', desc: 'Track every gram of gold with precision' },
  { icon: <FiShield />, title: 'Purity Tracking', desc: '18K, 22K, 24K automatic classification' },
  { icon: <FiShoppingCart />, title: 'Order Management', desc: 'End-to-end order lifecycle tracking' },
  { icon: <FiFileText />, title: 'GST Billing', desc: 'Automated GST invoices & compliance' },
  { icon: <FiUsers />, title: 'Customer CRM', desc: 'Complete customer relationship management' },
  { icon: <FiTrendingUp />, title: 'Live Gold Rates', desc: 'Real-time gold & silver price feeds' },
]

const features = [
  { icon: <FiPackage />, title: 'Gold Inventory Management', desc: 'Track gold by weight, purity, barcode — real-time stock alerts prevent shortages.', color: '#DAA520' },
  { icon: <FiCpu />, title: 'Manufacturing Management', desc: 'Job work tracking, artisan management, wastage calculation, melting records.', color: '#CD7F32' },
  { icon: <FiShoppingCart />, title: 'Sales & Billing', desc: 'GST invoices, live rate pricing, retail & wholesale billing, returns management.', color: '#22C55E' },
  { icon: <FiLayers />, title: 'Purchase Management', desc: 'Supplier records, purchase orders, raw material tracking — streamlined procurement.', color: '#2563EB' },
  { icon: <FiUsers />, title: 'Customer Management', desc: 'Customer profiles, purchase history, repair orders, loyalty programs.', color: '#8B5CF6' },
  { icon: <FiBarChart2 />, title: 'Accounting & Reports', desc: 'Ledger, P&L, balance sheet, tax reports — complete financial management.', color: '#F59E0B' },
]

const stats = [
  { value: '5,000+', label: 'Active Goldsmiths' },
  { value: '₹200Cr+', label: 'Transactions Processed' },
  { value: '98.5%', label: 'Uptime Guaranteed' },
  { value: '4.9/5', label: 'Customer Rating' },
]

const industries = [
  { icon: <FaGem />, label: 'Goldsmiths' },
  { icon: <FaIndustry />, label: 'Jewelry Manufacturers' },
  { icon: <FaStore />, label: 'Retail Jewelry Shops' },
  { icon: <FaHandshake />, label: 'Wholesale Jewelers' },
  { icon: <FaBalanceScale />, label: 'Bullion Traders' },
]

const testimonials = [
  { name: 'Rajesh Soni', role: 'Owner, Soni Jewellers', text: 'GoldBridge transformed our billing process. GST compliance is now effortless!', rating: 5 },
  { name: 'Priya Sharma', role: 'Manager, Gold Palace', text: 'The inventory tracking is incredible. We never lose track of a single gram now.', rating: 5 },
  { name: 'Vikram Patel', role: 'Director, Patel Gold Works', text: 'Manufacturing management with wastage calc saved us lakhs. Highly recommended!', rating: 5 },
]

export default function HomePage() {
  const heroRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.hero-badge', { y: 20, opacity: 1, duration: 0.6, delay: 0.2 })
      gsap.from('.hero-title', { y: 40, opacity: 1, duration: 0.8, delay: 0.4 })
      gsap.from('.hero-subtitle', { y: 30, opacity: 1, duration: 0.7, delay: 0.6 })
      gsap.from('.hero-cta', { y: 20, opacity: 1, duration: 0.6, delay: 0.8 })
      gsap.from('.hero-visual', { y: 50, opacity: 1, duration: 0.9, delay: 1 })

      // Benefits cards
      gsap.from('.benefit-card', {
        scrollTrigger: { trigger: '.benefits-section', start: 'top 80%' },
        y: 40, opacity: 1, duration: 0.6, stagger: 0.1,
      })

      // Features
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: '.features-section', start: 'top 80%' },
        y: 40, opacity: 1, duration: 0.6, stagger: 0.1,
      })

      // Stats counter
      gsap.from('.stat-item', {
        scrollTrigger: { trigger: '.stats-section', start: 'top 80%' },
        y: 30, opacity: 1, duration: 0.6, stagger: 0.15,
      })

      // Industries
      gsap.from('.industry-card', {
        scrollTrigger: { trigger: '.industries-section', start: 'top 80%' },
        scale: 0.8, opacity: 1, duration: 0.5, stagger: 0.1,
      })

      // Testimonials
      gsap.from('.testimonial-card', {
        scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' },
        y: 40, opacity: 1, duration: 0.6, stagger: 0.15,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef}>
      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-warm-50) 0%, var(--color-gold-50) 50%, var(--color-warm-100) 100%)',
        paddingTop: '100px',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(218,165,32,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(205,127,50,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* Text Column */}
            <div>
              <div className="hero-badge badge badge-gold" style={{ marginBottom: '20px', fontSize: '13px', padding: '6px 16px' }}>
                <FiZap style={{ fontSize: '14px' }} /> #1 ERP Software for Goldsmiths
              </div>
              <h1 className="hero-title" style={{
                fontSize: '52px', fontWeight: 800, lineHeight: 1.1,
                color: 'var(--color-navy-700)', marginBottom: '20px',
              }}>
                Complete{' '}
                <span className="text-gold-gradient">ERP Software</span>
                {' '}for Goldsmiths & Jewelry
              </h1>
              <p className="hero-subtitle" style={{
                fontSize: '18px', lineHeight: 1.7, color: 'var(--color-navy-300)',
                marginBottom: '36px', maxWidth: '480px',
              }}>
                Manage inventory, track gold purity, generate GST invoices, and grow your jewelry business — all in one powerful platform.
              </p>
              <div className="hero-cta" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-gold btn-lg">
                  Start Free Trial <FiArrowRight />
                </Link>
                <Link to="/contact" className="btn btn-outline btn-lg">
                  Request Demo
                </Link>
              </div>
              <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${40+i*30}, 70%, 50%), hsl(${50+i*30}, 60%, 40%))`,
                      border: '3px solid white', marginLeft: i > 1 ? '-10px' : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '12px', fontWeight: 700,
                    }}>
                      {['RS','PS','VK','AP'][i-1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--color-gold-400)', fontSize: '14px' }}>
                    {[1,2,3,4,5].map(i => <FiStar key={i} style={{ fill: 'var(--color-gold-400)' }} />)}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--color-navy-300)' }}>Trusted by 5,000+ Jewelers</span>
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="hero-visual" style={{ position: 'relative' }}>
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.08), 0 8px 32px rgba(218,165,32,0.06)',
                padding: '24px',
                border: '1px solid rgba(218,165,32,0.1)',
              }}>
                {/* Mock Dashboard Preview */}
                <div style={{ background: 'var(--color-warm-50)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { label: 'Total Gold Stock', value: '12.5 Kg', trend: '+2.3%', color: 'var(--color-gold-500)' },
                      { label: 'Today\'s Sales', value: '₹8.4L', trend: '+12%', color: 'var(--color-success-500)' },
                      { label: 'Active Orders', value: '42', trend: '+5', color: 'var(--color-info-500)' },
                      { label: '22K Rate', value: '₹6,250/g', trend: '+0.8%', color: 'var(--color-bronze-400)' },
                    ].map((stat, i) => (
                      <div key={i} style={{
                        background: 'white', borderRadius: 'var(--radius-md)', padding: '16px',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}>
                        <div style={{ fontSize: '11px', color: 'var(--color-navy-300)', marginBottom: '6px' }}>{stat.label}</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-700)' }}>{stat.value}</div>
                        <div style={{ fontSize: '11px', color: stat.color, fontWeight: 600, marginTop: '2px' }}>↑ {stat.trend}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mock chart area */}
                  <div style={{
                    background: 'white', borderRadius: 'var(--radius-md)', padding: '16px',
                    border: '1px solid rgba(0,0,0,0.04)', height: '160px',
                    display: 'flex', alignItems: 'end', gap: '8px', paddingBottom: '24px',
                  }}>
                    {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 88].map((h, i) => (
                      <div key={i} style={{
                        flex: 1, height: `${h}%`,
                        background: i === 11 ? 'linear-gradient(to top, var(--color-gold-500), var(--color-gold-300))' : 'var(--color-gold-100)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="animate-float" style={{
                position: 'absolute', top: '-16px', right: '-16px',
                background: 'white', borderRadius: 'var(--radius-lg)', padding: '12px 18px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px',
                border: '1px solid rgba(218,165,32,0.15)',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-success-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FiCheckCircle />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-navy-700)' }}>Invoice Generated</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-navy-300)' }}>₹2,45,000 • GST Included</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            section > div > div { grid-template-columns: 1fr !important; }
            .hero-visual { display: none !important; }
          }
        `}</style>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="benefits-section section-sm" style={{ background: 'white' }}>
        <div className="container-lg">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px' }}>
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card card-gold" style={{
                padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--color-gold-50)', color: 'var(--color-gold-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', margin: '0 auto 14px',
                }}>
                  {b.icon}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-navy-700)' }}>{b.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-navy-300)', lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <SectionHeading
            badge="✨ Powerful Features"
            title="Everything You Need to Run Your Jewelry Business"
            subtitle="From inventory tracking to GST billing — GoldBridge covers every aspect of your goldsmith business."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card card" style={{
                padding: '32px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: `linear-gradient(90deg, ${f.color}, transparent)`,
                }} />
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${f.color}12`, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '18px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '10px', color: 'var(--color-navy-700)' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-navy-300)', lineHeight: 1.7 }}>{f.desc}</p>
                <Link to="/features" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px',
                  fontSize: '14px', fontWeight: 600, color: f.color,
                }}>
                  Learn More <FiArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section" style={{
        background: 'linear-gradient(135deg, var(--color-navy-500), var(--color-navy-600))',
        padding: '80px 0',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div style={{ fontSize: '44px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)', marginBottom: '8px' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .stats-section > div > div { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      {/* ===== LIVE GOLD RATE TICKER ===== */}
      <section style={{
        background: 'linear-gradient(90deg, var(--color-gold-500), var(--color-gold-400), var(--color-bronze-400))',
        padding: '16px 0', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'scroll 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: 'flex', gap: '48px' }}>
              {[
                { label: '24K Gold', rate: '₹7,250/g', change: '+0.5%' },
                { label: '22K Gold', rate: '₹6,645/g', change: '+0.8%' },
                { label: '18K Gold', rate: '₹5,438/g', change: '+0.3%' },
                { label: 'Silver', rate: '₹92/g', change: '-0.2%' },
                { label: '24K Gold', rate: '₹7,250/g', change: '+0.5%' },
                { label: '22K Gold', rate: '₹6,645/g', change: '+0.8%' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8 }}>{r.label}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>{r.rate}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: r.change.startsWith('+') ? '#B8FFB8' : '#FFB8B8' }}>{r.change}</span>
                  <span style={{ opacity: 0.3 }}>•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        `}</style>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="industries-section section" style={{ background: 'white' }}>
        <div className="container">
          <SectionHeading
            badge="🏭 Industries Served"
            title="Built for the Jewelry Industry"
            subtitle="From individual goldsmiths to large-scale manufacturers — GoldBridge adapts to your business needs."
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {industries.map((ind, i) => (
              <div key={i} className="industry-card" style={{
                textAlign: 'center', cursor: 'pointer', padding: '32px 24px',
                borderRadius: 'var(--radius-xl)', border: '2px solid var(--color-warm-200)',
                transition: 'all 0.3s ease', width: '180px',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold-400)'; e.currentTarget.style.background = 'var(--color-gold-50)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-warm-200)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: '36px', color: 'var(--color-gold-500)', marginBottom: '14px' }}>{ind.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <SectionHeading
            badge="💬 Testimonials"
            title="Loved by Goldsmiths Across India"
            subtitle="Hear from jewelry business owners who transformed their operations with GoldBridge."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px', color: 'var(--color-gold-400)' }}>
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} style={{ fill: 'var(--color-gold-400)', fontSize: '16px' }} />)}
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--color-navy-500)', marginBottom: '20px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-bronze-400))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '14px',
                  }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-700)' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-navy-300)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-navy-500), var(--color-navy-600))',
        padding: '100px 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(218,165,32,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            Ready to <span className="text-gold-gradient">Transform</span> Your Business?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Join thousands of goldsmiths who trust GoldBridge to run their business efficiently.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gold btn-lg">Start Free Trial <FiArrowRight /></Link>
            <Link to="/contact" className="btn btn-white btn-lg">Schedule Demo</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
