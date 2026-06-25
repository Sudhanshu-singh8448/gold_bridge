import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { FaGem, FaIndustry, FaStore, FaHandshake, FaBalanceScale } from 'react-icons/fa'

const industries = [
  {
    icon: <FaGem />, title: 'Goldsmiths', color: '#DAA520',
    desc: 'Individual artisans and small workshops crafting custom jewelry pieces.',
    features: ['Custom order management', 'Wastage tracking per item', 'Artisan productivity reports', 'Making charge calculator'],
  },
  {
    icon: <FaIndustry />, title: 'Jewelry Manufacturers', color: '#CD7F32',
    desc: 'Large-scale manufacturing units producing jewelry in bulk.',
    features: ['Batch production tracking', 'Quality control workflows', 'Multi-stage manufacturing', 'Raw material requisitions'],
  },
  {
    icon: <FaStore />, title: 'Retail Jewelry Shops', color: '#22C55E',
    desc: 'Showrooms and retail stores selling jewelry directly to customers.',
    features: ['POS billing system', 'Customer loyalty programs', 'Live rate display screens', 'Return & exchange management'],
  },
  {
    icon: <FaHandshake />, title: 'Wholesale Jewelers', color: '#2563EB',
    desc: 'B2B dealers supplying jewelry to retailers and other businesses.',
    features: ['Bulk pricing & discounts', 'Dealer-wise credit tracking', 'Wholesale invoice templates', 'Consignment management'],
  },
  {
    icon: <FaBalanceScale />, title: 'Bullion Traders', color: '#8B5CF6',
    desc: 'Traders dealing in gold bars, coins, and raw bullion materials.',
    features: ['Live spot price integration', 'Margin & premium tracking', 'Bullion inventory by lot', 'Futures & hedging records'],
  },
]

export default function IndustriesPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <section style={{ padding: '80px 0 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-gold-50))' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>🏭 Industries</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '16px' }}>
            Built for the <span className="text-gold-gradient">Jewelry Industry</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-navy-300)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Tailored solutions for every segment of the gold and jewelry business ecosystem.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {industries.map((ind, idx) => (
              <div key={idx} className="card" style={{
                padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center',
              }}>
                <div style={{ order: idx % 2 === 0 ? 1 : 2 }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: `${ind.color}12`, color: ind.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', marginBottom: '20px',
                  }}>{ind.icon}</div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '10px' }}>{ind.title}</h2>
                  <p style={{ fontSize: '15px', color: 'var(--color-navy-300)', lineHeight: 1.7, marginBottom: '24px' }}>{ind.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {ind.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiCheckCircle style={{ color: ind.color, fontSize: '16px', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: 'var(--color-navy-500)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/pricing" className="btn btn-outline btn-sm">
                    View Plans <FiArrowRight />
                  </Link>
                </div>
                <div style={{
                  order: idx % 2 === 0 ? 2 : 1,
                  background: `linear-gradient(135deg, ${ind.color}08, ${ind.color}18)`,
                  borderRadius: 'var(--radius-xl)', padding: '60px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '260px', border: `1px solid ${ind.color}20`,
                }}>
                  <div style={{ fontSize: '80px', color: ind.color, opacity: 0.2 }}>{ind.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .card { grid-template-columns: 1fr !important; }
            .card > div { order: unset !important; }
          }
        `}</style>
      </section>
    </div>
  )
}
