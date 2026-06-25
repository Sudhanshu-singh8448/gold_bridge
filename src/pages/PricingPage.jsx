import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiArrowRight, FiX } from 'react-icons/fi'

const plans = [
  {
    name: 'Basic',
    desc: 'Perfect for small goldsmith shops',
    monthlyPrice: 1499,
    yearlyPrice: 14999,
    color: 'var(--color-navy-400)',
    features: [
      { text: 'Up to 500 inventory items', included: true },
      { text: 'Basic billing (non-GST)', included: true },
      { text: '1 user account', included: true },
      { text: 'Customer management', included: true },
      { text: 'Basic reports', included: true },
      { text: 'Email support', included: true },
      { text: 'GST invoicing', included: false },
      { text: 'Manufacturing module', included: false },
      { text: 'Live gold rates', included: false },
      { text: 'Multiple bill templates', included: false },
    ],
    popular: false,
  },
  {
    name: 'Professional',
    desc: 'Best for growing jewelry businesses',
    monthlyPrice: 3999,
    yearlyPrice: 39999,
    color: 'var(--color-gold-500)',
    features: [
      { text: 'Unlimited inventory items', included: true },
      { text: 'GST & non-GST billing', included: true },
      { text: '5 user accounts', included: true },
      { text: 'Customer CRM with loyalty', included: true },
      { text: 'Advanced reports & analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Live gold rate integration', included: true },
      { text: '4 bill download templates', included: true },
      { text: 'Manufacturing module', included: true },
      { text: 'API access', included: false },
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    desc: 'For large-scale jewelry operations',
    monthlyPrice: 9999,
    yearlyPrice: 99999,
    color: 'var(--color-bronze-400)',
    features: [
      { text: 'Unlimited everything', included: true },
      { text: 'Full GST compliance suite', included: true },
      { text: 'Unlimited user accounts', included: true },
      { text: 'Advanced CRM & automation', included: true },
      { text: 'Custom reports & dashboards', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Live gold rate + alerts', included: true },
      { text: 'Custom bill templates', included: true },
      { text: 'Full manufacturing + QC', included: true },
      { text: 'API + webhook access', included: true },
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section style={{ padding: '80px 0 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>💰 Pricing</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Simple, <span className="text-gold-gradient">Transparent</span> Pricing
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-navy-300)', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: 'white', borderRadius: 'var(--radius-full)', padding: '4px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-warm-200)' }}>
            <button onClick={() => setAnnual(false)} style={{
              padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px', transition: 'all 0.2s ease',
              background: !annual ? 'var(--color-navy-600)' : 'transparent',
              color: !annual ? 'white' : 'var(--color-navy-400)',
            }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{
              padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px', transition: 'all 0.2s ease',
              background: annual ? 'var(--color-gold-500)' : 'transparent',
              color: annual ? 'white' : 'var(--color-navy-400)',
            }}>
              Annual <span style={{ fontSize: '11px', opacity: 0.8 }}>Save 17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div key={i} className="card" style={{
                padding: '40px 32px', position: 'relative', overflow: 'hidden',
                border: plan.popular ? '2px solid var(--color-gold-400)' : '1px solid rgba(0,0,0,0.04)',
                transform: plan.popular ? 'scale(1.02)' : 'none',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '-32px',
                    background: 'var(--color-gold-500)', color: 'white',
                    padding: '4px 40px', fontSize: '11px', fontWeight: 700,
                    transform: 'rotate(45deg)', textTransform: 'uppercase',
                  }}>Popular</div>
                )}
                <div style={{ fontSize: '13px', fontWeight: 600, color: plan.color, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {plan.name}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-navy-300)', marginBottom: '20px' }}>{plan.desc}</p>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-700)' }}>
                    ₹{annual ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-navy-300)' }}>/{annual ? 'year' : 'month'}</span>
                </div>
                <Link to="/register" className="btn" style={{
                  width: '100%', padding: '14px', marginBottom: '28px',
                  background: plan.popular ? 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400))' : 'var(--color-navy-600)',
                  color: 'white',
                  boxShadow: plan.popular ? '0 4px 16px rgba(218,165,32,0.3)' : 'none',
                }}>
                  Start Free Trial <FiArrowRight />
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {f.included ? (
                        <FiCheck style={{ color: 'var(--color-success-500)', fontSize: '16px', flexShrink: 0 }} />
                      ) : (
                        <FiX style={{ color: 'var(--color-warm-400)', fontSize: '16px', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: '14px', color: f.included ? 'var(--color-navy-500)' : 'var(--color-warm-400)' }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
