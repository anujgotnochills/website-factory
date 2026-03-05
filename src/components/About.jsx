
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useClientConfig } from '../ClientConfigContext'
import aboutImg from '../assets/about.png'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
    { number: '8+', label: 'Years Experience' },
    { number: '500+', label: 'Projects Completed' },
    { number: '200+', label: 'Happy Clients' },
    { number: '50+', label: 'Brand Partnerships' },
]

export default function About() {
    const config = useClientConfig()
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.about-reveal').forEach((el) => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                    }
                )
            })

            // Image reveal
            gsap.fromTo('.about-img-wrapper',
                { clipPath: 'inset(100% 0 0 0)' },
                {
                    clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut',
                    scrollTrigger: { trigger: '.about-img-wrapper', start: 'top 80%', toggleActions: 'play none none none' },
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="about" ref={sectionRef} className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '60px',
                    alignItems: 'center',
                }}
                    className="about-grid"
                >
                    {/* Text */}
                    <div>
                        <div className="about-reveal">
                            <span className="section-label">About Us</span>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                                marginBottom: '28px',
                                lineHeight: 1.15,
                            }}>
                                Where Creativity Meets<br />
                                <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Precision</span>
                            </h2>
                        </div>

                        <div className="about-reveal" style={{ marginBottom: '24px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
                                At {config.studioName}, we believe every image tells a story. Founded with a passion for visual excellence,
                                we've grown into a full-service photography and videography studio that brands and families trust.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                From the intimate beauty of maternity shoots to the precision of e-commerce photography
                                and the cinematic quality of product videos — we bring your vision to life with meticulous
                                attention to detail and creative artistry.
                            </p>
                        </div>

                        <div className="about-reveal" style={{ marginBottom: '48px' }}>
                            <div className="gold-line" style={{ marginBottom: '24px' }} />
                            <p style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.3rem',
                                fontStyle: 'italic',
                                color: 'var(--gold-light)',
                                lineHeight: 1.5,
                            }}>
                                "Every click should tell a story worth remembering."
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="about-reveal stats-grid"
                        >
                            {STATS.map((stat) => (
                                <div key={stat.label} style={{
                                    padding: '24px',
                                    background: 'var(--bg-card)',
                                    borderLeft: '2px solid var(--gold)',
                                }}>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        color: 'var(--gold)',
                                        marginBottom: '4px',
                                    }}>{stat.number}</div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-secondary)',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                    }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image */}
                    <div
                        className="about-img-wrapper"
                        style={{
                            position: 'relative',
                            aspectRatio: '4/5',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={aboutImg}
                            alt="Photographer at work"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        {/* Decorative corner */}
                        <div style={{
                            position: 'absolute',
                            top: '-1px',
                            right: '-1px',
                            width: '80px',
                            height: '80px',
                            borderTop: '3px solid var(--gold)',
                            borderRight: '3px solid var(--gold)',
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-1px',
                            left: '-1px',
                            width: '80px',
                            height: '80px',
                            borderBottom: '3px solid var(--gold)',
                            borderLeft: '3px solid var(--gold)',
                        }} />
                    </div>
                </div>
            </div>

            <style>{`
@media(min-width: 768px) {
    .about-grid {
        grid-template-columns: 1fr 1fr !important;
    }
}
.stats-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 28px !important;
}
@media(max-width: 480px) {
    .stats-grid {
        grid-template-columns: 1fr !important;
    }
}
`}</style>
        </section>
    )
}
