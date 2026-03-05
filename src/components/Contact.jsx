import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import config from '../../client-config.json'

gsap.registerPlugin(ScrollTrigger)

const GLOW_COLOR = '201, 169, 110'

const SERVICE_OPTIONS = [
    'Maternity Shoot',
    'Product Video',
    'E-Commerce Shoot',
    'All Services',
]

const CONTACT_INFO = [
    { icon: 'location_on', label: 'Studio Address', value: config.address },
    { icon: 'phone', label: 'Phone', value: config.phone },
    { icon: 'mail', label: 'Email', value: config.email },
    { icon: 'schedule', label: 'Working Hours', value: 'Mon – Sat, 10 AM – 7 PM' },
]

/* ── Glow Card with spotlight + particles ── */
function GlowCard({ children, style }) {
    const cardRef = useRef(null)
    const particlesRef = useRef([])
    const isHoveredRef = useRef(false)

    const clearParticles = useCallback(() => {
        particlesRef.current.forEach(p => {
            gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: () => p.parentNode?.removeChild(p) })
        })
        particlesRef.current = []
    }, [])

    useEffect(() => {
        const el = cardRef.current
        if (!el) return

        const onEnter = () => {
            isHoveredRef.current = true
            // Spawn particles
            const { width, height } = el.getBoundingClientRect()
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    if (!isHoveredRef.current || !el) return
                    const particle = document.createElement('div')
                    particle.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${GLOW_COLOR},1);box-shadow:0 0 6px rgba(${GLOW_COLOR},0.6);pointer-events:none;z-index:100;left:${Math.random() * width}px;top:${Math.random() * height}px;`
                    el.appendChild(particle)
                    particlesRef.current.push(particle)
                    gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
                    gsap.to(particle, { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true })
                    gsap.to(particle, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true })
                }, i * 80)
            }
        }

        const onLeave = () => {
            isHoveredRef.current = false
            clearParticles()
            el.style.setProperty('--glow-intensity', '0')
        }

        const onMove = (e) => {
            const rect = el.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            el.style.setProperty('--glow-x', `${x}%`)
            el.style.setProperty('--glow-y', `${y}%`)
            el.style.setProperty('--glow-intensity', '1')
        }

        const onClick = (e) => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left, y = e.clientY - rect.top
            const maxD = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height))
            const ripple = document.createElement('div')
            ripple.style.cssText = `position:absolute;width:${maxD * 2}px;height:${maxD * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${GLOW_COLOR},0.3) 0%,rgba(${GLOW_COLOR},0.15) 30%,transparent 70%);left:${x - maxD}px;top:${y - maxD}px;pointer-events:none;z-index:50;`
            el.appendChild(ripple)
            gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() })
        }

        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('mousemove', onMove)
        el.addEventListener('click', onClick)
        return () => {
            isHoveredRef.current = false
            el.removeEventListener('mouseenter', onEnter)
            el.removeEventListener('mouseleave', onLeave)
            el.removeEventListener('mousemove', onMove)
            el.removeEventListener('click', onClick)
            clearParticles()
        }
    }, [clearParticles])

    return <div ref={cardRef} className="glow-card" style={style}>{children}</div>
}

export default function Contact() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.contact-reveal').forEach((el) => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        alert('Thank you! We\'ll get back to you within 24 hours.')
    }

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        background: 'rgba(10, 10, 15, 0.6)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        borderRadius: '8px',
    }

    return (
        <section id="contact" ref={sectionRef} className="section-padding">
            <div className="container">
                {/* Heading */}
                <div className="contact-reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
                        Let's <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Create</span> Together
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                        Ready to bring your vision to life? Get in touch and let's start planning your shoot.
                    </p>
                </div>

                {/* Form inside MagicBento-style glow card */}
                <div className="contact-reveal" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <GlowCard style={{
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '48px',
                        borderRadius: '24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-name-grid">
                                <input id="contact-name" type="text" placeholder="Your Name" required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')} />
                                <input id="contact-email" type="email" placeholder="Your Email" required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')} />
                            </div>

                            <input id="contact-phone" type="tel" placeholder="Phone Number" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')} />

                            <select
                                id="contact-service"
                                style={{
                                    ...inputStyle,
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a8a9a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 18px center',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                            >
                                <option value="" style={{ background: 'var(--bg-card)' }}>Select Service</option>
                                {SERVICE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt} style={{ background: 'var(--bg-card)' }}>{opt}</option>
                                ))}
                            </select>

                            <textarea
                                id="contact-project"
                                placeholder="Tell us about your project..."
                                rows={5}
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                            />

                            <button
                                type="button"
                                className="btn-primary"
                                style={{ alignSelf: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={() => {
                                    const name = document.getElementById('contact-name')?.value || ''
                                    const service = document.getElementById('contact-service')?.value || 'a shoot'
                                    const project = document.getElementById('contact-project')?.value || ''
                                    const text = `Hi ${config.studioName}! I'm ${name} and I would like to inquire about ${service}.\n\nProject details: ${project}`
                                    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
                                }}
                            >
                                Book on WhatsApp
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                            </button>
                        </form>
                    </GlowCard>
                </div>

                {/* Contact Info below the form */}
                <div className="contact-reveal" style={{ marginTop: '48px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {CONTACT_INFO.map((info) => (
                            <div
                                key={info.label}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '24px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'border-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }}>{info.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>{info.label}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{info.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {Object.entries({ Instagram: config.instagram, YouTube: config.youtube, Facebook: config.facebook }).map(([platform, url]) => (
                            <a
                                key={platform}
                                href={url || '#'}
                                target={url && url !== '#' ? '_blank' : '_self'}
                                rel={url && url !== '#' ? 'noopener noreferrer' : ''}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.color = 'var(--gold)' }}
                                onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.color = 'var(--text-secondary)' }}
                            >
                                {platform}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .glow-card::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%),
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity, 0) * 0.8)) 0%,
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity, 0) * 0.4)) 30%,
            transparent 60%);
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .glow-card:hover {
          box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 40px rgba(${GLOW_COLOR}, 0.15);
        }
        @media (max-width: 640px) {
          .form-name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    )
}
