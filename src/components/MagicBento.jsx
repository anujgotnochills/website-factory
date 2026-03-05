import React, { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = '201, 169, 110' // Gold theme
const MOBILE_BREAKPOINT = 768

const CARD_DATA = [
    { title: 'Maternity Shoots', description: 'Capturing the beautiful journey of motherhood', label: 'Signature', icon: 'pregnant_woman' },
    { title: 'Product Videos', description: 'Cinematic product films that convert viewers', label: 'Premium', icon: 'videocam' },
    { title: 'E-Commerce', description: 'High-volume product photography at scale', label: 'Studio', icon: 'shopping_bag' },
    { title: 'Creative Direction', description: 'End-to-end visual strategy and brand storytelling', label: 'Strategy', icon: 'palette' },
    { title: 'Post Production', description: 'Color grading, retouching & video editing', label: 'Polish', icon: 'auto_fix_high' },
    { title: 'Brand Identity', description: 'Visual systems that define your brand', label: 'Identity', icon: 'branding_watermark' },
]

const createParticleElement = (x, y, color) => {
    const el = document.createElement('div')
    el.style.cssText = `
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: rgba(${color}, 1); box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none; z-index: 100; left: ${x}px; top: ${y}px;
  `
    return el
}

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
    const rect = card.getBoundingClientRect()
    const relativeX = ((mouseX - rect.left) / rect.width) * 100
    const relativeY = ((mouseY - rect.top) / rect.height) * 100
    card.style.setProperty('--glow-x', `${relativeX}%`)
    card.style.setProperty('--glow-y', `${relativeY}%`)
    card.style.setProperty('--glow-intensity', glow.toString())
    card.style.setProperty('--glow-radius', `${radius}px`)
}

/* ── Particle Card ── */
function ParticleCard({ children, style, disableAnimations, particleCount, glowColor, clickEffect }) {
    const cardRef = useRef(null)
    const particlesRef = useRef([])
    const timeoutsRef = useRef([])
    const isHoveredRef = useRef(false)
    const memoizedParticles = useRef([])
    const inited = useRef(false)

    const initParticles = useCallback(() => {
        if (inited.current || !cardRef.current) return
        const { width, height } = cardRef.current.getBoundingClientRect()
        memoizedParticles.current = Array.from({ length: particleCount }, () =>
            createParticleElement(Math.random() * width, Math.random() * height, glowColor)
        )
        inited.current = true
    }, [particleCount, glowColor])

    const clearParticles = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout)
        timeoutsRef.current = []
        particlesRef.current.forEach(p => {
            gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: () => p.parentNode?.removeChild(p) })
        })
        particlesRef.current = []
    }, [])

    const animateParticles = useCallback(() => {
        if (!cardRef.current || !isHoveredRef.current) return
        if (!inited.current) initParticles()
        memoizedParticles.current.forEach((p, i) => {
            const tid = setTimeout(() => {
                if (!isHoveredRef.current || !cardRef.current) return
                const clone = p.cloneNode(true)
                cardRef.current.appendChild(clone)
                particlesRef.current.push(clone)
                gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
                gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true })
                gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true })
            }, i * 100)
            timeoutsRef.current.push(tid)
        })
    }, [initParticles])

    useEffect(() => {
        if (disableAnimations || !cardRef.current) return
        const el = cardRef.current

        const onEnter = () => { isHoveredRef.current = true; animateParticles() }
        const onLeave = () => { isHoveredRef.current = false; clearParticles() }
        const onClick = (e) => {
            if (!clickEffect) return
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left, y = e.clientY - rect.top
            const maxD = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height))
            const ripple = document.createElement('div')
            ripple.style.cssText = `position:absolute;width:${maxD * 2}px;height:${maxD * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);left:${x - maxD}px;top:${y - maxD}px;pointer-events:none;z-index:1000;`
            el.appendChild(ripple)
            gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() })
        }

        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('click', onClick)
        return () => { isHoveredRef.current = false; el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); el.removeEventListener('click', onClick); clearParticles() }
    }, [animateParticles, clearParticles, disableAnimations, clickEffect, glowColor])

    return <div ref={cardRef} style={{ ...style, position: 'relative', overflow: 'hidden' }}>{children}</div>
}

/* ── Global Spotlight ── */
function GlobalSpotlight({ gridRef, disableAnimations, enabled, spotlightRadius, glowColor }) {
    const spotlightRef = useRef(null)

    useEffect(() => {
        if (disableAnimations || !gridRef?.current || !enabled) return

        const spotlight = document.createElement('div')
        spotlight.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.08) 15%,rgba(${glowColor},0.04) 25%,rgba(${glowColor},0.02) 40%,rgba(${glowColor},0.01) 65%,transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `
        document.body.appendChild(spotlight)
        spotlightRef.current = spotlight

        const proximity = spotlightRadius * 0.5
        const fadeDistance = spotlightRadius * 0.75

        const onMove = (e) => {
            if (!spotlightRef.current || !gridRef.current) return
            const section = gridRef.current.closest('.bento-section')
            const rect = section?.getBoundingClientRect()
            const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

            if (!inside) {
                gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
                gridRef.current.querySelectorAll('.bento-card').forEach(c => c.style.setProperty('--glow-intensity', '0'))
                return
            }

            let minDist = Infinity
            gridRef.current.querySelectorAll('.bento-card').forEach(card => {
                const cr = card.getBoundingClientRect()
                const cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2
                const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2)
                minDist = Math.min(minDist, dist)
                const glow = dist <= proximity ? 1 : dist <= fadeDistance ? (fadeDistance - dist) / (fadeDistance - proximity) : 0
                updateCardGlowProperties(card, e.clientX, e.clientY, glow, spotlightRadius)
            })

            gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' })
            const op = minDist <= proximity ? 0.8 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8 : 0
            gsap.to(spotlightRef.current, { opacity: op, duration: op > 0 ? 0.2 : 0.5, ease: 'power2.out' })
        }

        const onLeave = () => {
            gridRef.current?.querySelectorAll('.bento-card').forEach(c => c.style.setProperty('--glow-intensity', '0'))
            if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseleave', onLeave)

        return () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseleave', onLeave)
            spotlightRef.current?.parentNode?.removeChild(spotlightRef.current)
        }
    }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor])

    return null
}

/* ── Main MagicBento ── */
export default function MagicBento({
    textAutoHide = true,
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    disableAnimations = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    particleCount = DEFAULT_PARTICLE_COUNT,
    glowColor = DEFAULT_GLOW_COLOR,
    clickEffect = true,
}) {
    const gridRef = useRef(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const shouldDisable = disableAnimations || isMobile

    const cardBaseStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '200px',
        width: '100%',
        padding: '28px',
        borderRadius: '20px',
        border: '1px solid rgba(201, 169, 110, 0.15)',
        fontWeight: 300,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
    }

    return (
        <>
            <style>{`
        .bento-card::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(var(--glow-radius, 200px) circle at var(--glow-x, 50%) var(--glow-y, 50%),
            rgba(${glowColor}, calc(var(--glow-intensity, 0) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity, 0) * 0.4)) 30%,
            transparent 60%);
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .bento-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(${glowColor}, 0.15);
        }
        .bento-grid-layout {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 768px) {
          .bento-grid-layout {
            grid-template-columns: repeat(4, 1fr);
          }
          .bento-grid-layout > :nth-child(3) { grid-column: span 2; grid-row: span 2; }
          .bento-grid-layout > :nth-child(4) { grid-column: 1 / span 2; grid-row: 2 / span 2; }
          .bento-grid-layout > :nth-child(6) { grid-column: 4; grid-row: 3; }
        }
        @media (max-width: 500px) {
          .bento-grid-layout { grid-template-columns: 1fr; }
        }
      `}</style>

            {enableSpotlight && (
                <GlobalSpotlight
                    gridRef={gridRef}
                    disableAnimations={shouldDisable}
                    enabled={enableSpotlight}
                    spotlightRadius={spotlightRadius}
                    glowColor={glowColor}
                />
            )}

            <div className="bento-section" ref={gridRef} style={{ maxWidth: '54rem', margin: '0 auto', padding: '12px', userSelect: 'none', position: 'relative' }}>
                <div className="bento-grid-layout">
                    {CARD_DATA.map((card, i) => {
                        const inner = (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>{card.label}</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--gold)', opacity: 0.6 }}>{card.icon}</span>
                                </div>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500, margin: '0 0 6px', color: 'var(--text-primary)' }}>{card.title}</h3>
                                    <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{card.description}</p>
                                </div>
                            </>
                        )

                        if (enableStars) {
                            return (
                                <ParticleCard
                                    key={i}
                                    style={{ ...cardBaseStyle }}
                                    disableAnimations={shouldDisable}
                                    particleCount={particleCount}
                                    glowColor={glowColor}
                                    clickEffect={clickEffect}
                                >
                                    <div className="bento-card" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }} />
                                    {inner}
                                </ParticleCard>
                            )
                        }

                        return (
                            <div key={i} className="bento-card" style={cardBaseStyle}>
                                {inner}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
