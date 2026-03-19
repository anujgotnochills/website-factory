import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useClientConfig } from '../ClientConfigContext'
import aboutImg from '../assets/about.png'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
    { number: 500, suffix: '+', label: 'Projects Completed' },
    { number: 200, suffix: '+', label: 'Happy Clients' },
    { number: 8, suffix: '+', label: 'Years Experience' },
]

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix, trigger }) {
    const ref = useRef(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        if (!trigger || started) return
        setStarted(true)
        const obj = { val: 0 }
        gsap.to(obj, {
            val: end,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix
            },
        })
    }, [trigger, end, suffix, started])

    return <span ref={ref}>0{suffix}</span>
}

export default function About() {
    const config = useClientConfig()
    const sectionRef = useRef(null)
    const [countersTriggered, setCountersTriggered] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── Stats trigger ──
            ScrollTrigger.create({
                trigger: '.about-stats-col',
                start: 'top 85%',
                onEnter: () => setCountersTriggered(true),
            })

            // ── Stats stagger in ──
            gsap.fromTo('.about-stat-item', { x: -40, opacity: 0 }, {
                x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.about-stats-col', start: 'top 82%' },
            })

            // ── Image reveal ──
            gsap.fromTo('.about-img-container', { clipPath: 'inset(100% 0 0 0)', opacity: 0 }, {
                clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut',
                scrollTrigger: { trigger: '.about-img-container', start: 'top 80%' },
            })

            // ── Rotating badge ──
            gsap.to('.about-badge-text', {
                rotation: 360, duration: 12, repeat: -1, ease: 'none',
            })

            // ── Text reveal ──
            gsap.fromTo('.about-text-reveal', { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.about-text-col', start: 'top 80%' },
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="about" ref={sectionRef} className="section-padding" style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div className="about-3col">

                    {/* ── Column 1: Stats ── */}
                    <div className="about-stats-col">
                        {STATS.map((stat, i) => (
                            <div key={stat.label} className="about-stat-item" style={{
                                paddingBlock: '28px',
                                borderBottom: i < STATS.length - 1 ? '1px solid var(--border-color)' : 'none',
                            }}>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    lineHeight: 1,
                                    marginBottom: '6px',
                                }}>
                                    <AnimatedCounter end={stat.number} suffix={stat.suffix} trigger={countersTriggered} />
                                </div>
                                <div style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--text-muted)',
                                    letterSpacing: '0.04em',
                                }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Column 2: Image + Rotating Badge ── */}
                    <div style={{ position: 'relative' }}>
                        <div className="about-img-container" style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '4px',
                        }}>
                            <img
                                src={aboutImg}
                                alt="Studio at work"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '3/4' }}
                            />
                        </div>

                        {/* Circular Rotating "ABOUT US" Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '-28px',
                            right: '-28px',
                            width: '100px',
                            height: '100px',
                            zIndex: 2,
                        }}>
                            {/* Center dot */}
                            <div style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '10px', height: '10px',
                                borderRadius: '50%',
                                background: 'var(--gold)',
                            }} />
                            {/* Rotating text */}
                            <svg className="about-badge-text" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                                <defs>
                                    <path id="aboutCirclePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                                </defs>
                                <text style={{ fill: 'var(--text-primary)', fontSize: '11px', letterSpacing: '5px', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
                                    <textPath href="#aboutCirclePath">
                                        ABOUT US • ABOUT US • ABOUT US •
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* ── Column 3: Text Content ── */}
                    <div className="about-text-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className="about-text-reveal" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>✦</span>
                            <span style={{
                                fontSize: '0.75rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                                fontWeight: 500,
                            }}>About Company</span>
                        </div>

                        <h2 className="about-text-reveal" style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                            lineHeight: 1.15,
                            marginBottom: '24px',
                            color: 'var(--text-primary)',
                        }}>
                            Creative studio &{' '}
                            <span style={{ color: 'var(--gold)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                                their best solutions
                            </span>
                        </h2>

                        <p className="about-text-reveal" style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: 1.8,
                            marginBottom: '16px',
                        }}>
                            At <strong style={{ color: 'var(--text-primary)' }}>{config.studioName}</strong>, we believe
                            every image tells a story. From maternity shoots to e-commerce photography and cinematic
                            product videos — we bring your vision to life with meticulous attention to detail.
                        </p>

                        <p className="about-text-reveal" style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: 1.8,
                            marginBottom: '32px',
                        }}>
                            Founded with a passion for visual excellence, we've grown into a full-service studio
                            that brands and families trust.
                        </p>

                        <div className="about-text-reveal">
                            <a
                                href="#portfolio"
                                className="btn-primary"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: 'fit-content',
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                View Our Work
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .about-3col {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 48px;
                    align-items: center;
                }
                .about-stats-col {
                    order: 3;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    text-align: center;
                }
                .about-stat-item {
                    border-bottom: none !important;
                    padding-inline: 16px;
                    border-right: 1px solid var(--border-color);
                }
                .about-stat-item:last-child {
                    border-right: none;
                }
                @media (min-width: 768px) {
                    .about-3col {
                        grid-template-columns: 160px 1fr 1.2fr !important;
                        gap: 40px;
                    }
                    .about-stats-col {
                        order: unset;
                        flex-direction: column;
                        text-align: left;
                    }
                    .about-stat-item {
                        border-right: none !important;
                        border-bottom: 1px solid var(--border-color) !important;
                        padding-inline: 0;
                    }
                    .about-stat-item:last-child {
                        border-bottom: none !important;
                    }
                }
                @media (min-width: 1024px) {
                    .about-3col {
                        grid-template-columns: 180px 1fr 1.3fr !important;
                        gap: 56px;
                    }
                }
            `}</style>
        </section>
    )
}
