import { Link } from 'react-router-dom'
import { FiArrowRight, FiTarget, FiHeart, FiEye, FiAward } from 'react-icons/fi'
import { FaGem } from 'react-icons/fa'

const values = [
  { icon: <FiTarget />, title: 'Mission-Driven', desc: 'Empowering goldsmiths with technology that simplifies their craft and grows their business.' },
  { icon: <FiHeart />, title: 'Customer First', desc: 'Every feature is built based on real feedback from jewelry business owners across India.' },
  { icon: <FiEye />, title: 'Transparency', desc: 'Clear pricing, honest communication, and no hidden fees — ever.' },
  { icon: <FiAward />, title: 'Excellence', desc: 'We strive for perfection in every line of code and every customer interaction.' },
]

const timeline = [
  { year: '2020', title: 'Founded', desc: 'GoldBridge was born from a simple idea — make goldsmith accounting effortless.' },
  { year: '2021', title: 'First 500 Users', desc: 'Launched billing and inventory modules. Onboarded 500 goldsmiths in Gujarat.' },
  { year: '2022', title: 'Manufacturing Module', desc: 'Added job work tracking, artisan management, and wastage calculation.' },
  { year: '2023', title: 'Pan-India Expansion', desc: 'Crossed 3,000 active users. Launched GST compliance suite and live gold rates.' },
  { year: '2024', title: '5,000+ Users', desc: 'Became India\'s most trusted ERP for goldsmiths with enterprise-grade features.' },
]

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section style={{
        padding: '80px 0', textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-navy-500), var(--color-navy-600))',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(218,165,32,0.1) 0%, transparent 70%)', borderRadius: '50%',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '48px', color: 'var(--color-gold-400)', marginBottom: '16px' }}><FaGem /></div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            About <span className="text-gold-gradient">GoldBridge</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            We're on a mission to digitize India's gold industry — one goldsmith at a time.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '20px', textAlign: 'center' }}>Our Story</h2>
          <p style={{ fontSize: '16px', color: 'var(--color-navy-400)', lineHeight: 1.8, textAlign: 'center', marginBottom: '24px' }}>
            India's gold industry is worth over ₹30 lakh crore — yet most goldsmiths still manage their business with pen, paper, and spreadsheets.
            GoldBridge was founded by a team of jewelry industry insiders and technology experts who saw an opportunity to bridge this gap.
          </p>
          <p style={{ fontSize: '16px', color: 'var(--color-navy-400)', lineHeight: 1.8, textAlign: 'center' }}>
            Today, we serve over 5,000 goldsmiths across India with a comprehensive ERP platform that handles everything
            from gold purity tracking to GST-compliant billing — helping them focus on what they do best: crafting beautiful jewelry.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--color-warm-50)' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-navy-700)', marginBottom: '48px', textAlign: 'center' }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {values.map((v, i) => (
              <div key={i} className="card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'var(--color-gold-50)', color: 'var(--color-gold-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', margin: '0 auto 16px',
                }}>{v.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--color-navy-700)' }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-navy-300)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-bronze-400))', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Join the GoldBridge Family</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '16px' }}>Start your free trial today and see the difference</p>
          <Link to="/register" className="btn btn-dark btn-lg">Get Started Free <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  )
}
