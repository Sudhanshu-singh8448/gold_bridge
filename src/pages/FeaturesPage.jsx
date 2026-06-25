import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FiPackage, FiShoppingCart, FiUsers, FiBarChart2, FiTool, FiTruck,
  FiCheckCircle, FiArrowRight
} from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const featureSections = [
  {
    id: 'inventory',
    icon: <FiPackage />,
    title: 'Gold Inventory Management',
    desc: 'Track every gram of gold across your business with precision and real-time updates.',
    color: '#DAA520',
    items: ['Track gold by weight (grams, tola, ounce)', 'Purity tracking — 18K, 22K, 24K classification', 'Automatic stock alerts & reorder points', 'Barcode & QR code support', 'Category-wise stock reports', 'Multi-location inventory sync'],
  },
  {
    id: 'manufacturing',
    icon: <FiTool />,
    title: 'Manufacturing Management',
    desc: 'Streamline your production process from raw material to finished jewelry.',
    color: '#CD7F32',
    items: ['Job work tracking & assignment', 'Artisan/goldsmith management', 'Production stage monitoring', 'Wastage & loss calculation', 'Melting & refining records', 'Quality control checkpoints'],
  },
  {
    id: 'sales',
    icon: <FiShoppingCart />,
    title: 'Sales & Billing',
    desc: 'Generate professional invoices with automatic GST calculation and live gold rate pricing.',
    color: '#22C55E',
    items: ['GST & non-GST invoice generation', 'Retail and wholesale billing modes', 'Price calculation based on live gold rates', 'Returns & exchange management', 'Multiple payment methods support', '4 downloadable bill templates (Classic, Modern, Minimal, Premium)'],
  },
  {
    id: 'purchase',
    icon: <FiTruck />,
    title: 'Purchase Management',
    desc: 'Manage your supplier relationships and raw material procurement efficiently.',
    color: '#2563EB',
    items: ['Supplier records & contact management', 'Purchase order creation & tracking', 'Raw material intake tracking', 'Purchase return handling', 'Supplier payment tracking', 'Purchase vs sales analysis'],
  },
  {
    id: 'customers',
    icon: <FiUsers />,
    title: 'Customer Management',
    desc: 'Build lasting relationships with your customers through comprehensive CRM.',
    color: '#8B5CF6',
    items: ['Detailed customer profiles', 'Complete purchase history', 'Repair order management', 'Loyalty program & rewards', 'Birthday & anniversary reminders', 'Customer-wise credit tracking'],
  },
  {
    id: 'accounting',
    icon: <FiBarChart2 />,
    title: 'Accounting & Reports',
    desc: 'Complete financial management with automated reports and tax compliance.',
    color: '#F59E0B',
    items: ['Ledger management', 'Profit & loss reports', 'Balance sheet generation', 'GST tax reports & filing support', 'Daily sales & collection reports', 'Gold movement & valuation reports'],
  },
]

export default function FeaturesPage() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-section-card', {
        scrollTrigger: { trigger: '.features-grid', start: 'top 80%' },
        y: 50, opacity: 1, duration: 0.7, stagger: 0.15,
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px', textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))',
      }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>✨ Features</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Powerful Features for <span className="text-gold-gradient">Every Need</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-navy-300)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Everything you need to manage your goldsmith business — from inventory tracking to GST-compliant billing.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="section features-grid" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {featureSections.map((feature, idx) => (
              <div key={feature.id} className="feature-section-card card" style={{
                padding: '48px', display: 'grid',
                gridTemplateColumns: idx % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                gap: '48px', alignItems: 'center',
              }}>
                <div style={{ order: idx % 2 === 0 ? 1 : 2 }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: `${feature.color}15`, color: feature.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', marginBottom: '20px',
                  }}>
                    {feature.icon}
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '12px' }}>
                    {feature.title}
                  </h2>
                  <p style={{ fontSize: '15px', color: 'var(--color-navy-300)', lineHeight: 1.7, marginBottom: '24px' }}>
                    {feature.desc}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {feature.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiCheckCircle style={{ color: feature.color, marginTop: '2px', flexShrink: 0, fontSize: '16px' }} />
                        <span style={{ fontSize: '14px', color: 'var(--color-navy-500)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  order: idx % 2 === 0 ? 2 : 1,
                  background: `linear-gradient(135deg, ${feature.color}08, ${feature.color}15)`,
                  borderRadius: 'var(--radius-xl)', padding: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '300px', border: `1px solid ${feature.color}20`,
                }}>
                  <div style={{ textAlign: 'center', color: feature.color }}>
                    <div style={{ fontSize: '64px', marginBottom: '12px', opacity: 0.5 }}>{feature.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>Feature Preview</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .feature-section-card { grid-template-columns: 1fr !important; }
            .feature-section-card > div { order: unset !important; }
          }
        `}</style>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-bronze-400))', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Start Using All Features Today</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>14-day free trial • No credit card required</p>
          <Link to="/register" className="btn btn-dark btn-lg">Get Started Free <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  )
}
