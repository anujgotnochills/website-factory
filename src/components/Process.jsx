import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
    {
        number: '01',
        title: 'Consultation',
        description: 'We start with an in-depth discussion to understand your vision, brand identity, and creative goals.',
        icon: 'chat',
    },
    {
        number: '02',
        title: 'Planning',
        description: 'Mood boards, shot lists, styling guides — every detail is meticulously planned before we step into the studio.',
        icon: 'edit_note',
    },
    {
        number: '03',
        title: 'Shoot Day',
        description: 'Lights, camera, action. Our expert team brings the plan to life in our fully-equipped professional studio.',
        icon: 'photo_camera',
    },
    {
        number: '04',
        title: 'Delivery',
        description: 'Professional editing, color grading, and retouching. Your final deliverables, polished to perfection.',
        icon: 'verified',
    },
]

export default function Process() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.process-heading',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.process-heading', start: 'top 85%' },
                }
            )

            gsap.utils.toArray('.process-step').forEach((step, i) => {
                gsap.fromTo(step,
                    { y: 60, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                        scrollTrigger: { trigger: step, start: 'top 85%' },
                        delay: i * 0.15,
                    }
                )
            })

            // Animate the connector lines
            gsap.utils.toArray('.process-line').forEach((line) => {
                gsap.fromTo(line,
                    { scaleX: 0 },
                    {
                        scaleX: 1, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: line, start: 'top 85%' },
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="process" ref={sectionRef} className="section-padding">
            <div className="container">
                {/* Heading */}
                <div className="process-heading" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>How We Work</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
                        Our <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Process</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                        From concept to delivery — a seamless journey to stunning visuals.
                    </p>
                </div>

                {/* Steps */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0px',
                    position: 'relative',
                }}
                    className="process-grid"
                >
                    {STEPS.map((step, i) => (
                        <div key={step.number} className="process-step" style={{ position: 'relative', textAlign: 'center' }}>
                            {/* Connector Line */}
                            {i < STEPS.length - 1 && (
                                <div className="process-line process-connector-desktop" style={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: '0',
                                    width: '50%',
                                    height: '1px',
                                    background: 'var(--border-color)',
                                    transformOrigin: 'left',
                                    zIndex: 0,
                                }} />
                            )}
                            {i > 0 && (
                                <div className="process-line process-connector-desktop" style={{
                                    position: 'absolute',
                                    top: '50px',
                                    left: '0',
                                    width: '50%',
                                    height: '1px',
                                    background: 'var(--border-color)',
                                    transformOrigin: 'left',
                                    zIndex: 0,
                                }} />
                            )}

                            {/* Icon Circle */}
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                border: '2px solid var(--gold)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 28px',
                                background: 'var(--bg-primary)',
                                position: 'relative',
                                zIndex: 1,
                                transition: 'all 0.4s ease',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--gold)'
                                    e.currentTarget.querySelector('.material-symbols-outlined').style.color = 'var(--bg-primary)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-primary)'
                                    e.currentTarget.querySelector('.material-symbols-outlined').style.color = 'var(--gold)'
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '32px', color: 'var(--gold)', transition: 'color 0.4s ease' }}
                                >
                                    {step.icon}
                                </span>
                            </div>

                            {/* Step Number */}
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: 'var(--gold)',
                                letterSpacing: '0.15em',
                                marginBottom: '8px',
                            }}>
                                STEP {step.number}
                            </div>

                            {/* Title */}
                            <h4 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.3rem',
                                fontWeight: 500,
                                marginBottom: '12px',
                            }}>
                                {step.title}
                            </h4>

                            {/* Description */}
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                lineHeight: 1.7,
                                maxWidth: '260px',
                                margin: '0 auto',
                                padding: '0 16px',
                            }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .process-connector-desktop {
            display: none !important;
          }
        }
      `}</style>
        </section>
    )
}
