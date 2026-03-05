import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const BRANDS = [
    'VOGUE', 'ELLE', 'GQ', 'HARPER\'S BAZAAR', 'LAKMÉ FASHION WEEK',
    'NYKAA', 'MYNTRA', 'FABINDIA', 'SABYASACHI', 'MANISH MALHOTRA'
]

export default function Marquee() {
    const marqueeRef = useRef(null)
    const trackRef = useRef(null)

    useEffect(() => {
        const track = trackRef.current

        // Create an infinite loop animation
        const tl = gsap.timeline({ repeat: -1 })

        tl.to(track, {
            xPercent: -50, // Move left by 50% (since we duplicated the content)
            duration: 30, // Adjust speed here
            ease: 'none'
        })

        return () => tl.kill()
    }, [])

    return (
        <div
            ref={marqueeRef}
            style={{
                padding: '32px 0',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                whiteSpace: 'nowrap'
            }}
        >
            <div
                ref={trackRef}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '80px', // Space between items
                    paddingRight: '80px', // Match gap
                }}
            >
                {/* Render the list twice to create a seamless loop */}
                {[...BRANDS, ...BRANDS].map((brand, i) => (
                    <div
                        key={`${brand}-${i}`}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.8rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '80px' // Space between item and next star
                        }}
                    >
                        <span>{brand}</span>
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '18px', color: 'var(--gold)' }}
                        >
                            star
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
