import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function LoadingScreen({ onComplete }) {
    const containerRef = useRef(null)
    const svgRef = useRef(null)
    const flashRef = useRef(null)
    const textRef = useRef(null)
    const lensGroupRef = useRef(null)
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return

        const blades = svgRef.current.querySelectorAll('.blade')
        const tl = gsap.timeline({
            onComplete: () => {
                setDone(true)
                onComplete?.()
            },
        })

        // Start: aperture is open (blades rotated away), then close, flash, open, exit

        // Phase 1: Lens group scales in
        tl.fromTo(lensGroupRef.current,
            { scale: 0.3, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' }
        )

            // Phase 2: Close aperture (rotate each blade to center)
            .to(blades, {
                rotation: '-=25',
                transformOrigin: 'center center',
                duration: 0.4,
                stagger: 0.03,
                ease: 'power2.inOut',
            }, '+=0.3')

            // Phase 3: FLASH!
            .to(flashRef.current, { opacity: 1, duration: 0.07 })
            .to(flashRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' })

            // Phase 4: Open wide + fade out
            .to(blades, {
                rotation: '+=70',
                opacity: 0,
                duration: 0.8,
                stagger: 0.04,
                ease: 'power3.out',
            }, '-=0.3')
            .to(lensGroupRef.current, { scale: 2, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
            .fromTo(textRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4 },
                '-=0.3'
            )
            .to(textRef.current, { opacity: 0, y: -10, duration: 0.3 }, '+=0.4')

            // Phase 5: Container exit
            .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })

        return () => tl.kill()
    }, [onComplete])

    if (done) return null

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: '#08080c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            {/* Flash */}
            <div ref={flashRef} style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)',
                opacity: 0, zIndex: 3, pointerEvents: 'none',
            }} />

            {/* Corner frames */}
            <div style={{ position: 'absolute', top: 20, left: 20, width: 35, height: 35, borderTop: '2px solid rgba(201,169,110,0.2)', borderLeft: '2px solid rgba(201,169,110,0.2)' }} />
            <div style={{ position: 'absolute', top: 20, right: 20, width: 35, height: 35, borderTop: '2px solid rgba(201,169,110,0.2)', borderRight: '2px solid rgba(201,169,110,0.2)' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 35, height: 35, borderBottom: '2px solid rgba(201,169,110,0.2)', borderLeft: '2px solid rgba(201,169,110,0.2)' }} />
            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 35, height: 35, borderBottom: '2px solid rgba(201,169,110,0.2)', borderRight: '2px solid rgba(201,169,110,0.2)' }} />

            {/* Viewfinder crosshairs */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
                <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="var(--gold)" strokeWidth="0.5" />
                <line x1="30%" y1="50%" x2="70%" y2="50%" stroke="var(--gold)" strokeWidth="0.5" />
                <rect x="38%" y="38%" width="24%" height="24%" rx="2" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>

            {/* Aperture Lens Group */}
            <div ref={lensGroupRef} style={{ position: 'relative' }}>
                <svg
                    ref={svgRef}
                    viewBox="0 0 300 300"
                    width="260"
                    height="260"
                >
                    <defs>
                        {/* Metallic blade gradient */}
                        <linearGradient id="blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4a4a56" />
                            <stop offset="40%" stopColor="#2e2e38" />
                            <stop offset="70%" stopColor="#3d3d4a" />
                            <stop offset="100%" stopColor="#252530" />
                        </linearGradient>
                        <linearGradient id="blade-grad-alt" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3a3a46" />
                            <stop offset="50%" stopColor="#28282f" />
                            <stop offset="100%" stopColor="#404050" />
                        </linearGradient>
                    </defs>

                    {/* Outer barrel rings */}
                    <circle cx="150" cy="150" r="148" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="1" />
                    <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(201,169,110,0.25)" strokeWidth="2.5" />
                    <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(80,80,95,0.5)" strokeWidth="1" />

                    {/* 6 realistic aperture blades */}
                    {[0, 1, 2, 3, 4, 5].map(i => {
                        const angle = 60 * i
                        // Trapezoid-like blade shape that overlaps neighbors
                        const cx = 150, cy = 150
                        const r1 = 30   // inner opening
                        const r2 = 130  // outer reach
                        const spread = 34 // degrees of spread
                        const a1 = ((angle - spread / 2) * Math.PI) / 180
                        const a2 = ((angle + spread / 2) * Math.PI) / 180
                        const a1inner = ((angle - spread * 0.35) * Math.PI) / 180
                        const a2inner = ((angle + spread * 0.35) * Math.PI) / 180

                        const ix1 = cx + r1 * Math.cos(a1inner)
                        const iy1 = cy + r1 * Math.sin(a1inner)
                        const ox1 = cx + r2 * Math.cos(a1)
                        const oy1 = cy + r2 * Math.sin(a1)
                        const ox2 = cx + r2 * Math.cos(a2)
                        const oy2 = cy + r2 * Math.sin(a2)
                        const ix2 = cx + r1 * Math.cos(a2inner)
                        const iy2 = cy + r1 * Math.sin(a2inner)

                        return (
                            <polygon
                                key={i}
                                className="blade"
                                points={`${ix1},${iy1} ${ox1},${oy1} ${ox2},${oy2} ${ix2},${iy2}`}
                                fill={i % 2 === 0 ? 'url(#blade-grad)' : 'url(#blade-grad-alt)'}
                                stroke="rgba(120,120,140,0.5)"
                                strokeWidth="1"
                                strokeLinejoin="round"
                                style={{ transformOrigin: '150px 150px' }}
                            />
                        )
                    })}

                    {/* Center lens elements */}
                    <circle cx="150" cy="150" r="28" fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="150" cy="150" r="22" fill="rgba(201,169,110,0.05)" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
                    <circle cx="150" cy="150" r="6" fill="var(--gold)" opacity="0.7" />

                    {/* Lens reflection */}
                    <ellipse cx="125" cy="120" rx="25" ry="8" fill="rgba(255,255,255,0.04)" transform="rotate(-35, 125, 120)" />
                </svg>

                {/* Outer metallic ring */}
                <div style={{
                    position: 'absolute',
                    inset: '-12px',
                    borderRadius: '50%',
                    border: '2px solid rgba(201,169,110,0.2)',
                    boxShadow: '0 0 40px rgba(201,169,110,0.06), inset 0 0 30px rgba(0,0,0,0.4)',
                }} />
            </div>

            {/* Text */}
            <div ref={textRef} style={{ marginTop: '35px', textAlign: 'center', opacity: 0 }}>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                }}>
                    ✦ Capturing Moments ✦
                </p>
            </div>
        </div>
    )
}
