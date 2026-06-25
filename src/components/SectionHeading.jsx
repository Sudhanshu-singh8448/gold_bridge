import { useRef } from 'react'

export default function SectionHeading({ badge, title, subtitle, center = true, light = false }) {
  const ref = useRef(null)

  return (
    <div ref={ref} style={{ textAlign: center ? 'center' : 'left', marginBottom: '56px', maxWidth: center ? '680px' : 'none', margin: center ? '0 auto 56px' : '0 0 56px' }}>
      {badge && (
        <span className="badge badge-gold" style={{ marginBottom: '14px', display: 'inline-flex' }}>
          {badge}
        </span>
      )}
      <h2 style={{
        fontSize: '40px', fontWeight: 800, lineHeight: 1.15,
        color: light ? 'white' : 'var(--color-navy-700)',
        marginBottom: '16px',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: '17px', lineHeight: 1.7,
          color: light ? 'rgba(255,255,255,0.7)' : 'var(--color-navy-300)',
          maxWidth: '560px', margin: center ? '0 auto' : '0',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
